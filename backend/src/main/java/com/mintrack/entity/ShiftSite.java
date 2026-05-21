package com.mintrack.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "\"ShiftSite\"")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShiftSite {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "\"shiftId\"", insertable = false, updatable = false)
    private Integer shiftId;

    @Column(name = "\"siteId\"", insertable = false, updatable = false)
    private Integer siteId;

    @Column(name = "\"createdAt\"")
    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "\"shiftId\"", nullable = false)
    private Shift shift;

    @ManyToOne
    @JoinColumn(name = "\"siteId\"", nullable = false)
    private Site site;
}
