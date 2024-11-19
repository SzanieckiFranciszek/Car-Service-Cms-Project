package com.carservice.car_service_crm_backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

@Builder
public record PostDto(
        @NotBlank String title,
        @NotBlank String content,
        @NotBlank String author) {
}