package com.vendly.backend.auth.service;

import com.vendly.backend.common.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class OtpService {

    private final RedisTemplate<String, String> redis;
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();
    private static final int OTP_TTL_MINUTES = 10;
    private static final int MAX_ATTEMPTS = 5;
    private static final String OTP_PREFIX = "otp:";
    private static final String ATTEMPT_PREFIX = "otp:attempts:";

    public String generateAndStore(String email) {
        String otp = String.format("%06d",
                SECURE_RANDOM.nextInt(1_000_000));
        redis.opsForValue().set(
                OTP_PREFIX + email, otp,
                OTP_TTL_MINUTES, TimeUnit.MINUTES);
        // reset attempt counter setiap kali OTP baru digenerate
        redis.delete(ATTEMPT_PREFIX + email);
        return otp;
    }

    public boolean verify(String email, String otp) {
        String attemptKey = ATTEMPT_PREFIX + email;
        Long attempts = redis.opsForValue().increment(attemptKey);
        if (attempts != null && attempts == 1L) {
            redis.expire(attemptKey, OTP_TTL_MINUTES, TimeUnit.MINUTES);
        }
        if (attempts != null && attempts > MAX_ATTEMPTS) {
            throw new BusinessException(
                    "Terlalu banyak percobaan. Minta OTP baru.");
        }
        String stored = redis.opsForValue().get(OTP_PREFIX + email);
        if (otp.equals(stored)) {
            redis.delete(OTP_PREFIX + email);
            redis.delete(attemptKey);
            return true;
        }
        return false;
    }
}