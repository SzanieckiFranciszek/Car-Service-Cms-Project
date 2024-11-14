package com.carservice.car_service_crm_backend.repository;

import com.carservice.car_service_crm_backend.model.Car;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CarRepository extends JpaRepository<Car, Long> {
}