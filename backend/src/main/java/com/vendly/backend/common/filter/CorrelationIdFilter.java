package com.vendly.backend.common.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.MDC;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

@Component
@Order(1)
public class CorrelationIdFilter extends OncePerRequestFilter {

    public static final String HEADER = "X-Correlation-ID";

    public static void setUserId(String userId) {
        MDC.put("userId", userId);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest req,
            HttpServletResponse res,
            FilterChain chain) throws ServletException, IOException {
        String corrId = req.getHeader(HEADER);
        if (corrId == null || corrId.isBlank())
            corrId = UUID.randomUUID().toString().substring(0, 8);

        MDC.put("correlationId", corrId);
        MDC.put("method", req.getMethod());
        MDC.put("path", req.getRequestURI());

        res.setHeader(HEADER, corrId);
        try {
            chain.doFilter(req, res);
        } finally {
            MDC.clear();
        }
    }
}