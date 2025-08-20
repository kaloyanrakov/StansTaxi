import React from 'react';
import './PhoneNumber.css';

function PhoneNumber() {
  const phoneNumber = "508-500-6565";

  return (
    <div className="phone-container">
      <h2 className="section-title">Call Us:</h2>
      <p className="phone-number">{phoneNumber}</p>
    </div>
  );
}

export default PhoneNumber;
