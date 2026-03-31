package com.vendly.backend.common.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.core.annotation.Order;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Component
@RequiredArgsConstructor
@Order(2)
public class RateLimitFilter extends OncePerRequestFilter {

    private final RedisTemplate<String, String> redis;

    private static final Map<String, long[]> LIMITS = Map.of(
            "/api/v1/auth/login", new long[] { 5, 15 },
            "/api/v1/auth/register", new long[] { 3, 60 },
            "/api/v1/auth/forgot-password", new long[] { 3, 60 },
            "/api/v1/auth/reset-password", new long[] { 5, 60 },
            "/api/v1/auth/verify-email", new long[] { 10, 60 },
            "/api/v1/auth/resend-otp", new long[] { 3, 60 });

    @Override
    protected void doFilterInternal(HttpServletRequest req,
            HttpServletResponse res,
            FilterChain chain) throws ServletException, IOException {
        long[] limit = LIMITS.get(req.getRequestURI());
        if (limit == null) {
            chain.doFilter(req, res);
            return;
        }

        String ip = getClientIp(req);
        String key = "rl:" + req.getRequestURI() + ":" + ip;

        Long count = redis.opsForValue().increment(key);
        if (count != null && count == 1L)
            redis.expire(key, limit[1], TimeUnit.MINUTES);

        if (count != null && count > limit[0]) {
            long ttl = redis.getExpire(key, TimeUnit.SECONDS);
            res.setStatus(429);
            res.setHeader("Retry-After", String.valueOf(ttl));
            res.setContentType("application/json");
            res.getWriter().write(String.format(
                    "{\"success\":false,\"message\":\"Too many attempts. Try again in %d seconds.\"}", ttl));
            return;
        }

        res.setHeader("X-RateLimit-Limit", String.valueOf(limit[0]));
        res.setHeader("X-RateLimit-Remaining", String.valueOf(Math.max(0, limit[0] - (count != null ? count : 0))));
        chain.doFilter(req, res);
    }

    private String getClientIp(HttpServletRequest req) {
        String fwd = req.getHeader("X-Forwarded-For");
        if (fwd != null) {
            String ip = fwd.split(",")[0].trim();
            if (ip.matches("^([0-9]{1,3}\\.){3}[0-9]{1,3}$"))
                return ip;
        }
        return req.getRemoteAddr();
    }
}