package com.example.demo2.api;

import com.example.demo2.entity.AdminAction;
import com.example.demo2.exception.AdminActionNotFoundException;
import com.example.demo2.repository.AdminActionRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/admin")
public class AdminActionAPI {

    @Autowired
    private AdminActionRepository adminActionRepository;

    @GetMapping
    public ResponseEntity<List<AdminAction>> getAdminActionList() {
        return ResponseEntity.ok(adminActionRepository.findAll());
    }

    @GetMapping("/{actionID}")
    public ResponseEntity<AdminAction> getAdminActionById(@PathVariable Long actionID) {
        AdminAction action = adminActionRepository.findById(actionID)
                .orElseThrow(() -> new AdminActionNotFoundException("Not found admin action " + actionID));
        return ResponseEntity.ok(action);
    }

    @PostMapping
    public ResponseEntity<AdminAction> createAdminAction(@Valid @RequestBody AdminAction adminAction) {
        return ResponseEntity.ok(adminActionRepository.save(adminAction));
    }

    @DeleteMapping("/{actionID}")
    public ResponseEntity<Void> deleteAdminAction(@PathVariable Long actionID) {
        adminActionRepository.deleteById(actionID);
        return ResponseEntity.ok().build();
    }
}

