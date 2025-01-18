package com.carservice.carservicecmsbackend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Table(name = "sections")
@Entity
@Getter
@Setter
public class Section {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_index", nullable = false)
    private Long orderIndexOnPage;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name = "is_visible", nullable = false)
    private Boolean isVisible;

    @ManyToOne
    @JoinColumn(name = "pages_id", nullable = false)
    @JsonBackReference
    private Page page;

}
