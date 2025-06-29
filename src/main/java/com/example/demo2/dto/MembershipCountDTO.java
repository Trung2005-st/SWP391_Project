package com.example.demo2.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MembershipCountDTO {
    private final String planName;
    private final long memberCount;
}
