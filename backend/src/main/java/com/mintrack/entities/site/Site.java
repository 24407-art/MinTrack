package com.mintrack.entities.site;

import com.mintrack.entities.equipment.Equipment;
import com.mintrack.entities.personnel.Personnel;
import com.mintrack.entities.production.Production;
import com.mintrack.entities.report.Report;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "\"Site\"")
@Data
@NoArgsConstructor
public class Site {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String code;

    @Column(nullable = false)
    private String mineral;

    @Column(nullable = false)
    private String region;

    @Column(nullable = false)
    private String coordinates;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private Integer capacity;

    @Column(name = "\"currentProduction\"", nullable = false)
    private Integer currentProduction;

    @Column(nullable = false)
    private Integer workers;

    @Column(name = "\"equipmentCount\"", nullable = false)
    private Integer equipmentCount;

    @Column(name = "\"startDate\"", nullable = false)
    private String startDate;

    @Column(nullable = false)
    private String area;

    @Column(name = "\"createdAt\"")
    private LocalDateTime createdAt;

    @Column(name = "\"updatedAt\"")
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        if (mineral == null) mineral = "";
        if (region == null) region = "";
        if (coordinates == null) coordinates = "0,0";
        if (status == null) status = "active";
        if (capacity == null) capacity = 0;
        if (currentProduction == null) currentProduction = 0;
        if (workers == null) workers = 0;
        if (equipmentCount == null) equipmentCount = 0;
        if (startDate == null) startDate = "";
        if (area == null) area = "";
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (updatedAt == null) updatedAt = LocalDateTime.now();
    }

    @JsonIgnore
    @OneToMany(mappedBy = "site", cascade = CascadeType.ALL)
    private List<Personnel> personnel;

    @JsonIgnore
    @OneToMany(mappedBy = "site", cascade = CascadeType.ALL)
    private List<Equipment> equipmentItems;

    @JsonIgnore
    @OneToMany(mappedBy = "site", cascade = CascadeType.ALL)
    private List<Production> productions;

    @JsonIgnore
    @OneToMany(mappedBy = "site", cascade = CascadeType.ALL)
    private List<Report> reports;

    @JsonIgnore
    @OneToMany(mappedBy = "site", cascade = CascadeType.ALL)
    private List<ShiftSite> shiftSites;
}
