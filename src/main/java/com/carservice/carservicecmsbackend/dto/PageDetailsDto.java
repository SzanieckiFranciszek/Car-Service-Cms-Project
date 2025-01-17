package com.carservice.carservicecmsbackend.dto;

import lombok.Builder;

@Builder
public record PageDetailsDto(Long id,
                             Long orderIndex,
                             String title,
                             Boolean isVisible) {
}
