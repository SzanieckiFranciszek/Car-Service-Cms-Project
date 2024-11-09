package com.carservice.car_service_crm_backend.service;

import com.carservice.car_service_crm_backend.dto.AuthLoginDto;
import com.carservice.car_service_crm_backend.dto.UserDto;
import com.carservice.car_service_crm_backend.model.User;
import com.carservice.car_service_crm_backend.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
    }

    public User signUp(UserDto userDto) {
        User user = new User();
        user.setUserName(userDto.userName());
        user.setEmail(userDto.email());
        user.setPassword(passwordEncoder.encode(userDto.password()));
        return userRepository.save(user);
    }

    public User authenticateUser(AuthLoginDto authLoginDto) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authLoginDto.email(), authLoginDto.password()));
        return userRepository.findByEmail(authLoginDto.email()).orElseThrow();
    }

    public List<User> getAllUsers() {
        List<User> users = new ArrayList<>();
        userRepository.findAll().forEach(users::add);
        return users;
    }
}