package com.shrihari.collection.service;

import com.shrihari.collection.dto.CreateOrderRequest;
import com.shrihari.collection.dto.OrderItemResponse;
import com.shrihari.collection.dto.OrderResponse;
import com.shrihari.collection.dto.OrderSummaryResponse;
import com.shrihari.collection.dto.UpdateOrderStatusRequest;
import com.shrihari.collection.dto.UpdatePaymentStatusRequest;
import com.shrihari.collection.exception.ConflictException;
import com.shrihari.collection.exception.ResourceNotFoundException;
import com.shrihari.collection.model.Cart;
import com.shrihari.collection.model.CartItem;
import com.shrihari.collection.model.Order;
import com.shrihari.collection.model.OrderItem;
import com.shrihari.collection.model.Product;
import com.shrihari.collection.model.User;
import com.shrihari.collection.model.enums.OrderStatus;
import com.shrihari.collection.model.enums.PaymentMethod;
import com.shrihari.collection.model.enums.PaymentStatus;
import com.shrihari.collection.repository.CartItemRepository;
import com.shrihari.collection.repository.CartRepository;
import com.shrihari.collection.repository.OrderItemRepository;
import com.shrihari.collection.repository.OrderRepository;
import com.shrihari.collection.repository.ProductRepository;
import com.shrihari.collection.repository.UserRepository;
import jakarta.persistence.criteria.Predicate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class OrderServiceImpl implements OrderService {
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final BigDecimal shippingCharge;
    private final BigDecimal freeShippingThreshold;

    public OrderServiceImpl(OrderRepository orderRepository, OrderItemRepository orderItemRepository,
                            CartRepository cartRepository, CartItemRepository cartItemRepository,
                            ProductRepository productRepository, UserRepository userRepository,
                            @Value("${order.shipping-charge:50}") BigDecimal shippingCharge,
                            @Value("${order.free-shipping-threshold:999}") BigDecimal freeShippingThreshold) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.shippingCharge = shippingCharge;
        this.freeShippingThreshold = freeShippingThreshold;
    }

    @Override
    @Transactional
    public OrderResponse createOrder(String email, CreateOrderRequest request) {
        User user = getUser(email);
        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));
        List<CartItem> cartItems = cartItemRepository.findByCartId(cart.getId());
        if (cartItems.isEmpty()) {
            throw new ConflictException("Cart is empty");
        }

        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal discountAmount = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem cartItem : cartItems) {
            Product product = productRepository.findById(cartItem.getProduct().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + cartItem.getProduct().getId()));
            if (!product.isActive()) {
                throw new ConflictException("Product is not available: " + product.getName());
            }
            if (cartItem.getQuantity() > product.getStockQuantity()) {
                throw new ConflictException("Insufficient stock for product: " + product.getName());
            }

            BigDecimal price = product.getPrice();
            BigDecimal effectivePrice = effectivePrice(product);
            BigDecimal itemSubtotal = effectivePrice.multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            BigDecimal itemDiscount = price.subtract(effectivePrice).multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            subtotal = subtotal.add(itemSubtotal);
            discountAmount = discountAmount.add(itemDiscount);
            orderItems.add(OrderItem.builder()
                    .product(product)
                    .productName(product.getName())
                    .sku(product.getSku())
                    .unitPrice(effectivePrice)
                    .quantity(cartItem.getQuantity())
                    .discountAmount(itemDiscount)
                    .subtotal(itemSubtotal)
                    .build());
        }

        BigDecimal shipping = subtotal.compareTo(freeShippingThreshold) >= 0 ? BigDecimal.ZERO : shippingCharge;
        OrderStatus status = request.getPaymentMethod() == PaymentMethod.COD ? OrderStatus.CONFIRMED : OrderStatus.PENDING;
        Order order = Order.builder()
                .orderNumber(generateOrderNumber())
                .user(user)
                .subtotal(subtotal)
                .discountAmount(discountAmount)
                .shippingAmount(shipping)
                .totalAmount(subtotal.add(shipping))
                .paymentMethod(request.getPaymentMethod())
                .paymentStatus(PaymentStatus.PENDING)
                .orderStatus(status)
                .customerName(user.getFullName())
                .customerEmail(user.getEmail())
                .customerMobile(user.getMobile())
                .shippingAddress(request.getShippingAddress().trim())
                .city(request.getCity().trim())
                .state(request.getState().trim())
                .pincode(request.getPincode().trim())
                .items(new ArrayList<>())
                .build();
        for (OrderItem item : orderItems) {
            item.setOrder(order);
            order.getItems().add(item);
            item.getProduct().setStockQuantity(item.getProduct().getStockQuantity() - item.getQuantity());
        }
        Order saved = orderRepository.save(order);
        cartItemRepository.deleteAll(cartItems);
        cart.getItems().clear();
        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderSummaryResponse> getUserOrders(String email, int page, int size) {
        User user = getUser(email);
        return orderRepository.findByUserId(user.getId(), pageRequest(page, size)).map(this::toSummary);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getUserOrder(String email, Long orderId) {
        User user = getUser(email);
        Order order = getOrder(orderId);
        ensureOwner(order, user.getId());
        return toResponse(order);
    }

    @Override
    @Transactional
    public OrderResponse cancelOrder(String email, Long orderId) {
        User user = getUser(email);
        Order order = getOrder(orderId);
        ensureOwner(order, user.getId());
        cancel(order);
        return toResponse(order);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderSummaryResponse> getAdminOrders(OrderStatus orderStatus, PaymentStatus paymentStatus,
                                                      PaymentMethod paymentMethod, String orderNumber,
                                                      String customerEmail, int page, int size) {
        Specification<Order> specification = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (orderStatus != null) predicates.add(cb.equal(root.get("orderStatus"), orderStatus));
            if (paymentStatus != null) predicates.add(cb.equal(root.get("paymentStatus"), paymentStatus));
            if (paymentMethod != null) predicates.add(cb.equal(root.get("paymentMethod"), paymentMethod));
            if (orderNumber != null && !orderNumber.isBlank()) predicates.add(cb.like(cb.lower(root.get("orderNumber")), "%" + orderNumber.toLowerCase() + "%"));
            if (customerEmail != null && !customerEmail.isBlank()) predicates.add(cb.like(cb.lower(root.get("customerEmail")), "%" + customerEmail.toLowerCase() + "%"));
            return cb.and(predicates.toArray(new Predicate[0]));
        };
        return orderRepository.findAll(specification, pageRequest(page, size)).map(this::toSummary);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getAdminOrder(Long orderId) {
        return toResponse(getOrder(orderId));
    }

    @Override
    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, UpdateOrderStatusRequest request) {
        Order order = getOrder(orderId);
        OrderStatus next = request.getOrderStatus();
        if (next == OrderStatus.CANCELLED) {
            cancel(order);
        } else if (!isAllowedTransition(order.getOrderStatus(), next)) {
            throw new ConflictException("Invalid order status transition");
        } else {
            order.setOrderStatus(next);
        }
        return toResponse(orderRepository.save(order));
    }

    @Override
    @Transactional
    public OrderResponse updatePaymentStatus(Long orderId, UpdatePaymentStatusRequest request) {
        Order order = getOrder(orderId);
        order.setPaymentStatus(request.getPaymentStatus());
        return toResponse(orderRepository.save(order));
    }

    private void cancel(Order order) {
        if (order.getOrderStatus() != OrderStatus.PENDING && order.getOrderStatus() != OrderStatus.CONFIRMED) {
            throw new ConflictException("Order cannot be cancelled in its current status");
        }
        for (OrderItem item : order.getItems()) {
            Product product = productRepository.findById(item.getProduct().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + item.getProduct().getId()));
            product.setStockQuantity(product.getStockQuantity() + item.getQuantity());
        }
        order.setOrderStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);
    }

    private boolean isAllowedTransition(OrderStatus current, OrderStatus next) {
        return (current == OrderStatus.PENDING && next == OrderStatus.CONFIRMED)
                || (current == OrderStatus.CONFIRMED && next == OrderStatus.PROCESSING)
                || (current == OrderStatus.PROCESSING && next == OrderStatus.SHIPPED)
                || (current == OrderStatus.SHIPPED && next == OrderStatus.DELIVERED);
    }

    private Product product(Long id) {
        return productRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    private BigDecimal effectivePrice(Product product) {
        return product.getDiscountPrice() != null && product.getDiscountPrice().compareTo(product.getPrice()) < 0
                ? product.getDiscountPrice() : product.getPrice();
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private Order getOrder(Long id) {
        return orderRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
    }

    private void ensureOwner(Order order, Long userId) {
        if (order.getUser() == null || !order.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("Order does not belong to the current user");
        }
    }

    private String generateOrderNumber() {
        String orderNumber;
        do {
            orderNumber = "SHC-" + LocalDate.now().format(DateTimeFormatter.BASIC_ISO_DATE) + "-" + UUID.randomUUID().toString().replace("-", "").substring(0, 6).toUpperCase();
        } while (orderRepository.findByOrderNumber(orderNumber).isPresent());
        return orderNumber;
    }

    private Pageable pageRequest(int page, int size) {
        return PageRequest.of(Math.max(page, 0), size > 0 ? size : 12, Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    private OrderSummaryResponse toSummary(Order order) {
        return OrderSummaryResponse.builder().id(order.getId()).orderNumber(order.getOrderNumber()).customerName(order.getCustomerName()).customerEmail(order.getCustomerEmail()).totalAmount(order.getTotalAmount()).paymentMethod(order.getPaymentMethod()).paymentStatus(order.getPaymentStatus()).orderStatus(order.getOrderStatus()).createdAt(order.getCreatedAt()).build();
    }

    private OrderResponse toResponse(Order order) {
        List<OrderItemResponse> items = order.getItems().stream().map(item -> OrderItemResponse.builder().id(item.getId()).productId(item.getProduct() != null ? item.getProduct().getId() : null).productName(item.getProductName()).sku(item.getSku()).unitPrice(item.getUnitPrice()).quantity(item.getQuantity()).discountAmount(item.getDiscountAmount()).subtotal(item.getSubtotal()).build()).toList();
        return OrderResponse.builder().id(order.getId()).orderNumber(order.getOrderNumber()).customerName(order.getCustomerName()).customerEmail(order.getCustomerEmail()).customerMobile(order.getCustomerMobile()).shippingAddress(order.getShippingAddress()).city(order.getCity()).state(order.getState()).pincode(order.getPincode()).items(items).subtotal(order.getSubtotal()).discountAmount(order.getDiscountAmount()).shippingAmount(order.getShippingAmount()).totalAmount(order.getTotalAmount()).paymentMethod(order.getPaymentMethod()).paymentStatus(order.getPaymentStatus()).orderStatus(order.getOrderStatus()).createdAt(order.getCreatedAt()).updatedAt(order.getUpdatedAt()).build();
    }
}
