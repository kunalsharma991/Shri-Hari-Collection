package com.shrihari.collection.controller;

import com.shrihari.collection.dto.AddToCartRequest;
import com.shrihari.collection.dto.ApiResponse;
import com.shrihari.collection.dto.CartResponse;
import com.shrihari.collection.dto.UpdateCartItemRequest;
import com.shrihari.collection.service.CartService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<CartResponse>> getCart(Authentication authentication) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Cart retrieved successfully", cartService.getCart(authentication.getName())));
    }

    @PostMapping("/items")
    public ResponseEntity<ApiResponse<CartResponse>> addItem(Authentication authentication,
                                                              @Valid @RequestBody AddToCartRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Item added to cart successfully", cartService.addItem(authentication.getName(), request)));
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<ApiResponse<CartResponse>> updateItem(Authentication authentication,
                                                                 @PathVariable Long itemId,
                                                                 @Valid @RequestBody UpdateCartItemRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Cart item updated successfully", cartService.updateItem(authentication.getName(), itemId, request)));
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<ApiResponse<Object>> removeItem(Authentication authentication, @PathVariable Long itemId) {
        cartService.removeItem(authentication.getName(), itemId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Cart item removed successfully", null));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<Object>> clearCart(Authentication authentication) {
        cartService.clearCart(authentication.getName());
        return ResponseEntity.ok(new ApiResponse<>(true, "Cart cleared successfully", null));
    }
}
