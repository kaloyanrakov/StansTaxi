import React, { useState, useEffect } from 'react';
import './maincomponent.css'; // Import the CSS file

function Main() {


 const partners = [
  { id: 1, name: "21 Broad", logoUrl: "/variables/images/21broad.png", websiteUrl: "" },
  { id: 2, name: "Veranda", logoUrl: "/variables/images/veranda.png", websiteUrl: "" },
  { id: 3, name: "The Veranda House", logoUrl: "/variables/images/verandahouse.png", websiteUrl: "" },
  { id: 4, name: "Luxury Hotel", logoUrl: "/variables/images/lh.png", websiteUrl: "" }
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
                <div className="logo-text">
                  <h1>STAN'S TAXI</h1>
                  <p>NANTUCKET</p>
                </div>
              </a>
            </div>

            <nav className="nav-sidebar">
              <ul>
                <li>
                  <a href="#">
                    <span className="icon">🏠</span> Home
                  </a>
                </li>
                <li>
                  <a href="#">
                    <span className="icon">ℹ️</span> About
                  </a>
                </li>
                <li>
                  <a href="#">
                    <span className="icon">📞</span> Contact
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
              <a href="#" className="btn-book">
                Book now
              </a>
            </div>

            <div className="hero-visual">
              <img src="/images/taxi.png" alt="Taxi" className="taxi-image" />
              <img
                src="/images/lighthouse.png"
                alt="Lighthouse"
                className="lighthouse-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-bar">
        <div className="container">
          <p>Call me:</p>
          <a href="tel:508-500-6565" className="phone-number">
            508-500-6565
          </a>
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
          <h3>Preferred partner of:</h3>

          <div className="carousel-container">
            <button className="carousel-button prev" onClick={prevPartner}>
              &#8249;
            </button>

            <div className="carousel">
              <div
                className="carousel-inner"
                style={{ transform: `translateX(-${currentPartnerIndex * 100}%)` }}
              >
                {partners.map((partner) => (
                  <div key={partner.id} className="carousel-item">
                    <a href={partner.websiteUrl} target="_blank" rel="noopener noreferrer">
                      <img
                        src={partner.logoUrl}
                        alt={partner.name}
                        className="partner-logo"
                        onError={(e) => {
                          e.currentTarget.src = "/images/placeholder.png";
                          e.currentTarget.alt = `${partner.name} logo`;
                        }}
                      />
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <button className="carousel-button next" onClick={nextPartner}>
              &#8250;
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
}

export default Main;
