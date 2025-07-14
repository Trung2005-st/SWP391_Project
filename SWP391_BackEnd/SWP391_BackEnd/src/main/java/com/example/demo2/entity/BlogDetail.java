package com.example.demo2.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Entity
@Getter
@Setter
public class BlogDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long blogID;

    @ManyToOne
    @JoinColumn(name = "userID")
    @JsonIgnoreProperties({"password","membershipPlan"})
    private User user;   // tác giả

    @Column(nullable = false)
    private String title;

    @Lob
    private String subtitle;

    @Lob
    private String story;

    private String bannerPath;

    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;
}
