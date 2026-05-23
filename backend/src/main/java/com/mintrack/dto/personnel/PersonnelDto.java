package com.mintrack.dto.personnel;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class PersonnelDto {
    private Integer id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String position;
    private String role;
    private String department;
    private Integer siteId;
    private Integer teamId;
    private String hireDate;
    private BigDecimal salary;
    private String status;
}
