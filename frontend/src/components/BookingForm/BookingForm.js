import React, { useState, useEffect } from 'react';
import './BookingForm.css';
import { LoadScript, GoogleMap, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';


function BookingForm() {
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [passengers, setPassengers] = useState('1');
  const [directions, setDirections] = useState(null);
  const [boundsSet, setBoundsSet] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pets, setPets] = useState('no');

  const containerStyle = {
    width: '100%',
    height: '300px'
  };

  const center = { lat: 41.2853, lng: -70.0988 };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const booking = {
      pickUpLocation: pickupLocation,
      dropOffLocation: dropoffLocation,
      pickupDate: pickupDate,
      pickupTime: pickupTime,
      passengers: parseInt(passengers, 10),
      pets: pets === "yes",
      phoneNumber: phoneNumber
    };

    try {
      const response = await fetch("http://localhost:8080/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(booking)
      });

      if (response.ok) {
        const savedBooking = await response.json();
        alert(`Booking confirmed! ID: ${savedBooking.bookingId}`);
      } else {
        alert("Failed to create booking.");
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
      alert("Error submitting booking.");
    }
  };


  useEffect(() => {
    if (pickupLocation && dropoffLocation && window.google) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: pickupLocation + ', Nantucket, MA',
          destination: dropoffLocation + ', Nantucket, MA',
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === 'OK' && result) {
            setDirections(result);
            setBoundsSet(false);
          } else {
            console.error('Directions request failed: ', status);
          }
        }
      );
    }
  }, [pickupLocation, dropoffLocation]);


  return (
    <form className="booking-form" onSubmit={handleSubmit}>
      <h2 className="section-title">Book a ride</h2>
      <div className="form-map-container">
        <div className="form-inputs">
          <div className="input-row">
            <div className="location-input stacked-input">
              <label>Pick-Up Location:</label>
              <input
                type="text"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                placeholder="Enter pickup location"
              />
            </div>

            <div className="location-input stacked-input">
              <label>Drop-Off Location:</label>
              <input
                type="text"
                value={dropoffLocation}
                onChange={(e) => setDropoffLocation(e.target.value)}
                placeholder="Enter dropoff location"
              />
            </div>
          </div>

          <div className="input-row">
            <div className="datetime-input">
              <label>Pick-Up Date:</label>
              <input
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
              />
            </div>

            <div className="datetime-input">
              <label>Pick-Up Time:</label>
              <input
                type="time"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
              />
            </div>
          </div>

          <div className="passenger-input">
            <label>Number of Passengers:</label>
            <input
              type="number"
              min="1"
              max="10"
              value={passengers}
              onChange={(e) => setPassengers(e.target.value)}
            />
          </div>

          <div className="passenger-input">
            <label>Your Phone Number:</label>
            <input
              type="tel"
              inputMode="numeric"
              value={phoneNumber}
              maxLength={13}
              onChange={(e) => {
                setPhoneNumber(e.target.value)
                const onlyNums = e.target.value.replace(/[^0-9+]/g, "");
                setPhoneNumber(onlyNums);
              }}
              pattern="^\+?[0-9]{7,15}$"
              required
            />
          </div>

          <div className="pets-input">
            <label>Traveling with pets?</label>
            <label className={pets === 'yes' ? 'pets-option selected' : 'pets-option'}>
              <input
                type="radio"
                name="pets"
                value="yes"
                checked={pets === 'yes'}
                onChange={(e) => setPets(e.target.value)}
                style={{ display: 'none' }}
              />
              Yes
            </label>
            <label className={pets === 'no' ? 'pets-option selected' : 'pets-option'}>
              <input
                type="radio"
                name="pets"
                value="no"
                checked={pets === 'no'}
                onChange={(e) => setPets(e.target.value)}
                style={{ display: 'none' }}
              />
              No
            </label>
          </div>
        </div>
        <div className="map-wrapper">
          <LoadScript googleMapsApiKey="AIzaSyBaBMAyAMo3jlHuTyMHzVfvLQ6MsBaJU54">
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={10}
            >

              {directions && (
                <DirectionsRenderer
                  options={{
                    directions: directions,

                  }}
                  onLoad={(renderer) => {
                    if (!boundsSet) {
                      const bounds = renderer.getDirections().routes[0].bounds;
                      renderer.getMap().fitBounds(bounds);
                      setBoundsSet(true);
                    }
                  }}
                />
              )}


            </GoogleMap>
          </LoadScript>
          <button type="submit" className="submit-button">Book Now</button>
          <div className="map-wrapper">
          </div>
        </div>
      </div>
    </form>

  );
}
export default BookingForm;