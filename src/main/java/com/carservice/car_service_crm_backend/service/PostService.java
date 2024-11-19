package com.carservice.car_service_crm_backend.service;

import com.carservice.car_service_crm_backend.dto.PostDto;
import com.carservice.car_service_crm_backend.exception.AppRuntimeException;
import com.carservice.car_service_crm_backend.exception.ErrorCode;
import com.carservice.car_service_crm_backend.model.Post;
import com.carservice.car_service_crm_backend.repository.PostRepository;
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
}