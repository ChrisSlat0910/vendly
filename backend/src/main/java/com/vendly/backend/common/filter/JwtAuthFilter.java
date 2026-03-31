package com.vendly.backend.common.filter;

import com.vendly.backend.admin.repository.AdminRoleRepository;
import com.vendly.backend.auth.service.JwtService;
import com.vendly.backend.user.entity.User;
import com.vendly.backend.user.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.core.annotation.Order;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Order(3)
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final AdminRoleRepository adminRoleRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest req,
            HttpServletResponse res,
            FilterChain chain) throws ServletException, IOException {
        String header = req.getHeader("Authorization");

        if (header == null || !header.startsWith("Bearer ")) {
            chain.doFilter(req, res);
            return;
        }

        String token = header.substring(7);

        if (!jwtService.validateToken(token)) {
            chain.doFilter(req, res);
            return;
        }

        try {
            var userId = jwtService.extractUserId(token);
            User user = userRepository.findById(userId).orElse(null);

            if (user != null && user.getIsActive() && user.getIsEmailVerified() && !user.isLocked()) {
                List<SimpleGrantedAuthority> authorities = new ArrayList<>();
                authorities.add(new SimpleGrantedAuthority("ROLE_USER"));

                if (adminRoleRepository.existsByUserId(userId)) {
                    authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
                }

                var auth = new UsernamePasswordAuthenticationToken(user, null, authorities);
                SecurityContextHolder.getContext().setAuthentication(auth);
                CorrelationIdFilter.setUserId(userId.toString());
            }
        } catch (Exception e) {
            SecurityContextHolder.clearContext();
        }

        chain.doFilter(req, res);
    }
}