package com.carservice.carservicecmsbackend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

@Builder
public record PostDto(
        @NotBlank String title,
        @NotBlank String content,
        @NotBlank String author) {
}