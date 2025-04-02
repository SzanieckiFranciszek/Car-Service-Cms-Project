package com.carservice.carservicecmsbackend.dto;

import com.carservice.carservicecmsbackend.model.UserRole;
import com.carservice.carservicecmsbackend.regex.RegexConstant;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Builder;

@Builder
public record UserDto(@NotBlank @Size(max = 20) String firstName,
                      @NotBlank @Size(max = 20) String lastName,
                      @NotBlank @Pattern(regexp = RegexConstant.EMAIL_PATTERN) String email,
                      @NotBlank @Pattern(regexp = RegexConstant.PASSWORD_PATTERN) String password,
                      @NotBlank String phoneNumber
                      ) {

}