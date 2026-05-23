package com.mintrack.dto.common;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SuccessResponseDto {
    private boolean success;
    private String message;
}
