/*package com.example.demo2.utils;

import com.example.demo2.entity.User;
import com.example.demo2.repository.AuthenticationRepository;
import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class AccountUtils implements ApplicationContextAware {

    private static AuthenticationRepository userRepo;


    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        userRepo = applicationContext.getBean(AuthenticationRepository.class);
    }

    public User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepo.findUserByUsername(username);
    }
}
*/
package com.example.demo2.utils;

import com.example.demo2.entity.User;
import com.example.demo2.services.TokenService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Component
public class AccountUtils implements ApplicationContextAware {

    private static TokenService tokenService;

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        tokenService = applicationContext.getBean(TokenService.class);
    }

    public static User getCurrentAccount() {
        // Lấy request hiện tại
        HttpServletRequest request = ((ServletRequestAttributes)
                RequestContextHolder.currentRequestAttributes()).getRequest();
        // Lấy token từ header
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new IllegalStateException("Token not found in header");
        }

        String token = authHeader.substring(7); // Bỏ "Bearer "

        // Dùng TokenService để giải mã và tìm User
        return tokenService.extractAccount(token);
    }
}
