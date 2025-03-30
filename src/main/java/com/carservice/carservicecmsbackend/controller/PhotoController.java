package com.carservice.carservicecmsbackend.controller;

import com.carservice.carservicecmsbackend.dto.PhotoDto;
import com.carservice.carservicecmsbackend.model.Photo;
import com.carservice.carservicecmsbackend.service.PhotoService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/photos")
public class PhotoController {
    private final PhotoService photoService;
    private static final String UPLOAD_DIR = "/app/images";

    public PhotoController(PhotoService photoService) {
        this.photoService = photoService;
    }

    @GetMapping
    public List<PhotoDto> getAllPhotos() {
        return photoService.getAllPhotosSorted();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PhotoDto> getPhotoById(@PathVariable Long id) {
        PhotoDto photo = photoService.getPhotoById(id);
        if (photo != null) {
            return ResponseEntity.ok(photo);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadPhoto(@RequestParam("file") MultipartFile file, @RequestParam("orderIndex") Integer orderIndex) {
        try {
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String fileName = file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);
            Files.write(filePath, file.getBytes());

            PhotoDto photo = PhotoDto.builder().orderIndex(orderIndex).path(filePath.toString()).build();
            photoService.savePhoto(photo);

            return ResponseEntity.ok("Photo uploaded and saved: " + fileName);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error while uploading file.");
        }
    }

    @PutMapping("/upload")
    public ResponseEntity<String> uploadPhotoWithData(@RequestParam("file") MultipartFile file, @RequestBody PhotoDto photoDto) {
        try {
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String fileName = file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);
            Files.write(filePath, file.getBytes());


            PhotoDto photo = PhotoDto.builder()
                    .orderIndex(photoDto.orderIndex())
                    .path(filePath.toString())
                            .isMainPhoto(photoDto.isMainPhoto()).build();

            photoService.savePhoto(photo);

            return ResponseEntity.ok("Photo uploaded and saved: " + fileName);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error while uploading file.");
        }
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> downloadPhotoById(@PathVariable Long id) {
        try {
            PhotoDto photo = photoService.getPhotoById(id);
            if (photo == null) {
                return ResponseEntity.notFound().build();
            }


            Path filePath = Paths.get(photo.path()).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists()) {
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filePath.getFileName().toString() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePhotoById(@PathVariable Long id) {
        if (photoService.getPhotoById(id) != null) {
            photoService.deletePhotoById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/homepage")
    public ResponseEntity<byte[]> downloadHomepagePhoto() {
        try {
            Photo photo = photoService.getHomePagePhoto();
            if (photo == null) {
                return ResponseEntity.notFound().build();
            }
            Path filePath = Paths.get(photo.getPath()).normalize();
            byte[] photoData = photoService.downloadHomepagePhoto();
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filePath.getFileName().toString() + "\"")
                    .body(photoData);
        } catch (RuntimeException | IOException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/homepage")
    public ResponseEntity<Photo> uploadHomepagePhoto(@RequestParam("file") MultipartFile file) {
        try {
            String fileName = file.getOriginalFilename();
            byte[] fileData = file.getBytes();
            Photo savedPhoto = photoService.uploadHomepagePhoto(fileName, fileData);
            return ResponseEntity.ok(savedPhoto);
        } catch (IOException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @DeleteMapping("/homepage")
    public ResponseEntity<Void> deleteHomepagePhoto() {
        try {
            photoService.deleteHomepagePhoto();
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/replace/homepage")
    public ResponseEntity<Photo> replaceHomepagePhoto(@RequestParam("file") MultipartFile file) {
        try {
            String fileName = file.getOriginalFilename();
            byte[] fileData = file.getBytes();
            Photo updatedPhoto = photoService.replaceHomepagePhoto(fileName, fileData);
            return ResponseEntity.ok(updatedPhoto);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(null);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}
