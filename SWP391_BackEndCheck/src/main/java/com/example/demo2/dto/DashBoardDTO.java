package com.example.demo2.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DashBoardDTO {
    private long totalUser;
    private long totalCoach;
    private long newUserCount;
    private String mostUsedMembership;
    private long mostUsedMembershipCount;
}
