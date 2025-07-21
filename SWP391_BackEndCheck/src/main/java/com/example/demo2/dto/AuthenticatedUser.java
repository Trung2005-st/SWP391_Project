package com.example.demo2.dto;


import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class AuthenticatedUser {
    private Long id;
    private String username;
    private String token;
    private List<String> roles;
}