package com.example.demo2.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
public class UserPlanHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long historyID;

    @ManyToOne
    @JoinColumn(name = "userID", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "planID", nullable = false)
    private MembershipPlan plan;

    private LocalDate startDate;
    private LocalDate endDate;
}

