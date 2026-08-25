package com.shrihari.collection.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.shrihari.collection.model.Order;
import com.shrihari.collection.model.enums.OrderStatus;
import com.shrihari.collection.model.enums.PaymentMethod;
import com.shrihari.collection.model.enums.PaymentStatus;

import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long>, JpaSpecificationExecutor<Order> {
	Page<Order> findByUserId(Long userId, Pageable pageable);
	Optional<Order> findByOrderNumber(String orderNumber);
	Page<Order> findByOrderStatus(OrderStatus status, Pageable pageable);
	Page<Order> findByPaymentStatus(PaymentStatus status, Pageable pageable);
	Page<Order> findByPaymentMethod(PaymentMethod method, Pageable pageable);
	Page<Order> findByOrderNumberContainingIgnoreCase(String orderNumber, Pageable pageable);
	Page<Order> findByCustomerEmailContainingIgnoreCase(String email, Pageable pageable);
}
