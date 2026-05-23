package com.mintrack.dto.production;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ProductionDto {
    private Integer id;
    private Integer siteId;
    private LocalDateTime date;
    private Integer target;
    private Integer actual;
    private String unit;
    private String notes;
}
