package com.vendly.backend.user.controller;

import com.vendly.backend.common.exception.ResourceNotFoundException;
import com.vendly.backend.common.exception.UnauthorizedException;
import com.vendly.backend.common.response.ApiResponse;
import com.vendly.backend.user.dto.UserProfileResponse;
import com.vendly.backend.user.entity.User;
import com.vendly.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepo;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getMe(
            @AuthenticationPrincipal User user) {
        if (user == null)
            throw new UnauthorizedException("Unauthorized");
        return ResponseEntity.ok(ApiResponse.ok(toProfile(user)));
    }

    @GetMapping("/{id}/profile")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getPublicProfile(
            @PathVariable UUID id) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User tidak ditemukan"));
        return ResponseEntity.ok(ApiResponse.ok(toPublicProfile(user)));
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    private UserProfileResponse toProfile(User u) {
        return UserProfileResponse.builder()
                .id(u.getId())
                .username(u.getUsername())
                .email(u.getEmail())
                .displayName(u.getDisplayName())
                .bio(u.getBio())
                .avatarUrl(u.getAvatarUrl())
                .creditScore(u.getCreditScore())
                .creditFlag(u.getCreditFlag())
                .ratingAverage(u.getRatingAverage())
                .ratingCount(u.getRatingCount())
                .emailVerified(u.getIsEmailVerified())
                .createdAt(u.getCreatedAt())
                .build();
    }

    private UserProfileResponse toPublicProfile(User u) {
        return UserProfileResponse.builder()
                .id(u.getId())
                .username(u.getUsername())
                .displayName(u.getDisplayName())
                .bio(u.getBio())
                .avatarUrl(u.getAvatarUrl())
                .ratingAverage(u.getRatingAverage())
                .ratingCount(u.getRatingCount())
                .createdAt(u.getCreatedAt())
                .build();
    }
}