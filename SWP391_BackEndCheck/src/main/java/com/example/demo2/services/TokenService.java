package com.example.demo2.services;

import com.example.demo2.entity.User;
import com.example.demo2.repository.AuthenticationRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.function.Function;

@Service
public class TokenService {
    public final String SECRET_KEY = "c2cdd2fc91a244f3a7b8332f51fcb7196b7a0eab1f9a4a4c7f72b875f6d13ae8";

    @Autowired
    AuthenticationRepository authenticationRepository;

    private SecretKey getSignInKey(){
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // token dành riêng cho những người quên mật khẩu
    public String generateResetToken(String email) {
        long ttlMillis = 15 * 60 * 1000;
        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + ttlMillis))
                .claim("scope", "RESET_PASSWORD")   // phân biệt với token đăng nhập
                .signWith(getSignInKey())
                .compact();
    }


    public String generateToken(User account){
            String token=
                    //create obj for jwt
                    Jwts.builder().
                            //subject of token
                            subject(account.getEmail()).
                            //time create token
                            issuedAt(new Date(System.currentTimeMillis()))
                            //time expire of token
                            .expiration(new Date(System.currentTimeMillis()+24*60*60*1000))
                            //
                            .signWith(getSignInKey())
                            .compact();
            return token;
    }

    //form token to chain object
    public Claims extractAllChains(String token){
        return Jwts.parser().
                verifyWith(getSignInKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    //get username from CLAIM
    public User extractAccount(String token){
        String gmail = extractClaim(token, Claims::getSubject);
        return authenticationRepository.findUserByEmail(gmail);
    }

    public boolean isTokenExpired(String token){
        return extractExpiration(token).before(new Date());
    }

    public Date extractExpiration(String token){
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims,T> resolver){
        Claims claims= extractAllChains(token);
        return resolver.apply(claims);
    }
}
