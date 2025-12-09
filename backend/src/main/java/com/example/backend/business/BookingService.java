package com.example.backend.business;
import java.util.List;
import com.example.backend.domain.Booking;
import com.example.backend.domain.request.CreateBookingRequest;

public interface BookingService {
    Booking createBooking(CreateBookingRequest request);
    List<Booking> getAllBookings();
    Booking updateStatus(Long bookingId, String status);
}
