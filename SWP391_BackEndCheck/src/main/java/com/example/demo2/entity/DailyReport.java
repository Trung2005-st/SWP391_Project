package com.example.demo2.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "daily_report", uniqueConstraints = @UniqueConstraint(columnNames = {"userId", "date"}))
@Getter
@Setter

public class DailyReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reportId;

    private Integer userId;

    @Column(name = "date", columnDefinition = "DATE")
    private LocalDate date;

    private Integer smokedCigars;
    private String reason;
    private String feeling;
}