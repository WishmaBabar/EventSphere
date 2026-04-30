package com.events.dto.response;

import com.events.model.Event;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventResponse {

    private Long id;
    private String title;
    private String description;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime time;

    private String location;
    private String category;
    private int capacity;
    private int registeredCount;
    private int availableSpots;
    private boolean available;
    private String createdBy;
    private Instant createdAt;
    private Instant updatedAt;

    public static EventResponse from(Event event) {
        int available = event.getCapacity() - event.getRegisteredCount();
        return EventResponse.builder()
                .id(event.getId())
                .title(event.getTitle())
                .description(event.getDescription())
                .date(event.getDate())
                .time(event.getTime())
                .location(event.getLocation())
                .category(event.getCategory())
                .capacity(event.getCapacity())
                .registeredCount(event.getRegisteredCount())
                .availableSpots(Math.max(0, available))
                .available(available > 0)
                .createdBy(event.getCreatedBy())
                .createdAt(event.getCreatedAt())
                .updatedAt(event.getUpdatedAt())
                .build();
    }
}
