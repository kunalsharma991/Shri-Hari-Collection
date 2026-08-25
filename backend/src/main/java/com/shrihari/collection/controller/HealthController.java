package com.shrihari.collection.controller;

import com.shrihari.collection.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class HealthController {

    @GetMapping("/health")
    public ResponseEntity<ApiResponse<Object>> health() {
        ApiResponse<Object> res = new ApiResponse<>(true, "Shri Hari Collection backend is running", null);
        return ResponseEntity.ok(res);
    }
}
