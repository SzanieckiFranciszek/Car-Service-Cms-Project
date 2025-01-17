package com.carservice.carservicecmsbackend.service;

import com.carservice.carservicecmsbackend.model.PostPhoto;
import com.carservice.carservicecmsbackend.repository.PostPhotoRepository;
import org.springframework.stereotype.Service;

@Service
public class PostPhotoService {

    private final PostPhotoRepository postPhotoRepository;

    public PostPhotoService( PostPhotoRepository postPhotoRepository) {
        this.postPhotoRepository = postPhotoRepository;
    }

    public PostPhoto getPostPhotoById(Long id) {
        return postPhotoRepository.findById(id).orElse(null);
    }

    public PostPhoto savePostPhoto(PostPhoto photo) {
        return postPhotoRepository.save(photo);
    }

    public void deletePostPhoto(Long id) {
        if (!postPhotoRepository.existsById(id)) {
            throw new RuntimeException("PostPhoto not found with ID: " + id);
        }
        postPhotoRepository.deleteById(id);
    }
}