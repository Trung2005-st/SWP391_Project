package com.example.demo2.model.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class LoginResponse {
    private Long id;
    private String username;
    private String token;
    private List<String> roles;
}