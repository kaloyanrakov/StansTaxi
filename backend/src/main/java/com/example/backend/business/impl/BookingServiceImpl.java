package com.example.backend.business.impl;
import com.example.backend.business.BookingService;
import com.example.backend.domain.Booking;
import com.example.backend.domain.request.CreateBookingRequest;
import com.example.backend.persistence.entity.BookingEntity;
import com.example.backend.persistence.repository.BookingRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;
import com.example.backend.service.SmsService;


@Service
public class BookingServiceImpl implements BookingService{
    private final BookingRepository bookingRepository;
    private final SmsService smsService;
    public BookingServiceImpl(BookingRepository bookingRepository, SmsService smsService) {
        this.bookingRepository = bookingRepository;
        this.smsService = smsService;   
    }

    @Override
    public Booking createBooking(CreateBookingRequest request) {
        BookingEntity entity = new BookingEntity();
        entity.setPickUpLocation(request.getPickUpLocation());
        entity.setDropOffLocation(request.getDropOffLocation());
        entity.setPickupDate(LocalDate.parse(request.getPickupDate()));
        entity.setPickupTime(LocalTime.parse(request.getPickupTime()));
        entity.setPassengers(request.getPassengers());
        entity.setPets(request.isPets());
        entity.setPhoneNumber(request.getPhoneNumber());
        entity.setStatus("PENDING");
        entity.setBookingDate(LocalDate.now());


        BookingEntity saved = bookingRepository.save(entity);
        return mapToDomain(saved);
    }

    @Override
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll()
                .stream()
                .map(this::mapToDomain)
                .collect(Collectors.toList());
    }

    private Booking mapToDomain(BookingEntity entity) {
        Booking booking = new Booking();
        booking.setBookingId(entity.getBookingId());
        booking.setPickUpLocation(entity.getPickUpLocation());
        booking.setDropOffLocation(entity.getDropOffLocation());
        booking.setPickupDate(entity.getPickupDate());
        booking.setPickupTime(entity.getPickupTime());
        booking.setPassengers(entity.getPassengers());
        booking.setPets(entity.isPets());
        booking.setPhoneNumber(entity.getPhoneNumber());
        booking.setStatus(entity.getStatus());
        booking.setBookingDate(entity.getBookingDate());
        return booking;
    }
    @Override
    public Booking updateStatus(Long bookingId, String status) {
        BookingEntity entity = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        entity.setStatus(status);
        BookingEntity saved = bookingRepository.save(entity);

        // Send SMS based on status
        try {
            String body = switch (status.toUpperCase()) {
                case "ACCEPTED" -> "Your booking has been accepted! See you soon.";
                case "REJECTED", "DECLINED" -> "Sorry, your booking was declined.";
                default -> "Your booking status has been updated: " + status;
            };
            smsService.send(saved.getPhoneNumber(), body);
        } catch (Exception ex) {
            System.err.println("Failed to send SMS for booking " + bookingId + ": " + ex.getMessage());
        }

        return mapToDomain(saved);
    }

}
