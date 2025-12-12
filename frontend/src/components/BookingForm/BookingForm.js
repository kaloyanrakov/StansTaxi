import React, { useState, useEffect } from 'react';
import './BookingForm.css';
import { LoadScript, GoogleMap, DirectionsRenderer } from '@react-google-maps/api';

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
    height: '200px'
  };

  const center = { lat: 41.2853, lng: -70.0988 };

  const handleSubmit = async function(e) {
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
        // Reset form
        setPickupLocation('');
        setDropoffLocation('');
        setPickupDate('');
        setPickupTime('');
        setPassengers('1');
        setPhoneNumber('');
        setPets('no');
        setDirections(null);
      } else {
        alert("Failed to create booking.");
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
      alert("Error submitting booking.");
    }
  };

  useEffect(function() {
    if (pickupLocation && dropoffLocation && window.google) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: pickupLocation + ', Nantucket, MA',
          destination: dropoffLocation + ', Nantucket, MA',
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        function(result, status) {
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

  return React.createElement(
    'form',
    {
      className: 'booking-form',
      onSubmit: handleSubmit
    },
    React.createElement(
      'h2',
      { className: 'section-title' },
      'Book a Ride'
    ),
    React.createElement(
      'div',
      { className: 'form-inputs' },
      React.createElement(
        'div',
        { className: 'input-row' },
        React.createElement(
          'div',
          { className: 'location-input' },
          React.createElement(
            'label',
            null,
            'Pick-Up Location:'
          ),
          React.createElement('input', {
            type: 'text',
            value: pickupLocation,
            onChange: function(e) { return setPickupLocation(e.target.value); },
            placeholder: 'Enter pickup location',
            required: true
          })
        ),
        React.createElement(
          'div',
          { className: 'location-input' },
          React.createElement(
            'label',
            null,
            'Drop-Off Location:'
          ),
          React.createElement('input', {
            type: 'text',
            value: dropoffLocation,
            onChange: function(e) { return setDropoffLocation(e.target.value); },
            placeholder: 'Enter dropoff location',
            required: true
          })
        )
      ),
      React.createElement(
        'div',
        { className: 'input-row' },
        React.createElement(
          'div',
          { className: 'datetime-input' },
          React.createElement(
            'label',
            null,
            'Pick-Up Date:'
          ),
          React.createElement('input', {
            type: 'date',
            value: pickupDate,
            onChange: function(e) { return setPickupDate(e.target.value); },
            required: true
          })
        ),
        React.createElement(
          'div',
          { className: 'datetime-input' },
          React.createElement(
            'label',
            null,
            'Pick-Up Time:'
          ),
          React.createElement('input', {
            type: 'time',
            value: pickupTime,
            onChange: function(e) { return setPickupTime(e.target.value); },
            required: true
          })
        )
      ),
      React.createElement(
        'div',
        { className: 'input-row' },
        React.createElement(
          'div',
          { className: 'passenger-input' },
          React.createElement(
            'label',
            null,
            'Number of Passengers:'
          ),
          React.createElement('input', {
            type: 'number',
            min: '1',
            max: '10',
            value: passengers,
            onChange: function(e) { return setPassengers(e.target.value); },
            required: true
          })
        ),
        React.createElement(
          'div',
          { className: 'passenger-input' },
          React.createElement(
            'label',
            null,
            'Your Phone Number:'
          ),
          React.createElement('input', {
            type: 'tel',
            value: phoneNumber,
            onChange: function(e) {
              const onlyNums = e.target.value.replace(/[^0-9+]/g, "");
              setPhoneNumber(onlyNums);
            },
            placeholder: '508-500-6565',
            pattern: '^\\+?[0-9]{7,15}$',
            required: true
          })
        )
      ),
      React.createElement(
        'div',
        { className: 'pets-input' },
        React.createElement(
          'label',
          null,
          'Traveling with pets?'
        ),
        React.createElement(
          'div',
          { className: 'pets-options' },
          React.createElement(
            'label',
            {
              className: pets === 'yes' ? 'pets-option selected' : 'pets-option'
            },
            React.createElement('input', {
              type: 'radio',
              name: 'pets',
              value: 'yes',
              checked: pets === 'yes',
              onChange: function(e) { return setPets(e.target.value); },
              style: { display: 'none' }
            }),
            'Yes'
          ),
          React.createElement(
            'label',
            {
              className: pets === 'no' ? 'pets-option selected' : 'pets-option'
            },
            React.createElement('input', {
              type: 'radio',
              name: 'pets',
              value: 'no',
              checked: pets === 'no',
              onChange: function(e) { return setPets(e.target.value); },
              style: { display: 'none' }
            }),
            'No'
          )
        )
      )
    ),
    React.createElement(
      'div',
      { className: 'map-wrapper' },
      React.createElement(
        LoadScript,
        {
          googleMapsApiKey: "xxxxxxxxxxxxxxxx"
        },
        React.createElement(
          GoogleMap,
          {
            mapContainerStyle: containerStyle,
            center: center,
            zoom: 12
          },
          directions && React.createElement(
            DirectionsRenderer,
            {
              options: { directions: directions },
              onLoad: function(renderer) {
                if (!boundsSet) {
                  const bounds = renderer.getDirections().routes[0].bounds;
                  renderer.getMap().fitBounds(bounds);
                  setBoundsSet(true);
                }
              }
            }
          )
        )
      )
    ),
    React.createElement(
      'button',
      {
        type: 'submit',
        className: 'submit-button'
      },
      'Book Now'
    )
  );
}

export default BookingForm;