package com.carservice.carservicecmsbackend.dto;

import lombok.Builder;
import java.util.Map;

@Builder
public record ContactInformationDto(Long id, Map<String, Object> value){
}
