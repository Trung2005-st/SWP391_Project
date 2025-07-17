// src/main/java/com/example.demo2/api/FeedbackController.java
package com.example.demo2.api;

import com.example.demo2.dto.FeedbackDTO;
import com.example.demo2.services.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/feedback")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    /** GET  /api/feedback – Lấy tất cả feedback */
    @GetMapping
    public ResponseEntity<List<FeedbackDTO>> getAll() {
        return ResponseEntity.ok(feedbackService.getAllFeedback());
    }

    /**
     * POST /api/feedback
     * Body JSON chỉ gồm { "emoji": "...", "message": "..." }
     * User sẽ tự xác định qua token, không cần truyền userId
     */
    @PostMapping
    public ResponseEntity<FeedbackDTO> create(@RequestBody FeedbackDTO dto) {
        FeedbackDTO result = feedbackService.addFeedback(dto);
        return ResponseEntity.ok(result);
    }
}
