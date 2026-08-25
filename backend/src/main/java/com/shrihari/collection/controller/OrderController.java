package com.shrihari.collection.controller;

import com.shrihari.collection.dto.ApiResponse;
import com.shrihari.collection.dto.CreateOrderRequest;
import com.shrihari.collection.dto.OrderResponse;
import com.shrihari.collection.dto.OrderSummaryResponse;
import com.shrihari.collection.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> create(Authentication authentication, @Valid @RequestBody CreateOrderRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse<>(true, "Order created successfully", orderService.createOrder(authentication.getName(), request)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<OrderSummaryResponse>>> list(Authentication authentication,
                                                                          @RequestParam(defaultValue = "0") int page,
                                                                          @RequestParam(defaultValue = "12") int size) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Orders retrieved successfully", orderService.getUserOrders(authentication.getName(), page, size)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> get(Authentication authentication, @PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Order retrieved successfully", orderService.getUserOrder(authentication.getName(), id)));
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<OrderResponse>> cancel(Authentication authentication, @PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Order cancelled successfully", orderService.cancelOrder(authentication.getName(), id)));
    }
}
