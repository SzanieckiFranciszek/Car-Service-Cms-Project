package com.carservice.carservicecmsbackend.dto;

import lombok.Builder;

@Builder
public record PageDto(Long id,
                      Long orderIndex,
                      String name,
                      Boolean isHomepage,
                      Boolean isVisible,
                      Boolean isRemovable,
                      Boolean isGallery) {
}