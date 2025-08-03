package com.example.demo2.api;

import com.example.demo2.entity.BlogComment;
import com.example.demo2.entity.User;
import com.example.demo2.repository.UserRepository;
import com.example.demo2.services.BlogInteractionService;
import com.example.demo2.services.BlogReactionService;
import com.example.demo2.utils.AccountUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/blog-interaction")
public class BlogInteractionAPI {

    @Autowired
    private BlogInteractionService blogInteractionService;

    @Autowired
    private BlogReactionService blogReactionService;

    @Autowired
    private UserDetailsService userDetailsService;

    // ------------------- REACTION -------------------
    @Autowired
    private UserRepository userRepository;

    private Long getCurrentUserID() {
        return AccountUtils.getCurrentAccount().getUserID();
    }



    @PostMapping("/react")
    public ResponseEntity<?> reactToBlog(@RequestParam Long blogID, @RequestParam(required = false) String emoji) {
        blogReactionService.reactToBlog(blogID, getCurrentUserID(), emoji);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/reactions/{blogID}")
    public ResponseEntity<Map<String, Long>> getBlogReactions(@PathVariable Long blogID) {
        Map<String, Long> reactions = blogReactionService.countReactionsByEmoji(blogID);
        return ResponseEntity.ok(reactions);
    }

    @GetMapping("/user-reaction/{blogID}")
    public ResponseEntity<Map<String, String>> getUserReaction(@PathVariable Long blogID) {
        String emoji = blogReactionService.getUserReaction(blogID, getCurrentUserID());
        return ResponseEntity.ok(Collections.singletonMap("emoji", emoji));
    }

    // ------------------- COMMENT -------------------
    @GetMapping("/comments/{blogID}")
    public ResponseEntity<List<BlogComment>> getComments(@PathVariable Long blogID) {
        return ResponseEntity.ok(blogInteractionService.getComments(blogID));
    }

    @PostMapping("/comment")
    public ResponseEntity<BlogComment> addComment(
            @RequestParam Long blogID,
            @RequestParam String content
    ) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName(); // Đây là username từ JWT
        BlogComment comment = blogInteractionService.addComment(blogID, content, username);
        return ResponseEntity.ok(comment);
    }
}
