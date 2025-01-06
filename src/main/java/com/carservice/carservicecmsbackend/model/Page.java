package com.carservice.carservicecmsbackend.model;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Table(name = "pages")
@Entity
@Getter
@Setter
public class Page{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_index", nullable = false)
    private Long orderIndex;

    @Column(nullable = false)
    private String name;

    private String title;

    //To update, remove String type
//    @OneToMany
    @JoinColumn(name = "child_page_id")
    private String childPage;

    @Column(name = "is_homepage", nullable = false)
    private Boolean isHomepage;

    @Column(name = "is_visible", nullable = false)
    private Boolean isVisible;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name = "is_removable", nullable = false)
    private Boolean isRemovable;
}
