package com.vendly.backend.auth.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class OtpService {

    private final RedisTemplate<String, String> redis;
    private static final SecureRandom secureRandom = new SecureRandom();
    private static final int OTP_EXPIRY_MINUTES = 10;
    private static final int MAX_ATTEMPTS = 5;

    public String generateAndStore(String email) {
        String otp = String.valueOf(100000 + secureRandom.nextInt(900000));
        redis.opsForValue().set("otp:" + email, otp, OTP_EXPIRY_MINUTES, TimeUnit.MINUTES);
        redis.opsForValue().set("otp:attempts:" + email, "0", OTP_EXPIRY_MINUTES, TimeUnit.MINUTES);
        return otp;
    }

    public boolean verify(String email, String otp) {
        String attemptsKey = "otp:attempts:" + email;
        Long attempts = redis.opsForValue().increment(attemptsKey);

        if (attempts != null && attempts > MAX_ATTEMPTS) {
            return false;
        }

        String stored = redis.opsForValue().get("otp:" + email);
        if (otp.equals(stored)) {
            redis.delete("otp:" + email);
            redis.delete(attemptsKey);
            return true;
        }
        return false;
    }

    public boolean hasActiveOtp(String email) {
        return Boolean.TRUE.equals(redis.hasKey("otp:" + email));
    }

    public void invalidate(String email) {
        redis.delete("otp:" + email);
        redis.delete("otp:attempts:" + email);
    }
}