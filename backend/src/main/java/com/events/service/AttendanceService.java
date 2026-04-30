package com.events.service;

import com.events.dto.response.RegistrationResponse;
import com.events.exception.ResourceNotFoundException;
import com.events.model.Event;
import com.events.model.Registration;
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
public class AttendanceService {

    private final RegistrationRepository registrationRepository;
    private final EventService eventService;
    private final UserRepository userRepository;

    @Transactional
    public RegistrationResponse markAttended(Long registrationId) {
        Registration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new ResourceNotFoundException("Registration", "id", registrationId));

        if (registration.getStatus() == Registration.RegistrationStatus.CANCELLED) {
            throw new IllegalStateException("Cancelled registrations cannot be marked as attended");
        }
        if (registration.getStatus() == Registration.RegistrationStatus.ATTENDED) {
            throw new IllegalStateException("Registration is already marked as attended");
        }

        registration.setStatus(Registration.RegistrationStatus.ATTENDED);
        Registration saved = registrationRepository.save(registration);
        log.info("Marked attendance for registration: {}", registrationId);

        Event event = eventService.findEventById(saved.getEventId());
        RegistrationResponse response = enrich(saved, event);
        return response;
    }

    @Transactional(readOnly = true)
    public List<RegistrationResponse> getAttendees(Long eventId) {
        eventService.findEventById(eventId); // validate event exists
        return registrationRepository.findByEventIdAndStatus(eventId, Registration.RegistrationStatus.ATTENDED)
                .stream()
                .map(reg -> enrich(reg, eventService.findEventById(eventId)))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RegistrationResponse> getAllRegistrantsForEvent(Long eventId) {
        eventService.findEventById(eventId);
        return registrationRepository.findByEventId(eventId)
                .stream()
                .map(reg -> {
                    Event event = eventService.findEventById(reg.getEventId());
                    return enrich(reg, event);
                })
                .collect(Collectors.toList());
    }

    private RegistrationResponse enrich(Registration registration, Event event) {
        RegistrationResponse response = RegistrationResponse.from(registration);
        response.setEventTitle(event.getTitle());
        response.setEventLocation(event.getLocation());
        response.setEventDate(event.getDate() != null ? event.getDate().toString() : null);
        response.setEventTime(event.getTime() != null ? event.getTime().toString() : null);
        userRepository.findById(registration.getUserId()).ifPresent(user -> {
            response.setUserName(user.getName());
            response.setUserEmail(user.getEmail());
        });
        return response;
    }
}
