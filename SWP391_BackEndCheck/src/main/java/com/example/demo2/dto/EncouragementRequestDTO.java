package com.example.demo2.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EncouragementRequestDTO {
    private Long receiverId;
    private String message;
    private String template;
}