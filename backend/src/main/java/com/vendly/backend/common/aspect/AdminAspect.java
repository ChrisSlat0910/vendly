package com.vendly.backend.common.aspect;

import com.vendly.backend.admin.repository.AdminRoleRepository;
import com.vendly.backend.common.exception.ForbiddenException;
import com.vendly.backend.common.exception.UnauthorizedException;
import com.vendly.backend.user.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Aspect
@Component
@RequiredArgsConstructor
@Slf4j
public class AdminAspect {

    private final AdminRoleRepository adminRoleRepo;

    @Before("@annotation(com.vendly.backend.common.annotation.RequireAdmin) || @within(com.vendly.backend.common.annotation.RequireAdmin)")
    public void checkAdminRole() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            throw new UnauthorizedException("Login diperlukan");
        }

        if (!(auth.getPrincipal() instanceof User user)) {
            throw new UnauthorizedException("Token tidak valid");
        }

        UUID userId = user.getId();

        if (!adminRoleRepo.existsByUserId(userId)) {
            log.warn("Non-admin access attempt userId={}", userId);
            throw new ForbiddenException("Akses admin diperlukan");
        }
    }
}