package com.shrihari.collection.controller;

import com.shrihari.collection.dto.ApiResponse;
import com.shrihari.collection.dto.ProductRequest;
import com.shrihari.collection.dto.ProductResponse;
import com.shrihari.collection.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api")
public class ProductController {
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/products")
    public ResponseEntity<ApiResponse<Page<ProductResponse>>> getProducts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long category,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false, defaultValue = "createdAt") String sort,
            @RequestParam(required = false, defaultValue = "0") Integer page,
            @RequestParam(required = false, defaultValue = "12") Integer size
    ) {
        if (page < 0) page = 0;
        if (size <= 0) size = 12;
        return ResponseEntity.ok(new ApiResponse<>(true, "Products retrieved successfully", productService.getProducts(search, category, minPrice, maxPrice, sort, page, size)));
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Product retrieved successfully", productService.getProductById(id)));
    }

    @GetMapping("/products/slug/{slug}")
    public ResponseEntity<ApiResponse<ProductResponse>> getProductBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Product retrieved successfully", productService.getProductBySlug(slug)));
    }

    @GetMapping("/products/featured")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getFeaturedProducts() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Featured products retrieved successfully", productService.getFeaturedProducts()));
    }

    @GetMapping("/products/category/{categoryId}")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getProductsByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Products retrieved successfully", productService.getProductsByCategory(categoryId)));
    }

    @PostMapping("/admin/products")
    public ResponseEntity<ApiResponse<ProductResponse>> createProduct(@Valid @RequestBody ProductRequest request) {
        ProductResponse created = productService.createProduct(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse<>(true, "Product created successfully", created));
    }

    @PutMapping("/admin/products/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProduct(@PathVariable Long id, @Valid @RequestBody ProductRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Product updated successfully", productService.updateProduct(id, request)));
    }

    @DeleteMapping("/admin/products/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Product deleted successfully", null));
    }

    @PatchMapping("/admin/products/{id}/stock")
    public ResponseEntity<ApiResponse<ProductResponse>> updateStock(@PathVariable Long id, @RequestBody ProductRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Stock updated successfully", productService.updateStock(id, request.getStockQuantity())));
    }

    @PatchMapping("/admin/products/{id}/status")
    public ResponseEntity<ApiResponse<ProductResponse>> updateStatus(@PathVariable Long id, @RequestBody ProductRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Status updated successfully", productService.updateStatus(id, request.getActive())));
    }
}
