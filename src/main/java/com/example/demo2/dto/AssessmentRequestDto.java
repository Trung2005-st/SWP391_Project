package com.example.demo2.dto;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Setter
@Getter
public class AssessmentRequestDto {
    /**
     * List of checkbox answers, e.g. ["stress", "social_event", ...]
     */
    private List<String> selectedTriggers;
    private List<String> selectedStrategies;
    private List<String> selectedEmotions;


}
