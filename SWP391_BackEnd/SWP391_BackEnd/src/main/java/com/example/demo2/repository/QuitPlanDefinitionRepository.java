package com.example.demo2.repository;

import com.example.demo2.entity.QuitPlanDefinition;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuitPlanDefinitionRepository extends JpaRepository<QuitPlanDefinition, Integer> {
    List<QuitPlanDefinition> findByDifficultyLevelLessThanEqualOrderByDifficultyLevelAsc(Integer level);
}
