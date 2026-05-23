package com.mintrack.dto.site;

import lombok.Data;

@Data
public class SiteDto {
    private Integer id;
    private String name;
    private String code;
    private String mineral;
    private String region;
    private String coordinates;
    private String status;
    private Integer capacity;
    private Integer currentProduction;
    private Integer workers;
    private Integer equipmentCount;
    private String startDate;
    private String area;
}
