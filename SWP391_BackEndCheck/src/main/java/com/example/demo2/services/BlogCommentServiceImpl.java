package com.example.demo2.services;

import com.example.demo2.entity.BlogComment;
import com.example.demo2.repository.BlogCommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BlogCommentServiceImpl implements BlogCommentService {

    @Autowired
    private BlogCommentRepository commentRepo;

    @Override
    public List<BlogComment> getCommentsByBlogID(Long blogID) {
        return commentRepo.findByBlog_BlogIDOrderByCreatedAtDesc(blogID);
    }

    @Override
    public void addComment(Long blogID, String content, String username) {
        BlogComment comment = new BlogComment();
        comment.setId(blogID);
        comment.setContent(content);
        comment.setUserName(username);
        commentRepo.save(comment);
    }
}

