package com.shrihari.collection.repository;

import com.shrihari.collection.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, Long> {
}
