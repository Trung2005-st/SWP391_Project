package com.example.demo2.model.request;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class DailyChecklistRequest {
    private Integer userId;
    private LocalDate date;
    private List<ChecklistItem> checklist;

    @Data
    public static class ChecklistItem {
        private String text;
        private Boolean checked;
    }
}