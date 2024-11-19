package com.carservice.car_service_crm_backend.repository;

import com.carservice.car_service_crm_backend.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostRepository  extends JpaRepository<Post, Long> {
}
