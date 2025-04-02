package com.carservice.carservicecmsbackend.dto;

import lombok.Builder;

@Builder
public record UserOpinionDto(Long id,
                             String firstName,
                             String lastName,
                             String email
) {
}