package com.carservice.carservicecmsbackend.model;

import com.carservice.carservicecmsbackend.dto.UserOpinionDto;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Table(name = "opinion")
@Entity
@Getter
@Setter
public class Opinion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private LocalDateTime createdAt;

    @Column(columnDefinition = "TEXT")
    private String content;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public UserOpinionDto getUserOpinionDto() {
        return UserOpinionDto.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .build();
    }
}
