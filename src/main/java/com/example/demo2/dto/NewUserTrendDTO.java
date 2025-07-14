// src/main/java/com/example/demo2/dto/NewUserTrendDTO.java
package com.example.demo2.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class NewUserTrendDTO {
    private final String date;   // e.g. "2025-06-10"
    private final long count;    // number of new users that day
}
