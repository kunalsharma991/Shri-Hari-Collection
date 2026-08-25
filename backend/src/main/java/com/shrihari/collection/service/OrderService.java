package com.shrihari.collection.service;

import com.shrihari.collection.dto.CreateOrderRequest;
import com.shrihari.collection.dto.OrderResponse;
import com.shrihari.collection.dto.OrderSummaryResponse;
import com.shrihari.collection.dto.UpdateOrderStatusRequest;
import com.shrihari.collection.dto.UpdatePaymentStatusRequest;
import com.shrihari.collection.model.enums.OrderStatus;
import com.shrihari.collection.model.enums.PaymentMethod;
import com.shrihari.collection.model.enums.PaymentStatus;
import org.springframework.data.domain.Page;

public interface OrderService {
    OrderResponse createOrder(String email, CreateOrderRequest request);
    Page<OrderSummaryResponse> getUserOrders(String email, int page, int size);
    OrderResponse getUserOrder(String email, Long orderId);
    OrderResponse cancelOrder(String email, Long orderId);
    Page<OrderSummaryResponse> getAdminOrders(OrderStatus orderStatus, PaymentStatus paymentStatus,
                                               PaymentMethod paymentMethod, String orderNumber,
                                               String customerEmail, int page, int size);
    OrderResponse getAdminOrder(Long orderId);
    OrderResponse updateOrderStatus(Long orderId, UpdateOrderStatusRequest request);
    OrderResponse updatePaymentStatus(Long orderId, UpdatePaymentStatusRequest request);
}
