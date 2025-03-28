package com.carservice.carservicecmsbackend.model;

import com.carservice.carservicecmsbackend.config.JpaConverterJson;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Entity
@Table(name = "homepage")
@Getter
@Setter
public class HomePage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "homepage_value", columnDefinition = "JSON", nullable = false)
    @Convert(converter = JpaConverterJson.class)
    private Map<String, Object> value;
}