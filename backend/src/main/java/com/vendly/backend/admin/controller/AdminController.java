package com.vendly.backend.admin.controller;

import com.vendly.backend.admin.service.AdminService;
import com.vendly.backend.common.annotation.RequireAdmin;
import com.vendly.backend.common.response.ApiResponse;
import com.vendly.backend.listing.dto.ListingResponse;
import com.vendly.backend.listing.repository.ListingRepository;
import com.vendly.backend.listing.service.ListingService;
import com.vendly.backend.user.dto.UserProfileResponse;
import com.vendly.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin")
@RequireAdmin
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final UserRepository userRepository;
    private final ListingRepository listingRepository;

    @PostMapping("/users/{userId}/grant-admin")
    public ResponseEntity<ApiResponse<Void>> grantAdmin(@PathVariable UUID userId) {
        adminService.grantAdmin(userId);
        return ResponseEntity.ok(ApiResponse.ok("Hak admin berhasil diberikan.", null));
    }

    @DeleteMapping("/users/{userId}/revoke-admin")
    public ResponseEntity<ApiResponse<Void>> revokeAdmin(@PathVariable UUID userId) {
        adminService.revokeAdmin(userId);
        return ResponseEntity.ok(ApiResponse.ok("Hak admin berhasil dicabut.", null));
    }

    @GetMapping("/users/{userId}/is-admin")
    public ResponseEntity<ApiResponse<Boolean>> isAdmin(@PathVariable UUID userId) {
        boolean result = adminService.isAdmin(userId);
        return ResponseEntity.ok(ApiResponse.ok("Status admin", result));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<Page<UserProfileResponse>>> listUsers(
            @PageableDefault(size = 20) Pageable pageable) {
        Page<UserProfileResponse> users = userRepository.findAll(pageable)
                .map(u -> UserProfileResponse.builder()
                        .id(u.getId())
                        .username(u.getUsername())
                        .email(u.getEmail())
                        .displayName(u.getDisplayName())
                        .creditScore(u.getCreditScore())
                        .creditFlag(u.getCreditFlag())
                        .ratingAverage(u.getRatingAverage())
                        .ratingCount(u.getRatingCount())
                        .emailVerified(u.getIsEmailVerified())
                        .createdAt(u.getCreatedAt())
                        .build());
        return ResponseEntity.ok(ApiResponse.ok(users));
    }

    @GetMapping("/listings")
    public ResponseEntity<ApiResponse<Page<ListingResponse>>> listAllListings(
            @PageableDefault(size = 20) Pageable pageable) {
        Page<ListingResponse> listings = listingRepository.findAll(pageable)
                .map(l -> ListingResponse.builder()
                        .id(l.getId())
                        .sellerId(l.getSellerId())
                        .title(l.getTitle())
                        .price(l.getPrice())
                        .condition(l.getCondition())
                        .status(l.getStatus())
                        .location(l.getLocation())
                        .allowCod(l.getAllowCod())
                        .allowOffers(l.getAllowOffers())
                        .viewCount(l.getViewCount())
                        .createdAt(l.getCreatedAt())
                        .updatedAt(l.getUpdatedAt())
                        .build());
        return ResponseEntity.ok(ApiResponse.ok(listings));
    }

    @DeleteMapping("/listings/{listingId}")
    public ResponseEntity<ApiResponse<Void>> deleteListing(@PathVariable UUID listingId) {
        listingRepository.deleteById(listingId);
        return ResponseEntity.ok(ApiResponse.ok("Listing berhasil dihapus.", null));
    }
}