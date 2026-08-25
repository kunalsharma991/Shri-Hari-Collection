package com.shrihari.collection.dto;

import com.shrihari.collection.model.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String fullName;
    private String email;
    private String mobile;
    private UserRole role;
}
