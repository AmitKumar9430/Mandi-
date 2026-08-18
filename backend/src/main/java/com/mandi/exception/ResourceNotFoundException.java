package com.mandi.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
    public ResourceNotFoundException(String entity, Object id) {
        super(String.format("%s not found with identifier: %s", entity, id));
    }
}
