package com.shrihari.collection.dto;

import com.shrihari.collection.model.enums.OrderStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateOrderStatusRequest {
    @NotNull(message = "Order status is required")
    private OrderStatus orderStatus;
}
