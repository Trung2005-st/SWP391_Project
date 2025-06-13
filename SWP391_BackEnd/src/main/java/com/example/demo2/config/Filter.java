package com.example.demo2.config;

import com.example.demo2.entity.User;
import com.example.demo2.exception.AuthenticationException;
import com.example.demo2.services.TokenService;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.io.IOException;
import java.util.List;

@Component
public class Filter extends OncePerRequestFilter {

    //để xử lí nếu ko có token quyền truy cập => gửi mã lỗi
    @Autowired
    @Qualifier("handlerExceptionResolver")
    private HandlerExceptionResolver handleResolver;

    private final List<String> PUBLIC_API = List.of(
            "POST:/api/register",
            "POST:/api/login",
            "DELETE:/api/users/{userId}",
            "POST:/api/users",
            "PUT:/api/users/{userId}",
            "DELETE:/api/membership/{planID}",
            "POST:/api/membership",
            "PUT:/api/membership/{planID}",
            "DELETE:/api/quitPlan/{quitID}",
            "POST:/api/quitPlan",
            "PUT:/api/quitPlan/{quitID}"
    );
    @Autowired
    private TokenService tokenService;

    public boolean isPublicAPI(String uri, String method){
        //URL: http:localhost:8080/api/users
        //URI: /api/users
        AntPathMatcher matcher= new AntPathMatcher();

        //nếu method là get cho qua luôn
        if (method.equals("GET")) return true;

        //nếu ko phải
        return PUBLIC_API.stream().anyMatch(pattern ->{
            //lấy string sau dấu :
            String[] parts= pattern.split(":",2);
            if (parts.length!=2) return false;

            String allowedMethod = parts[0];
            String allowedUri = parts[1];

            return method.equalsIgnoreCase(allowedMethod) && matcher.match(allowedUri,uri);
        });

    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        //function sẽ run mỗi khi có request front-end sang đây
        //cho phep tuy cap cac lop controller
        String uri= request.getRequestURI();
        String method= request.getMethod();

        if (isPublicAPI(uri,method)){
            //nếu kết quả check là public api thì cho qua luôn khỏi check token
            filterChain.doFilter(request, response);
        } else {
            //xác thực
            String token = getToken(request);
            if (token == null) {
                //nếu ko có token
                handleResolver.resolveException(request, response, null, new AuthenticationException("Empty token!"));
                return;
            }
            //có token
            //verify token
            User account;
            try{
                //từ token => user là ai
                account = tokenService.extractAccount(token);
            }catch(ExpiredJwtException expiredJwtException){
                //token hết hạn
                handleResolver.resolveException(request, response, null, new AuthenticationException("Expired token!"));
                return;
            }catch(MalformedJwtException malformedJwtException){
                //token không đúng
                handleResolver.resolveException(request, response, null, new AuthenticationException("Malformed token!"));
                return;
            }
            //token đúng
            UsernamePasswordAuthenticationToken
                    authenToken =
                    new UsernamePasswordAuthenticationToken(account, token, account.getAuthorities());
            authenToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authenToken);
            //token ok, cho vào
            filterChain.doFilter(request, response);
        }
    }

    public String getToken(HttpServletRequest request){
        String authHeader= request.getHeader("Authorization");
        if (authHeader == null) return null;
        return authHeader.substring(7);
    }
}
