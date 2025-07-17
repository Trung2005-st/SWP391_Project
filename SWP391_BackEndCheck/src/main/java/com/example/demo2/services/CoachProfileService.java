package com.example.demo2.services;

import com.example.demo2.dto.CoachProfileDTO;
import com.example.demo2.dto.CreateCoachRequest;
import com.example.demo2.entity.CoachProfile;
import com.example.demo2.entity.User;
import com.example.demo2.enums.UserRole;
import com.example.demo2.exception.AccountNotFoundException;
import com.example.demo2.repository.CoachProfileRepository;
import com.example.demo2.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CoachProfileService {

    @Autowired
    private CoachProfileRepository coachProfileRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Lấy toàn bộ coach dưới dạng DTO
    public List<CoachProfileDTO> getAllCoaches() {
        return coachProfileRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    // Chuyển entity sang DTO
    public CoachProfileDTO toDTO(CoachProfile cp) {
        CoachProfileDTO dto = new CoachProfileDTO();
        dto.setCoachID(cp.getCoachID());
        dto.setExpertise(cp.getExpertise());
        dto.setYearsOfExperience(cp.getYearsOfExperience());
        dto.setInstitution(cp.getInstitution());
        dto.setBiography(cp.getBiography());
        if (cp.getUser() != null) {
            dto.setFirstName(cp.getUser().getFirstName());
            dto.setLastName(cp.getUser().getLastName());
            dto.setUsername(cp.getUser().getUsername());
        }
        return dto;
    }

    // Tạo mới coach profile từ request, đồng thời tạo user luôn
    public CoachProfileDTO createCoach(CreateCoachRequest req) {
        if (userRepository.existsByUsername(req.getUsername()))
            throw new RuntimeException("Username already exists!");

        // 1. Tạo user
        User u = new User();
        u.setUsername(req.getUsername());
        u.setPassword(passwordEncoder.encode(req.getPassword()));
        u.setFirstName(req.getFirstName());
        u.setLastName(req.getLastName());
        u.setEmail(req.getEmail());
        u.setPhone(req.getPhone());
        u.setGender(req.getGender());
        u.setRole(2); // 2 = COACH (tùy enum của bạn)
        u.setJoinDate(new java.util.Date());
        u.setStatus(true);
        u.setVerified(false);
        userRepository.save(u);

        // 2. Tạo CoachProfile
        CoachProfile profile = new CoachProfile();
        profile.setUser(u);
        profile.setExpertise(req.getExpertise());
        profile.setYearsOfExperience(req.getYearsOfExperience());
        profile.setInstitution(req.getInstitution());
        profile.setBiography(req.getBiography());

        CoachProfile saved = coachProfileRepository.save(profile);
        return toDTO(saved);
    }
}
