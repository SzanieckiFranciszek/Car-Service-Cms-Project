package com.carservice.carservicecmsbackend.repository;

import com.carservice.carservicecmsbackend.model.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PageRepository extends JpaRepository<Page,Long> {
    List<Page> findAllByIsVisibleTrueOrderByOrderIndexAsc();
    Optional<Page> findByName(String name);
}