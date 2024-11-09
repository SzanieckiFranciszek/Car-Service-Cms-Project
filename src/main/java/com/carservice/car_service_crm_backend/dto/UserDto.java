package com.carservice.car_service_crm_backend.dto;

import com.carservice.car_service_crm_backend.regex.RegexConstant;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Builder;

@Builder
public record UserDto (@NotBlank @Size(max = 20) String userName,
                       @NotBlank @Pattern(regexp = RegexConstant.EMAIL_PATTERN) String email,
                       @NotBlank @Pattern(regexp = RegexConstant.PASSWORD_PATTERN) String password){

}