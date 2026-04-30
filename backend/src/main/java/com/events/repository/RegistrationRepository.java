package com.events.repository;

import com.events.model.Registration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, Long> {

    Optional<Registration> findByUserIdAndEventId(Long userId, Long eventId);

    boolean existsByUserIdAndEventId(Long userId, Long eventId);

    List<Registration> findByUserId(Long userId);

    List<Registration> findByEventId(Long eventId);

    List<Registration> findByEventIdAndStatus(Long eventId, Registration.RegistrationStatus status);

    List<Registration> findByUserIdAndStatus(Long userId, Registration.RegistrationStatus status);

    long countByEventIdAndStatus(Long eventId, Registration.RegistrationStatus status);

    void deleteByEventId(Long eventId);
}
