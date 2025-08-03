package com.example.demo2.api;

import com.example.demo2.model.request.SaveStatsRequest;
import com.example.demo2.services.UserPlanStatsService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user-plan")

@SecurityRequirement(name="api")
@CrossOrigin("*")
public class UserPlanStatsAPI {
    @Autowired
    private UserPlanStatsService svc;

    @PostMapping("/stats")
    public ResponseEntity<?> saveStats(@RequestBody SaveStatsRequest rq) {
        svc.save(rq);
        return ResponseEntity.ok().build();
    }
}
