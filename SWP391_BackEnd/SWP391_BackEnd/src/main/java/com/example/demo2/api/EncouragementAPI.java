package com.example.demo2.api;

import com.example.demo2.dto.EncouragementRequest;
import com.example.demo2.entity.Encouragement;
import com.example.demo2.entity.User;
import com.example.demo2.services.EncouragementService;
import com.example.demo2.services.TokenService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/encouragements")
public class EncouragementAPI {

    @Autowired
    private EncouragementService service;

    @Autowired
    private TokenService tokenService;

    /** Coach/Admin sends custom message. Extract senderId from JWT **/
    @PostMapping("/send")
    public ResponseEntity<Encouragement> send(/*@RequestHeader("Authorization") String authHeader,*/
                                              @RequestBody EncouragementRequest req) {
        Encouragement e = service.sendCustom(
                req.getSenderId(),
                req.getReceiverId(),
                req.getMessage(),
                req.getTemplate()
        );
        // header = "Bearer <token>"
       /* String token = authHeader.replaceFirst("Bearer ", "");
        User user = tokenService.extractAccount(token);
        Encouragement e = service.sendCustom(user.getUserID(), req.getReceiverId(), req.getMessage(), req.getTemplate());*/
        return ResponseEntity.ok(e);
    }

    /** User retrieves today's message **/
    @GetMapping("/today")
    public ResponseEntity<Encouragement> today(/*@RequestHeader("Authorization") String authHeader*/
            @RequestParam Long receiverId /*xóa pathrariable sau khi test*/) {
       /* String token = authHeader.replaceFirst("Bearer ", "");
        User user = tokenService.extractAccount(token);
        Encouragement e = service.getOrGenerateToday(user.getUserID());*/
        Encouragement e = service.getOrGenerateToday(receiverId);
        return ResponseEntity.ok(e);
    }

    /** User gets all past messages **/
    @GetMapping("/history")
    public ResponseEntity<List<Encouragement>> history(/*@RequestHeader("Authorization") String authHeader*/
            @RequestParam Long receiverId
    ) {
        /*String token = authHeader.replaceFirst("Bearer ", "");
        User user = tokenService.extractAccount(token);
        List<Encouragement> list = service.getHistory(user.getUserID());*/
        List<Encouragement> list = service.getHistory(receiverId);
        return ResponseEntity.ok(list);
    }
}
