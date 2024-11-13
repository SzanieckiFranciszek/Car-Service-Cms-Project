package com.carservice.car_service_crm_backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Table(name = "appointment")
@Entity
@Getter
@Setter
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime appointmentDate;

    @Column(nullable = false, length = 500)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')")
    private AppointmentStatus appointmentStatus;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User client;

    @ManyToOne
    @JoinColumn(name = "assigned_employee_id")
    private User assignedEmployee;

    @ManyToOne
    @JoinColumn(name = "car_id", nullable = false)
    private Car car;
}
