package com.example.demo2.services;

import com.example.demo2.entity.Message;
import com.example.demo2.entity.User;
import com.example.demo2.exception.BadRequestException;
import com.example.demo2.exception.InvalidMembershipException;
import com.example.demo2.model.request.MessageRequest;
import com.example.demo2.model.response.MessageResponse;
import com.example.demo2.repository.UserRepository;
import com.example.demo2.utils.AccountUtils;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MessageService {
    @Autowired
    ModelMapper modelMapper;

    @Autowired
    AccountUtils accountUtils;

    @Autowired
    MessageRepository messageRepository;

    @Autowired
    UserRepository userRepository;

    public MessageResponse sendMessage(MessageRequest messageRequest){
        Long senderId = messageRequest.getSenderId();
        Long receiverId = messageRequest.getReceiverId();
        String content = messageRequest.getContent();
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new BadRequestException("Sender not found"));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new BadRequestException("Receiver not found"));
        String membershipName = sender.getMembershipPlan().getName();
        if ("Free".equalsIgnoreCase(membershipName)) {
            throw new InvalidMembershipException("Free members cannot use chat.");
        }

        if ("Paid".equalsIgnoreCase(membershipName)) {
            long countThisMonth = messageRepository.countMessageBySender(sender);
            if (countThisMonth >= 20) {
                throw new InvalidMembershipException("Paid members can send up to 20 messages per month.");
            }
        }
        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setContent(content);
        message.setTime(LocalDateTime.now());

        messageRepository.save(message);

        MessageResponse messageResponse = modelMapper.map(message, MessageResponse.class);

        return messageResponse;
    }

    public List<MessageResponse> getConversation(Long partnerId) {
        User currentUser = accountUtils.getCurrentAccount(); // from SecurityContext
        Long currentUserId = currentUser.getUserID();

        List<Message> messages = messageRepository.findConversation(currentUserId, partnerId);

        return messages.stream()
                .map(message -> modelMapper.map(message, MessageResponse.class))
                .collect(Collectors.toList());
    }


}
