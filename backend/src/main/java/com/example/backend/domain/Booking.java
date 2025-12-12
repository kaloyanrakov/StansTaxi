package com.example.backend.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.Id;

import java.time.LocalDate;
import java.time.LocalTime;


@Data
@NoArgsConstructor
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookingId;

    private String pickUpLocation;
    private String dropOffLocation;
    private LocalDate pickupDate;
    private LocalTime pickupTime;
    private int passengers;
    private boolean pets;
    private String phoneNumber;
    private String status = "PENDING";
    private LocalDate bookingDate;
}
