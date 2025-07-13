package com.example.demo2.services;

import com.example.demo2.entity.Message;
import com.example.demo2.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    int countMessageBySender(User user);
    @Query("""
    SELECT m FROM Message m
    WHERE (m.sender.userID = :user1Id AND m.receiver.userID = :user2Id)
       OR (m.sender.userID = :user2Id AND m.receiver.userID = :user1Id)
    ORDER BY m.time ASC
""")
    List<Message> findConversation(@Param("user1Id") Long user1Id, @Param("user2Id") Long user2Id);
}
