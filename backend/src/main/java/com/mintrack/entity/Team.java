package com.mintrack.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "\"Team\"")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Team {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true)
    private String code;

    @Column(name = "\"siteId\"", insertable = false, updatable = false)
    private Integer siteId;

    private String department;

    @Column(name = "\"shiftId\"")
    private Integer shiftId;

    @Column(name = "\"chefId\"")
    private Integer chefId;

    @Column(name = "\"adjointId\"")
    private Integer adjointId;

    @Column(name = "\"status\"")
    private String status = "active";

    @Column(name = "\"createdAt\"")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "\"updatedAt\"")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "\"siteId\"")
    private Site site;

    @JsonIgnore
    @OneToMany(mappedBy = "team", cascade = CascadeType.ALL)
    private List<Personnel> members;
}
