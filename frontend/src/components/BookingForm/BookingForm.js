import React, { useState, useEffect, useRef } from 'react';
import './BookingForm.css';
import { APIProvider, Map, useMapsLibrary, useMap } from '@vis.gl/react-google-maps';

const nantucketBounds = {
  north: 41.35,
  south: 41.22,
  east: -69.93,
  west: -70.20
};

function PlaceAutocompleteInput({ onPlaceSelect, placeholder }) {
  const containerRef = useRef(null);
  const autocompleteRef = useRef(null);
  const placesLib = useMapsLibrary('places');

  useEffect(() => {
    if (!placesLib || !containerRef.current) return;

    if (autocompleteRef.current) {
      autocompleteRef.current.remove();
    }

    const el = new placesLib.PlaceAutocompleteElement({
      locationRestriction: nantucketBounds,
      componentRestrictions: { country: 'us' }
    });

    el.style.width = '100%';
    containerRef.current.appendChild(el);
    autocompleteRef.current = el;

    el.addEventListener('gmp-select', function (event) {
      console.log('gmp-select fired', event);
      const place = event.placePrediction.toPlace();
      place.fetchFields({ fields: ['formattedAddress'] }).then(function () {
        console.log('Place selected:', place.formattedAddress);
        onPlaceSelect(place.formattedAddress);
      });
    });

    return function () {
      if (autocompleteRef.current) {
        autocompleteRef.current.remove();
        autocompleteRef.current = null;
      }
    };
  }, [placesLib, onPlaceSelect]);

  return React.createElement('div', { 
    ref: containerRef, 
    className: 'place-autocomplete-wrapper',
    style: { width: '100%' } 
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
  const [consentChecked, setConsentChecked] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

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

  const termsContent = [
    React.createElement('h3', { key: 't1', className: 'modal-section-title' }, '1. Acceptance of Terms'),
    React.createElement('p', { key: 't1p', className: 'modal-section-text' }, 'By using this application to request transportation, you agree to be bound by these Terms and Conditions. Our service acts as a communication platform connecting passengers with independent, Town-licensed taxi operators in Nantucket, Massachusetts.'),
    React.createElement('h3', { key: 't2', className: 'modal-section-title' }, '2. The \u201cRide Accepted\u201d Notification'),
    React.createElement('ul', { key: 't2ul', className: 'modal-section-list' },
      React.createElement('li', { key: 't2a' }, React.createElement('strong', null, 'Booking Confirmation:'), ' When a driver accepts your request, the app will send a \u201cRide Accepted\u201d email to your registered address. This email constitutes a confirmation of your scheduled pickup time and route.'),
      React.createElement('li', { key: 't2b' }, React.createElement('strong', null, 'No Live Tracking:'), ' This app does not provide live GPS arrival updates or push notifications. The email is the final confirmation.'),
      React.createElement('li', { key: 't2c' }, React.createElement('strong', null, 'Passenger Responsibility:'), ' You must be present at the designated pickup location at the specified time.')
    ),
    React.createElement('h3', { key: 't3', className: 'modal-section-title' }, '3. Nantucket Local Regulations'),
    React.createElement('ul', { key: 't3ul', className: 'modal-section-list' },
      React.createElement('li', { key: 't3a' }, React.createElement('strong', null, 'Wait Time Limits:'), ' Per Nantucket Town Code \u00a7 375-6, taxis are permitted to stop for a maximum of 10 minutes.'),
      React.createElement('li', { key: 't3b' }, React.createElement('strong', null, 'Airport Pickups:'), ' Pickups at Nantucket Memorial Airport (ACK) must occur in designated taxi lanes.'),
      React.createElement('li', { key: 't3c' }, React.createElement('strong', null, 'Fares:'), ' All fares are governed by the Nantucket Select Board rates.')
    ),
    React.createElement('h3', { key: 't4', className: 'modal-section-title' }, '4. Payments and Receipts'),
    React.createElement('ul', { key: 't4ul', className: 'modal-section-list' },
      React.createElement('li', { key: 't4a' }, React.createElement('strong', null, 'No In-App Payment:'), ' All fares must be paid directly to the driver via cash or their preferred method.'),
      React.createElement('li', { key: 't4b' }, React.createElement('strong', null, 'Physical Receipts:'), ' Per Town Code Chapter 367, you may request a written, physical receipt directly from your driver.')
    ),
    React.createElement('h3', { key: 't5', className: 'modal-section-title' }, '5. Transactional Communications & Privacy'),
    React.createElement('ul', { key: 't5ul', className: 'modal-section-list' },
      React.createElement('li', { key: 't5a' }, React.createElement('strong', null, 'Email Usage:'), ' Emails are collected solely for \u201cRide Accepted\u201d notifications.'),
      React.createElement('li', { key: 't5b' }, React.createElement('strong', null, 'No Marketing:'), ' Your email will not be used for marketing or third-party promotions.')
    ),
    React.createElement('h3', { key: 't6', className: 'modal-section-title' }, '6. Limitation of Liability'),
    React.createElement('p', { key: 't6p', className: 'modal-section-text' }, 'The company is not liable for missed flights or delays resulting from email delivery failures or driver cancellations.')
  ];

  const privacyContent = [
    React.createElement('h3', { key: 'p1', className: 'modal-section-title' }, '1. Data Collection and Purpose'),
    React.createElement('p', { key: 'p1p', className: 'modal-section-text' }, 'We collect your email address solely to send a one-time \u201cRide Accepted\u201d notification. We do not collect names, phone numbers, or geolocation.'),
    React.createElement('h3', { key: 'p2', className: 'modal-section-title' }, '2. Technical Security (Hashing)'),
    React.createElement('p', { key: 'p2p', className: 'modal-section-text' }, 'We do not store your email in plain text. All emails are immediately hashed using the bcrypt algorithm upon submission to ensure they are unreadable to unauthorized parties.'),
    React.createElement('h3', { key: 'p3', className: 'modal-section-title' }, '3. Data Retention and Deletion'),
    React.createElement('ul', { key: 'p3ul', className: 'modal-section-list' },
      React.createElement('li', { key: 'p3a' }, React.createElement('strong', null, 'Automatic Deletion:'), ' All hashed email records are permanently deleted from our active database exactly 30 days after your request.'),
      React.createElement('li', { key: 'p3b' }, React.createElement('strong', null, 'No Backups:'), ' We do not maintain long-term archives.')
    ),
    React.createElement('h3', { key: 'p4', className: 'modal-section-title' }, '4. No Third-Party Sharing'),
    React.createElement('ul', { key: 'p4ul', className: 'modal-section-list' },
      React.createElement('li', { key: 'p4a' }, React.createElement('strong', null, 'No Data Sales:'), ' We do not sell or trade user data.'),
      React.createElement('li', { key: 'p4b' }, React.createElement('strong', null, 'Driver Privacy:'), ' Your email is never shared with your driver.')
    ),
    React.createElement('h3', { key: 'p5', className: 'modal-section-title' }, '5. Compliance'),
    React.createElement('p', { key: 'p5p', className: 'modal-section-text' }, 'This policy complies with Massachusetts Data Security Law (201 CMR 17.00).')
  ];

  const consentRow = React.createElement(
    'div',
    { className: 'consent-row' },
    React.createElement('input', {
      type: 'checkbox',
      id: 'consent-checkbox',
      className: 'consent-checkbox',
      checked: consentChecked,
      onChange: function (e) { setConsentChecked(e.target.checked); }
    }),
    React.createElement(
      'label',
      { htmlFor: 'consent-checkbox', className: 'consent-label' },
      'I agree to the ',
      React.createElement('button', {
        type: 'button',
        className: 'consent-link',
        onClick: function () { setActiveModal('terms'); }
      }, 'Terms and Conditions'),
      ' and the ',
      React.createElement('button', {
        type: 'button',
        className: 'consent-link',
        onClick: function () { setActiveModal('privacy'); }
      }, 'Privacy Policy'),
      '.'
    )
  );

  const modal = activeModal ? React.createElement(
    'div',
    {
      className: 'modal-overlay',
      onClick: function (e) { if (e.target === e.currentTarget) setActiveModal(null); }
    },
    React.createElement(
      'div',
      { className: 'modal-container' },
      React.createElement(
        'div',
        { className: 'modal-header' },
        React.createElement('h2', { className: 'modal-title' }, activeModal === 'terms' ? 'Terms and Conditions' : 'Privacy Policy'),
        React.createElement('button', {
          type: 'button',
          className: 'modal-close',
          onClick: function () { setActiveModal(null); },
          'aria-label': 'Close'
        }, '\u00d7')
      ),
      React.createElement(
        'div',
        { className: 'modal-body' },
        ...(activeModal === 'terms' ? termsContent : privacyContent)
      )
    )
  ) : null;

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
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
          { className: 'passenger-input passenger-selector' },
          React.createElement('label', null, 'Number of Passengers:'),
          React.createElement(
            'div',
            { className: 'passenger-controls' },
            React.createElement(
              'button',
              {
                type: 'button',
                className: 'passenger-btn minus-btn',
                onClick: function () {
                  const newVal = Math.max(1, parseInt(passengers, 10) - 1);
                  setPassengers(String(newVal));
                },
                disabled: parseInt(passengers, 10) <= 1
              },
              '-'
            ),
            React.createElement('span', { className: 'passenger-count' }, passengers),
            React.createElement(
              'button',
              {
                type: 'button',
                className: 'passenger-btn plus-btn',
                onClick: function () {
                  const newVal = Math.min(7, parseInt(passengers, 10) + 1);
                  setPassengers(String(newVal));
                },
                disabled: parseInt(passengers, 10) >= 7
              },
              '+'
            )
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

    consentRow,

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
      { type: 'submit', className: 'submit-button', disabled: !consentChecked },
      'Book Now'
    )
    ),
    modal
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