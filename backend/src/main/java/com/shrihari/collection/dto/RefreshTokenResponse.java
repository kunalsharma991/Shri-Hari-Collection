package com.shrihari.collection.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RefreshTokenResponse {
    private String accessToken;
    private String tokenType = "Bearer";
    private long expiresIn;
    private String refreshToken;
    private UserResponse user;
}
