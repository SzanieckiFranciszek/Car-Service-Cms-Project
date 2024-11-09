package com.carservice.car_service_crm_backend.dto;

import lombok.Builder;

@Builder
public record AuthAccessTokenDto(String token, long expiresIn) {
}
