package com.example.demo2.services;

import com.example.demo2.entity.BlogComment;

import java.util.List;

public interface BlogCommentService {
    List<BlogComment> getCommentsByBlogID(Long blogID);
    void addComment(Long blogID, String content, String username);
}
