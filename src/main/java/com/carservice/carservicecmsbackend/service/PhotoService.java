package com.carservice.carservicecmsbackend.service;


import com.carservice.carservicecmsbackend.model.Photo;
import com.carservice.carservicecmsbackend.repository.PhotoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PhotoService {
    private final PhotoRepository photoRepository;

    public PhotoService(PhotoRepository photoRepository) {
        this.photoRepository = photoRepository;
    }

    public List<Photo> getAllPhotosSorted() {
        return photoRepository.findAllByOrderByOrderIndexAsc();
    }

    public Photo getPhotoById(Long id) {
        return photoRepository.findById(id).orElse(null);
    }

    public Photo savePhoto(Photo photo) {
        return photoRepository.save(photo);
    }


    public void deletePhotoById(Long id) {
        photoRepository.deleteById(id);
    }
}
