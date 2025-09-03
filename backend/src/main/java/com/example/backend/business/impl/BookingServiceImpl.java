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

@Service
public class BookingServiceImpl implements BookingService{
    private final BookingRepository bookingRepository;

    public BookingServiceImpl(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
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
        return booking;
    }
}
