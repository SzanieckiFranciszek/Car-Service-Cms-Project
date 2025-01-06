package com.carservice.carservicecmsbackend.dto;

import lombok.Builder;

@Builder
public record ContactInformationDto(Long id, String type, String key, String value){
}
