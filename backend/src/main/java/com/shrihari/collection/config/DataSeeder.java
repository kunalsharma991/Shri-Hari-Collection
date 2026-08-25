package com.shrihari.collection.config;

import com.shrihari.collection.model.Category;
import com.shrihari.collection.model.Product;
import com.shrihari.collection.repository.CategoryRepository;
import com.shrihari.collection.repository.ProductRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Locale;

@Component
public class DataSeeder implements ApplicationRunner {
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    public DataSeeder(CategoryRepository categoryRepository, ProductRepository productRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (categoryRepository.count() > 0 || productRepository.count() > 0) {
            return;
        }

        List<String> categoryNames = List.of(
                "Men", "Women", "Kids", "Sarees", "Kurtis", "Shirts", "T-Shirts", "Jeans", "Dresses", "Accessories"
        );

        List<Category> categories = categoryNames.stream()
                .map(name -> Category.builder()
                        .name(name)
                        .slug(toSlug(name))
                        .description(name + " collection for Shri Hari Collection")
                        .image("https://images.example.com/" + toSlug(name) + ".jpg")
                        .active(true)
                        .build())
                .toList();

        categoryRepository.saveAll(categories);

        Category men = categoryRepository.findBySlug("men").orElseThrow();
        Category women = categoryRepository.findBySlug("women").orElseThrow();
        Category kids = categoryRepository.findBySlug("kids").orElseThrow();
        Category sarees = categoryRepository.findBySlug("sarees").orElseThrow();
        Category kurtis = categoryRepository.findBySlug("kurtis").orElseThrow();

        List<Product> products = List.of(
                Product.builder().name("Classic Cotton Shirt").slug("classic-cotton-shirt").description("Premium cotton shirt for everyday wear").price(new BigDecimal("1499.00")).discountPrice(new BigDecimal("1199.00")).stockQuantity(25).sku("SHIRT-001").brand("Shri Hari").image("https://images.example.com/shirt-001.jpg").category(men).active(true).featured(true).build(),
                Product.builder().name("Royal Festive Saree").slug("royal-festive-saree").description("Elegant festive saree with rich texture").price(new BigDecimal("3499.00")).discountPrice(new BigDecimal("2799.00")).stockQuantity(18).sku("SAREE-001").brand("Shri Hari").image("https://images.example.com/saree-001.jpg").category(sarees).active(true).featured(true).build(),
                Product.builder().name("Everyday Kurtis Set").slug("everyday-kurtis-set").description("Comfortable and chic everyday kurtis").price(new BigDecimal("1899.00")).discountPrice(new BigDecimal("1499.00")).stockQuantity(30).sku("KURTI-001").brand("Shri Hari").image("https://images.example.com/kurti-001.jpg").category(kurtis).active(true).featured(true).build(),
                Product.builder().name("Kids Play Tee").slug("kids-play-tee").description("Soft cotton tee for active kids").price(new BigDecimal("799.00")).discountPrice(new BigDecimal("599.00")).stockQuantity(40).sku("KIDS-001").brand("Shri Hari").image("https://images.example.com/kids-001.jpg").category(kids).active(true).featured(false).build(),
                Product.builder().name("Women Printed Dress").slug("women-printed-dress").description("Flattering printed dress for day and evening").price(new BigDecimal("2599.00")).discountPrice(new BigDecimal("2099.00")).stockQuantity(22).sku("DRESS-001").brand("Shri Hari").image("https://images.example.com/dress-001.jpg").category(women).active(true).featured(true).build()
        );

        productRepository.saveAll(products);
    }

    private String toSlug(String value) {
        return value.trim().toLowerCase(Locale.ENGLISH)
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "");
    }
}
