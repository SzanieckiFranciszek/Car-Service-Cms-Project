package com.carservice.carservicecmsbackend.dto;

import lombok.Builder;

import java.util.Map;

@Builder
public record HomePageDto(Long id, Map<String, Object> value) {
}
