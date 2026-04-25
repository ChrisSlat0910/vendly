package com.vendly.backend.listing.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class UpdateListingRequest {

    @Size(max = 255, message = "Judul maksimal 255 karakter")
    private String title;

    private String description;

    @DecimalMin(value = "0.0", inclusive = false, message = "Harga harus lebih dari 0")
    private BigDecimal price;

    private String condition;

    private String location;

    private Boolean allowCod;

    private Boolean allowOffers;

    private String status; // DRAFT, ACTIVE, SOLD, EXPIRED
}