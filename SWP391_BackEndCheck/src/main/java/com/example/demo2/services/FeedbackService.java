// src/main/java/com/example/demo2/service/FeedbackService.java
package com.example.demo2.services;

import com.example.demo2.dto.FeedbackDTO;

import java.util.List;

public interface FeedbackService {
    FeedbackDTO addFeedback(FeedbackDTO dto);
    List<FeedbackDTO> getAllFeedback();
}