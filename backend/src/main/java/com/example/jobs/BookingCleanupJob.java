package com.example.backend.jobs;

import com.example.backend.persistence.repository.BookingRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class BookingCleanupJob {

    private static final Logger log = LoggerFactory.getLogger(BookingCleanupJob.class);
    private final BookingRepository bookingRepository;

    public BookingCleanupJob(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    // Runs once per day at 02:15 local server time
    @Scheduled(cron = "0 15 2 * * *")
    public void deleteOldBookings() {
        LocalDate cutoff = LocalDate.now().minusDays(30);
        long deleted = bookingRepository.deleteByBookingDateBefore(cutoff);
        if (deleted > 0) {
            log.info("Booking cleanup: deleted {} bookings older than {}", deleted, cutoff);
        } else {
            log.debug("Booking cleanup: no bookings older than {} to delete", cutoff);
        }
    }
}