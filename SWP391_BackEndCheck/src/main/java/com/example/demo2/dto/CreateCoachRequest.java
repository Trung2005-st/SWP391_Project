package com.example.demo2.dto;

import com.example.demo2.enums.Gender;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateCoachRequest {
    // User info
    private String username;
    private String password;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private Gender gender;

    // Profile info
    private String expertise;
    private int yearsOfExperience;
    private String institution;
    private String biography;
}
