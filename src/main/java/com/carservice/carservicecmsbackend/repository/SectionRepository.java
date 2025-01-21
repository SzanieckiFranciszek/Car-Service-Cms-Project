package com.carservice.carservicecmsbackend.repository;

import com.carservice.carservicecmsbackend.model.Section;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SectionRepository extends JpaRepository<Section,Long> {
    Optional<Section> findByOrderIndex(Long orderIndex);

    List<Section> findAllByPageIdAndOrderIndexGreaterThanEqual(Long pageId, Long orderIndex);

    List<Section> findAllByPageIdOrderByOrderIndexAsc(Long pageId);
}
