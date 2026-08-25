package com.shrihari.collection.service;

import com.shrihari.collection.dto.AddToCartRequest;
import com.shrihari.collection.dto.CartResponse;
import com.shrihari.collection.dto.UpdateCartItemRequest;

public interface CartService {
    CartResponse getCart(String email);
    CartResponse addItem(String email, AddToCartRequest request);
    CartResponse updateItem(String email, Long itemId, UpdateCartItemRequest request);
    void removeItem(String email, Long itemId);
    void clearCart(String email);
}
