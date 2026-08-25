package com.shrihari.collection.config;

import com.shrihari.collection.model.Role;
import com.shrihari.collection.model.User;
import com.shrihari.collection.model.enums.UserRole;
import com.shrihari.collection.repository.RoleRepository;
import com.shrihari.collection.repository.UserRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminSeeder implements ApplicationRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminSeeder(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        String adminEmail = System.getenv("ADMIN_EMAIL");
        String adminPassword = System.getenv("ADMIN_PASSWORD");

        if (adminEmail == null || adminEmail.isBlank() || adminPassword == null || adminPassword.isBlank()) {
            return; // nothing to do
        }

        if (userRepository.findByEmail(adminEmail).isPresent()) {
            return; // don't overwrite existing admin
        }

        Role adminRole = roleRepository.findByName(UserRole.ADMIN).orElseGet(() -> {
            Role r = new Role();
            r.setName(UserRole.ADMIN);
            return roleRepository.save(r);
        });

        User admin = User.builder()
                .fullName("Administrator")
                .email(adminEmail)
                .password(passwordEncoder.encode(adminPassword))
                .role(adminRole)
                .active(true)
                .build();

        userRepository.save(admin);
    }
}
