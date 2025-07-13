package com.example.demo2.config;

import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * ───────────────────────────────────────────────────────────
 *  JwtBlackList
 *  • add(token, exp)      – đưa token vào blacklist
 *  • contains(token)      – true  ⇢  token đã bị thu hồi
 *  • cleanup() (cron)     – xóa mục quá hạn mỗi 5 phút
 * ───────────────────────────────────────────────────────────
 */
@Component
public class JwtBlackList {
    /** token ➜ expiryEpochMillis */
    private final Map<String, Long> store = new ConcurrentHashMap<>();

    /** Đưa token vào blacklist (thường gọi sau khi reset-password thành công) */
    public void add(String token, long expiryMillis) {
        store.put(token, expiryMillis);
    }

    /** Kiểm tra token có đang bị blacklist hay không */
    public boolean contains(String token) {
        Long exp = store.get(token);
        if (exp == null) return false;                   // chưa bị blacklist
        if (Instant.now().toEpochMilli() > exp) {        // đã quá hạn ⇒ dọn rác tại chỗ
            store.remove(token);
            return false;
        }
        return true;                                     // đang trong blacklist
    }
}