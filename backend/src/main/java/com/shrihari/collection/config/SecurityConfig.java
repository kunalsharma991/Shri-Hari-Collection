package com.shrihari.collection.config;

import com.shrihari.collection.security.JwtAuthenticationFilter;
import com.shrihari.collection.security.JwtUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final JwtUtils jwtUtils;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter, JwtUtils jwtUtils) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.jwtUtils = jwtUtils;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint((request, response, authException) ->
                    response.sendError(isValidBearerToken(request)
                            ? HttpServletResponse.SC_FORBIDDEN
                            : HttpServletResponse.SC_UNAUTHORIZED,
                            isValidBearerToken(request) ? "Forbidden" : "Unauthorized"))
                .accessDeniedHandler((request, response, accessDeniedException) ->
                    response.sendError(HttpServletResponse.SC_FORBIDDEN, "Forbidden"))
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/health", "/actuator/**", "/static/**", "/api/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/categories", "/api/categories/**", "/api/products", "/api/products/**").permitAll()
                .requestMatchers("/api/cart/**").hasRole("USER")
                .requestMatchers("/api/admin/orders/**").hasRole("ADMIN")
                .requestMatchers("/api/orders/**").hasRole("USER")
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            );

        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    private boolean isValidBearerToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        return header != null && header.startsWith("Bearer ") && jwtUtils.validateToken(header.substring(7));
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }
}
