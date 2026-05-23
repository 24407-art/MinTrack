package com.mintrack.dto.personnel;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PersonnelScheduleDto {
    private Integer id;
    private Integer personnelId;
    private LocalDateTime weekStart;
    private String monday;
    private String tuesday;
    private String wednesday;
    private String thursday;
    private String friday;
    private String saturday;
    private String sunday;
}
