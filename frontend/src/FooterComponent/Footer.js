import React from 'react';
import './FooterStyles.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="road-divider footer-road" />

      <div className="footer-inner">

        {/* Brand */}
        <div className="footer-brand">
          <img src="/variables/images/Logo.png" alt="Stan's Taxi" className="footer-logo" />
        </div>

        {/* Divider */}
        <div className="footer-vline" />

        {/* Contact */}
        <div className="footer-col">
          <h4 className="footer-heading">Contact Us</h4>
          <ul className="footer-list">
            <li><i className="fas fa-fw fa-phone-alt" /><a href="tel:5085006565">508-500-6565</a></li>
            <li><i className="fas fa-fw fa-envelope" /><a href="mailto:ack@stanstaxinantucket.com">ack@stanstaxinantucket.com</a></li>
            <li><i className="fas fa-fw fa-map-marker-alt" /><span>Nantucket, MA</span></li>
          </ul>
        </div>

        {/* Divider */}
        <div className="footer-vline" />

        {/* Hours */}
        <div className="footer-col">
          <h4 className="footer-heading">Service Hours</h4>
          <ul className="footer-list">
            <li><i className="fas fa-fw fa-circle footer-live" /><span>Always Open</span></li>
            <li><i className="fas fa-fw fa-plane-arrival" /><span>Airport &amp; island-wide pickups</span></li>
          </ul>
        </div>

      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <span>&copy; {new Date().getFullYear()} Stan's Taxi Nantucket. All rights reserved.</span>
        <span className="footer-badge"><i className="fas fa-shield-alt" /> Trusted Island Service</span>
      </div>
    </footer>
  );
}

export default Footer;