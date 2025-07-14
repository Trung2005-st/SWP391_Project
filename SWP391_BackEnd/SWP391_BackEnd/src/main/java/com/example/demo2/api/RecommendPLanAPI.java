package com.example.demo2.api;

import com.example.demo2.dto.AssessmentRequestDto;
import com.example.demo2.dto.PlanDto;
import com.example.demo2.repository.RecommendPlanService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/plans")
@SecurityRequirement(name="api")
public class RecommendPLanAPI {
    private final RecommendPlanService recommendPlanService;

    public RecommendPLanAPI(RecommendPlanService recommendPlanService) {
        this.recommendPlanService = recommendPlanService;
    }

    // GET /api/plans/recommend?maxDifficulty=2
    @GetMapping("/recommend")
    public ResponseEntity<List<PlanDto>> recommendByDifficulty(
            @RequestParam(defaultValue = "3") int maxDifficulty) {
        return ResponseEntity.ok(
                recommendPlanService.recommendByDifficulty(maxDifficulty)
        );
    }

    // POST /api/plans/recommend/assessment
    @PostMapping("/recommend/assessment")
    public ResponseEntity<PlanDto> recommendByAssessment(
            @RequestBody AssessmentRequestDto request) {
        return ResponseEntity.ok(
                recommendPlanService.recommendByAssessment(request)
        );
    }
}