package com.example.demo2.model.request;

import lombok.Data;

import java.time.LocalDate;

@Data
public class DailyReportRequest {
    private Integer userId;
    private LocalDate date;
    private Integer smokedCigars;
    private String reason;
    private String feeling;
}
