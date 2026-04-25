package com.vendly.backend.common.config;

import com.vendly.backend.common.filter.CorrelationIdFilter;
import com.vendly.backend.common.filter.JwtAuthFilter;
import com.vendly.backend.common.filter.RateLimitFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

        private final JwtAuthFilter jwtAuthFilter;
        private final RateLimitFilter rateLimitFilter;
        private final CorrelationIdFilter correlationIdFilter;
        private final CorsConfigurationSource corsConfigurationSource;

        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
                return http
                                .csrf(csrf -> csrf.disable())
                                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .headers(headers -> headers
                                                .frameOptions(frame -> frame.deny())
                                                .httpStrictTransportSecurity(hsts -> hsts
                                                                .includeSubDomains(true)
                                                                .maxAgeInSeconds(31536000)))
                                .exceptionHandling(ex -> ex
                                                .authenticationEntryPoint((req, res, e) -> {
                                                        res.setStatus(401);
                                                        res.setContentType("application/json");
                                                        res.getWriter().write(
                                                                        "{\"success\":false,\"message\":\"Unauthorized\"}");
                                                })
                                                .accessDeniedHandler((req, res, e) -> {
                                                        res.setStatus(403);
                                                        res.setContentType("application/json");
                                                        res.getWriter().write(
                                                                        "{\"success\":false,\"message\":\"Access denied\"}");
                                                }))
                                .authorizeHttpRequests(auth -> auth
                                                .requestMatchers(HttpMethod.POST,
                                                                "/api/v1/auth/register",
                                                                "/api/v1/auth/login",
                                                                "/api/v1/auth/refresh",
                                                                "/api/v1/auth/verify-email",
                                                                "/api/v1/auth/resend-otp",
                                                                "/api/v1/auth/forgot-password",
                                                                "/api/v1/auth/reset-password")
                                                .permitAll()
                                                .requestMatchers(HttpMethod.GET,
                                                                "/api/v1/market/**",
                                                                "/api/v1/listings",
                                                                "/api/v1/listings/{id}",
                                                                "/api/v1/communities",
                                                                "/api/v1/communities/{id}",
                                                                "/api/v1/users/{id}/profile",
                                                                "/api/v1/users/{id}/reviews",
                                                                "/api/v1/users/{id}/rating-summary",
                                                                "/api/v1/auth/validate-reset-token")
                                                .permitAll()
                                                .requestMatchers("/actuator/health", "/actuator/info").permitAll()
                                                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                                                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                                                .anyRequest().authenticated())
                                .addFilterBefore(correlationIdFilter,
                                                UsernamePasswordAuthenticationFilter.class)
                                .addFilterBefore(rateLimitFilter,
                                                UsernamePasswordAuthenticationFilter.class)
                                .addFilterBefore(jwtAuthFilter,
                                                UsernamePasswordAuthenticationFilter.class)
                                .build();
        }

        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }

        @Bean
        public AuthenticationManager authenticationManager(
                        AuthenticationConfiguration config) throws Exception {
                return config.getAuthenticationManager();
        }
}