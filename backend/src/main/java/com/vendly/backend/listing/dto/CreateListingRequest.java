package com.vendly.backend.listing.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateListingRequest {

    @NotBlank(message = "Judul wajib diisi")
    @Size(max = 255, message = "Judul maksimal 255 karakter")
    private String title;

    private String description;

    @NotNull(message = "Harga wajib diisi")
    @DecimalMin(value = "0.0", inclusive = false, message = "Harga harus lebih dari 0")
    private BigDecimal price;

    @NotBlank(message = "Kondisi wajib diisi")
    private String condition; // NEW, LIKE_NEW, GOOD, FAIR

    private String location;

    private Boolean allowCod = false;

    private Boolean allowOffers = false;
}