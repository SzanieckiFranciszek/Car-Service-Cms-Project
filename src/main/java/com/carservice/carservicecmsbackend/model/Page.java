package com.carservice.carservicecmsbackend.model;


import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Table(name = "pages")
@Entity
@Getter
@Setter
public class Page{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_index")
    private Long orderIndex;

    @Column(nullable = false)
    private String name;

    @Column(name = "is_homepage")
    private Boolean isHomepage;

    @Column(name = "is_visible", nullable = false)
    private Boolean isVisible;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "pages_id")
    @JsonManagedReference
    private List<Section> sections;

    @Column(name = "is_removable")
    private Boolean isRemovable;
}
