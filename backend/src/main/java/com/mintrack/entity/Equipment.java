package com.mintrack.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDateTime;

@Entity
@Table(name = "\"Equipment\"")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Equipment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String type;

    private String model;

    @Column(unique = true)
    private String serial;

    @Column(name = "\"siteId\"", insertable = false, updatable = false)
    private Integer siteId;

    @Column(name = "\"status\"")
    private String status = "operational";

    @Column(name = "\"purchaseDate\"")
    private String purchaseDate;

    @Column(name = "\"lastMaintenance\"")
    private LocalDateTime lastMaintenance;

    @Column(name = "\"createdAt\"")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "\"updatedAt\"")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "\"siteId\"")
    private Site site;
}
