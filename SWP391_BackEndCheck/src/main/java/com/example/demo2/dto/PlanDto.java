package com.example.demo2.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PlanDto {
    private Integer id;
    private String name;
    private String description;
    private Integer durationDays;
    private Integer difficultyLevel;



}
