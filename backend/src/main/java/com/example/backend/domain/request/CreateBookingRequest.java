package com.example.backend.domain.request;

import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.*;

@Data
@NoArgsConstructor
public class CreateBookingRequest {
    @NotBlank
    @Size(max = 100)
    private String pickUpLocation;

    @NotBlank
    @Size(max = 100)
    private String dropOffLocation; // parse later to LocalDate

    @NotBlank
    private String pickupDate; // parse later to LocalTime

    @NotBlank
    private String pickupTime;

    @Size(min = 1, max = 10)
    private int passengers;

    private boolean pets;

    @NotBlank
    @Pattern(regexp="^\\+?[0-9]{7,15}$")
    private String phoneNumber;
}
