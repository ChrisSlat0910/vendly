package com.vendly.backend.admin.controller;

import com.vendly.backend.admin.service.AdminService;
import com.vendly.backend.common.annotation.RequireAdmin;
import com.vendly.backend.common.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin")
@RequireAdmin
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

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
}