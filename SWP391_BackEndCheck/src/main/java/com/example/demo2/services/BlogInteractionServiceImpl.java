package com.example.demo2.services;

import com.example.demo2.entity.BlogComment;
import com.example.demo2.entity.BlogDetail;
import com.example.demo2.repository.BlogCommentRepository;
import com.example.demo2.repository.BlogDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BlogInteractionServiceImpl implements BlogInteractionService {

    @Autowired
    private BlogCommentRepository commentRepo;



    @Autowired
    private BlogDetailRepository blogRepo;

    @Override
    public List<BlogComment> getComments(Long blogID) {
        return commentRepo.findByBlog_BlogIDOrderByCreatedAtDesc(blogID);
    }

    @Override
    public BlogComment addComment(Long blogID, String content, String username) {
        BlogDetail blog = blogRepo.findById(blogID)
                .orElseThrow(() -> new RuntimeException("Blog not found"));

        BlogComment comment = new BlogComment();
        comment.setBlog(blog);  // ⬅ đây là chỗ lỗi bạn gặp: chỉ hoạt động khi bạn dùng @ManyToOne blog
        comment.setContent(content);
        comment.setUserName(username);
        comment.setCreatedAt(LocalDateTime.now());

        return commentRepo.save(comment);
    }

    
}

