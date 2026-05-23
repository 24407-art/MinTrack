package com.mintrack.dto.personnel;

import lombok.Data;

@Data
public class TeamDto {
    private Integer id;
    private String name;
    private String code;
    private Integer siteId;
    private String department;
    private Integer shiftId;
    private Integer chefId;
    private Integer adjointId;
    private String status;
}
