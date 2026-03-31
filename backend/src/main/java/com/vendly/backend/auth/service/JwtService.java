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

    public String generateAccessToken(UUID userId, String email) {
        return Jwts.builder()
                .subject(userId.toString())
                .claim("email", email)
                .claim("gen", getCurrentGeneration())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + cfg.getAccessTokenExpiryMs()))
                .signWith(getSigningKey())
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
            return claims.get("gen", Long.class) >= getCurrentGeneration();
        } catch (JwtException e) {
            return false;
        }
    }

    public UUID extractUserId(String token) {
        return UUID.fromString(Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject());
    }

    public String extractEmail(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("email", String.class);
    }

    public void rotateAllTokens() {
        redis.opsForValue().increment(GEN_KEY);
    }

    private long getCurrentGeneration() {
        String g = redis.opsForValue().get(GEN_KEY);
        return g != null ? Long.parseLong(g) : 0L;
    }

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(cfg.getSecret()));
    }
}