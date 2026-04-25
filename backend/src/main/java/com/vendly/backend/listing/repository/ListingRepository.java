package com.vendly.backend.listing.repository;

import com.vendly.backend.listing.entity.Listing;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ListingRepository extends JpaRepository<Listing, UUID> {

    Page<Listing> findBySellerId(UUID sellerId, Pageable pageable);

    Page<Listing> findByStatus(String status, Pageable pageable);

    @Query("SELECT l FROM Listing l WHERE l.status = 'ACTIVE' AND " +
            "(LOWER(l.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(l.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Listing> searchByKeyword(String keyword, Pageable pageable);
}