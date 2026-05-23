package com.mintrack.entities.report;

import com.mintrack.entities.site.Site;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDateTime;

@Entity
@Table(name = "\"Report\"")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String title;

    private String type;
    private String content;

    @Column(name = "\"siteId\"", insertable = false, updatable = false)
    private Integer siteId;

    @Column(name = "\"authorId\"")
    private Integer authorId;

    @Column(nullable = false)
    private LocalDateTime date;

    @Column(name = "\"status\"")
    private String status = "draft";

    @Column(name = "\"createdAt\"")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "\"updatedAt\"")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "\"siteId\"")
    private Site site;
}
