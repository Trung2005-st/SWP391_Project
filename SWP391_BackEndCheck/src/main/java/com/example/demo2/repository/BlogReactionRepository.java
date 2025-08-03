package com.example.demo2.repository;

import com.example.demo2.entity.BlogReaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BlogReactionRepository extends JpaRepository<BlogReaction, Long> {

    Optional<BlogReaction> findByBlogIDAndUserID(Long blogID, Long userID);

    List<BlogReaction> findByBlogID(Long blogID);
}

