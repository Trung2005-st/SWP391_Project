package com.example.demo2.services;

import com.example.demo2.dto.AssessmentRequestDto;
import com.example.demo2.dto.PlanDto;
import com.example.demo2.entity.QuitPlanDefinition;
import com.example.demo2.repository.QuitPlanDefinitionRepository;
import com.example.demo2.repository.RecommendPlanService;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RecommendPlanServiceImpl implements RecommendPlanService {
    private final QuitPlanDefinitionRepository repository;

    public RecommendPlanServiceImpl(QuitPlanDefinitionRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<PlanDto> recommendByDifficulty(int maxDifficulty) {
        return repository.findByDifficultyLevelLessThanEqualOrderByDifficultyLevelAsc(maxDifficulty)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public PlanDto recommendByAssessment(AssessmentRequestDto request) {
        // Weighted scoring: triggers x3, strategies x2, emotions x1
        int triggerScore = request.getSelectedTriggers() == null ? 0 : request.getSelectedTriggers().size() * 3;
        int strategyScore = request.getSelectedStrategies() == null ? 0 : request.getSelectedStrategies().size() * 2;
        int emotionScore = request.getSelectedEmotions() == null ? 0 : request.getSelectedEmotions().size();
        int totalScore = triggerScore + strategyScore + emotionScore;

        // Map totalScore to difficulty level: 0-4 →1, 5-9 →2, ≥10 →3
        int desiredDifficulty = totalScore < 5 ? 1 : (totalScore < 10 ? 2 : 3);

        // 3) Lấy tất cả plan (hoặc có thể filter difficulty ≤ 3)
        List<QuitPlanDefinition> allPlans = repository.findAll();
        // Fetch candidates and pick the longest-duration plan
        QuitPlanDefinition best = allPlans.stream()
                .min(Comparator
                        .<QuitPlanDefinition, Integer>comparing(p ->
                                Math.abs(p.getDifficultyLevel() - desiredDifficulty))
                        // nếu bằng nhau về chênh lệch, ưu tiên durationDays dài hơn
                        .thenComparing(Comparator.comparingInt(QuitPlanDefinition::getDurationDays).reversed())
                )
                .orElseThrow(() ->
                        new RuntimeException("Không tìm được plan phù hợp")
                );

        return toDto(best);
    }

    private PlanDto toDto(QuitPlanDefinition p) {
        return new PlanDto(p.getDefinitionID(), p.getName(), p.getDescription(), p.getDurationDays(), p.getDifficultyLevel());
    }
}