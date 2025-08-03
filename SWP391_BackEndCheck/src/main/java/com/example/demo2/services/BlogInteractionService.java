package com.example.demo2.services;

import com.example.demo2.entity.BlogComment;

import java.util.List;

public interface BlogInteractionService {
    List<BlogComment> getComments(Long blogID);
    BlogComment addComment(Long blogID, String content, String username );
}

