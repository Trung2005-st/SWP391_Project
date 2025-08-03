// src/main/java/com/example.demo2/service/FeedbackServiceImpl.java
package com.example.demo2.services;

import com.example.demo2.dto.FeedbackDTO;
import com.example.demo2.entity.Feedback;
import com.example.demo2.entity.User;
import com.example.demo2.repository.FeedbackRepository;
import com.example.demo2.utils.AccountUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FeedbackServiceImpl implements FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepo;

    @Override
    public FeedbackDTO addFeedback(FeedbackDTO dto) {
        // Lấy user hiện tại từ token
        User current = AccountUtils.getCurrentAccount();

        Feedback f = new Feedback();
        f.setUser(current);
        f.setEmoji(dto.getEmoji());
        f.setMessage(dto.getMessage());
        f.setSentAt(LocalDateTime.now());

        Feedback saved = feedbackRepo.save(f);
        return mapToDto(saved);
    }

    @Override
    public List<FeedbackDTO> getAllFeedback() {
        return feedbackRepo.findAll(Sort.by(Sort.Direction.DESC, "sentAt"))
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private FeedbackDTO mapToDto(Feedback f) {
        return new FeedbackDTO(
                f.getId(),
                f.getUser().getUserID(),
                f.getUser().getUsername(),
                f.getEmoji(),
                f.getMessage(),
                f.getSentAt()
        );
    }
}
