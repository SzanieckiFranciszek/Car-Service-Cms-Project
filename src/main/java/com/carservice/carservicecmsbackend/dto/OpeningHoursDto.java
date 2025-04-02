package com.carservice.carservicecmsbackend.dto;

import lombok.Builder;

@Builder
public record OpeningHoursDto(Long id, String dayFrom, String dayTo, String timeFrom, String timeTo){
}
