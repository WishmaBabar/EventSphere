package com.events.repository;

import com.events.model.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface EventRepository extends JpaRepository<Event, Long>, JpaSpecificationExecutor<Event> {

    Page<Event> findByCategory(String category, Pageable pageable);

    Page<Event> findByDate(LocalDate date, Pageable pageable);

    Page<Event> findByCategoryAndDate(String category, LocalDate date, Pageable pageable);

    @Query("SELECT e FROM Event e WHERE e.registeredCount < e.capacity")
    Page<Event> findAllAvailable(Pageable pageable);

    Page<Event> findByTitleContainingIgnoreCase(String title, Pageable pageable);

    /**
     * Atomically increment registeredCount only if registeredCount < capacity.
     * Returns 1 if update succeeded, 0 if event is full.
     */
    @Modifying
    @Query("UPDATE Event e SET e.registeredCount = e.registeredCount + 1, e.version = e.version + 1 " +
           "WHERE e.id = :eventId AND e.registeredCount < e.capacity")
    int incrementRegisteredCount(@Param("eventId") Long eventId);

    /**
     * Atomically decrement registeredCount.
     */
    @Modifying
    @Query("UPDATE Event e SET e.registeredCount = e.registeredCount - 1, e.version = e.version + 1 " +
           "WHERE e.id = :eventId AND e.registeredCount > 0")
    int decrementRegisteredCount(@Param("eventId") Long eventId);
}
