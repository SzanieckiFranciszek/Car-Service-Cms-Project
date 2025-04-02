package com.carservice.carservicecmsbackend.dto;

import lombok.Builder;

@Builder
public record PostDto(
        String title, String content,
        String author) {
}