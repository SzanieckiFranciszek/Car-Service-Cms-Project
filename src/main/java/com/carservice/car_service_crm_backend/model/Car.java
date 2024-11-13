package com.carservice.car_service_crm_backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Table(name = "car")
@Entity
@Getter
@Setter
public class Car {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String mark;

    @Column(nullable = false)
    private String model;

    @Column(nullable = false)
    private Integer productionYear;

    @Column(nullable = false, unique = true)
    private String licensePlate;

    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @OneToMany(mappedBy = "car", cascade = CascadeType.ALL)
    private List<Appointment> appointments;
}