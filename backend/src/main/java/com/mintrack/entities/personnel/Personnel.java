package com.mintrack.entities.personnel;

import com.mintrack.entities.site.Site;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.fasterxml.jackson.annotation.JsonIgnore;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "\"Personnel\"")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Personnel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "\"firstName\"")
    private String firstName;

    @Column(name = "\"lastName\"")
    private String lastName;

    @Column(unique = true)
    private String email;

    private String phone;
    private String position;

    @Column(name = "\"role\"")
    private String role = "ouvrier";

    private String department;

    @Column(name = "\"siteId\"", insertable = false, updatable = false)
    private Integer siteId;

    @Column(name = "\"teamId\"", insertable = false, updatable = false)
    private Integer teamId;

    @Column(name = "\"hireDate\"")
    private String hireDate;

    private BigDecimal salary;

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
    @ManyToOne
    @JoinColumn(name = "\"teamId\"")
    private Team team;
}
