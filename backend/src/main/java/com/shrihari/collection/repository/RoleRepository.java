package com.shrihari.collection.repository;

import com.shrihari.collection.model.Role;
import com.shrihari.collection.model.enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
	Optional<Role> findByName(UserRole name);
}
