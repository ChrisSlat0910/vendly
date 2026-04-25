package com.vendly.backend.auth.repository;

import com.vendly.backend.auth.entity.PasswordReset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;
import java.util.UUID;

public interface PasswordResetRepository extends JpaRepository<PasswordReset, UUID> {

    Optional<PasswordReset> findByToken(String token);

    @Modifying
    @Query("UPDATE PasswordReset p SET p.usedAt = CURRENT_TIMESTAMP WHERE p.userId = :userId AND p.usedAt IS NULL")
    void invalidateAllForUser(UUID userId);
}