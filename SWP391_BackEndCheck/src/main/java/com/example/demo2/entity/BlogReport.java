package com.example.demo2.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Entity
@Getter
@Setter
public class BlogReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reportID;

    @ManyToOne
    @JoinColumn(name = "blogID")
    @JsonIgnoreProperties("blogReports")
    private BlogDetail blog;

    @ManyToOne
    @JoinColumn(name = "userID")
    @JsonIgnoreProperties({"password", "membershipPlan"})
    private User user;

    @Column(nullable = false)
    private String reason;

    @Temporal(TemporalType.TIMESTAMP)
    private Date reportedAt = new Date();
}
