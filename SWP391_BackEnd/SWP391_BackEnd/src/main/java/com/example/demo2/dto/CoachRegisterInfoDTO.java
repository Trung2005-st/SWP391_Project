// src/main/java/com/example/demo2/dto/CoachRegisterInfoDTO.java
package com.example.demo2.dto;

import com.example.demo2.enums.Status;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.Date;

@Getter
@AllArgsConstructor
public class CoachRegisterInfoDTO {
    private Long registerId;
    private Long userId;
    private String username;
    private String email;
    private Date registerDate;
    private String reason;
    private Status status;
}
