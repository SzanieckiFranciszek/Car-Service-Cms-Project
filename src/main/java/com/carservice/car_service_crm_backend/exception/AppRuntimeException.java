package com.carservice.car_service_crm_backend.exception;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AppRuntimeException extends RuntimeException {

    private final String businessStatus;
    private final String businessMessage;
    private final String description;
    private final Integer businessStatusCode;

    public AppRuntimeException(ErrorCode error, String description) {
        super(error.getBusinessMessage());
        this.businessStatus = error.getBusinessStatus();
        this.businessMessage = error.getBusinessMessage();
        this.businessStatusCode = error.getBusinessStatusCode();
        this.description = description;
    }
}
