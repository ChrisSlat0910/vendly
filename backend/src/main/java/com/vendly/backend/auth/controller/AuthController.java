package com.vendly.backend.auth.controller;

import com.vendly.backend.auth.dto.*;
import com.vendly.backend.auth.service.AuthService;
import com.vendly.backend.common.response.ApiResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Void>> register(
            @Valid @RequestBody RegisterRequest req) {
        authService.register(req);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.ok(
                        "Registrasi berhasil. Cek email untuk kode verifikasi.",
                        null));
    }

    @PostMapping("/verify-email")
    public ResponseEntity<ApiResponse<Void>> verifyEmail(
            @Valid @RequestBody VerifyEmailRequest req) {
        authService.verifyEmail(req);
        return ResponseEntity.ok(
                ApiResponse.ok("Email berhasil diverifikasi.", null));
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<ApiResponse<Void>> resendOtp(
            @Valid @RequestBody ResendOtpRequest req) {
        authService.resendOtp(req);
        return ResponseEntity.ok(
                ApiResponse.ok("OTP baru telah dikirim ke email kamu.", null));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest req,
            HttpServletResponse res) {
        AuthResponse data = authService.login(req, res);
        return ResponseEntity.ok(ApiResponse.ok("Login berhasil.", data));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<RefreshResponse>> refresh(
            HttpServletRequest req) {
        String refreshToken = extractRefreshCookie(req);
        RefreshResponse data = authService.refresh(refreshToken);
        return ResponseEntity.ok(ApiResponse.ok(data));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(
            HttpServletRequest req,
            HttpServletResponse res) {
        String refreshToken = extractRefreshCookie(req);
        authService.logout(refreshToken, res);
        return ResponseEntity.ok(ApiResponse.ok("Logout berhasil.", null));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest req) {
        authService.forgotPassword(req.getEmail());
        return ResponseEntity.ok(ApiResponse.ok(
                "Jika email terdaftar, link reset password telah dikirim.", null));
    }

    @GetMapping("/validate-reset-token")
    public ResponseEntity<ApiResponse<Boolean>> validateResetToken(
            @RequestParam String token) {
        boolean valid = authService.validateResetToken(token);
        return ResponseEntity.ok(ApiResponse.ok("Token valid", valid));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(
            @Valid @RequestBody ResetPasswordRequest req) {
        authService.resetPassword(req);
        return ResponseEntity.ok(ApiResponse.ok(
                "Password berhasil direset. Silakan login dengan password baru.", null));
    }

    // ─── Helper ───────────────────────────────────────────────────────────────

    private String extractRefreshCookie(HttpServletRequest req) {
        if (req.getCookies() == null)
            return null;
        return Arrays.stream(req.getCookies())
                .filter(c -> "refresh_token".equals(c.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
    }
}