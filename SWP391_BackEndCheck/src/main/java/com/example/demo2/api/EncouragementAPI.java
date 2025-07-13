package com.example.demo2.api;

import com.example.demo2.dto.EncouragementRequestDTO;
import com.example.demo2.entity.Encouragement;
import com.example.demo2.entity.User;
import com.example.demo2.repository.EncouragementRepository;
import com.example.demo2.repository.UserRepository;
import com.example.demo2.services.EncouragementService;
import com.example.demo2.utils.AccountUtils;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/encouragements")
@SecurityRequirement(name = "api")
public class EncouragementAPI {

    @Autowired
    private EncouragementService encouragementService;

    @Autowired
    private EncouragementRepository encouragementRepository;

    @Autowired
    private AccountUtils accountUtils;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> sendEncouragement(@Valid @RequestBody EncouragementRequestDTO request) {
        Encouragement saved = encouragementService.sendEncouragement(request.getReceiverId(), request.getMessage(), request.getTemplate());
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/sent")
    public ResponseEntity<?> getSentEncouragements() {
        User sender = accountUtils.getCurrentAccount();
        return ResponseEntity.ok(encouragementRepository.findBySender(sender));
    }

    @GetMapping("/received")
    public ResponseEntity<?> getReceivedEncouragements() {
        User receiver = accountUtils.getCurrentAccount();
        return ResponseEntity.ok(encouragementRepository.findByReceiver(receiver));
    }
}
