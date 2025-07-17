package com.example.demo2.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CoachProfileDTO {
    private Long coachID;
    private String firstName;
    private String lastName;
    private String username;
    private String expertise;
    private int yearsOfExperience;
    private String institution;
    private String biography;
}
