package com.carservice.car_service_crm_backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

@Builder
public record CarDto(
        @NotBlank String mark,
        @NotBlank String model,
        @NotBlank Integer productionYear,
        @NotBlank String licensePlate
) {
}