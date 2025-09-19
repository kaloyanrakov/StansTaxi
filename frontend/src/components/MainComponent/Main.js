import React, { useState, useEffect, useRef } from 'react';
import './maincomponent.css';

function Main() {
  const partners = [
    { id: 1, name: "21 Broad", logoUrl: "/variables/images/21-Broad-Nantucket-Logo.png", websiteUrl: "#" },
    { id: 2, name: "76 Main", logoUrl: "/variables/images/76-main-ink-press-hotel-logo-resized.png", websiteUrl: "#" },
    { id: 3, name: "Galley Beach", logoUrl: "/variables/images/Galley-Beach.png", websiteUrl: "#" },
    { id: 4, name: "Nantucket Resort", logoUrl: "/variables/images/nantucketresortcollection.png", websiteUrl: "#" },
    { id: 5, name: "Veranda House", logoUrl: "/variables/images/veranda_house_logo_color.png", websiteUrl: "#" }
  ];
  
  // State for carousel
  const [currentPartnerIndex, setCurrentPartnerIndex] = useState(2); // Start with center position
  const [isHovered, setIsHovered] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const sectionRefs = {
    home: useRef(null),
    about: useRef(null),
    contact: useRef(null),
    partners: useRef(null)
  };

  // Auto-rotate carousel (pauses when hovered)
  useEffect(() => {
    if (isHovered) return;
    
    const interval = setInterval(() => {
      setCurrentPartnerIndex((prevIndex) =>
        prevIndex === partners.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [partners.length, isHovered]);

  // Scroll to section function
  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    sectionRefs[sectionId].current.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

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

  // Calculate visible partners for bubble carousel
  const getVisiblePartners = () => {
    const visible = [];
    const total = partners.length;
    
    // Always show 5 bubbles with the current one in the center
    for (let i = -2; i <= 2; i++) {
      const index = (currentPartnerIndex + i + total) % total;
      visible.push({
        ...partners[index],
        position: i,
        isCenter: i === 0
      });
    }
    
    return visible;
  };

  const visiblePartners = getVisiblePartners();

  return (
    <div className="stans-taxi">
      {/* Header Section */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <a href="/" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>
                <img
                  src="/variables/images/Logo.png"
                  alt="Stan's Taxi Logo"
                  className="logo-image"
                />
              </a>
            </div>

            <nav className="nav-main">
              <ul>
                <li className={activeSection === 'home' ? 'active' : ''}>
                  <a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>
                    <i className="fas fa-home"></i> Home
                  </a>
                </li>
                <li className={activeSection === 'about' ? 'active' : ''}>
                  <a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>
                    <i className="fas fa-info-circle"></i> About
                  </a>
                </li>
                <li className={activeSection === 'partners' ? 'active' : ''}>
                  <a href="#partners" onClick={(e) => { e.preventDefault(); scrollToSection('partners'); }}>
                    <i className="fas fa-handshake"></i> Partners
                  </a>
                </li>
                <li className={activeSection === 'contact' ? 'active' : ''}>
                  <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>
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
      <section className="hero" id="home" ref={sectionRefs.home}>
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
              <img src="/variables/images/taxi.png" alt="Taxi" className="taxi-image" />
              <img src="/variables/images/lighthouse.png" alt="Lighthouse" className="lighthouse-image" />
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
          {/* Road Divider */}
          <div className="road-divider"></div>
        </div>
      </section>

      {/* Partners Section with Bubble Carousel */}
      <section className="partners" id="partners" ref={sectionRefs.partners}>
        <div className="container">
          <div className="section-header">
            <h3>Preferred partner of:</h3>
            <p>We're proud to partner with these premium establishments</p>
          </div>

          <div 
            className="bubble-carousel-container"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <button className="carousel-button prev" onClick={prevPartner}>
              <i className="fas fa-chevron-left"></i>
            </button>

            <div className="bubble-carousel">
              {visiblePartners.map((partner) => (
                <div 
                  key={`${partner.id}-${partner.position}`} 
                  className={`bubble-item ${partner.isCenter ? 'center' : ''}`}
                  style={{
                    '--position': partner.position,
                    '--offset': Math.abs(partner.position) * 20
                  }}
                >
                  <a href={partner.websiteUrl} target="_blank" rel="noopener noreferrer">
                    <div className="bubble-logo-container">
                      <img
                        src={partner.logoUrl}
                        alt={partner.name}
                        className="bubble-logo"
                        onError={(e) => {
                          e.currentTarget.src = "/variables/images/Logo.png";
                          e.currentTarget.alt = `${partner.name} logo`;
                        }}
                      />
                    </div>
                    {partner.isCenter && <span className="partner-name">{partner.name}</span>}
                  </a>
                </div>
              ))}
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
      <section className="about" id="about" ref={sectionRefs.about}>
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

      {/* Contact Section */}
      <section className="contact" id="contact" ref={sectionRefs.contact}>
        <div className="container">
          <div className="section-header">
            <h3>Get in Touch</h3>
            <p>Reach out to us for bookings or inquiries</p>
          </div>
          
          <div className="contact-content">
            <div className="contact-info">
              <div className="contact-item">
                <div className="contact-icon">
                  <i className="fas fa-phone"></i>
                </div>
                <div className="contact-details">
                  <h4>Call Us</h4>
                  <p>508-500-6565</p>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="contact-icon">
                  <i className="fas fa-envelope"></i>
                </div>
                <div className="contact-details">
                  <h4>Email Us</h4>
                  <p>info@stanstaxi.com</p>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="contact-icon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <div className="contact-details">
                  <h4>Visit Us</h4>
                  <p>Nantucket Island, MA</p>
                </div>
              </div>
            </div>
            
            <div className="contact-form">
              <form>
                <div className="form-group">
                  <input type="text" placeholder="Your Name" />
                </div>
                <div className="form-group">
                  <input type="email" placeholder="Your Email" />
                </div>
                <div className="form-group">
                  <textarea placeholder="Your Message" rows="4"></textarea>
                </div>
                <button type="submit" className="btn-submit">Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Main;