package com.vendly.backend.admin.service;

import com.vendly.backend.admin.entity.AdminRole;
import com.vendly.backend.admin.repository.AdminRoleRepository;
import com.vendly.backend.common.exception.BusinessException;
import com.vendly.backend.common.exception.ResourceNotFoundException;
import com.vendly.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.vendly.backend.user.entity.User;
import org.springframework.security.core.Authentication;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminService {

    private final AdminRoleRepository adminRoleRepo;
    private final UserRepository userRepo;

    public boolean isAdmin(UUID userId) {
        return adminRoleRepo.existsByUserId(userId);
    }

    @Transactional
    public void grantAdmin(UUID targetUserId) {
        if (!userRepo.existsById(targetUserId)) {
            throw new ResourceNotFoundException("User tidak ditemukan");
        }
        if (adminRoleRepo.existsByUserId(targetUserId)) {
            throw new BusinessException("User sudah menjadi admin");
        }

        UUID grantedBy = getCurrentUserId();
        AdminRole role = AdminRole.builder()
                .userId(targetUserId)
                .grantedBy(grantedBy)
                .build();
        adminRoleRepo.save(role);
        log.info("Admin granted userId={} by={}", targetUserId, grantedBy);
    }

    @Transactional
    public void revokeAdmin(UUID targetUserId) {
        AdminRole role = adminRoleRepo.findByUserId(targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User bukan admin"));

        UUID currentUserId = getCurrentUserId();
        if (currentUserId.equals(targetUserId)) {
            throw new BusinessException("Tidak bisa mencabut hak admin diri sendiri");
        }

        adminRoleRepo.delete(role);
        log.info("Admin revoked userId={} by={}", targetUserId, currentUserId);
    }

    private UUID getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();
        return user.getId();
    }
}