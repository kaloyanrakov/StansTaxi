import React, { useState } from 'react';
import './BookingForm.css';

function BookingForm() {
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [passengers, setPassengers] = useState('1');
  const [pets, setPets] = useState('no');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Booking submitted!\nFrom: ${pickupLocation}\nTo: ${dropoffLocation}\nDate: ${pickupDate}\nTime: ${pickupTime}\nPassengers: ${passengers}\nPets: ${pets}`);
  };

  return (
    <form className="booking-form" onSubmit={handleSubmit}>
      <h2 className="section-title">Book a ride</h2>
      
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
      
      <button type="submit" className="submit-button">Book Now</button>
    </form>
  );
}

export default BookingForm;