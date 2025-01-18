package com.carservice.carservicecmsbackend.repository;

import com.carservice.carservicecmsbackend.model.Section;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SectionRepository extends JpaRepository<Section,Long> {
}
