package com.mintrack.dto.equipment;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class EquipmentDto {
    private Integer id;
    private String name;
    private String type;
    private String model;
    private String serial;
    private Integer siteId;
    private String status;
    private String purchaseDate;
    private LocalDateTime lastMaintenance;
}
