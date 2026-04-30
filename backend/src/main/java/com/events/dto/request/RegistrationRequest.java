package com.events.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RegistrationRequest {

    @NotNull(message = "Event ID is required")
    private Long eventId;
}
