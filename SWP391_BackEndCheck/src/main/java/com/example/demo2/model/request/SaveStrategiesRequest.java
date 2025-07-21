package com.example.demo2.model.request;

import lombok.Data;

import java.util.List;

@Data
public class SaveStrategiesRequest {
    private Long userId;
    private List<String> strategyKeys;
}

