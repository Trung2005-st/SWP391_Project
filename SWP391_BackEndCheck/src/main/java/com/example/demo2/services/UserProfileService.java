package com.example.demo2.services;

import com.example.demo2.dto.UserProfileDTO;
import com.example.demo2.entity.User;
import com.example.demo2.enums.UserRole;
import com.example.demo2.exception.AccountNotFoundException;
import com.example.demo2.exception.BadRequestException;
import com.example.demo2.model.request.UpdateProfileRequest;
import com.example.demo2.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserProfileService {
    @Autowired
    UserRepository userRepository;

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private UserProfileDTO mapToDTO(User user) {
        UserProfileDTO dto = modelMapper.map(user, UserProfileDTO.class);
        dto.setRole(UserRole.fromCode(user.getRole())); // override field
        return dto;
    }

    public UserProfileDTO getUserProfileById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AccountNotFoundException("User not found"));
        return mapToDTO(user);
    }

    private User getCurrentUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    public UserProfileDTO getCurrentUserProfile() {
        User currentUser = getCurrentUser();
        return mapToDTO(currentUser);
    }

    public UserProfileDTO updateProfile(UpdateProfileRequest request) {
        User user = getCurrentUser();

        // cập nhật username
        if (request.getUsername() != null) {
            user.setUsername(request.getUsername());
        }

        // cập nhật gender
        if (request.getGender() != null) {
            user.setGender(request.getGender());
        }

        // xử lý đổi password
        if (request.getOldPassword() != null && request.getNewPassword() != null) {
            // validate old password
            if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
                throw new BadRequestException("Old password is incorrect");
            }
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        }

        userRepository.save(user);

        // trả về DTO đã update
        UserProfileDTO dto = modelMapper.map(user, UserProfileDTO.class);
        dto.setRole(UserRole.fromCode(user.getRole()));
        return dto;
    }
}
