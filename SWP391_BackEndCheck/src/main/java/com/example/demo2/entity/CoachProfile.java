package com.example.demo2.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
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
    @JsonBackReference
    private User user;

    private String expertise;
    private int yearsOfExperience;
    private String institution;
    private String biography;
}
