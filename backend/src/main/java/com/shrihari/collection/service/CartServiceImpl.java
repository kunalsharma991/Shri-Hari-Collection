package com.shrihari.collection.service;

import com.shrihari.collection.dto.AddToCartRequest;
import com.shrihari.collection.dto.CartItemResponse;
import com.shrihari.collection.dto.CartResponse;
import com.shrihari.collection.dto.UpdateCartItemRequest;
import com.shrihari.collection.exception.ConflictException;
import com.shrihari.collection.exception.ResourceNotFoundException;
import com.shrihari.collection.model.Cart;
import com.shrihari.collection.model.CartItem;
import com.shrihari.collection.model.Product;
import com.shrihari.collection.model.User;
import com.shrihari.collection.repository.CartItemRepository;
import com.shrihari.collection.repository.CartRepository;
import com.shrihari.collection.repository.ProductRepository;
import com.shrihari.collection.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class CartServiceImpl implements CartService {
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartServiceImpl(CartRepository cartRepository, CartItemRepository cartItemRepository,
                           ProductRepository productRepository, UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public CartResponse getCart(String email) {
        return toResponse(getOrCreateCart(email));
    }

    @Override
    @Transactional
    public CartResponse addItem(String email, AddToCartRequest request) {
        Cart cart = getOrCreateCart(email);
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + request.getProductId()));
        validateActive(product);

        CartItem item = cartItemRepository.findByCartIdAndProductId(cart.getId(), product.getId()).orElse(null);
        int requestedQuantity = request.getQuantity();
        int finalQuantity = item == null ? requestedQuantity : item.getQuantity() + requestedQuantity;
        validateStock(product, finalQuantity);

        if (item == null) {
            item = CartItem.builder().cart(cart).product(product).quantity(finalQuantity).build();
            if (cart.getItems() == null) {
                cart.setItems(new ArrayList<>());
            }
            cart.getItems().add(item);
        } else {
            item.setQuantity(finalQuantity);
        }
        cartItemRepository.save(item);
        return toResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse updateItem(String email, Long itemId, UpdateCartItemRequest request) {
        Cart cart = getOrCreateCart(email);
        CartItem item = getOwnedItem(cart, itemId);
        Product product = productRepository.findById(item.getProduct().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + item.getProduct().getId()));
        validateActive(product);
        validateStock(product, request.getQuantity());
        item.setQuantity(request.getQuantity());
        cartItemRepository.save(item);
        return toResponse(cart);
    }

    @Override
    @Transactional
    public void removeItem(String email, Long itemId) {
        Cart cart = getOrCreateCart(email);
        CartItem item = getOwnedItem(cart, itemId);
        cart.getItems().remove(item);
        cartItemRepository.delete(item);
    }

    @Override
    @Transactional
    public void clearCart(String email) {
        Cart cart = getOrCreateCart(email);
        if (cart.getItems() != null) {
            cartItemRepository.deleteAll(cart.getItems());
            cart.getItems().clear();
        }
    }

    private Cart getOrCreateCart(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return cartRepository.findByUserId(user.getId()).orElseGet(() -> {
            Cart cart = Cart.builder().user(user).items(new ArrayList<>()).build();
            return cartRepository.save(cart);
        });
    }

    private CartItem getOwnedItem(Cart cart, Long itemId) {
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + itemId));
        if (item.getCart() == null || !item.getCart().getId().equals(cart.getId())) {
            throw new AccessDeniedException("Cart item does not belong to the current user");
        }
        return item;
    }

    private void validateActive(Product product) {
        if (!product.isActive()) {
            throw new ConflictException("Product is not available");
        }
    }

    private void validateStock(Product product, int quantity) {
        if (quantity < 1) {
            throw new IllegalArgumentException("Quantity must be at least 1");
        }
        if (quantity > product.getStockQuantity()) {
            throw new ConflictException("Requested quantity exceeds available stock");
        }
    }

    private CartResponse toResponse(Cart cart) {
        List<CartItemResponse> items = new ArrayList<>();
        int totalItemCount = 0;
        BigDecimal cartTotal = BigDecimal.ZERO;
        if (cart.getItems() != null) {
            for (CartItem item : cart.getItems()) {
                Product product = productRepository.findById(item.getProduct().getId())
                        .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + item.getProduct().getId()));
                BigDecimal effectivePrice = product.getDiscountPrice() != null
                        && product.getDiscountPrice().compareTo(product.getPrice()) < 0
                        ? product.getDiscountPrice() : product.getPrice();
                BigDecimal subtotal = effectivePrice.multiply(BigDecimal.valueOf(item.getQuantity()));
                items.add(CartItemResponse.builder()
                        .id(item.getId())
                        .productId(product.getId())
                        .productName(product.getName())
                        .productSlug(product.getSlug())
                        .productImage(product.getImage())
                        .price(product.getPrice())
                        .discountPrice(product.getDiscountPrice())
                        .effectivePrice(effectivePrice)
                        .stockQuantity(product.getStockQuantity())
                        .quantity(item.getQuantity())
                        .itemSubtotal(subtotal)
                        .build());
                totalItemCount += item.getQuantity();
                cartTotal = cartTotal.add(subtotal);
            }
        }
        return CartResponse.builder()
                .id(cart.getId())
                .userId(cart.getUser().getId())
                .items(items)
                .totalItemCount(totalItemCount)
                .cartTotal(cartTotal)
                .build();
    }
}
