package com.example.demo2.dto;

import com.example.demo2.entity.MembershipPlan;
import com.example.demo2.enums.Gender;
import com.example.demo2.enums.UserRole;
import lombok.Data;

import java.util.Date;

@Data
public class UserProfileDTO {
    private Integer userID;
    private MembershipPlan membershipPlan;
    private UserRole role;
    private String username;
    private Gender gender;
    private Date joinDate;
    private String email;
}
