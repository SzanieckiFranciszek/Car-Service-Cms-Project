package com.carservice.car_service_crm_backend.controller;

import com.carservice.car_service_crm_backend.dto.PostDto;
import com.carservice.car_service_crm_backend.model.Post;
import com.carservice.car_service_crm_backend.service.PostService;
import jakarta.validation.constraints.Min;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {
    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Post> findPostById(@Min(1) @NotNull @PathVariable Long id) {
        Post post = postService.findPostById(id);
        return new ResponseEntity<>(post,HttpStatus.OK);
    }

    @GetMapping()
    public ResponseEntity<List<Post>> getPosts() {
        List<Post> posts = postService.getAllPosts();
        return new ResponseEntity<>(posts,HttpStatus.OK);
    }

    @PostMapping("/new")
    public ResponseEntity<PostDto> createPost(@RequestBody PostDto postDto) {
        postService.createPost(postDto);
        return new ResponseEntity<>(postDto,HttpStatus.CREATED);
    }
}
