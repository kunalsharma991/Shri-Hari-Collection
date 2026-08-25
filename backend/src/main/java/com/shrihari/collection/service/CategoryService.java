package com.shrihari.collection.service;

import com.shrihari.collection.dto.CategoryRequest;
import com.shrihari.collection.dto.CategoryResponse;
import com.shrihari.collection.exception.ConflictException;
import com.shrihari.collection.exception.ResourceNotFoundException;
import com.shrihari.collection.model.Category;
import com.shrihari.collection.repository.CategoryRepository;
import com.shrihari.collection.repository.ProductRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    public CategoryService(CategoryRepository categoryRepository, ProductRepository productRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
    }

    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll(Sort.by(Sort.Direction.ASC, "name")).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public CategoryResponse getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        return toResponse(category);
    }

    public CategoryResponse getCategoryBySlug(String slug) {
        Category category = categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with slug: " + slug));
        return toResponse(category);
    }

    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {
        String name = request.getName() == null ? "" : request.getName().trim();
        String slug = (request.getSlug() == null || request.getSlug().isBlank()) ? toSlug(name) : toSlug(request.getSlug());

        if (name.isBlank()) {
            throw new IllegalArgumentException("Category name is required");
        }
        if (categoryRepository.existsByName(name)) {
            throw new ConflictException("Category name already exists");
        }
        if (categoryRepository.existsBySlug(slug)) {
            throw new ConflictException("Category slug already exists");
        }

        Category category = Category.builder()
                .name(name)
                .slug(slug)
                .description(request.getDescription())
                .image(request.getImage())
                .active(Optional.ofNullable(request.getActive()).orElse(true))
                .build();

        return toResponse(categoryRepository.save(category));
    }

    @Transactional
    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));

        String newName = request.getName() == null ? category.getName() : request.getName().trim();
        String newSlug = (request.getSlug() == null || request.getSlug().isBlank()) ? category.getSlug() : toSlug(request.getSlug());

        if (newName.isBlank()) {
            throw new IllegalArgumentException("Category name is required");
        }

        if (!newName.equalsIgnoreCase(category.getName()) && categoryRepository.existsByName(newName)) {
            throw new ConflictException("Category name already exists");
        }
        if (!newSlug.equalsIgnoreCase(category.getSlug()) && categoryRepository.existsBySlug(newSlug)) {
            throw new ConflictException("Category slug already exists");
        }

        category.setName(newName);
        category.setSlug(newSlug);
        category.setDescription(request.getDescription());
        category.setImage(request.getImage());
        if (request.getActive() != null) {
            category.setActive(request.getActive());
        }

        return toResponse(categoryRepository.save(category));
    }

    @Transactional
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        if (productRepository.existsByCategoryId(id)) {
            throw new ConflictException("Category cannot be deleted while products depend on it");
        }
        categoryRepository.delete(category);
    }

    private CategoryResponse toResponse(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .slug(category.getSlug())
                .description(category.getDescription())
                .image(category.getImage())
                .active(category.isActive())
                .createdAt(category.getCreatedAt())
                .updatedAt(category.getUpdatedAt())
                .build();
    }

    private String toSlug(String value) {
        if (value == null) {
            return "";
        }
        return value.trim()
                .toLowerCase(Locale.ENGLISH)
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "");
    }
}
