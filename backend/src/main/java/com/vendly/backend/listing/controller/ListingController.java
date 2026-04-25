package com.vendly.backend.listing.controller;

import com.vendly.backend.common.response.ApiResponse;
import com.vendly.backend.listing.dto.*;
import com.vendly.backend.listing.service.ListingService;
import com.vendly.backend.user.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/listings")
@RequiredArgsConstructor
public class ListingController {

    private final ListingService listingService;

    @PostMapping
    public ResponseEntity<ApiResponse<ListingResponse>> create(
            @Valid @RequestBody CreateListingRequest req,
            @AuthenticationPrincipal User user) {
        ListingResponse data = listingService.create(req, user.getId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Listing berhasil dibuat.", data));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ListingResponse>> getById(
            @PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.ok(listingService.getById(id)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<ListingResponse>>> browse(
            @RequestParam(required = false) String keyword,
            @PageableDefault(size = 20, sort = "createdAt") Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(listingService.browse(keyword, pageable)));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<Page<ListingResponse>>> myListings(
            @AuthenticationPrincipal User user,
            @PageableDefault(size = 20, sort = "createdAt") Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(
                listingService.getMyListings(user.getId(), pageable)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ListingResponse>> update(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateListingRequest req,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(
                "Listing berhasil diupdate.",
                listingService.update(id, req, user.getId())));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user) {
        listingService.delete(id, user.getId());
        return ResponseEntity.ok(ApiResponse.ok("Listing berhasil dihapus.", null));
    }
}