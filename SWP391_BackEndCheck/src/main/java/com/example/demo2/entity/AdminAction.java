package com.example.demo2.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Entity
@Getter
@Setter
public class AdminAction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long actionID;

    @ManyToOne
    @JoinColumn(name = "adminID")
    private User admin;

    @ManyToOne
    @JoinColumn(name = "targetID")
    private User target;

    private String actionType;
    private String details;
    private Date date;

}
