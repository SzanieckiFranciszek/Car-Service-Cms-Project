package com.carservice.car_service_crm_backend.regex;

public final class RegexConstant {
    public static final String PASSWORD_PATTERN = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*?])[A-Za-z\\d!@#$%^&*?]{8,100}$";
    public static final String EMAIL_PATTERN = "^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$";
}
