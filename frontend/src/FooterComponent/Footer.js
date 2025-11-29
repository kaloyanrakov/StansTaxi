import React from 'react';
import './FooterStyles.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            <img src="/variables/images/Logo.png" alt="Stan's Taxi" />
            <p>Your reliable transportation solution in Nantucket</p>
          </div>
          
          <div className="footer-contact">
            <h4>Contact Us</h4>
            <p><i className="fas fa-phone"></i> 508-500-6565</p>
            <p><i className="fas fa-envelope"></i> ack@stanstaxinantucket.com</p>
          </div>
          
          <div className="footer-hours">
            <h4>Service Hours</h4>
            <p>23/7, 365 days a year</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2023 Stan's Taxi Nantucket. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;