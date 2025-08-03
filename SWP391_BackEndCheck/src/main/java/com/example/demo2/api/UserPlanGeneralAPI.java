package com.example.demo2.api;

import com.example.demo2.entity.User;
import com.example.demo2.model.request.SaveGeneralRequest;
import com.example.demo2.services.TokenService;
import com.example.demo2.services.UserPlanGeneralService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user-plan")

@SecurityRequirement(name="api")
@CrossOrigin("*")
public class UserPlanGeneralAPI {
    @Autowired
    private UserPlanGeneralService svc;
    @Autowired private TokenService tokenService;

    @GetMapping("/general")
    public ResponseEntity<SaveGeneralRequest> getGeneralPlan(
            @RequestHeader("Authorization") String bearerToken
    ) {
        // strip off "Bearer " if present
        String token = bearerToken.startsWith("Bearer ")
                ? bearerToken.substring(7)
                : bearerToken;

        // extract the User (your TokenService should give you the entity or at least the ID)
        User me = tokenService.extractAccount(token);
        Long userId = me.getUserID();

        return svc
                .findByUserId(userId)
                .map(entity -> {
                    // map your entity back into the same DTO shape
                    SaveGeneralRequest dto = new SaveGeneralRequest();
                    dto.setUserId(entity.getUserId());
                    dto.setQuitDate(entity.getQuitDate());
                    dto.setFinishTimeline(entity.getFinishTimeline());
                    return ResponseEntity.ok(dto);
                })
                .orElseGet(() -> ResponseEntity.noContent().build());
    }
    @PostMapping("/general")
    public ResponseEntity<?> saveGeneral(@RequestBody SaveGeneralRequest rq) {
        svc.save(rq);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/general")
    public ResponseEntity<?> deleteGeneralPlan(
            @RequestHeader("Authorization") String bearerToken) {
        // 1) Bỏ prefix "Bearer " (nếu có)
        String token = bearerToken.startsWith("Bearer ")
                ? bearerToken.substring(7)
                : bearerToken;

        // 2) Giải mã ra User, rồi lấy id
        User me = tokenService.extractAccount(token);
        Long userId = me.getUserID();

        // 3) Xoá
        svc.deleteByUserId(userId);

        // 4) Trả về 204
        return ResponseEntity.noContent().build();
    }
}