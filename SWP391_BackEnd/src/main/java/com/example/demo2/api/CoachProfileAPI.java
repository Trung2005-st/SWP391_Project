package com.example.demo2.api;

import com.example.demo2.entity.CoachProfile;
import com.example.demo2.entity.User;
import com.example.demo2.exception.AccountNotFoundException;
import com.example.demo2.exception.CoachProfileNotFoundException;
import com.example.demo2.repository.CoachProfileRepository;
import com.example.demo2.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@CrossOrigin("*")
@RestController
@RequestMapping("/api/coach")
public class CoachProfileAPI {

    @Autowired
    private CoachProfileRepository coachProfileRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity getAllCoachProfiles() {
        return ResponseEntity.ok(coachProfileRepository.findAll());
    }

    @GetMapping("/{coachID}")
    public ResponseEntity getCoachProfileById(@PathVariable Long coachID) {
        CoachProfile cp = coachProfileRepository.findById(coachID)
                .orElseThrow(() -> new CoachProfileNotFoundException("Not found coach profile " + coachID));
        return ResponseEntity.ok(cp);
    }

    @PostMapping
    public ResponseEntity createCoachProfile(@Valid @RequestBody CoachProfile coachProfile) {
        User u = userRepository.findById(coachProfile.getUser().getUserID()).orElseThrow();
        coachProfile.setUser(u);
        return ResponseEntity.ok(coachProfileRepository.save(coachProfile));
    }

    @PutMapping("/{coachID}")
    public ResponseEntity<CoachProfile> updateCoachProfile(
            @PathVariable Long coachID,
            @Valid @RequestBody CoachProfile incoming
    ) {
        // 1) fetch existing
        CoachProfile existing = coachProfileRepository.findById(coachID)
                .orElseThrow(() ->
                        new CoachProfileNotFoundException("Not found coach profile " + coachID));

        // 2) if the payload contains a new user, reattach it
        if (incoming.getUser() != null && incoming.getUser().getUserID() != null) {
            Long newUid = incoming.getUser().getUserID();
            User u = userRepository.findById(newUid)
                    .orElseThrow(() ->
                            new AccountNotFoundException("User not found: " + newUid));
            existing.setUser(u);
        }

        // 3) copy the other updatable fields
        existing.setBiography(incoming.getBiography());
        existing.setExpertise(incoming.getExpertise());
        existing.setYearsOfExperience(incoming.getYearsOfExperience());

        // 4) save & return
        CoachProfile updated = coachProfileRepository.save(existing);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{coachID}")
    public ResponseEntity<Void> deleteCoachProfile(@PathVariable Long coachID) {
        coachProfileRepository.deleteById(coachID);
        return ResponseEntity.ok().build();
    }
}
