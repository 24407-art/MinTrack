package com.mintrack.entities.document;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "\"Document\"")
@Data
@NoArgsConstructor
public class Document {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer siteId;

    @Column(nullable = false)
    private String name;

    private String type;

    private Long size;

    @Column(name = "\"filePath\"")
    private String filePath;

    @Column(name = "\"uploadedAt\"")
    private LocalDateTime uploadedAt;

    @Column(name = "\"uploadedBy\"")
    private String uploadedBy;

    @PrePersist
    public void prePersist() {
        if (uploadedAt == null) uploadedAt = LocalDateTime.now();
    }
}
