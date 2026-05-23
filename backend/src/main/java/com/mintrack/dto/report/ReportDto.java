package com.mintrack.dto.report;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ReportDto {
    private Integer id;
    private String title;
    private String type;
    private String content;
    private Integer siteId;
    private Integer authorId;
    private LocalDateTime date;
    private String status;
}
