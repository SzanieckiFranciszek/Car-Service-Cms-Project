package com.carservice.carservicecmsbackend.repository;

import com.carservice.carservicecmsbackend.model.HomePage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HomePageRepository extends JpaRepository<HomePage,Long> {
}
