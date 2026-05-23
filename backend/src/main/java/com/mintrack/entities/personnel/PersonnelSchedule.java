package com.mintrack.entities.personnel;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "\"PersonnelSchedule\"")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PersonnelSchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "\"personnelId\"", insertable = false, updatable = false)
    private Integer personnelId;

    @Column(name = "\"weekStart\"")
    private LocalDateTime weekStart;

    private String monday;
    private String tuesday;
    private String wednesday;
    private String thursday;
    private String friday;
    private String saturday;
    private String sunday;

    @Column(name = "\"createdAt\"")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "\"updatedAt\"")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "\"personnelId\"")
    private Personnel personnel;
}
