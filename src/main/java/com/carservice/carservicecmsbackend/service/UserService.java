package com.carservice.carservicecmsbackend.service;

import com.carservice.carservicecmsbackend.dto.AuthLoginDto;
import com.carservice.carservicecmsbackend.dto.UserDto;
import com.carservice.carservicecmsbackend.exception.AppRuntimeException;
import com.carservice.carservicecmsbackend.exception.ErrorCode;
import com.carservice.carservicecmsbackend.model.User;
import com.carservice.carservicecmsbackend.model.UserStatus;
import com.carservice.carservicecmsbackend.repository.UserRepository;
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
        user.setFirstName(userDto.firstName());
        user.setLastName(userDto.lastName());
        user.setEmail(userDto.email());
        user.setPassword(passwordEncoder.encode(userDto.password()));
        user.setPhoneNumber(userDto.phoneNumber());
        user.setUserRole(userDto.userRole());
        user.setUserStatus(UserStatus.VERIFIED);
        return userRepository.save(user);
    }

    public User authenticateUser(AuthLoginDto authLoginDto) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authLoginDto.email(), authLoginDto.password()));
        return userRepository.findByEmail(authLoginDto.email()).orElseThrow();
    }

    public List<User> getAllUsers() {
        return new ArrayList<>(userRepository.findAll());
    }

    public User findUserById(Long id) {
        return userRepository.findById(id).orElseThrow();
    }

    public void deleteUser(Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
        }
        else {
            throw new AppRuntimeException(
                    ErrorCode.U005,
                    String.format("User with given id: %d does not exist", id));
        }
    }
}