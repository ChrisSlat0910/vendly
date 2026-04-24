package com.vendly.backend.auth.repository;

import com.vendly.backend.auth.entity.UserToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserTokenRepository extends JpaRepository<UserToken, UUID> {

    Optional<UserToken> findByTokenHash(String tokenHash);

    @Modifying
    @Query("UPDATE UserToken t SET t.revokedAt = CURRENT_TIMESTAMP " +
            "WHERE t.userId = :userId AND t.revokedAt IS NULL")
    void revokeAllForUser(UUID userId);

    @Modifying
    @Query("DELETE FROM UserToken t WHERE t.expiresAt < CURRENT_TIMESTAMP")
    void deleteExpiredTokens();
}