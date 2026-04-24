package com.vendly.backend.user.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class UserProfileResponse {

    private UUID id;
    private String username;
    private String email;
    private String displayName;
    private String bio;
    private String avatarUrl;
    private Integer creditScore;
    private String creditFlag;
    private BigDecimal ratingAverage;
    private Integer ratingCount;
    private Boolean emailVerified;
    private LocalDateTime createdAt;
}