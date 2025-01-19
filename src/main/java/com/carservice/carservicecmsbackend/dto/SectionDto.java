package com.carservice.carservicecmsbackend.dto;

import lombok.Builder;

@Builder
public record SectionDto(Long id, Long orderIndex, String title, String content, Boolean isVisible, Long pageId,
                         Boolean showInMenu){
}
