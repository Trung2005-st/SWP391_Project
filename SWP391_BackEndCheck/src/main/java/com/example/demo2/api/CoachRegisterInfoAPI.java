// src/main/java/com/example/demo2/api/CoachRegisterInfoAPI.java
package com.example.demo2.api;

import com.example.demo2.dto.CoachRegisterInfoDTO;
import com.example.demo2.entity.CoachRegisterInfo;
import com.example.demo2.entity.User;
import com.example.demo2.enums.Status;
import com.example.demo2.exception.AccountNotFoundException;
import com.example.demo2.exception.CoachRegisterInfoNotFoundException;
import com.example.demo2.repository.CoachRegisterInfoRepository;
import com.example.demo2.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/coach-register-info")
public class CoachRegisterInfoAPI {

    @Autowired
    private CoachRegisterInfoRepository repo;

    @Autowired
    private UserRepository userRepo;

    // --- 1) List all as DTO ---
    @GetMapping
    public ResponseEntity<List<CoachRegisterInfoDTO>> getAll() {
        List<CoachRegisterInfoDTO> list = repo.findAll().stream()
                .map(info -> {
                    User u = info.getUser();
                    return new CoachRegisterInfoDTO(
                            info.getRegisterId(),
                            u.getUserID(),
                            u.getUsername(),
                            u.getEmail(),
                            info.getRegisterDate(),
                            info.getReason(),
                            info.getStatus()
                    );
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    // --- 2) Get by ID as DTO ---
    @GetMapping("/{id}")
    public ResponseEntity<CoachRegisterInfoDTO> getById(@PathVariable Long id) {
        CoachRegisterInfo info = repo.findById(id)
                .orElseThrow(() -> new CoachRegisterInfoNotFoundException("Registration not found: " + id));
        User u = info.getUser();
        CoachRegisterInfoDTO dto = new CoachRegisterInfoDTO(
                info.getRegisterId(),
                u.getUserID(),
                u.getUsername(),
                u.getEmail(),
                info.getRegisterDate(),
                info.getReason(),
                info.getStatus()
        );
        return ResponseEntity.ok(dto);
    }

    // --- 3) Create new (unchanged) ---
    @PostMapping
    public ResponseEntity<Void> create(@Valid @RequestBody CoachRegisterInfo incoming) {
        User user = userRepo.findById(incoming.getUser().getUserID())
                .orElseThrow(() -> new AccountNotFoundException("User not found: " + incoming.getUser().getUserID()));
        incoming.setUser(user);
        incoming.setStatus(Status.PENDING);
        repo.save(incoming);
        return ResponseEntity.ok().build();
    }

    // --- 4) Update (unchanged) ---
    @PutMapping("/{id}")
    public ResponseEntity<Void> update(
            @PathVariable Long id,
            @Valid @RequestBody CoachRegisterInfo incoming) {
        CoachRegisterInfo existing = repo.findById(id)
                .orElseThrow(() -> new CoachRegisterInfoNotFoundException("Registration not found: " + id));
        existing.setReason(incoming.getReason());
        existing.setStatus(incoming.getStatus());
        repo.save(existing);
        return ResponseEntity.ok().build();
    }

    // --- 5) Delete ---
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        repo.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // --- Approve ---
    @PostMapping("/{id}/approve")
    public ResponseEntity<Void> approve(@PathVariable Long id) {
        CoachRegisterInfo info = repo.findById(id)
                .orElseThrow(() -> new CoachRegisterInfoNotFoundException("Not found: " + id));
        // 1) Nâng role lên Coach
        var user = info.getUser();
        user.setRole(2);
        userRepo.save(user);
        // 2) Xóa hồ sơ đăng ký
        repo.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // --- Reject ---
    @PostMapping("/{id}/reject")
    public ResponseEntity<Void> reject(@PathVariable Long id) {
        if (!repo.existsById(id)) {
            throw new CoachRegisterInfoNotFoundException("Not found: " + id);
        }
        repo.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
