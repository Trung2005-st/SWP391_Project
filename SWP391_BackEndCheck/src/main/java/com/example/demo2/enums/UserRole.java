package com.example.demo2.enums;

import com.example.demo2.exception.BadRequestException;
import lombok.Getter;

@Getter
public enum UserRole {
    MEMBER(1, "Member"),
    COACH(2, "Coach"),
    ADMIN(3, "Admin");

    private final int code;
    private final String label;

    UserRole(int code, String label) {
        this.code = code;
        this.label = label;
    }

    public static UserRole fromCode(int code) {
        for (UserRole role : values()) {
            if (role.code == code) return role;
        }
        throw new BadRequestException("Invalid role code: " + code);
    }
}