package com.mintrack.dto.report;

import lombok.Data;

import java.time.LocalDate;

@Data
public class ReportDto {
    private Integer id;
    private String title;
    private String type;
    private String content;
    private Integer siteId;
    private Integer authorId;
    private LocalDate date;
    private String status;
}
