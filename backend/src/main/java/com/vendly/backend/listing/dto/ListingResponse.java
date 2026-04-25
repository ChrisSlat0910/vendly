package com.vendly.backend.listing.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class ListingResponse {

    private UUID id;
    private UUID sellerId;
    private String sellerUsername;
    private String title;
    private String description;
    private BigDecimal price;
    private String condition;
    private String status;
    private String location;
    private Boolean allowCod;
    private Boolean allowOffers;
    private Integer viewCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}