package com.carservice.car_service_crm_backend.dto;

import lombok.Builder;

@Builder
public record UserDto (Long id, String userName,  String email, String password){

}