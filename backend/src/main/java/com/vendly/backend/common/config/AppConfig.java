package com.vendly.backend.common.config;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.validation.annotation.Validated;

@Data
@Configuration
@ConfigurationProperties(prefix = "app")
@Validated
public class AppConfig {

    @NotBlank(message = "app.frontend-url harus diisi")
    private String frontendUrl;

    @NotBlank(message = "app.upload-dir harus diisi")
    private String uploadDir;
}