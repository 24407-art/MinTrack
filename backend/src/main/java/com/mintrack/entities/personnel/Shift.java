package com.mintrack.entities.personnel;

import com.mintrack.entities.site.ShiftSite;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "\"Shift\"")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Shift {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;

    @Column(name = "\"startTime\"")
    private String startTime;

    @Column(name = "\"endTime\"")
    private String endTime;

    private Integer workers = 0;

    @Column(name = "\"status\"")
    private String status = "active";

    @Column(name = "\"createdAt\"")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "\"updatedAt\"")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @JsonIgnore
    @OneToMany(mappedBy = "shift", cascade = CascadeType.ALL)
    private List<ShiftSite> sites;
}
