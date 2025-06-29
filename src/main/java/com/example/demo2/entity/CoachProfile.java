package com.example.demo2.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class CoachProfile {

    @Id
    private Long coachID;

    @OneToOne
    @MapsId
    @JoinColumn(name = "coachID")
    private User user;

    private String biography;
    private String expertise;
    private int yearsOfExperience;

    // Getters and Setters
}

