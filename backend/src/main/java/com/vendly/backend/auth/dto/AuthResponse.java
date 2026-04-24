package com.vendly.backend.auth.dto;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class AuthResponse {

    private UUID userId;
    private String username;
    private String email;
    private String accessToken;
    private boolean emailVerified;
}