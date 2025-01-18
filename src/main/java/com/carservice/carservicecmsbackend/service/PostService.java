package com.carservice.carservicecmsbackend.service;

import com.carservice.carservicecmsbackend.dto.PostDto;
import com.carservice.carservicecmsbackend.dto.PostWithPhotoDto;
import com.carservice.carservicecmsbackend.model.Post;
import com.carservice.carservicecmsbackend.model.PostPhoto;
import com.carservice.carservicecmsbackend.repository.PostRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.constraints.Min;
import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
public class PostService {
    private final PostRepository postRepository;
    private final ObjectMapper objectMapper;

    public PostService(PostRepository postRepository, ObjectMapper objectMapper) {
        this.postRepository = postRepository;
        this.objectMapper = objectMapper;
    }

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public Post findPostById(Long id) {
        return postRepository.findById(id).orElseThrow();
    }

    public Post createPostWithImage(PostDto postDto, PostPhoto file) {

        Post post = new Post();

            post.setTitle(postDto.title());
            post.setContent(postDto.content());
            post.setAuthor(postDto.author());
            if (file!=null) {
                post.setPhoto(file);
            }
            postRepository.save(post);

            return post;
        }

    public PostDto convertToPostDto(String postJson) {

        try {
            return objectMapper.readValue(postJson, PostDto.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to convert String to PostDto: " + e.getMessage(), e);
        }
    }

    public PostWithPhotoDto getPostWithPhotoByPostId(@Min(1) @NotNull Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found with ID: " + id));

        byte[] photo = null;
        try {
            Path photoPath = Paths.get(post.getPhoto().getPath());
            if (Files.exists(photoPath)) {
                photo = Files.readAllBytes(photoPath);
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to load photo for post with ID: " + id, e);
        }

        return PostWithPhotoDto.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .author(post.getAuthor())
                .photo(photo)
                .createdAt(post.getCreatedAt())
                .build();
    }

    public Post updatePostWithPhotoByPostId(Long id, PostDto postDto, PostPhoto photo) {
        PostPhoto existPhoto= postRepository.findById(id).get().getPhoto();

        return postRepository.findById(id).map(post -> {
            post.setAuthor(postDto.author());
            post.setTitle(postDto.title());
            post.setContent(postDto.content());
            if(photo == null) {
                post.setPhoto(existPhoto);
            }else{
                post.setPhoto(photo);
            }
            return postRepository.save(post);
        }).orElseThrow(() -> new RuntimeException("Post not found"));
    }

    public void deletePostById(@Min(1) @NotNull Long id) {
        if (!postRepository.existsById(id)) {
            throw new RuntimeException("Post not found with ID: " + id);
        }
        postRepository.deleteById(id);
    }
}
