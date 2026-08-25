package com.shrihari.collection.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductRequest {
    @NotBlank(message = "Product name is required")
    private String name;

    private String slug;

    private String description;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.00", inclusive = true, message = "Price must be >= 0")
    private BigDecimal price;

    @DecimalMin(value = "0.00", inclusive = true, message = "Discount price must be >= 0")
    private BigDecimal discountPrice;

    @NotNull(message = "Category is required")
    private Long categoryId;

    @NotNull(message = "Stock quantity is required")
    @Min(value = 0, message = "Stock must be >= 0")
    private Integer stockQuantity;

    @NotBlank(message = "SKU is required")
    private String sku;

    private String brand;
    private String image;
    private Boolean active = true;
    private Boolean featured = false;
}
