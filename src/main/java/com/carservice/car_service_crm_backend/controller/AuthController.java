package com.carservice.car_service_crm_backend.controller;

import com.carservice.car_service_crm_backend.dto.AuthAccessTokenDto;
import com.carservice.car_service_crm_backend.dto.AuthLoginDto;
import com.carservice.car_service_crm_backend.dto.UserDto;
import com.carservice.car_service_crm_backend.model.User;
import com.carservice.car_service_crm_backend.service.JwtService;
import com.carservice.car_service_crm_backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/api/auth")
@RestController
public class AuthController {

    private final JwtService jwtService;
    private final UserService userService;

    public AuthController(JwtService jwtService, UserService userService) {
        this.jwtService = jwtService;
        this.userService = userService;
    }

    @PostMapping("/signup")
    public ResponseEntity<User> registerUser(@RequestBody UserDto userDto) {
        User registerUser = userService.signUp(userDto);

        return ResponseEntity.ok(registerUser);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthAccessTokenDto> authenticateUser(@RequestBody AuthLoginDto authLoginDto) {
        User authenticatedUser = userService.authenticateUser(authLoginDto);
        String jwtToken = jwtService.generateToken(authenticatedUser);

        AuthAccessTokenDto authAccessTokenDto = new AuthAccessTokenDto(jwtToken, jwtService.getExpirationTime());
        return ResponseEntity.ok(authAccessTokenDto);
    }
}
