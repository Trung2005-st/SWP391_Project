package com.example.demo2.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;


@Entity
@Getter
@Setter
@Table(name = "user_plan_general")
public class UserPlanGeneral {
    @Id
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "quit_date", nullable = false)
    private LocalDate quitDate;

    @Column(name = "finish_timeline", nullable = false)
    private LocalDate finishTimeline;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist @PreUpdate
    public void touch() {
        updatedAt = LocalDateTime.now();
    }
}
