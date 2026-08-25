package com.shrihari.collection.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank
    private String fullName;

    @Email
    @NotBlank
    private String email;

    private String mobile;

    @NotBlank
    private String password;

    @NotBlank
    private String confirmPassword;
}
