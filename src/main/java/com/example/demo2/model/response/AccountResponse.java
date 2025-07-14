package com.example.demo2.model.response;

import com.example.demo2.enums.Gender;
import lombok.Data;

import java.util.Date;

@Data
public class AccountResponse {
    public String username;

    public int role;

    public Gender gender;

    public Date joinDate;

    public String email;

    public String token;

    public AccountResponse() {
        this.role = 1;
    }
}
