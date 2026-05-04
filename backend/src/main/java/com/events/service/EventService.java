package com.events.service;

import com.events.dto.request.EventRequest;
import com.events.dto.response.EventResponse;
import com.events.dto.response.PagedResponse;
import com.events.exception.ResourceNotFoundException;
import com.events.model.Event;
import com.events.repository.EventRepository;
import com.events.repository.RegistrationRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DateTimeException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;
    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of("date", "title", "category", "capacity", "registeredCount");

    @Transactional
    public EventResponse createEvent(EventRequest request, String createdByEmail) {
        Event event = Event.builder()
                .title(request.getTitle().trim())
                .description(request.getDescription().trim())
                .date(request.getDate())
                .time(request.getTime())
                .location(request.getLocation().trim())
                .category(request.getCategory().trim())
                .capacity(request.getCapacity())
                .createdBy(createdByEmail)
                .build();

        Event saved = eventRepository.save(event);
        log.info("Event created: {} by {}", saved.getId(), createdByEmail);
        return EventResponse.from(saved);
    }

    @Transactional
    public EventResponse updateEvent(Long id, EventRequest request) {
        Event event = findEventById(id);
        if (request.getCapacity() < event.getRegisteredCount()) {
            throw new IllegalStateException("Capacity cannot be lower than current registrations");
        }
        event.setTitle(request.getTitle().trim());
        event.setDescription(request.getDescription().trim());
        event.setDate(request.getDate());
        event.setTime(request.getTime());
        event.setLocation(request.getLocation().trim());
        event.setCategory(request.getCategory().trim());
        event.setCapacity(request.getCapacity());
        Event updated = eventRepository.save(event);
        return EventResponse.from(updated);
    }

    @Transactional
    public void deleteEvent(Long id) {
        Event event = findEventById(id);
        registrationRepository.deleteByEventId(id);
        eventRepository.delete(event);
        log.info("Event deleted: {}", id);
    }

    @Transactional(readOnly = true)
    public EventResponse getEventById(Long id) {
        return EventResponse.from(findEventById(id));
    }

    @Transactional(readOnly = true)
    public PagedResponse<EventResponse> getEvents(
            String category,
            String date,
            Boolean available,
            String search,
            int page,
            int size,
            String sortBy,
            String sortDir
    ) {
        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), 50);
        String safeSortBy = ALLOWED_SORT_FIELDS.contains(sortBy) ? sortBy : "date";
        Sort sort = "desc".equalsIgnoreCase(sortDir)
                ? Sort.by(safeSortBy).descending()
                : Sort.by(safeSortBy).ascending();
        Pageable pageable = PageRequest.of(safePage, safeSize, sort);

        LocalDate parsedDate = null;
        if (date != null && !date.isBlank()) {
            try {
                parsedDate = LocalDate.parse(date);
            } catch (DateTimeException ex) {
                throw new IllegalArgumentException("Date filter must use yyyy-MM-dd format");
            }
        }

        LocalDate filterDate = parsedDate;

        // Build dynamic JPA Specification for flexible filtering
        Specification<Event> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (category != null && !category.isBlank()) {
                predicates.add(cb.equal(root.get("category"), category));
            }
            if (filterDate != null) {
                predicates.add(cb.equal(root.get("date"), filterDate));
            }
            if (Boolean.TRUE.equals(available)) {
                predicates.add(cb.lessThan(root.get("registeredCount"), root.get("capacity")));
                predicates.add(cb.greaterThanOrEqualTo(root.get("date"), LocalDate.now()));
            }
            if (search != null && !search.isBlank()) {
                String normalizedSearch = search.trim().toLowerCase();
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("title")), "%" + normalizedSearch + "%"),
                        cb.like(cb.lower(root.get("description")), "%" + normalizedSearch + "%"),
                        cb.like(cb.lower(root.get("location")), "%" + normalizedSearch + "%")
                ));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Event> pageResult = eventRepository.findAll(spec, pageable);
        List<EventResponse> responses = pageResult.getContent().stream().map(EventResponse::from).toList();

        return PagedResponse.<EventResponse>builder()
                .content(responses)
                .page(pageResult.getNumber())
                .size(pageResult.getSize())
                .totalElements(pageResult.getTotalElements())
                .totalPages(pageResult.getTotalPages())
                .last(pageResult.isLast())
                .build();
    }

    @Transactional(readOnly = true)
    public Event findEventById(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", id));
    }
}
