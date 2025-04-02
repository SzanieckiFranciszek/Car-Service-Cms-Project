package com.carservice.carservicecmsbackend.repository;

import com.carservice.carservicecmsbackend.model.OpeningHours;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OpeningHoursRepository extends JpaRepository<OpeningHours, Long> {
}
