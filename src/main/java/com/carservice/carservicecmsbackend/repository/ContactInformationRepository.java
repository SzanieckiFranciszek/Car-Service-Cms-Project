package com.carservice.carservicecmsbackend.repository;

import com.carservice.carservicecmsbackend.model.ContactInformation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactInformationRepository extends JpaRepository<ContactInformation,Long> {
    List<ContactInformation> findByType(String type);
}