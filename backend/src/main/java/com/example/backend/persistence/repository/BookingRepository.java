package com.example.backend.persistence.repository;

import com.example.backend.persistence.entity.BookingEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate; 
@Repository
public interface BookingRepository extends JpaRepository<BookingEntity, Long> {
    @Transactional
    long deleteByBookingDateBefore(LocalDate cutoff);
}
