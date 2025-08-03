package com.example.demo2.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "daily_checklist", uniqueConstraints = @UniqueConstraint(columnNames = {"userId", "date", "item"}))
@Getter
@Setter
public class DailyCheckList {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long checklistId;

    private Integer userId;
    @Column(name = "date", columnDefinition = "DATE")
    private LocalDate date;

    private String item;
    private Boolean isChecked;


}
