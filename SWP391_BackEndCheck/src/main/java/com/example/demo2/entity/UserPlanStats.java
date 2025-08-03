package com.example.demo2.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "user_plan_stats")
public class UserPlanStats {
    @Id
    @Column(name="user_id") private Long userId;
    @Column(name="cigarettes_per_day") private Integer cigarettesPerDay;
    @Column(name="cigarettes_per_pack") private Integer cigarettesPerPack;
    @Column(name="pack_cost") private Double packCost;
    @Column(name="updated_at") private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    public void touch() { updatedAt = LocalDateTime.now(); }

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;
}
