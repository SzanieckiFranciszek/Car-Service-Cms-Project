package com.carservice.carservicecmsbackend.dto;
import com.carservice.carservicecmsbackend.model.User;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

@Builder
public record OpinionDto(
        @NotBlank
        User user,
        @NotBlank String content) {
}
