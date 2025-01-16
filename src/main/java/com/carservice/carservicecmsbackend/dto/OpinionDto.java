package com.carservice.carservicecmsbackend.dto;
import lombok.Builder;

@Builder
public record OpinionDto(
        Long id,
        UserOpinionDto user,
        String content) {
}
