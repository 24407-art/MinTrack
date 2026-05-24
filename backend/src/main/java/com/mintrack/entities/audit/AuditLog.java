package com.mintrack.entities.audit;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "\"AuditLog\"")
@Data
@NoArgsConstructor
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = true)
    private Integer siteId;

    @Column(nullable = true)
    private Integer entityId;

    @Column(nullable = true)
    private String entityType;

    @Column(nullable = false)
    private String action;

    private String field;

    @Column(name = "\"oldValue\"")
    private String oldValue;

    @Column(name = "\"newValue\"")
    private String newValue;

    private String username;

    @Column(name = "\"timestamp\"")
    private LocalDateTime timestamp;

    @PrePersist
    public void prePersist() {
        if (timestamp == null) timestamp = LocalDateTime.now();
    }
}
