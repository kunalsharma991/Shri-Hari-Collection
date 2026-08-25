package com.shrihari.collection.dto;

import com.shrihari.collection.model.enums.OrderStatus;
import com.shrihari.collection.model.enums.PaymentMethod;
import com.shrihari.collection.model.enums.PaymentStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@Builder
public class OrderSummaryResponse {
    private Long id;
    private String orderNumber;
    private String customerName;
    private String customerEmail;
    private BigDecimal totalAmount;
    private PaymentMethod paymentMethod;
    private PaymentStatus paymentStatus;
    private OrderStatus orderStatus;
    private Instant createdAt;
}
