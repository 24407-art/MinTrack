package com.mintrack.dto.personnel;

import lombok.Data;

@Data
public class ShiftDto {
    private Integer id;
    private String name;
    private String startTime;
    private String endTime;
    private Integer workers;
    private String status;
}
