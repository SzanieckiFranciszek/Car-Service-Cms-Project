package com.carservice.carservicecmsbackend.controller;

import com.carservice.carservicecmsbackend.dto.PostDto;
import com.carservice.carservicecmsbackend.dto.PostWithPhotoDto;
import com.carservice.carservicecmsbackend.model.Post;
import com.carservice.carservicecmsbackend.model.PostPhoto;
import com.carservice.carservicecmsbackend.service.ContactInformationService;
import com.carservice.carservicecmsbackend.service.PostPhotoService;
import com.carservice.carservicecmsbackend.service.PostService;
import jakarta.validation.constraints.Min;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/posts")
public class PostController {
    private final PostService postService;
    private final PostPhotoService postPhotoService;
    private static final String UPLOAD_DIR = "src/main/resources/images/posts";

    public PostController(PostService postService, PostPhotoService postPhotoService, ContactInformationService contactInformationService) {
        this.postService = postService;
        this.postPhotoService = postPhotoService;
    }

    @GetMapping()
    public ResponseEntity<List<PostWithPhotoDto>> getAllPosts() {
        List<PostWithPhotoDto> posts = postService.getAllPostsWithPhoto();
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/basic/{id}")
    public ResponseEntity<Post> findPostById(@Min(1) @NotNull @PathVariable Long id) {
        Post post = postService.findPostById(id);
        return ResponseEntity.ok(post);
    }

    @PostMapping("/new")
    public ResponseEntity<Post> createPost(@RequestParam("post") String postJson,
                                           @RequestParam(value = "file", required = false) MultipartFile file) {
        PostPhoto photo = null;
        if (file != null && !file.isEmpty() && !Objects.equals(file.getOriginalFilename(), "")) {
            photo = new PostPhoto();

            try {
                Path uploadPath = Paths.get(UPLOAD_DIR);
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }

                String fileName = file.getOriginalFilename();
                Path filePath = uploadPath.resolve(fileName);
                Files.write(filePath, file.getBytes());
                photo.setPath(filePath.toString());
                postPhotoService.savePostPhoto(photo);
                System.out.println("Post photo uploaded and saved: " + fileName);

            } catch (IOException e) {
                throw new RuntimeException("Error while uploading post photo.");
            }
        }

        Post createdPost = postService.createPostWithImage(postService.convertToPostDto(postJson), photo);

        return ResponseEntity.ok(createdPost);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostWithPhotoDto> getPostWithPhotoByPostId(@Min(1) @NotNull @PathVariable Long id) {
        PostWithPhotoDto postWithPhoto = postService.getPostWithPhotoByPostId(id);
        return ResponseEntity.ok(postWithPhoto);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Post> updatePostById(@PathVariable Long id, @RequestParam("post") String post,
                                               @RequestPart(value = "file", required = false) MultipartFile file) {
        PostDto postDto = postService.convertToPostDto(post);
        PostPhoto photo = new PostPhoto();
        if (file != null && !file.isEmpty()) {
            try {
                Path uploadPath = Paths.get(UPLOAD_DIR);
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }

                String fileName = file.getOriginalFilename();
                Path filePath = uploadPath.resolve(fileName);
                Files.write(filePath, file.getBytes());
                photo.setPath(filePath.toString());
                postPhotoService.savePostPhoto(photo);
                System.out.println("Post photo uploaded and saved: " + fileName);

            } catch (IOException e) {
                throw new RuntimeException("Error while uploading post photo.");
            }
        }
        Post updatedPost = postService.updatePostWithPhotoByPostId(id, postDto, photo);

        return ResponseEntity.ok(updatedPost);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePostById(@Min(1) @NotNull @PathVariable Long id) {
        Post post = postService.findPostById(id);

        if (post.getPhoto() != null) {
            Path photoPath = Paths.get(post.getPhoto().getPath());
            try {
                if (Files.exists(photoPath)) {
                    Files.delete(photoPath);
                    postPhotoService.deletePostPhoto(post.getPhoto().getId());
                }
            } catch (IOException e) {
                throw new RuntimeException("Failed to delete photo for post with ID: " + id, e);
            }
        }
        postService.deletePostById(id);

        return ResponseEntity.noContent().build();
    }
}
