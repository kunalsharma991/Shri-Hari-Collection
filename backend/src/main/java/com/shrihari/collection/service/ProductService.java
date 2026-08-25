package com.shrihari.collection.service;

import com.shrihari.collection.dto.ProductRequest;
import com.shrihari.collection.dto.ProductResponse;
import com.shrihari.collection.exception.ConflictException;
import com.shrihari.collection.exception.ResourceNotFoundException;
import com.shrihari.collection.model.Category;
import com.shrihari.collection.model.Product;
import com.shrihari.collection.repository.CategoryRepository;
import com.shrihari.collection.repository.ProductRepository;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public Page<ProductResponse> getProducts(String search, Long categoryId, BigDecimal minPrice, BigDecimal maxPrice, String sort, int page, int size) {
        Sort sortSpec = resolveSort(sort);
        Pageable pageable = PageRequest.of(page, size, sortSpec);

        Specification<Product> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.isTrue(root.get("active")));

            if (search != null && !search.isBlank()) {
                String q = "%" + search.trim().toLowerCase(Locale.ENGLISH) + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("name")), q),
                        cb.like(cb.lower(root.get("description")), q),
                        cb.like(cb.lower(root.get("brand")), q),
                        cb.like(cb.lower(root.get("sku")), q)
                ));
            }

            if (categoryId != null) {
                predicates.add(cb.equal(root.get("category").get("id"), categoryId));
            }

            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), minPrice));
            }

            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), maxPrice));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return productRepository.findAll(spec, pageable).map(this::toResponse);
    }

    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return toResponse(product);
    }

    public ProductResponse getProductBySlug(String slug) {
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with slug: " + slug));
        return toResponse(product);
    }

    public List<ProductResponse> getFeaturedProducts() {
        return productRepository.findByFeatured(true, Pageable.unpaged()).stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<ProductResponse> getProductsByCategory(Long categoryId) {
        if (!categoryRepository.existsById(categoryId)) {
            throw new ResourceNotFoundException("Category not found with id: " + categoryId);
        }
        return productRepository.findByCategoryId(categoryId).stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        String name = request.getName() == null ? "" : request.getName().trim();
        String slug = (request.getSlug() == null || request.getSlug().isBlank()) ? toSlug(name) : toSlug(request.getSlug());
        String sku = request.getSku() == null ? "" : request.getSku().trim();

        if (name.isBlank()) {
            throw new IllegalArgumentException("Product name is required");
        }
        if (request.getPrice() == null || request.getPrice().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Price must be >= 0");
        }
        validateDiscountPrice(request.getDiscountPrice(), request.getPrice());
        if (request.getStockQuantity() == null || request.getStockQuantity() < 0) {
            throw new IllegalArgumentException("Stock must be >= 0");
        }
        if (sku.isBlank()) {
            throw new IllegalArgumentException("SKU is required");
        }
        if (productRepository.findBySku(sku).isPresent()) {
            throw new ConflictException("SKU already exists");
        }
        if (productRepository.findBySlug(slug).isPresent()) {
            throw new ConflictException("Slug already exists");
        }

        Product product = Product.builder()
                .name(name)
                .slug(slug)
                .description(request.getDescription())
                .price(request.getPrice())
                .discountPrice(request.getDiscountPrice())
                .stockQuantity(request.getStockQuantity())
                .sku(sku)
                .brand(request.getBrand())
                .image(request.getImage())
                .category(category)
                .active(Optional.ofNullable(request.getActive()).orElse(true))
                .featured(Optional.ofNullable(request.getFeatured()).orElse(false))
                .build();

        return toResponse(productRepository.save(product));
    }

    @Transactional
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        String name = request.getName() == null ? product.getName() : request.getName().trim();
        String slug = (request.getSlug() == null || request.getSlug().isBlank()) ? product.getSlug() : toSlug(request.getSlug());
        String sku = request.getSku() == null ? product.getSku() : request.getSku().trim();

        if (name.isBlank()) {
            throw new IllegalArgumentException("Product name is required");
        }
        if (request.getPrice() == null || request.getPrice().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Price must be >= 0");
        }
        validateDiscountPrice(request.getDiscountPrice(), request.getPrice());
        if (request.getStockQuantity() == null || request.getStockQuantity() < 0) {
            throw new IllegalArgumentException("Stock must be >= 0");
        }
        if (sku.isBlank()) {
            throw new IllegalArgumentException("SKU is required");
        }
        if (!sku.equalsIgnoreCase(product.getSku()) && productRepository.findBySku(sku).isPresent()) {
            throw new ConflictException("SKU already exists");
        }
        if (!slug.equalsIgnoreCase(product.getSlug()) && productRepository.findBySlug(slug).isPresent()) {
            throw new ConflictException("Slug already exists");
        }

        product.setName(name);
        product.setSlug(slug);
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setDiscountPrice(request.getDiscountPrice());
        product.setStockQuantity(request.getStockQuantity());
        product.setSku(sku);
        product.setBrand(request.getBrand());
        product.setImage(request.getImage());
        product.setCategory(category);
        if (request.getActive() != null) {
            product.setActive(request.getActive());
        }
        if (request.getFeatured() != null) {
            product.setFeatured(request.getFeatured());
        }

        return toResponse(productRepository.save(product));
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        productRepository.delete(product);
    }

    @Transactional
    public ProductResponse updateStock(Long id, Integer stockQuantity) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        if (stockQuantity == null || stockQuantity < 0) {
            throw new IllegalArgumentException("Stock must be >= 0");
        }
        product.setStockQuantity(stockQuantity);
        return toResponse(productRepository.save(product));
    }

    @Transactional
    public ProductResponse updateStatus(Long id, Boolean active) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        product.setActive(Boolean.TRUE.equals(active));
        return toResponse(productRepository.save(product));
    }

    private ProductResponse toResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .slug(product.getSlug())
                .description(product.getDescription())
                .price(product.getPrice())
                .discountPrice(product.getDiscountPrice())
                .stockQuantity(product.getStockQuantity())
                .sku(product.getSku())
                .brand(product.getBrand())
                .image(product.getImage())
                .categoryId(product.getCategory() != null ? product.getCategory().getId() : null)
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .active(product.isActive())
                .featured(product.isFeatured())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }

    private String toSlug(String value) {
        if (value == null) {
            return "";
        }
        return value.trim().toLowerCase(Locale.ENGLISH)
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "");
    }

    private void validateDiscountPrice(BigDecimal discountPrice, BigDecimal price) {
        if (discountPrice != null && discountPrice.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Discount price must be >= 0");
        }
        if (discountPrice != null && discountPrice.compareTo(price) > 0) {
            throw new IllegalArgumentException("Discount price must not exceed price");
        }
    }

    private Sort resolveSort(String sort) {
        if (sort == null || sort.isBlank()) {
            return Sort.by(Sort.Direction.DESC, "createdAt");
        }

        switch (sort.toLowerCase(Locale.ENGLISH)) {
            case "price_asc":
                return Sort.by(Sort.Direction.ASC, "price");
            case "price_desc":
                return Sort.by(Sort.Direction.DESC, "price");
            case "name_asc":
                return Sort.by(Sort.Direction.ASC, "name");
            case "name_desc":
                return Sort.by(Sort.Direction.DESC, "name");
            default:
                return Sort.by(Sort.Direction.DESC, "createdAt");
        }
    }
}
