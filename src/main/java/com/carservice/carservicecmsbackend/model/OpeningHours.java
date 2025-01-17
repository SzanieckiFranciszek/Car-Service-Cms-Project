package com.carservice.carservicecmsbackend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "opening_hours")
@Getter
@Setter
public class OpeningHours {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String dayFrom;

    @Column()
    private String dayTo;

    @Column(nullable = false)
    private String timeFrom;

    @Column(nullable = false)
    private String timeTo;
}
