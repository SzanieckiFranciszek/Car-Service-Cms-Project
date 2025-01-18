package com.carservice.carservicecmsbackend.service;


import com.carservice.carservicecmsbackend.dto.PhotoDto;
import com.carservice.carservicecmsbackend.model.Photo;
import com.carservice.carservicecmsbackend.repository.PhotoRepository;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PhotoService {
    private final PhotoRepository photoRepository;
    private static final String UPLOAD_DIR = "src/main/resources/images";

    public PhotoService(PhotoRepository photoRepository) {
        this.photoRepository = photoRepository;
    }

    public List<PhotoDto> getAllPhotosSorted() {
        return photoRepository.findAllByOrderByOrderIndexAsc().stream().map(this::convertEntityToDto).collect(Collectors.toList());
    }

    public PhotoDto getPhotoById(Long id) {
        return photoRepository.findById(id).map(this::convertEntityToDto).orElse(null);
    }

    public PhotoDto savePhoto(PhotoDto photoDto) {
        Photo photo = convertDtoToEntity(photoDto); // Konwertuj PhotoDto na Photo
        Photo savedPhoto = photoRepository.save(photo);
        return convertEntityToDto(savedPhoto);
    }


    public void deletePhotoById(Long id) {
        photoRepository.deleteById(id);
    }

    private PhotoDto convertEntityToDto(Photo photo) {
        return PhotoDto.builder()
                .id(photo.getId())
                .orderIndex(photo.getOrderIndex())
                .path(photo.getPath())
                .createdAt(photo.getCreatedAt())
                .build();
    }

    private Photo convertDtoToEntity(PhotoDto photoDto) {
        Photo photo = new Photo();
        photo.setId(photoDto.id());
        photo.setOrderIndex(photoDto.orderIndex());
        photo.setPath(photoDto.path());
        photo.setCreatedAt(photoDto.createdAt());
        return photo;
    }

    public byte[] downloadHomepagePhoto() throws IOException {
        Photo homepagePhoto = photoRepository.findByIsHomePagePhotoTrue();
        if (homepagePhoto != null) {
            Path photoPath = Paths.get(homepagePhoto.getPath());
            if (Files.exists(photoPath)) {
                return Files.readAllBytes(photoPath);
            } else {
                throw new RuntimeException("Photo for Home Page not found: " + photoPath);
            }
        } else {
            throw new RuntimeException("Photo for Home Page not found.");
        }
    }

    public Photo uploadHomepagePhoto(String fileName, byte[] fileData) throws IOException {

        if (photoRepository.findByIsHomePagePhotoTrue() != null) {
            throw new IllegalStateException("There is already a homepage photo in the database.");
        }

        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        Path filePath = uploadPath.resolve(fileName);
        Files.write(filePath, fileData);


        Photo photo = new Photo();
        photo.setPath(filePath.toString());
        photo.setIsHomePagePhoto(true);
        Photo savedPhoto = photoRepository.save(photo);

        return savedPhoto;
    }

    public void deleteHomepagePhoto() {
        Photo homepagePhoto = photoRepository.findByIsHomePagePhotoTrue();
        if (homepagePhoto != null) {
            Path photoPath = Paths.get(homepagePhoto.getPath());
            try {
                if (Files.exists(photoPath)) {
                    Files.delete(photoPath);
                }
                photoRepository.deleteById(homepagePhoto.getId());
            } catch (IOException e) {
                throw new RuntimeException("Failed to delete photo file: " + photoPath, e);
            }
        } else {
            throw new IllegalStateException("No homepage photo found to delete.");
        }
    }

    public Photo getHomePagePhoto() {
        return photoRepository.findByIsHomePagePhotoTrue();
    }

    public Photo replaceHomepagePhoto(String fileName, byte[] fileData) throws IOException {

        Photo existingPhoto = photoRepository.findByIsHomePagePhotoTrue();

        if (existingPhoto != null) {

            Path oldPhotoPath = Paths.get(existingPhoto.getPath());
            if (Files.exists(oldPhotoPath)) {
                Files.delete(oldPhotoPath);
            }

            photoRepository.deleteById(existingPhoto.getId());
        }

        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        Path newPhotoPath = uploadPath.resolve(fileName);
        Files.write(newPhotoPath, fileData);

        Photo newPhoto = new Photo();
        newPhoto.setPath(newPhotoPath.toString());
        newPhoto.setIsHomePagePhoto(true);

        return photoRepository.save(newPhoto);
    }
}
