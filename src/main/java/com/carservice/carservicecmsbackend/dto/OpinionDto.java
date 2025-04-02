package com.carservice.carservicecmsbackend.dto;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record OpinionDto(
        Long id,
        UserOpinionDto user,
        LocalDateTime createdAt,
        String content) {
}
