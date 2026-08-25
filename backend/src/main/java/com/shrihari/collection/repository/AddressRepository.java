package com.shrihari.collection.repository;

import com.shrihari.collection.model.Address;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AddressRepository extends JpaRepository<Address, Long> {
}
