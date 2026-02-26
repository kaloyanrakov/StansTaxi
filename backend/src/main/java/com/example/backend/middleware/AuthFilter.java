package com.example.backend.middleware;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class AuthFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        String path = httpRequest.getRequestURI();
        String method = httpRequest.getMethod();

        // 1) Allow CORS preflight through
        if ("OPTIONS".equalsIgnoreCase(method)) {
            chain.doFilter(request, response);
            return;
        }

        // 2) Public endpoints
        boolean isPublic =
                path.startsWith("/auth/") ||
                path.equals("/") ||
                path.startsWith("/error") ||
                (path.equals("/settings/bookings-enabled") && "GET".equalsIgnoreCase(method)) ||
                (path.equals("/bookings") && "POST".equalsIgnoreCase(method));

        // 3) Endpoints you want to protect
        boolean isAdminEndpoint =
                path.startsWith("/bookings") ||
                path.startsWith("/settings");

        // 4) If not protected or is public, let through
        if (!isAdminEndpoint || isPublic) {
            chain.doFilter(request, response);
            return;
        }

        // 5) Check session
        Object isLoggedIn = httpRequest.getSession().getAttribute("isLoggedIn");
        if (Boolean.TRUE.equals(isLoggedIn)) {
            chain.doFilter(request, response);
        } else {
            // 6) Add CORS headers even when unauthorized
            String origin = httpRequest.getHeader("Origin");
            if (origin != null && origin.startsWith("http://localhost:")) {
                httpResponse.setHeader("Access-Control-Allow-Origin", origin);
            }
            httpResponse.setHeader("Access-Control-Allow-Credentials", "true");
            httpResponse.setHeader("Access-Control-Allow-Headers", "Content-Type");
            httpResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            httpResponse.setContentType("application/json");
            httpResponse.getWriter().write("{\"error\":\"Unauthorized\"}");
        }
    }
}