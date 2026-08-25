package com.shrihari.collection.controller;

import com.shrihari.collection.dto.ApiResponse;
import com.shrihari.collection.dto.OrderResponse;
import com.shrihari.collection.dto.OrderSummaryResponse;
import com.shrihari.collection.dto.UpdateOrderStatusRequest;
import com.shrihari.collection.dto.UpdatePaymentStatusRequest;
import com.shrihari.collection.model.enums.OrderStatus;
import com.shrihari.collection.model.enums.PaymentMethod;
import com.shrihari.collection.model.enums.PaymentStatus;
import com.shrihari.collection.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/orders")
public class AdminOrderController {
    private final OrderService orderService;

    public AdminOrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<OrderSummaryResponse>>> list(
            @RequestParam(required = false) OrderStatus orderStatus,
            @RequestParam(required = false) PaymentStatus paymentStatus,
            @RequestParam(required = false) PaymentMethod paymentMethod,
            @RequestParam(required = false) String orderNumber,
            @RequestParam(required = false) String customerEmail,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Orders retrieved successfully", orderService.getAdminOrders(orderStatus, paymentStatus, paymentMethod, orderNumber, customerEmail, page, size)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> get(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Order retrieved successfully", orderService.getAdminOrder(id)));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<OrderResponse>> updateStatus(@PathVariable Long id, @Valid @RequestBody UpdateOrderStatusRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Order status updated successfully", orderService.updateOrderStatus(id, request)));
    }

    @PatchMapping("/{id}/payment-status")
    public ResponseEntity<ApiResponse<OrderResponse>> updatePaymentStatus(@PathVariable Long id, @Valid @RequestBody UpdatePaymentStatusRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Payment status updated successfully", orderService.updatePaymentStatus(id, request)));
    }
}
