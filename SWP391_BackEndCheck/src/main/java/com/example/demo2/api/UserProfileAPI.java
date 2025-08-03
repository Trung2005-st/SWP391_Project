package com.example.demo2.api;

import com.example.demo2.dto.UserProfileDTO;
import com.example.demo2.model.request.UpdateProfileRequest;
import com.example.demo2.services.UserProfileService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@SecurityRequirement(name="api")

@SecurityRequirement(name="api")
public class UserProfileAPI {
    @Autowired
    UserProfileService userProfileService;

    @GetMapping
    public ResponseEntity getMyProfile() {
        UserProfileDTO dto = userProfileService.getCurrentUserProfile();
        return ResponseEntity.ok(dto);
    }

    /**
     * GET /api/profile/{userId}
     * trả về hồ sơ công khai của user khác (by ID)
     */
    @GetMapping("/{userId}")
    public ResponseEntity getUserProfile(@PathVariable Long userId) {
        UserProfileDTO dto = userProfileService.getUserProfileById(userId);
        return ResponseEntity.ok(dto);
    }

    /**
     * PUT /api/profile
     * update profile (self)
     */
    @PutMapping
    public ResponseEntity updateProfile(@RequestBody UpdateProfileRequest request) {
        UserProfileDTO updated = userProfileService.updateProfile(request);
        return ResponseEntity.ok(updated);
    }
}
