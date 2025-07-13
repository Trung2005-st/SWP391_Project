package com.example.demo2.api;

import com.example.demo2.model.request.MessageRequest;
import com.example.demo2.model.response.MessageResponse;
import com.example.demo2.services.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/messages")
public class MessagesAPI {
    @Autowired
    private MessageService messageService;

    // ✅ Send a message
    @PostMapping
    public ResponseEntity sendMessage(@RequestBody MessageRequest messageRequest) {
        MessageResponse response = messageService.sendMessage(messageRequest);
        return ResponseEntity.ok(response);
    }

    // ✅ Get chat history between current user and partner
    @GetMapping("/conversation/{partnerId}")
    public ResponseEntity getConversation(
            @PathVariable Long partnerId
    ) {
        List<MessageResponse> conversation = messageService.getConversation(partnerId);
        return ResponseEntity.ok(conversation);
    }
}
