package com.example.demo2.services;

import com.example.demo2.entity.Encouragement;
import com.example.demo2.entity.User;
import com.example.demo2.repository.EncouragementRepository;
import com.example.demo2.repository.UserRepository;
import com.example.demo2.utils.AccountUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class EncouragementService {

    @Autowired
    private EncouragementRepository encouragementRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AccountUtils accountUtils;

    public Encouragement sendEncouragement(Long receiverId, String message, String template) {
        User sender = accountUtils.getCurrentAccount();
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new IllegalArgumentException("Receiver not found"));

        Encouragement encouragement = new Encouragement();
        encouragement.setSender(sender);
        encouragement.setReceiver(receiver);
        encouragement.setMessage(message);
        encouragement.setTemplate(template);
        encouragement.setSentAt(new Date());

        return encouragementRepository.save(encouragement);
    }

    public List<Encouragement> getReceived(User receiver) {
        return encouragementRepository.findByReceiver(receiver);
    }
}
