package com.carservice.carservicecmsbackend.dto;

import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record PostWithPhotoDto(Long id, String title, String content, String author, byte[] photo, LocalDateTime createdAt) {
}
