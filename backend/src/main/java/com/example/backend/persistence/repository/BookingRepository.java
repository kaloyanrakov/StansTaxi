package com.example.backend.persistence.repository;

import com.example.backend.persistence.entity.BookingEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface BookingRepository extends JpaRepository<BookingEntity, Long> {
}
