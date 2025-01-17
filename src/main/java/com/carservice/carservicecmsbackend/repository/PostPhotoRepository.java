package com.carservice.carservicecmsbackend.repository;

import com.carservice.carservicecmsbackend.model.PostPhoto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostPhotoRepository extends JpaRepository<PostPhoto, Long> {
}
