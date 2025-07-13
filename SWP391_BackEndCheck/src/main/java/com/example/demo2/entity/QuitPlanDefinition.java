package com.example.demo2.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "quitplandefinition")
public class QuitPlanDefinition {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer definitionID;

    @Column(length = 100, nullable = false)
    private String name;

    @Lob
    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private Integer durationDays;

    @Lob
    @Column(nullable = false)
    private String steps;

    @Column(nullable = false)
    private Integer difficultyLevel;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    @OneToMany(mappedBy = "definition")
    private List<QuitPlan> quitPlans;
}
