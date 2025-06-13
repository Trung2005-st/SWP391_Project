package com.example.demo2.api;

import com.example.demo2.entity.CoachProfile;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@CrossOrigin("*")
@RequestMapping("/api/coach")
@RestController
public class CoachProfileAPI {
    List<CoachProfile> coachList= new ArrayList<CoachProfile>();

    @GetMapping
    public ResponseEntity getAllCoachProfiles() {
        return ResponseEntity.ok(coachList);
    }
}
