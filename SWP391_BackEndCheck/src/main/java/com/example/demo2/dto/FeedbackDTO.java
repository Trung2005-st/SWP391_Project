// src/main/java/com/example/demo2/dto/FeedbackDTO.java
package com.example.demo2.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackDTO {
    private Long id;             // null khi tạo mới
    private Long userId;         // sẽ ghi đè tự động
    private String userName;     // sẽ ghi đè tự động
    private String emoji;
    private String message;
    private LocalDateTime sentAt; // null khi tạo mới
}
