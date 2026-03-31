package com.vendly.backend.auth.service;

import com.vendly.backend.auth.config.JwtConfig;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class JwtService {

    private final JwtConfig cfg;
    private final RedisTemplate<String, String> redis;
    private static final String GEN_KEY = "jwt:generation";
    private static final String USER_GEN_PREFIX = "jwt:user:generation:";
    private static final int CLOCK_SKEW_SEC = 30;

    public String generateAccessToken(UUID userId, String email) {
        return Jwts.builder()
                .id(UUID.randomUUID().toString())
                .subject(userId.toString())
                .claim("email", email)
                .claim("gen", getCurrentGeneration())
                .claim("ugen", getUserGeneration(userId))
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + cfg.getAccessTokenExpiryMs()))
                .signWith(getSigningKey())
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            Claims claims = parseClaims(token);
            long globalGen = getCurrentGeneration();
            long userGen = getUserGeneration(
                    UUID.fromString(claims.getSubject()));
            return claims.get("gen", Long.class) >= globalGen
                    && claims.get("ugen", Long.class) >= userGen;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public UUID extractUserId(String token) {
        return UUID.fromString(parseClaims(token).getSubject());
    }

    public String extractEmail(String token) {
        return parseClaims(token).get("email", String.class);
    }

    public void rotateAllTokens() {
        redis.opsForValue().increment(GEN_KEY);
    }

    public void invalidateUserTokens(UUID userId) {
        redis.opsForValue().increment(USER_GEN_PREFIX + userId);
    }

    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .clockSkewSeconds(CLOCK_SKEW_SEC)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private long getCurrentGeneration() {
        String g = redis.opsForValue().get(GEN_KEY);
        return g != null ? Long.parseLong(g) : 0L;
    }

    private long getUserGeneration(UUID userId) {
        String g = redis.opsForValue().get(USER_GEN_PREFIX + userId);
        return g != null ? Long.parseLong(g) : 0L;
    }

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(cfg.getSecret()));
    }
}