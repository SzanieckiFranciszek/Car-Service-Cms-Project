package com.carservice.carservicecmsbackend.service;

import com.carservice.carservicecmsbackend.dto.PostDto;
import com.carservice.carservicecmsbackend.exception.AppRuntimeException;
import com.carservice.carservicecmsbackend.exception.ErrorCode;
import com.carservice.carservicecmsbackend.model.Post;
import com.carservice.carservicecmsbackend.repository.PostRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PostService {
    private final PostRepository postRepository;

    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public void createPost(PostDto postDto) {
        Post post = new Post();
        post.setTitle(postDto.title());
        post.setContent(postDto.content());
        post.setAuthor(postDto.author());
        post.setCreatedAt(LocalDateTime.now());
        postRepository.save(post);
    }

    public Post findPostById(Long id) {
        return Optional.of(postRepository.getById(id)).orElseThrow(() -> new AppRuntimeException(ErrorCode.P001,
                "Post with this id does not exist"));
    }

    public Post updatePost(Long id, PostDto postDto) {

        return postRepository.findById(id).map(post -> {
            post.setAuthor(postDto.author());
            post.setTitle(postDto.title());
            post.setContent(postDto.content());
            post.setPhoto(postDto.photo());
            return postRepository.save(post);
        }).orElseThrow(() -> new RuntimeException("Post not found"));
    }
}