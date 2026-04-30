package com.events.service;

import com.events.dto.response.RegistrationResponse;
import com.events.exception.DuplicateResourceException;
import com.events.exception.EventFullException;
import com.events.exception.ResourceNotFoundException;
import com.events.model.Event;
import com.events.model.Registration;
import com.events.model.User;
import com.events.repository.EventRepository;
import com.events.repository.RegistrationRepository;
import com.events.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final EventService eventService;

    /**
     * Registers a user for an event.
     * Uses @Transactional and atomic SQL UPDATE with WHERE clause to prevent overbooking
     * without race conditions, matching the JPA/MySQL approach required by the proposal.
     */
    @Transactional
    public RegistrationResponse registerForEvent(Long eventId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        // Validate event exists
        eventService.findEventById(eventId);

        // Check for duplicate registration
        if (registrationRepository.existsByUserIdAndEventId(user.getId(), eventId)) {
            Registration existing = registrationRepository
                    .findByUserIdAndEventId(user.getId(), eventId).get();
            if (existing.getStatus() == Registration.RegistrationStatus.CANCELLED) {
                // Allow re-registration after cancellation
                int updated = eventRepository.incrementRegisteredCount(eventId);
                if (updated == 0) {
                    throw new EventFullException("This event is fully booked. No spots available.");
                }

                existing.setStatus(Registration.RegistrationStatus.REGISTERED);
                Registration saved = registrationRepository.save(existing);
                // Refresh event data
                Event refreshedEvent = eventService.findEventById(eventId);
                return enrichResponse(RegistrationResponse.from(saved), refreshedEvent);
            }
            throw new DuplicateResourceException("You are already registered for this event");
        }

        // Atomic overbooking prevention:
        // Only increment registeredCount if registeredCount < capacity
        int updated = eventRepository.incrementRegisteredCount(eventId);
        if (updated == 0) {
            throw new EventFullException("This event is fully booked. No spots available.");
        }

        Registration registration = Registration.builder()
                .userId(user.getId())
                .eventId(eventId)
                .status(Registration.RegistrationStatus.REGISTERED)
                .build();

        Registration saved = registrationRepository.save(registration);
        log.info("User {} registered for event {}", userEmail, eventId);
        // Refresh event data
        Event refreshedEvent = eventService.findEventById(eventId);
        return enrichResponse(RegistrationResponse.from(saved), refreshedEvent);
    }

    @Transactional
    public void cancelRegistration(Long registrationId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        Registration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new ResourceNotFoundException("Registration", "id", registrationId));

        if (!registration.getUserId().equals(user.getId())) {
            throw new org.springframework.security.access.AccessDeniedException("You can only cancel your own registrations");
        }

        if (registration.getStatus() == Registration.RegistrationStatus.CANCELLED) {
            throw new IllegalStateException("Registration is already cancelled");
        }
        if (registration.getStatus() == Registration.RegistrationStatus.ATTENDED) {
            throw new IllegalStateException("Attended registrations cannot be cancelled");
        }

        registration.setStatus(Registration.RegistrationStatus.CANCELLED);
        registrationRepository.save(registration);

        // Decrement registeredCount atomically
        eventRepository.decrementRegisteredCount(registration.getEventId());

        log.info("User {} cancelled registration {}", userEmail, registrationId);
    }

    @Transactional(readOnly = true)
    public List<RegistrationResponse> getMyRegistrations(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        return registrationRepository.findByUserId(user.getId()).stream()
                .map(reg -> {
                    try {
                        Event event = eventService.findEventById(reg.getEventId());
                        return enrichResponse(RegistrationResponse.from(reg), event);
                    } catch (ResourceNotFoundException e) {
                        return RegistrationResponse.from(reg);
                    }
                })
                .collect(Collectors.toList());
    }

    private RegistrationResponse enrichResponse(RegistrationResponse response, Event event) {
        response.setEventTitle(event.getTitle());
        response.setEventLocation(event.getLocation());
        response.setEventDate(event.getDate() != null ? event.getDate().toString() : null);
        response.setEventTime(event.getTime() != null ? event.getTime().toString() : null);

        userRepository.findById(response.getUserId()).ifPresent(u -> {
            response.setUserName(u.getName());
            response.setUserEmail(u.getEmail());
        });

        return response;
    }

}
