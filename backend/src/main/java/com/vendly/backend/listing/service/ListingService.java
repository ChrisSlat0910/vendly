package com.vendly.backend.listing.service;

import com.vendly.backend.common.exception.ForbiddenException;
import com.vendly.backend.common.exception.ResourceNotFoundException;
import com.vendly.backend.listing.dto.*;
import com.vendly.backend.listing.entity.Listing;
import com.vendly.backend.listing.repository.ListingRepository;
import com.vendly.backend.user.entity.User;
import com.vendly.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ListingService {

    private final ListingRepository listingRepo;
    private final UserRepository userRepo;

    // ─── Create ──────────────────────────────────────────────────────────────

    @Transactional
    public ListingResponse create(CreateListingRequest req, UUID sellerId) {
        Listing listing = Listing.builder()
                .sellerId(sellerId)
                .title(req.getTitle())
                .description(req.getDescription())
                .price(req.getPrice())
                .condition(req.getCondition())
                .location(req.getLocation())
                .allowCod(req.getAllowCod() != null ? req.getAllowCod() : false)
                .allowOffers(req.getAllowOffers() != null ? req.getAllowOffers() : false)
                .status("DRAFT")
                .build();

        listingRepo.save(listing);
        log.info("Listing created id={} sellerId={}", listing.getId(), sellerId);
        return toResponse(listing, sellerId);
    }

    // ─── Get by ID ────────────────────────────────────────────────────────────

    @Transactional
    public ListingResponse getById(UUID id) {
        Listing listing = listingRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Listing tidak ditemukan"));

        listing.setViewCount(listing.getViewCount() + 1);
        listingRepo.save(listing);

        return toResponse(listing, listing.getSellerId());
    }

    // ─── Browse Active ────────────────────────────────────────────────────────

    public Page<ListingResponse> browse(String keyword, Pageable pageable) {
        if (keyword != null && !keyword.isBlank()) {
            return listingRepo.searchByKeyword(keyword.trim(), pageable)
                    .map(l -> toResponse(l, l.getSellerId()));
        }
        return listingRepo.findByStatus("ACTIVE", pageable)
                .map(l -> toResponse(l, l.getSellerId()));
    }

    // ─── My Listings ──────────────────────────────────────────────────────────

    public Page<ListingResponse> getMyListings(UUID sellerId, Pageable pageable) {
        return listingRepo.findBySellerId(sellerId, pageable)
                .map(l -> toResponse(l, l.getSellerId()));
    }

    // ─── Update ───────────────────────────────────────────────────────────────

    @Transactional
    public ListingResponse update(UUID id, UpdateListingRequest req, UUID sellerId) {
        Listing listing = listingRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Listing tidak ditemukan"));

        if (!listing.getSellerId().equals(sellerId)) {
            throw new ForbiddenException("Bukan listing milik kamu");
        }

        if (req.getTitle() != null)
            listing.setTitle(req.getTitle());
        if (req.getDescription() != null)
            listing.setDescription(req.getDescription());
        if (req.getPrice() != null)
            listing.setPrice(req.getPrice());
        if (req.getCondition() != null)
            listing.setCondition(req.getCondition());
        if (req.getLocation() != null)
            listing.setLocation(req.getLocation());
        if (req.getAllowCod() != null)
            listing.setAllowCod(req.getAllowCod());
        if (req.getAllowOffers() != null)
            listing.setAllowOffers(req.getAllowOffers());
        if (req.getStatus() != null)
            listing.setStatus(req.getStatus());

        listingRepo.save(listing);
        log.info("Listing updated id={}", id);
        return toResponse(listing, sellerId);
    }

    // ─── Delete ───────────────────────────────────────────────────────────────

    @Transactional
    public void delete(UUID id, UUID sellerId) {
        Listing listing = listingRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Listing tidak ditemukan"));

        if (!listing.getSellerId().equals(sellerId)) {
            throw new ForbiddenException("Bukan listing milik kamu");
        }

        listing.setDeletedAt(LocalDateTime.now());
        listingRepo.save(listing);
        log.info("Listing deleted id={}", id);
    }

    // ─── Helper ───────────────────────────────────────────────────────────────

    private ListingResponse toResponse(Listing listing, UUID sellerId) {
        String username = userRepo.findById(sellerId)
                .map(User::getUsername)
                .orElse("unknown");

        return ListingResponse.builder()
                .id(listing.getId())
                .sellerId(listing.getSellerId())
                .sellerUsername(username)
                .title(listing.getTitle())
                .description(listing.getDescription())
                .price(listing.getPrice())
                .condition(listing.getCondition())
                .status(listing.getStatus())
                .location(listing.getLocation())
                .allowCod(listing.getAllowCod())
                .allowOffers(listing.getAllowOffers())
                .viewCount(listing.getViewCount())
                .createdAt(listing.getCreatedAt())
                .updatedAt(listing.getUpdatedAt())
                .build();
    }
}