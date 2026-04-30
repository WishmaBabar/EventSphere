package com.events.config;

import com.events.model.User;
import com.events.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${ADMIN_NAME:System Admin}")
    private String adminName;

    @Value("${ADMIN_EMAIL:admin@eventsphere.com}")
    private String adminEmail;

    @Value("${ADMIN_PASSWORD:Admin@1234}")
    private String adminPassword;

    @Override
    public void run(String... args) {
        String normalizedAdminEmail = adminEmail.toLowerCase().trim();

        User admin = userRepository.findByEmail(normalizedAdminEmail)
                .orElseGet(() -> User.builder()
                        .email(normalizedAdminEmail)
                        .build());

        admin.setName(adminName);
        admin.setPassword(passwordEncoder.encode(adminPassword));
        admin.setRole(User.Role.ADMIN);
        admin.setStatus(User.UserStatus.APPROVED);

        userRepository.save(admin);
        log.info("Default admin account is ready: {}", normalizedAdminEmail);

        userRepository.findByRole(User.Role.ADMIN).forEach(existingAdmin -> {
            if (existingAdmin.getStatus() != User.UserStatus.APPROVED) {
                existingAdmin.setStatus(User.UserStatus.APPROVED);
                userRepository.save(existingAdmin);
                log.info("Auto-approved existing admin: {}", existingAdmin.getEmail());
            }
        });
    }
}
