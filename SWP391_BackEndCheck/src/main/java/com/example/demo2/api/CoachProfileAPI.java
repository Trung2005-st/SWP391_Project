package com.example.demo2.api;

import com.example.demo2.dto.CoachProfileDTO;
import com.example.demo2.dto.CreateCoachRequest;
import com.example.demo2.services.CoachProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/coach")
public class CoachProfileAPI {

    @Autowired
    private CoachProfileService coachProfileService;

    // Lấy toàn bộ coach dạng DTO (cho FE)
    @GetMapping
    public ResponseEntity<List<CoachProfileDTO>> getAllCoaches() {
        return ResponseEntity.ok(coachProfileService.getAllCoaches());
    }

    // Tạo mới coach (user + profile) 1 phát
    @PostMapping("/create")
    public ResponseEntity<CoachProfileDTO> createCoach(@RequestBody CreateCoachRequest request) {
        return ResponseEntity.ok(coachProfileService.createCoach(request));
    }

    // Nếu vẫn muốn lấy entity gốc thì giữ API cũ
    // @GetMapping("/{coachID}")
    // public ResponseEntity<CoachProfile> getCoachProfileById(@PathVariable Long coachID) {...}
}
