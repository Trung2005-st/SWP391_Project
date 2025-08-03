package com.example.demo2.api;

import com.example.demo2.entity.BlogDetail;
import com.example.demo2.entity.User;
import com.example.demo2.exception.BlogDetailNotFoundException;
import com.example.demo2.repository.BlogDetailRepository;
import com.example.demo2.repository.UserRepository;
import com.example.demo2.services.BlogDetailService;
import com.example.demo2.services.TokenService;
import com.example.demo2.dto.BlogDetailDTO;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@CrossOrigin("*")
@RequestMapping("/api/blogs")
@SecurityRequirement(name = "api")
@RestController
public class BlogDetailAPI {

    @Autowired
    private BlogDetailRepository blogDetailRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BlogDetailService blogDetailService;

    @Autowired
    private TokenService tokenService;

    // CRUD nguyên thủy
    @GetMapping
    public ResponseEntity<?> getAllBlogs() {
        List<BlogDetail> blogs = blogDetailRepository.findAll();
        return ResponseEntity.ok(blogs);
    }

    @PostMapping
    public ResponseEntity<?> createBlog(@Valid @RequestBody BlogDetail blog) {
        blog.setCreatedAt(new Date());
        return ResponseEntity.ok(blogDetailRepository.save(blog));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBlogById(@PathVariable Long id) {
        BlogDetail blog = blogDetailRepository.findById(id)
                .orElseThrow(() -> new BlogDetailNotFoundException("Blog not found"));
        return ResponseEntity.ok(blog);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBlog(@PathVariable Long id) {
        blogDetailRepository.deleteById(id);
        return ResponseEntity.ok("Deleted blog id: " + id);
    }

    @DeleteMapping
    public ResponseEntity<?> deleteBlog() {
        blogDetailRepository.deleteAll();
        return ResponseEntity.ok("done");
    }

    // DTO trả tất cả blog
    @GetMapping("/dto")
    public ResponseEntity<?> getAllBlogDTO() {
        List<BlogDetailDTO> dtoList = blogDetailService.getAllBlogs();
        return ResponseEntity.ok(dtoList);
    }

    // DTO trả blog theo userId
    @GetMapping("/dto/user")
    public ResponseEntity<?> getBlogsByUser(@RequestParam Long userId) {
        List<BlogDetailDTO> dtoList = blogDetailService.getBlogsByUser(userId);
        return ResponseEntity.ok(dtoList);
    }

    // tạo blog DTO với userId
    @PostMapping("/dto")
    public ResponseEntity<?> createBlogDTO(@RequestParam Long userId, @Valid @RequestBody BlogDetail blog) {
        User u = userRepository.findById(userId)
                .orElseThrow(() -> new BlogDetailNotFoundException("User not found"));
        blog.setUser(u);
        blog.setCreatedAt(new Date());
        return ResponseEntity.ok(blogDetailRepository.save(blog));
    }

    // lấy blog theo token của người đăng nhập
    @GetMapping("/dto/my")
    public ResponseEntity<?> getBlogsOfCurrentUser(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        User user = tokenService.extractAccount(token);
        List<BlogDetailDTO> dtoList = blogDetailService.getBlogsByUser(user.getUserID());
        return ResponseEntity.ok(dtoList);
    }

    @PostMapping("/dto/my")
    public ResponseEntity<?> createBlogForCurrentUser(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody BlogDetail blog) {
        String token = authHeader.substring(7); // tách Bearer
        User user = tokenService.extractAccount(token);
        blog.setUser(user);
        blog.setCreatedAt(new Date());
        return ResponseEntity.ok(blogDetailRepository.save(blog));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateBlog(
            @PathVariable Long id,
            @Valid @RequestBody BlogDetail updatedBlog) {
        BlogDetail existingBlog = blogDetailRepository.findById(id)
                .orElseThrow(() -> new BlogDetailNotFoundException("Blog not found"));

        existingBlog.setTitle(updatedBlog.getTitle());
        existingBlog.setSubtitle(updatedBlog.getSubtitle());
        existingBlog.setStory(updatedBlog.getStory());
        existingBlog.setBannerPath(updatedBlog.getBannerPath());
        // Không cần set lại user hoặc createdAt (trừ khi bạn muốn thay đổi)

        BlogDetail savedBlog = blogDetailRepository.save(existingBlog);

        return ResponseEntity.ok(savedBlog);
    }
}
