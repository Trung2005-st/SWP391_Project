package com.example.demo2.model.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDate;

@Data
public class SaveGeneralRequest {
    private Long userId;
    @JsonFormat(pattern="yyyy-MM-dd") private LocalDate quitDate;
    @JsonFormat(pattern="yyyy-MM-dd") private LocalDate finishTimeline;
}