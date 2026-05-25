package com.mintrack.dto.production;

import lombok.Data;

import java.time.LocalDate;

@Data
public class ProductionDto {
    private Integer id;
    private Integer siteId;
    private LocalDate date;
    private Integer target;
    private Integer actual;
    private String unit;
    private String notes;
}
