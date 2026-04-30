package com.events.dto.response;

import com.events.model.Registration;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationResponse {

    private Long id;
    private Long userId;
    private Long eventId;
    private String status;
    private Instant registeredAt;
    private Instant updatedAt;

    // Enriched fields from event
    private String eventTitle;
    private String eventLocation;
    private String eventDate;
    private String eventTime;
    private String userName;
    private String userEmail;


    public static RegistrationResponse from(Registration reg) {
        return RegistrationResponse.builder()
                .id(reg.getId())
                .userId(reg.getUserId())
                .eventId(reg.getEventId())
                .status(reg.getStatus().name())
                .registeredAt(reg.getRegisteredAt())
                .updatedAt(reg.getUpdatedAt())
                .build();
    }
}
