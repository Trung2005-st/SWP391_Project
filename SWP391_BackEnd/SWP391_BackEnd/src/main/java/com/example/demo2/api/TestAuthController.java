/*
 * Development-only Test Controller: generate JWT by user ID (bypass login)
 */
package com.example.demo2.api;

import com.example.demo2.entity.User;
import com.example.demo2.repository.AuthenticationRepository;
import com.example.demo2.services.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
public class TestAuthController {

    @Autowired
    private AuthenticationRepository authRepo;

    @Autowired
    private TokenService tokenService;

    /**
     * Generate a valid JWT for given user ID (development only).
     * Call GET /api/test/token/{userId} to retrieve token.
     */
    @GetMapping("/token/{userId}")
    public ResponseEntity<String> getToken(@PathVariable Long userId) {
        User user = authRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        String jwt = tokenService.generateToken(user);
        return ResponseEntity.ok(jwt);
    }
}
