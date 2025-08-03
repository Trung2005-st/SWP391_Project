package com.example.demo2.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Getter
@Setter
@Table(name = "blog_comments")
public class BlogComment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "blog_id")
    @JsonIgnoreProperties({"story", "subtitle", "bannerPath", "createdAt", "user"})
    private BlogDetail blog;

    private String userName;

    private String content;

    private LocalDateTime createdAt = LocalDateTime.now();


}

