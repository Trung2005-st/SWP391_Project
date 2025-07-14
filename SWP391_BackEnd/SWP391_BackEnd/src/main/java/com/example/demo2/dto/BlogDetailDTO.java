package com.example.demo2.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class BlogDetailDTO {
    private Long blogID;
    private String title;
    private String subtitle;
    private String story;
    private String bannerPath;
    private Date createdAt;

    private Long userID;
    private String username;
    private String email;
    private int role;
}
