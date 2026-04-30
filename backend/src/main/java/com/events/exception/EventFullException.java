package com.events.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
public class EventFullException extends RuntimeException {
    public EventFullException(String message) {
        super(message);
    }
}
