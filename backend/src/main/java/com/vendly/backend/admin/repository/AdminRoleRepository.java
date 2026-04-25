package com.vendly.backend.admin.repository;

import com.vendly.backend.admin.entity.AdminRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AdminRoleRepository extends JpaRepository<AdminRole, UUID> {
    boolean existsByUserId(UUID userId);

    Optional<AdminRole> findByUserId(UUID userId);
}