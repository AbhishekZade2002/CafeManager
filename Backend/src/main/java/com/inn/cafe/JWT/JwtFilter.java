package com.inn.cafe.JWT;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.Claims;

@Configuration
public class JwtFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtFilter.class);

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CustomerUserDetailsService customerUserDetailsService;

    private Claims claims = null;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // Exclude certain paths (e.g., login, signup)
        String servletPath = request.getServletPath();
        if (servletPath.matches("/user/login|/user/signup|/user/forgotPassword")) {
            filterChain.doFilter(request, response);
            return;
        }

        String authorizationHeader = request.getHeader("Authorization");
        String token = null;
        String username = null;

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            token = authorizationHeader.substring(7); // Extract token after "Bearer "
            try {
                username = jwtUtil.extractUsername(token); // Extract username from token
                claims = jwtUtil.extractAllClaims(token);  // Extract all claims from token
            } catch (Exception e) {
                logger.error("Error extracting username or claims from token: {}", e.getMessage());
            }
        } else {
            logger.warn("Authorization header is missing or malformed");
        }

        // Validate token and set security context
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = customerUserDetailsService.loadUserByUsername(username);

            if (jwtUtil.validateToken(token, userDetails)) {
                UsernamePasswordAuthenticationToken authenticationToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                logger.info("Authentication successful for user: {}", username);
            } else {
                logger.warn("Invalid or expired token for user: {}", username);
            }
        }

        filterChain.doFilter(request, response);
    }

    public boolean isAdmin() {
        return claims != null && "admin".equalsIgnoreCase((String) claims.get("role"));
    }

    public boolean isUser() {
        return claims != null && "user".equalsIgnoreCase((String) claims.get("role"));
    }

    public String getCurrentUsername() {
        return claims != null ? claims.getSubject() : null;
    }
}
