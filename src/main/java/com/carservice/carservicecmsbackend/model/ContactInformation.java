package com.carservice.carservicecmsbackend.model;

import com.carservice.carservicecmsbackend.config.JpaConverterJson;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Entity
@Getter
@Setter
@Table(name = "contact_info")
public class ContactInformation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "JSON", nullable = false)
    @Convert(converter = JpaConverterJson.class)
    private Map<String, Object> value;
}