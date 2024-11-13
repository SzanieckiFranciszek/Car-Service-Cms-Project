package com.carservice.car_service_crm_backend.model;

public enum AppointmentStatus {
    PENDING,       // Appointment is scheduled but not yet started
    IN_PROGRESS,   // Appointment is currently ongoing
    COMPLETED,     // Appointment has been completed
    CANCELLED      // Appointment was cancelled
}
