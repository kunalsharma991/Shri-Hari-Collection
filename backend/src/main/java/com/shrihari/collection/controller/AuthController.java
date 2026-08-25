package com.shrihari.collection.controller;

import com.shrihari.collection.dto.*;
import com.shrihari.collection.model.RefreshToken;
import com.shrihari.collection.model.Role;
import com.shrihari.collection.model.User;
import com.shrihari.collection.model.enums.UserRole;
import com.shrihari.collection.repository.RoleRepository;
import com.shrihari.collection.repository.UserRepository;
import com.shrihari.collection.security.JwtUtils;
import com.shrihari.collection.service.RefreshTokenService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.Optional;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final RefreshTokenService refreshTokenService;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AuthenticationManager authenticationManager, JwtUtils jwtUtils,
                          RefreshTokenService refreshTokenService, UserRepository userRepository,
                          RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
        this.refreshTokenService = refreshTokenService;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateToken(authentication.getName());

        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);

        UserResponse userResp = new UserResponse(user.getId(), user.getFullName(), user.getEmail(), user.getMobile(), user.getRole() != null ? user.getRole().getName() : null);
        return ResponseEntity.ok(new RefreshTokenResponse(jwt, "Bearer", jwtUtils.getJwtExpirationMs(), refreshToken.getToken(), userResp));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            return ResponseEntity.badRequest().body(new com.shrihari.collection.dto.ApiResponse<>(false, "Passwords do not match", null));
        }

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.status(409).body(new com.shrihari.collection.dto.ApiResponse<>(false, "Email already in use", null));
        }

        if (request.getMobile() != null && userRepository.findByMobile(request.getMobile()).isPresent()) {
            return ResponseEntity.status(409).body(new com.shrihari.collection.dto.ApiResponse<>(false, "Mobile already in use", null));
        }

        Role userRole = roleRepository.findByName(UserRole.USER).orElseGet(() -> {
            Role r = new Role(); r.setName(UserRole.USER); return roleRepository.save(r);
        });

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .mobile(request.getMobile())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(userRole)
                .active(true)
                .build();

        user = userRepository.save(user);

        UserResponse userResp = new UserResponse(user.getId(), user.getFullName(), user.getEmail(), user.getMobile(), user.getRole().getName());
        return ResponseEntity.ok(userResp);
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).build();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        UserResponse userResp = new UserResponse(user.getId(), user.getFullName(), user.getEmail(), user.getMobile(), user.getRole()!=null?user.getRole().getName():null);
        return ResponseEntity.ok(userResp);
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        String requestToken = request.getRefreshToken();
        return refreshTokenService.findByToken(requestToken)
                .map(rt -> {
                    if (rt.isRevoked() || refreshTokenService.isExpired(rt)) {
                        return ResponseEntity.status(401).body(new com.shrihari.collection.dto.ApiResponse<>(false, "Invalid or expired refresh token", null));
                    }
                    // rotation: revoke current and issue new
                    refreshTokenService.revoke(rt);
                    User user = rt.getUser();
                    String newAccess = jwtUtils.generateToken(user.getEmail());
                    RefreshToken newRefresh = refreshTokenService.createRefreshToken(user);
                    UserResponse userResp = new UserResponse(user.getId(), user.getFullName(), user.getEmail(), user.getMobile(), user.getRole()!=null?user.getRole().getName():null);
                    return ResponseEntity.ok(new RefreshTokenResponse(newAccess, "Bearer", jwtUtils.getJwtExpirationMs(), newRefresh.getToken(), userResp));
                })
                .orElseGet(() -> ResponseEntity.status(401).body(new com.shrihari.collection.dto.ApiResponse<>(false, "Invalid refresh token", null)));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@Valid @RequestBody RefreshTokenRequest request) {
        String requestToken = request.getRefreshToken();
        Optional<RefreshToken> token = refreshTokenService.findByToken(requestToken);
        token.ifPresent(rt -> refreshTokenService.revoke(rt));
        return ResponseEntity.ok(new com.shrihari.collection.dto.ApiResponse<>(true, "Logged out", null));
    }
}
