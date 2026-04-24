package com.vendly.backend.auth.service;

import com.vendly.backend.auth.dto.*;
import com.vendly.backend.auth.entity.UserToken;
import com.vendly.backend.auth.repository.UserTokenRepository;
import com.vendly.backend.common.exception.*;
import com.vendly.backend.user.entity.User;
import com.vendly.backend.user.repository.UserRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepo;
    private final UserTokenRepository tokenRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final OtpService otpService;

    // EmailService akan diinject setelah Fase 10 — pakai placeholder dulu
    // private final EmailService emailService;

    @Value("${jwt.refresh-token-expiry-ms:604800000}")
    private long refreshTokenExpiryMs;

    // ─── Register ────────────────────────────────────────────────────────────

    @Transactional
    public void register(RegisterRequest req) {
        if (userRepo.existsByEmail(req.getEmail())) {
            throw new DuplicateResourceException("Email sudah terdaftar");
        }
        if (userRepo.existsByUsername(req.getUsername())) {
            throw new DuplicateResourceException("Username sudah dipakai");
        }

        User user = User.builder()
                .username(req.getUsername().toLowerCase())
                .email(req.getEmail().toLowerCase())
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .displayName(req.getDisplayName() != null
                        ? req.getDisplayName()
                        : req.getUsername())
                .build();
        userRepo.save(user);

        String otp = otpService.generateAndStore(user.getEmail());
        // TODO Fase 10: emailService.sendOtpVerification(user.getEmail(), otp)
        // Sementara log OTP untuk development — HAPUS sebelum production
        log.info("[DEV ONLY] OTP for {} = {}", user.getEmail(), otp);

        log.info("User registered userId={} email={}", user.getId(), user.getEmail());
    }

    // ─── Verify Email ─────────────────────────────────────────────────────────

    @Transactional
    public void verifyEmail(VerifyEmailRequest req) {
        User user = userRepo.findByEmail(req.getEmail().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("Email tidak ditemukan"));

        if (user.getIsEmailVerified()) {
            throw new BusinessException("Email sudah diverifikasi");
        }

        boolean valid = otpService.verify(req.getEmail().toLowerCase(), req.getOtp());
        if (!valid) {
            throw new BusinessException("OTP tidak valid atau sudah expired");
        }

        user.setIsEmailVerified(true);
        userRepo.save(user);
        log.info("Email verified userId={}", user.getId());
    }

    // ─── Resend OTP ───────────────────────────────────────────────────────────

    @Transactional
    public void resendOtp(ResendOtpRequest req) {
        User user = userRepo.findByEmail(req.getEmail().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("Email tidak ditemukan"));

        if (user.getIsEmailVerified()) {
            throw new BusinessException("Email sudah diverifikasi");
        }

        String otp = otpService.generateAndStore(user.getEmail());
        // TODO Fase 10: emailService.sendOtpVerification(user.getEmail(), otp)
        log.info("[DEV ONLY] Resend OTP for {} = {}", user.getEmail(), otp);
    }

    // ─── Login ────────────────────────────────────────────────────────────────

    @Transactional
    public AuthResponse login(LoginRequest req, HttpServletResponse res) {
        User user = userRepo.findByEmail(req.getEmail().toLowerCase())
                .orElseThrow(() -> new UnauthorizedException("Email atau password salah"));

        if (user.isLocked()) {
            throw new UnauthorizedException(
                    "Akun terkunci. Coba lagi dalam beberapa menit.");
        }

        if (!passwordEncoder.matches(req.getPassword(), user.getPasswordHash())) {
            user.incrementLoginAttempts();
            userRepo.save(user);
            log.warn("Failed login attempt userId={} attempts={}",
                    user.getId(), user.getLoginAttempts());
            throw new UnauthorizedException("Email atau password salah");
        }

        if (!user.getIsEmailVerified()) {
            throw new UnauthorizedException("Email belum diverifikasi");
        }

        user.resetLoginAttempts();
        user.setLastActiveAt(LocalDateTime.now());
        userRepo.save(user);

        String accessToken = jwtService.generateAccessToken(user.getId(), user.getEmail());
        String refreshToken = generateAndStoreRefreshToken(user.getId());
        setRefreshCookie(res, refreshToken);

        log.info("User logged in userId={}", user.getId());
        return AuthResponse.builder()
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .accessToken(accessToken)
                .emailVerified(user.getIsEmailVerified())
                .build();
    }

    // ─── Refresh Token ────────────────────────────────────────────────────────

    @Transactional
    public RefreshResponse refresh(String rawRefreshToken) {
        if (rawRefreshToken == null || rawRefreshToken.isBlank()) {
            throw new UnauthorizedException("Refresh token tidak ditemukan");
        }

        String hash = hashToken(rawRefreshToken);
        UserToken stored = tokenRepo.findByTokenHash(hash)
                .orElseThrow(() -> new UnauthorizedException("Refresh token tidak valid"));

        if (!stored.isValid()) {
            throw new UnauthorizedException("Refresh token expired atau sudah direvoke");
        }

        User user = userRepo.findById(stored.getUserId())
                .orElseThrow(() -> new UnauthorizedException("User tidak ditemukan"));

        String newAccessToken = jwtService.generateAccessToken(
                user.getId(), user.getEmail());
        log.info("Token refreshed userId={}", user.getId());

        return RefreshResponse.builder()
                .accessToken(newAccessToken)
                .build();
    }

    // ─── Logout ───────────────────────────────────────────────────────────────

    @Transactional
    public void logout(String rawRefreshToken, HttpServletResponse res) {
        if (rawRefreshToken != null && !rawRefreshToken.isBlank()) {
            String hash = hashToken(rawRefreshToken);
            tokenRepo.findByTokenHash(hash).ifPresent(t -> {
                t.setRevokedAt(LocalDateTime.now());
                tokenRepo.save(t);
            });
        }
        clearRefreshCookie(res);
        log.info("User logged out");
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    private String generateAndStoreRefreshToken(UUID userId) {
        String token = UUID.randomUUID().toString();
        UserToken stored = UserToken.builder()
                .userId(userId)
                .tokenHash(hashToken(token))
                .expiresAt(LocalDateTime.now()
                        .plusSeconds(refreshTokenExpiryMs / 1000))
                .build();
        tokenRepo.save(stored);
        return token;
    }

    private void setRefreshCookie(HttpServletResponse res, String token) {
        Cookie cookie = new Cookie("refresh_token", token);
        cookie.setHttpOnly(true); // tidak bisa diakses JavaScript
        cookie.setSecure(false); // set true di production (HTTPS)
        cookie.setPath("/api/v1/auth");
        cookie.setMaxAge((int) (refreshTokenExpiryMs / 1000));
        res.addCookie(cookie);
    }

    private void clearRefreshCookie(HttpServletResponse res) {
        Cookie cookie = new Cookie("refresh_token", "");
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/api/v1/auth");
        cookie.setMaxAge(0); // expire immediately
        res.addCookie(cookie);
    }

    private String hashToken(String raw) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] bytes = digest.digest(
                    raw.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(bytes);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 not available", e);
        }
    }
}