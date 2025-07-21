package com.example.demo2.model.request;

import lombok.Data;

@Data
public class SaveStatsRequest {
    private Long userId;
    private Integer cigarettesPerDay;
    private Integer cigarettesPerPack;
    private Double packCost;
}
