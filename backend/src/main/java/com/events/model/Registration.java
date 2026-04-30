package com.events.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "registrations",
    uniqueConstraints = @UniqueConstraint(
        name = "uk_user_event",
        columnNames = {"user_id", "event_id"}
    ),
    indexes = {
        @Index(name = "idx_registration_user", columnList = "user_id"),
        @Index(name = "idx_registration_event", columnList = "event_id"),
        @Index(name = "idx_registration_status", columnList = "status")
    }
)
@EntityListeners(AuditingEntityListener.class)
public class Registration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "event_id", nullable = false)
    private Long eventId;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(nullable = false)
    private RegistrationStatus status = RegistrationStatus.REGISTERED;

    @CreatedDate
    @Column(updatable = false)
    private Instant registeredAt;

    @LastModifiedDate
    private Instant updatedAt;

    public enum RegistrationStatus {
        REGISTERED, CANCELLED, ATTENDED
    }
}
