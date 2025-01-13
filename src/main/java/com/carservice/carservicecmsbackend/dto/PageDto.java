package com.carservice.carservicecmsbackend.dto;

import lombok.Builder;

@Builder
public record PageDto(Long id,
                      Long orderIndex,
                      String name,
                      String title,
                      String childPage,
                      Boolean isHomepage,
                      Boolean isVisible,
                      String content,
                      Boolean isRemovable) {
}