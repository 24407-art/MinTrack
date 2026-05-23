package com.mintrack.entities.cost;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "\"Cost\"")
@Data
@NoArgsConstructor
public class Cost {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer siteId;

    @Column(nullable = false)
    private String category;

    private String description;

    @Column(precision = 15, scale = 2)
    private BigDecimal amount;

    private LocalDate date;

    @Column(name = "\"createdAt\"")
    private java.time.LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = java.time.LocalDateTime.now();
        if (date == null) date = LocalDate.now();
    }
}
