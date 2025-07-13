package com.example.demo2.repository;

import com.example.demo2.dto.AssessmentRequestDto;
import com.example.demo2.dto.PlanDto;

import java.util.List;

public interface RecommendPlanService {
    /**
     * Recommend plans based on maximum difficulty cap
     */
    List<PlanDto> recommendByDifficulty(int maxDifficulty);
    /**
     * Analyze user assessment and return the best matching plan
     */
    PlanDto recommendByAssessment(AssessmentRequestDto request);

}
