package com.carservice.carservicecmsbackend.exception;

import lombok.Getter;

@Getter
public enum ErrorCode {

    TEA001("TEA001", "INTERNAL_SERVER_ERROR", 500),
    TEA002("TEA002", "ENDPOINT_DOES_NOT_EXISTS", 400),
    TEA003("TEA003", "VALIDATION_FAILED", 400),
    TEA004("TEA004", "THROWABLE_EXCEPTION", 500),

    U001("U001", "USER_ALREADY_EXISTS", 400),
    U002("U002", "INVALID_EMAIL_FORMAT", 400),
    U003("U003", "PASSWORD_DOES_NOT_MEET_REQUIREMENTS", 400),
    U004("U004", "PASSWORD_TOO_SHORT", 400),
    U005("U005", "USER_NOT_FOUND", 404),
    U006("U006", "WRONG_CREDENTIALS", 401),
    U007("U007", "PASSWORD_TOO_LONG", 400),

    S001("S001", "UNAUTHORIZED", 401),
    S002("S002", "FORBIDDEN", 403),
    S003("S003", "REFRESH_TOKEN_NOT_VALID", 403),

    P001("P001", "WRONG_CREDENTIALS", 401);

    private final String businessStatus;
    private final String businessMessage;
    private final Integer businessStatusCode;

    ErrorCode(String businessStatus, String businessMessage, Integer businessStatusCode) {
        this.businessStatus = businessStatus;
        this.businessMessage = businessMessage;
        this.businessStatusCode = businessStatusCode;
    }

    public String getBusinessStatus() {
        return this.businessStatus;
    }

    public String getBusinessMessage() {
        return this.businessMessage;
    }

    public Integer getBusinessStatusCode() {
        return this.businessStatusCode;
    }

}
