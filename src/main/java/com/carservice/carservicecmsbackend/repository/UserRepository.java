package com.carservice.carservicecmsbackend.repository;

import com.carservice.carservicecmsbackend.model.User;
import com.carservice.carservicecmsbackend.model.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByUserRole(UserRole userRole);

}