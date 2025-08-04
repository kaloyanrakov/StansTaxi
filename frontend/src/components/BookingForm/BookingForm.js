import React, { useState } from 'react';
import './BookingForm.css';

function BookingForm() {
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [passengers, setPassengers] = useState('1');
  const [pets, setPets] = useState('no');

  return (
    <form className="booking-form">
      <label className="section-title">Book a ride:</label>
      <div className="stacked-input">
        <label>Pick-Up Location:</label>
        <input
          type="text"
          value={pickupLocation}
          onChange={(e) => setPickupLocation(e.target.value)}
        />
      </div>
      <div className="stacked-input">
        <label>Drop-Off Location:</label>
        <input
          type="text"
          value={dropoffLocation}
          onChange={(e) => setDropoffLocation(e.target.value)}
        />
      </div>
      <div className="small-input">
        <label>Pick-Up Date:</label>
        <input
          type="date"
          value={pickupDate}
          onChange={(e) => setPickupDate(e.target.value)}
        />
      </div>
      <div className="small-input">
        <label>Pick-Up Time:</label>
        <input
          type="time"
          value={pickupTime}
          onChange={(e) => setPickupTime(e.target.value)}
        />
      </div>
      <div className="passenger-input">
        <label>Number of Passengers:</label>
        <input
          type="number"
          min="1"
          value={passengers}
          onChange={(e) => setPassengers(e.target.value)}
          style={{ width: '30px' }}
        />
      </div>
      <div className='pets-input'>
        <label>Pets:</label>
        <label className={pets === 'yes' ? 'pets-option selected' : 'pets-option'}>
          <input
            type="checkbox"
            name="pets"
            value="yes"
            checked={pets === 'yes'}
            onChange={(e) => setPets(e.target.value)}
          />
          Yes
        </label>
        <label className={pets === 'no' ? 'pets-option selected' : 'pets-option'}>
          <input
            type="checkbox"
            name="pets"
            value="no"
            checked={pets === 'no'}
            onChange={(e) => setPets(e.target.value)}
          />
          No
        </label>
      </div>
      <button type="submit" className="submit-button">Book Now</button>
    </form>
  );
}

export default BookingForm;