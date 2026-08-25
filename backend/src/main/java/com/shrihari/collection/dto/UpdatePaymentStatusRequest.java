package com.shrihari.collection.dto;

import com.shrihari.collection.model.enums.PaymentStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdatePaymentStatusRequest {
    @NotNull(message = "Payment status is required")
    private PaymentStatus paymentStatus;
}
