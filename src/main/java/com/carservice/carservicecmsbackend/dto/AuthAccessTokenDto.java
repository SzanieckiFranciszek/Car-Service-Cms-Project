package com.carservice.carservicecmsbackend.dto;

import lombok.Builder;

@Builder
public record AuthAccessTokenDto(String token, long expiresIn) {
}
