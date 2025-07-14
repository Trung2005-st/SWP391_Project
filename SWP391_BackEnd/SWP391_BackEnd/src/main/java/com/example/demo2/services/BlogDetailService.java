package com.example.demo2.services;

import com.example.demo2.dto.BlogDetailDTO;
import com.example.demo2.entity.BlogDetail;
import com.example.demo2.repository.BlogDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class BlogDetailService {
    @Autowired
    private BlogDetailRepository blogRepo;

    // trả về tất cả blog
    public List<BlogDetailDTO> getAllBlogs() {
        List<BlogDetail> blogs = blogRepo.findAll();
        List<BlogDetailDTO> dtoList = new ArrayList<>();
        for (BlogDetail b : blogs) {
            BlogDetailDTO dto = new BlogDetailDTO();
            dto.setBlogID(b.getBlogID());
            dto.setTitle(b.getTitle());
            dto.setStory(b.getStory());
            dto.setBannerPath(b.getBannerPath());
            dto.setCreatedAt(b.getCreatedAt());
            dto.setUserID(b.getUser().getUserID());
            dto.setUsername(b.getUser().getUsername());
            dto.setEmail(b.getUser().getEmail());
            dto.setRole(b.getUser().getRole());
            dtoList.add(dto);
        }
        return dtoList;
    }

    // trả về blog theo user
    public List<BlogDetailDTO> getBlogsByUser(long userId) {
        List<BlogDetail> blogs = blogRepo.findByUser_UserID(userId);
        List<BlogDetailDTO> dtoList = new ArrayList<>();
        for (BlogDetail b : blogs) {
            BlogDetailDTO dto = new BlogDetailDTO();
            dto.setBlogID(b.getBlogID());
            dto.setTitle(b.getTitle());
            dto.setStory(b.getStory());
            dto.setBannerPath(b.getBannerPath());
            dto.setCreatedAt(b.getCreatedAt());
            dto.setUserID(b.getUser().getUserID());
            dto.setUsername(b.getUser().getUsername());
            dto.setRole(b.getUser().getRole());
            dtoList.add(dto);
        }
        return dtoList;
    }

}

