package com.carservice.carservicecmsbackend.dto;

import com.carservice.carservicecmsbackend.regex.RegexConstant;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;


public record AuthLoginDto(@NotBlank @Pattern(regexp = RegexConstant.EMAIL_PATTERN) String email,
                           @NotBlank @Pattern(regexp = RegexConstant.PASSWORD_PATTERN) String password) {
}