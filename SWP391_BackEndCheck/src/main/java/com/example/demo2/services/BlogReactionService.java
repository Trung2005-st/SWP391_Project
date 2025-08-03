package com.example.demo2.services;

import com.example.demo2.entity.BlogReaction;
import com.example.demo2.repository.BlogReactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BlogReactionService {
    @Autowired
    private BlogReactionRepository reactionRepository;

    public void reactToBlog(Long blogID, Long userID, String newEmoji) {
        Optional<BlogReaction> existing = reactionRepository.findByBlogIDAndUserID(blogID, userID);

        if (existing.isPresent()) {
            BlogReaction reaction = existing.get();
            if (newEmoji == null || newEmoji.isEmpty()) {
                reactionRepository.delete(reaction); // remove reaction
            } else {
                reaction.setEmoji(newEmoji); // update emoji
                reactionRepository.save(reaction);
            }
        } else {
            if (newEmoji != null && !newEmoji.isEmpty()) {
                BlogReaction newReaction = new BlogReaction();
                newReaction.setBlogID(blogID);
                newReaction.setUserID(userID);
                newReaction.setEmoji(newEmoji);
                reactionRepository.save(newReaction);
            }
        }
    }

    public Map<String, Long> countReactionsByEmoji(Long blogID) {
        List<BlogReaction> reactions = reactionRepository.findByBlogID(blogID);
        return reactions.stream()
                .collect(Collectors.groupingBy(BlogReaction::getEmoji, Collectors.counting()));
    }

    public String getUserReaction(Long blogID, Long userID) {
        return reactionRepository.findByBlogIDAndUserID(blogID, userID)
                .map(BlogReaction::getEmoji)
                .orElse(null);
    }
}
