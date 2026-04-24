package com.vendly.backend.common.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class CorsConfig {

        @Value("${app.frontend-url:http://localhost:3000}")
        private String frontendUrl;

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration cfg = new CorsConfiguration();
                cfg.setAllowedOrigins(List.of(
                                "http://localhost",
                                "http://localhost:3000",
                                frontendUrl));
                cfg.setAllowedMethods(List.of(
                                "GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
                cfg.setAllowedHeaders(List.of(
                                "Authorization",
                                "Content-Type",
                                "X-Request-ID",
                                "X-Correlation-ID",
                                "X-Idempotency-Key"));
                cfg.setExposedHeaders(List.of(
                                "X-Correlation-ID",
                                "X-RateLimit-Limit",
                                "X-RateLimit-Remaining",
                                "Retry-After"));
                cfg.setAllowCredentials(true);
                cfg.setMaxAge(3600L);

                UrlBasedCorsConfigurationSource src = new UrlBasedCorsConfigurationSource();
                src.registerCorsConfiguration("/api/**", cfg);
                return src;
        }
}