package com.carservice.carservicecmsbackend.dto;

import com.carservice.carservicecmsbackend.model.Photo;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

@Builder
public record PostDto(
        @NotBlank String title,
        @NotBlank String content,
        Photo photo,
        @NotBlank String author) {
}