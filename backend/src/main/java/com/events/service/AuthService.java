package com.events.service;

import com.events.config.UserDetailsServiceImpl;
import com.events.dto.request.LoginRequest;
import com.events.dto.request.RegisterRequest;
import com.events.dto.response.AuthResponse;
import com.events.exception.DuplicateResourceException;
import com.events.model.User;
import com.events.repository.UserRepository;
import com.events.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsServiceImpl userDetailsService;

    public AuthResponse register(RegisterRequest request) {
        String normalizedEmail = request.getEmail().toLowerCase().trim();

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new DuplicateResourceException("Email already in use: " + normalizedEmail);
        }

        User user = User.builder()
                .name(request.getName().trim())
                .email(normalizedEmail)
                .password(passwordEncoder.encode(request.getPassword()))
                .role(User.Role.USER)
                .build();

        User saved = userRepository.save(user);
        log.info("New user registered: {} ({})", saved.getEmail(), saved.getRole());

        // If an account was manually placed in PENDING, do not issue a token.
        if (saved.getStatus() == User.UserStatus.PENDING) {
            return AuthResponse.from(null, saved);
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(saved.getEmail());
        String token = jwtUtil.generateToken(userDetails);
        return AuthResponse.from(token, saved);
    }

    public AuthResponse login(LoginRequest request) {
        String normalizedEmail = request.getEmail().toLowerCase().trim();

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(normalizedEmail, request.getPassword())
        );

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getStatus() == User.UserStatus.PENDING) {
            throw new AccessDeniedException("Your account is pending approval. Please check back later.");
        }
        if (user.getStatus() == User.UserStatus.REJECTED) {
            throw new AccessDeniedException("Your account application has been rejected.");
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(userDetails);
        log.info("User logged in: {}", user.getEmail());
        return AuthResponse.from(token, user);

    }
}
