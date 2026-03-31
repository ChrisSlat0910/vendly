package com.vendly.backend.user.repository;

import com.vendly.backend.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmail(String email);

    Optional<User> findByUsername(String username);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    @Query("SELECT u FROM User u WHERE u.email = :email AND u.isEmailVerified = true")
    Optional<User> findVerifiedByEmail(String email);

    @Modifying
    @Query("UPDATE User u SET u.lastActiveAt = CURRENT_TIMESTAMP WHERE u.id = :id")
    void updateLastActiveAt(UUID id);
}