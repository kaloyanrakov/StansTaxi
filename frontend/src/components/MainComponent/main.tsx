import React from 'react';
import './StansTaxi.css';

const StansTaxi: React.FC = () => {
  return (
    <div className="stans-taxi">
      {/* Header Section */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <div className="logo-emblem">
                <div className="seagull">✈</div>
                <div className="logo-text">
                  <h1>STAN'S TAXI</h1>
                  <p>NANTUCKET</p>
                </div>
              </div>
            </div>
            
            <nav className="nav-sidebar">
              <ul>
                <li><a href="#"><span className="icon">🏠</span> Home</a></li>
                <li><a href="#"><span className="icon">ℹ️</span> About</a></li>
                <li><a href="#"><span className="icon">📞</span> Contact</a></li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h2>Reliable Transportation<br/>in Nantucket</h2>
              <a href="#" className="btn-book">Book now</a>
            </div>
            
            <div className="hero-visual">
              <div className="taxi-illustration">
                <div className="taxi-body">
                  <div className="taxi-stripe"></div>
                  <div className="taxi-window"></div>
                </div>
              </div>
              <div className="lighthouse-illustration">
                <div className="lighthouse-body">
                  <div className="lighthouse-light"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-bar">
        <div className="container">
          <p>Call me:</p>
          <a href="tel:508-500-6565" className="phone-number">508-500-6565</a>
        </div>
      </section>

      {/* Divider */}
      <section className="divider">
        <div className="container">
          <div className="divider-bars">
            <div className="divider-bar"></div>
            <div className="divider-bar"></div>
            <div className="divider-bar"></div>
            <div className="divider-bar"></div>
            <div className="divider-bar"></div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="partners">
        <div className="container">
          <h3>Preferred partner of:</h3>
          <div className="partner-logos">
            <div className="partner-logo logo-1">21 BROAD</div>
            <div className="partner-logo logo-2">Veranda</div>
            <div className="partner-logo logo-3">THE VERANDA HOUSE</div>
            <div className="partner-logo logo-4">LH</div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about">
        <div className="container">
          <div className="about-content">
            <div className="about-title">
              <h3>About Us:</h3>
            </div>
            
            <div className="about-placeholder">
              <div className="placeholder-line short"></div>
              <div className="placeholder-line medium"></div>
              <div className="placeholder-line long"></div>
              <div className="placeholder-line short"></div>
            </div>
            
            <div className="profile-icon">
              <div className="profile-circle">
                <span className="profile-silhouette">👤</span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default StansTaxi;