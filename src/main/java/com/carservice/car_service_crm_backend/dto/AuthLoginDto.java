package com.carservice.car_service_crm_backend.dto;

import com.carservice.car_service_crm_backend.regex.RegexConstant;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;


public record AuthLoginDto(@NotBlank @Pattern(regexp = RegexConstant.EMAIL_PATTERN) String email,
                           @NotBlank @Pattern(regexp = RegexConstant.PASSWORD_PATTERN) String password) {
}