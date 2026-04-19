package com.crud.crud.application.filter;
import com.crud.crud.application.utils.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter{
    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws ServletException, IOException {
        String username = null;
        String jwt = null;

        // 👇 Read from cookies instead of header
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("token".equals(cookie.getName())) {
                    jwt = cookie.getValue();
                }
            }
        }

        if (jwt != null) {
            try {
                username = jwtUtil.extractUsername(jwt);
            } catch (Exception e) {
                System.out.println("JWT error: " + e.getMessage());
            }
        }

        if (username != null  && SecurityContextHolder.getContext().getAuthentication() == null) {
            try{
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                if (jwtUtil.validateToken(jwt)) {
                    UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            }
            catch (UsernameNotFoundException e) {
                Cookie cookie = new Cookie("token", "");
                cookie.setHttpOnly(true);
                cookie.setPath("/");
                cookie.setMaxAge(0);
                response.addCookie(cookie);
            }

        }
        System.out.println("---- JWT FILTER ----");
        System.out.println("URI = " + request.getRequestURI());
        System.out.println("METHOD = " + request.getMethod());
        System.out.println("JWT = " + jwt);
        System.out.println("USERNAME = " + username);
        System.out.println("AUTH BEFORE = " + SecurityContextHolder.getContext().getAuthentication());
        chain.doFilter(request, response);
    }


}