package com.carservice.carservicecmsbackend.repository;

import com.carservice.carservicecmsbackend.model.ContactInformation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContactInformationRepository extends JpaRepository<ContactInformation,Long> {
}