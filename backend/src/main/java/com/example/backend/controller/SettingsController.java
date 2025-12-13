package com.example.backend.controller;

import com.example.backend.service.SettingsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/settings")
public class SettingsController {
    private final SettingsService settings;

    public SettingsController(SettingsService settings) {
        this.settings = settings;
    }

    @GetMapping("/bookings-enabled")
    public ResponseEntity<Map<String, Boolean>> getBookingsEnabled() {
        return ResponseEntity.ok(Map.of("bookingsEnabled", settings.isBookingsEnabled()));
    }

    @PatchMapping("/bookings-enabled")
    public ResponseEntity<Map<String, Boolean>> setBookingsEnabled(@RequestParam boolean enabled) {
        boolean value = settings.setBookingsEnabled(enabled);
        return ResponseEntity.ok(Map.of("bookingsEnabled", value));
    }
}