package com.example.demo2.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Entity
@Getter
@Setter
public class Encouragement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long encouragementID;

    @ManyToOne
    @JoinColumn(name = "sender_id")
    private User sender;

    @ManyToOne
    @JoinColumn(name = "receiver_id")
    private User receiver;

    private String message;

    private Date sentAt;

    private String template;
}
