package com.events.controller;

import com.events.dto.response.ApiResponse;
import com.events.dto.response.UserResponse;
import com.events.model.User;
import com.events.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Admin User Management", description = "Endpoints for managing user accounts and approvals")
public class AdminUserController {

    private final UserRepository userRepository;

    @GetMapping("/pending")
    @Operation(summary = "Get all users pending approval")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getPendingUsers() {
        List<UserResponse> pending = userRepository.findByStatus(User.UserStatus.PENDING).stream()
                .map(UserResponse::from)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(pending));
    }

    @PutMapping("/{id}/approve")
    @Operation(summary = "Approve a user registration")
    public ResponseEntity<ApiResponse<UserResponse>> approveUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setStatus(User.UserStatus.APPROVED);
        User saved = userRepository.save(user);
        return ResponseEntity.ok(ApiResponse.success(UserResponse.from(saved), "User approved successfully"));
    }

    @PutMapping("/{id}/reject")
    @Operation(summary = "Reject a user registration")
    public ResponseEntity<ApiResponse<UserResponse>> rejectUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setStatus(User.UserStatus.REJECTED);
        User saved = userRepository.save(user);
        return ResponseEntity.ok(ApiResponse.success(UserResponse.from(saved), "User rejected successfully"));
    }

    @GetMapping
    @Operation(summary = "Get all users (Audit view)")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        List<UserResponse> users = userRepository.findAll().stream()
                .map(UserResponse::from)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(users));
    }
}
