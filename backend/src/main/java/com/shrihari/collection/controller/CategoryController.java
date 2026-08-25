package com.shrihari.collection.controller;

import com.shrihari.collection.dto.ApiResponse;
import com.shrihari.collection.dto.CategoryRequest;
import com.shrihari.collection.dto.CategoryResponse;
import com.shrihari.collection.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CategoryController {
    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getAllCategories() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Categories retrieved successfully", categoryService.getAllCategories()));
    }

    @GetMapping("/categories/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> getCategoryById(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Category retrieved successfully", categoryService.getCategoryById(id)));
    }

    @GetMapping("/categories/slug/{slug}")
    public ResponseEntity<ApiResponse<CategoryResponse>> getCategoryBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Category retrieved successfully", categoryService.getCategoryBySlug(slug)));
    }

    @PostMapping("/admin/categories")
    public ResponseEntity<ApiResponse<CategoryResponse>> createCategory(@Valid @RequestBody CategoryRequest request) {
        CategoryResponse created = categoryService.createCategory(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse<>(true, "Category created successfully", created));
    }

    @PutMapping("/admin/categories/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> updateCategory(@PathVariable Long id, @Valid @RequestBody CategoryRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Category updated successfully", categoryService.updateCategory(id, request)));
    }

    @DeleteMapping("/admin/categories/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Category deleted successfully", null));
    }
}
