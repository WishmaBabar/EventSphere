package com.events.controller;

import com.events.dto.response.ApiResponse;
import com.events.dto.response.RegistrationResponse;
import com.events.service.AttendanceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Attendance", description = "Attendance tracking (Admin only)")
public class AttendanceController {

    private final AttendanceService attendanceService;

    @PutMapping("/{registrationId}")
    @Operation(summary = "Mark a registration as attended")
    public ResponseEntity<ApiResponse<RegistrationResponse>> markAttended(
            @PathVariable Long registrationId) {
        RegistrationResponse response = attendanceService.markAttended(registrationId);
        return ResponseEntity.ok(ApiResponse.success(response, "Attendance marked successfully"));
    }

    @GetMapping("/event/{eventId}/attendees")
    @Operation(summary = "Get list of attendees for an event")
    public ResponseEntity<ApiResponse<List<RegistrationResponse>>> getAttendees(
            @PathVariable Long eventId) {
        List<RegistrationResponse> attendees = attendanceService.getAttendees(eventId);
        return ResponseEntity.ok(ApiResponse.success(attendees));
    }

    @GetMapping("/event/{eventId}/registrants")
    @Operation(summary = "Get all registrants for an event")
    public ResponseEntity<ApiResponse<List<RegistrationResponse>>> getAllRegistrants(
            @PathVariable Long eventId) {
        List<RegistrationResponse> registrants = attendanceService.getAllRegistrantsForEvent(eventId);
        return ResponseEntity.ok(ApiResponse.success(registrants));
    }
}
