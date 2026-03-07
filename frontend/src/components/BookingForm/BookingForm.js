import React, { useState, useEffect, useRef } from 'react';
import './BookingForm.css';
import { APIProvider, Map, useMapsLibrary, useMap } from '@vis.gl/react-google-maps';

function PlaceAutocompleteInput({ onPlaceSelect, placeholder }) {
  const inputRef = useRef(null);
  const placesLib = useMapsLibrary('places');

  useEffect(() => {
    if (!placesLib || !inputRef.current) return;

    const autocomplete = new placesLib.Autocomplete(inputRef.current, {
      componentRestrictions: { country: 'us' },
      fields: ['formatted_address']
    });

    const listener = autocomplete.addListener('place_changed', function () {
      const place = autocomplete.getPlace();
      if (place && place.formatted_address) {
        onPlaceSelect(place.formatted_address);
      }
    });

    return function () {
      if (window.google && window.google.maps && window.google.maps.event) {
        window.google.maps.event.removeListener(listener);
      }
    };
  }, [placesLib, onPlaceSelect]);

  return React.createElement('input', {
    ref: inputRef,
    type: 'text',
    placeholder: placeholder || 'Enter location',
  });
}

function DirectionsRendererInner({ directions }) {
  const routesLib = useMapsLibrary('routes');
  const map = useMap();

  useEffect(() => {
    if (!routesLib || !map || !directions) return;
    const renderer = new routesLib.DirectionsRenderer();
    renderer.setMap(map);
    renderer.setDirections(directions);
    return () => renderer.setMap(null);
  }, [routesLib, map, directions]);

  return null;
}

function BookingFormInner() {
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [passengers, setPassengers] = useState('1');
  const [directions, setDirections] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pets, setPets] = useState('no');

  const routesLib = useMapsLibrary('routes');

  const containerStyle = { width: '100%', height: '200px' };
  const center = { lat: 41.2853, lng: -70.0988 };

  const handleSubmit = async function (e) {
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(booking)
      });

      if (response.ok) {
        const savedBooking = await response.json();
        alert(`Booking confirmed! ID: ${savedBooking.bookingId}`);
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

  useEffect(function () {
    if (!routesLib || !pickupLocation || !dropoffLocation) return;

    const directionsService = new routesLib.DirectionsService();
    directionsService.route(
      {
        origin: pickupLocation + ', Nantucket, MA',
        destination: dropoffLocation + ', Nantucket, MA',
        travelMode: 'DRIVING',
      },
      function (result, status) {
        if (status === 'OK' && result) {
          setDirections(result);
        } else {
          console.error('Directions request failed: ', status);
        }
      }
    );
  }, [pickupLocation, dropoffLocation, routesLib]);

  return React.createElement(
    'form',
    { className: 'booking-form', onSubmit: handleSubmit },

    React.createElement('h2', { className: 'section-title' }, 'Book a Ride'),

    React.createElement(
      'div',
      { className: 'form-inputs' },

      React.createElement(
        'div',
        { className: 'input-row' },
        React.createElement(
          'div',
          { className: 'location-input' },
          React.createElement('label', null, 'Pick-Up Location:'),
          React.createElement(PlaceAutocompleteInput, {
            onPlaceSelect: setPickupLocation,
            placeholder: 'Enter pickup location'
          })
        ),
        React.createElement(
          'div',
          { className: 'location-input' },
          React.createElement('label', null, 'Drop-Off Location:'),
          React.createElement(PlaceAutocompleteInput, {
            onPlaceSelect: setDropoffLocation,
            placeholder: 'Enter dropoff location'
          })
        )
      ),

      React.createElement(
        'div',
        { className: 'input-row' },
        React.createElement(
          'div',
          { className: 'datetime-input' },
          React.createElement('label', null, 'Pick-Up Date:'),
          React.createElement('input', {
            type: 'date',
            value: pickupDate,
            onChange: function (e) { return setPickupDate(e.target.value); },
            required: true
          })
        ),
        React.createElement(
          'div',
          { className: 'datetime-input' },
          React.createElement('label', null, 'Pick-Up Time:'),
          React.createElement('input', {
            type: 'time',
            value: pickupTime,
            onChange: function (e) { return setPickupTime(e.target.value); },
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
          React.createElement('label', null, 'Number of Passengers:'),
          React.createElement(
            'div',
            { className: 'number-input-wrapper' },
            React.createElement('button', {
              type: 'button',
              className: 'number-btn decrement',
              onClick: function () {
                setPassengers(function (prev) {
                  return String(Math.max(1, parseInt(prev, 10) - 1));
                });
              },
              disabled: parseInt(passengers, 10) <= 1
            }, '−'),
            React.createElement('input', {
              type: 'number',
              min: '1',
              max: '10',
              value: passengers,
              onChange: function (e) { return setPassengers(e.target.value); },
              required: true
            }),
            React.createElement('button', {
              type: 'button',
              className: 'number-btn increment',
              onClick: function () {
                setPassengers(function (prev) {
                  return String(Math.min(10, parseInt(prev, 10) + 1));
                });
              },
              disabled: parseInt(passengers, 10) >= 10
            }, '+')
          )
        ),
        React.createElement(
          'div',
          { className: 'passenger-input' },
          React.createElement('label', null, 'Your Phone Number:'),
          React.createElement('input', {
            type: 'tel',
            value: phoneNumber,
            onChange: function (e) {
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
        React.createElement('label', null, 'Traveling with pets?'),
        React.createElement(
          'div',
          { className: 'pets-options' },
          React.createElement(
            'label',
            { className: pets === 'yes' ? 'pets-option selected' : 'pets-option' },
            React.createElement('input', {
              type: 'radio', name: 'pets', value: 'yes',
              checked: pets === 'yes',
              onChange: function (e) { return setPets(e.target.value); },
              style: { display: 'none' }
            }),
            'Yes'
          ),
          React.createElement(
            'label',
            { className: pets === 'no' ? 'pets-option selected' : 'pets-option' },
            React.createElement('input', {
              type: 'radio', name: 'pets', value: 'no',
              checked: pets === 'no',
              onChange: function (e) { return setPets(e.target.value); },
              style: { display: 'none' }
            }),
            'No'
          )
        )
      ),

      React.createElement(
        'small',
        { className: 'phone-note' },
        '* We use your phone number only to send SMS messages related to this booking.'
      )
    ),

    React.createElement(
      'div',
      { className: 'map-wrapper' },
      React.createElement(
        Map,
        { style: containerStyle, defaultCenter: center, defaultZoom: 12 },
        directions && React.createElement(DirectionsRendererInner, { directions: directions })
      )
    ),

    React.createElement(
      'button',
      { type: 'submit', className: 'submit-button' },
      'Book Now'
    )
  );
}

function BookingForm() {
  return React.createElement(
    APIProvider,
    { apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "" },
    React.createElement(BookingFormInner, null)
  );
}

export default BookingForm;