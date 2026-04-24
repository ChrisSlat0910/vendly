package com.vendly.backend.auth.config;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.validation.annotation.Validated;

@Data
@Configuration
@ConfigurationProperties(prefix = "jwt")
@Validated
public class JwtConfig {

    @NotBlank(message = "jwt.secret harus diisi")
    @Size(min = 32, message = "jwt.secret minimal 32 karakter")
    private String secret;

    @Positive
    private long accessTokenExpiryMs;

    @Positive
    private long refreshTokenExpiryMs;
}