package com.carservice.carservicecmsbackend.dto;

import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record PhotoDto(Long id, Integer orderIndex, String path, LocalDateTime createdAt) {
}
