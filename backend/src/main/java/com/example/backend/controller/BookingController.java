package com.example.backend.controller;

import com.example.backend.business.BookingService;
import com.example.backend.domain.Booking;
import com.example.backend.domain.request.CreateBookingRequest;
import com.example.backend.service.SettingsService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/bookings")
public class BookingController {
    private final BookingService bookingService;
    private final SettingsService settingsService;

    public BookingController(BookingService bookingService, SettingsService settingsService) {
        this.bookingService = bookingService;
        this.settingsService = settingsService;
    }

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody CreateBookingRequest request) {
        if (!settingsService.isBookingsEnabled()) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body("Online bookings are currently disabled.");
        }
        Booking booking = bookingService.createBooking(request);
        return ResponseEntity.ok(booking);
    }

    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {
        List<Booking> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(bookings);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Booking> updateStatus(
        @PathVariable Long id,
        @RequestParam String status
    ) {
        Booking updatedBooking = bookingService.updateStatus(id, status);
        return ResponseEntity.ok(updatedBooking);
    }
}