import React, { useState, useEffect } from 'react';
import './maincomponent.css'; 

function Main() {
  const partners = [
    { id: 1, name: "21 Broad", logoUrl: "/images/partners/21broad.png", websiteUrl: "#" },
    { id: 2, name: "Veranda", logoUrl: "/images/partners/veranda.png", websiteUrl: "#" },
    { id: 3, name: "The Veranda House", logoUrl: "/images/partners/verandahouse.png", websiteUrl: "#" },
    { id: 4, name: "Luxury Hotel", logoUrl: "/images/partners/lh.png", websiteUrl: "#" }
  ];
  
  // State for carousel
  const [currentPartnerIndex, setCurrentPartnerIndex] = useState(0);

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPartnerIndex((prevIndex) =>
        prevIndex === partners.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [partners.length]);

  const nextPartner = () => {
    setCurrentPartnerIndex((prevIndex) =>
      prevIndex === partners.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevPartner = () => {
    setCurrentPartnerIndex((prevIndex) =>
      prevIndex === 0 ? partners.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="stans-taxi">
      {/* Header Section */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <a href="/">
                <img
                  src="/images/logo.png"
                  alt="Stan's Taxi Logo"
                  className="logo-image"
                />
              </a>
            </div>

            <nav className="nav-main">
              <ul>
                <li>
                  <a href="#">
                    <i className="fas fa-home"></i> Home
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="fas fa-info-circle"></i> About
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="fas fa-phone"></i> Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="nav-booking-btn">
                    <i className="fas fa-car"></i> Book Ride
                  </a>
                </li>
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
              <h2>
                Reliable Transportation
                <br />
                in Nantucket
              </h2>
              <p className="hero-subtitle">Premium taxi service for island residents and visitors</p>
              <a href="#" className="btn-book">
                Book now
              </a>
            </div>

            <div className="hero-visual">
              <div className="taxi-illustration">
                <div className="taxi-window"></div>
                <div className="taxi-stripe"></div>
                <div className="taxi-wheels"></div>
              </div>
              <div className="lighthouse-illustration">
                <div className="lighthouse-light"></div>
                <div className="lighthouse-stripe"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-bar">
        <div className="container">
          <div className="cta-content">
            <div className="cta-text">
              <p>Ready to ride? Call us directly:</p>
            </div>
            <a href="tel:508-500-6565" className="phone-number">
              <i className="fas fa-phone"></i> 508-500-6565
            </a>
          </div>
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

      {/* Partners Section with Carousel */}
      <section className="partners">
        <div className="container">
          <div className="section-header">
            <h3>Preferred partner of:</h3>
            <p>We're proud to partner with these premium establishments</p>
          </div>

          <div className="carousel-container">
            <button className="carousel-button prev" onClick={prevPartner}>
              <i className="fas fa-chevron-left"></i>
            </button>

            <div className="carousel">
              <div
                className="carousel-inner"
                style={{ transform: `translateX(-${currentPartnerIndex * 100}%)` }}
              >
                {partners.map((partner) => (
                  <div key={partner.id} className="carousel-item">
                    <a href={partner.websiteUrl} target="_blank" rel="noopener noreferrer">
                      <div className="partner-logo-container">
                        <img
                          src={partner.logoUrl}
                          alt={partner.name}
                          className="partner-logo"
                          onError={(e) => {
                            e.currentTarget.src = "/images/placeholder.png";
                            e.currentTarget.alt = `${partner.name} logo`;
                          }}
                        />
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <button className="carousel-button next" onClick={nextPartner}>
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>

          <div className="carousel-indicators">
            {partners.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentPartnerIndex ? 'active' : ''}`}
                onClick={() => setCurrentPartnerIndex(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about">
        <div className="container">
          <div className="section-header">
            <h3>About Our Service</h3>
            <p>Discover what makes Stan's Taxi the preferred choice in Nantucket</p>
          </div>
          
          <div className="about-content">
            <div className="about-features">
              <div className="feature">
                <div className="feature-icon">
                  <i className="fas fa-clock"></i>
                </div>
                <h4>24/7 Availability</h4>
                <p>We're available round the clock for all your transportation needs</p>
              </div>
              
              <div className="feature">
                <div className="feature-icon">
                  <i className="fas fa-shield-alt"></i>
                </div>
                <h4>Safe & Reliable</h4>
                <p>Our professional drivers prioritize your safety and comfort</p>
              </div>
              
              <div className="feature">
                <div className="feature-icon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <h4>Island-Wide Service</h4>
                <p>We cover all of Nantucket, from the airport to remote beaches</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <img src="/images/logo.png" alt="Stan's Taxi" />
              <p>Your reliable transportation solution in Nantucket</p>
            </div>
            
            <div className="footer-contact">
              <h4>Contact Us</h4>
              <p><i className="fas fa-phone"></i> 508-500-6565</p>
              <p><i className="fas fa-envelope"></i> info@stanstaxi.com</p>
            </div>
            
            <div className="footer-hours">
              <h4>Service Hours</h4>
              <p>24/7, 365 days a year</p>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2023 Stan's Taxi Nantucket. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Main;