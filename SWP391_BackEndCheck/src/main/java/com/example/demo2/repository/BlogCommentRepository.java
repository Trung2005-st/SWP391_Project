package com.example.demo2.repository;

import com.example.demo2.entity.BlogComment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BlogCommentRepository extends JpaRepository<BlogComment, Long> {
    List<BlogComment> findByBlog_BlogID(Long blogID);

    List<BlogComment> findByBlog_BlogIDOrderByCreatedAtDesc(Long blogBlogID);
}