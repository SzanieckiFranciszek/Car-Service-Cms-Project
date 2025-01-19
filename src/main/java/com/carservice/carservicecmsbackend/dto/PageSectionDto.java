package com.carservice.carservicecmsbackend.dto;

import com.carservice.carservicecmsbackend.model.Section;
import lombok.Builder;

import java.util.List;

@Builder
public record PageSectionDto(Long id,
                             Long orderIndex,
                             String name,
                             Boolean isHomepage,
                             Boolean isVisible,
                            List<Section> section,
                             Boolean isRemovable,
                             Boolean isGallery) {
}
