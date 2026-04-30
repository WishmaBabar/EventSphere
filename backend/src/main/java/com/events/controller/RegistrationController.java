package com.events.controller;

import com.events.dto.request.RegistrationRequest;
import com.events.dto.response.ApiResponse;
import com.events.dto.response.RegistrationResponse;
import com.events.service.RegistrationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/registrations")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Registrations", description = "Event registration and cancellation")
public class RegistrationController {

    private final RegistrationService registrationService;

    @PostMapping
    @Operation(summary = "Register for an event")
    public ResponseEntity<ApiResponse<RegistrationResponse>> register(
            @Valid @RequestBody RegistrationRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        RegistrationResponse response = registrationService.registerForEvent(
                request.getEventId(), userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Successfully registered for the event"));
    }

    @GetMapping("/my")
    @Operation(summary = "Get my registrations")
    public ResponseEntity<ApiResponse<List<RegistrationResponse>>> getMyRegistrations(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<RegistrationResponse> registrations = registrationService.getMyRegistrations(
                userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(registrations));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Cancel a registration")
    public ResponseEntity<ApiResponse<Void>> cancelRegistration(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        registrationService.cancelRegistration(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(null, "Registration cancelled successfully"));
    }
}
