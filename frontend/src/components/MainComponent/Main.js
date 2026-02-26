import React, { useState, useEffect, useRef } from 'react';
import './maincomponent.css';
import BookingForm from '../BookingForm/BookingForm';

function Main() {
  const partners = [
    { id: 1, name: "21 Broad", logoUrl: "/variables/images/21-Broad-Nantucket-Logo.png", websiteUrl: "https://21broadhotel.com/" },
    { id: 2, name: "76 Main", logoUrl: "/variables/images/76-main-ink-press-hotel-logo-resized.png", websiteUrl: "https://76main.com/" },
    { id: 3, name: "Galley Beach", logoUrl: "/variables/images/Galley-Beach.png", websiteUrl: "https://galleybeach.net/" },
    { id: 4, name: "Nantucket Resort", logoUrl: "/variables/images/nantucketresortcollection.png", websiteUrl: "https://www.nantucketresortcollection.com/" },
    { id: 5, name: "Veranda House", logoUrl: "/variables/images/veranda_house_logo_color.png", websiteUrl: "https://www.nantucketresortcollection.com/veranda/" }
  ];
  
  // State for carousel
  const [currentPartnerIndex, setCurrentPartnerIndex] = useState(2);
  const [isHovered, setIsHovered] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [rotation, setRotation] = useState(0);
  const sectionRefs = {
    home: useRef(null),
    about: useRef(null),
    contact: useRef(null),
    partners: useRef(null)
  };

    // Online bookings flag from backend
  const [bookingsEnabled, setBookingsEnabled] = useState(true);

  useEffect(function () {
    fetch("http://localhost:8080/settings/bookings-enabled")
      .then(function (res) {
        if (!res.ok) throw new Error('Failed to load settings');
        return res.json();
      })
      .then(function (data) {
        setBookingsEnabled(!!data.bookingsEnabled);
      })
      .catch(function (err) {
        console.error("Error fetching settings:", err);
        // default to true if settings fail to load
        setBookingsEnabled(true);
      });
  }, []);

  // Auto-rotate carousel (pauses when hovered)
  useEffect(function() {
    if (isHovered) return;
    
    const interval = setInterval(function() {
      setRotation(function(prev) { return prev - 72; }); // 360/5 partners = 72 degrees
      setCurrentPartnerIndex(function(prevIndex) {
        return prevIndex === partners.length - 1 ? 0 : prevIndex + 1;
      });
    }, 5000);

    return function() { return clearInterval(interval); };
  }, [partners.length, isHovered]);

  // Scroll to section function
  const scrollToSection = function(sectionId) {
    setActiveSection(sectionId);
    sectionRefs[sectionId].current.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const nextPartner = function() {
    setRotation(function(prev) { return prev - 72; });
    setCurrentPartnerIndex(function(prevIndex) {
      return prevIndex === partners.length - 1 ? 0 : prevIndex + 1;
    });
  };

  const prevPartner = function() {
    setRotation(function(prev) { return prev + 72; });
    setCurrentPartnerIndex(function(prevIndex) {
      return prevIndex === 0 ? partners.length - 1 : prevIndex - 1;
    });
  };

  // Calculate visible partners for bubble carousel
  const getVisiblePartners = function() {
    const visible = [];
    const total = partners.length;
    
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

  return React.createElement(
    'div',
    { className: 'stans-taxi' },
    
    // Header Section
    React.createElement(
      'header',
      { className: 'header' },
      React.createElement(
        'div',
        { className: 'container' },
        React.createElement(
          'div',
          { className: 'header-content' },
          React.createElement(
            'div',
            { className: 'logo' },
            React.createElement(
              'a',
              {
                href: '/',
                onClick: function(e) { 
                  e.preventDefault(); 
                  scrollToSection('home'); 
                }
              },
              React.createElement('img', {
                src: '/variables/images/Logo.png',
                alt: "Stan's Taxi Logo",
                className: 'logo-image'
              })
            )
          ),
          React.createElement(
            'nav',
            { className: 'nav-main' },
            React.createElement(
              'ul',
              null,
              React.createElement(
                'li',
                { className: activeSection === 'home' ? 'active' : '' },
                React.createElement(
                  'a',
                  {
                    href: '#home',
                    onClick: function(e) { 
                      e.preventDefault(); 
                      scrollToSection('home'); 
                    }
                  },
                  'Home'
                )
              ),
              React.createElement(
                'li',
                { className: activeSection === 'partners' ? 'active' : '' },
                React.createElement(
                  'a',
                  {
                    href: '#partners',
                    onClick: function(e) { 
                      e.preventDefault(); 
                      scrollToSection('partners'); 
                    }
                  },
                  'Partners'
                )
              ),
              React.createElement(
                'li',
                { className: activeSection === 'about' ? 'active' : '' },
                React.createElement(
                  'a',
                  {
                    href: '#about',
                    onClick: function(e) { 
                      e.preventDefault(); 
                      scrollToSection('about'); 
                    }
                  },
                  'About'
                )
              ),
              bookingsEnabled && React.createElement(
              'li',
              { className: activeSection === 'contact' ? 'active' : '' },
              React.createElement(
                'a',
                {
                  href: '#contact',
                  onClick: function(e) { 
                    e.preventDefault(); 
                    scrollToSection('contact'); 
                  }
                },
                'Book Ride'
              )
            )
            )
          )
        )
      )
    ),

    // Hero Section
    React.createElement(
      'section',
      {
        className: 'hero',
        id: 'home',
        ref: sectionRefs.home
      },
      React.createElement(
        'div',
        { className: 'container' },
        React.createElement(
          'div',
          { className: 'hero-content' },
          React.createElement(
            'div',
            { className: 'hero-text' },
            React.createElement(
              'h2',
              null,
              'Reliable Transportation',
              React.createElement('br'),
              'in Nantucket'
            ),
            React.createElement(
              'p',
              { className: 'hero-subtitle' },
              'Premium taxi service for island residents and visitors'
            ),
           bookingsEnabled ? React.createElement (
            'button',
            { 
              className: 'btn-book-hero',
              onClick: function(e) { 
                e.preventDefault(); 
                scrollToSection('contact'); 
              }
            },
            React.createElement('i', { className: 'fas fa-car' }),
            'Book Your Ride Now'
          ) : null
          ),
          React.createElement(
            'div',
            { className: 'hero-visual' },
            React.createElement('img', {
              src: './variables/images/TaxiAndLighthouse.png',
              alt: 'Taxi and Lighthouse',
              className: 'combined-image'
            })
          )
        )
      )
    ),

    // Call to Action
    React.createElement(
      'section',
      { className: 'cta-bar' },
      React.createElement(
        'div',
        { className: 'container' },
        React.createElement(
          'div',
          { className: 'cta-content' },
          React.createElement(
            'div',
            { className: 'cta-text' },
            React.createElement('p', null, 'Ready to ride? Call us directly:')
          ),
          React.createElement(
            'a',
            {
              href: 'tel:508-500-6565',
              className: 'phone-number'
            },
            React.createElement('img', {
              src: '/variables/images/phone-call.png',
              alt: 'Phone',
              className: 'phone-icon'
            }),
            '508-500-6565'
          )
        ),
        React.createElement('div', { className: 'road-divider' })
      )
    ),

    // Partners Section
    React.createElement(
      'section',
      {
        className: 'partners',
        id: 'partners',
        ref: sectionRefs.partners
      },
      React.createElement(
        'div',
        { className: 'container' },
        React.createElement(
          'div',
          { className: 'section-header' },
          React.createElement(
            'h3',
            null,
            'Our Trusted Partners'
          ),
          React.createElement(
            'p',
            null,
            "We're proud to partner with Nantucket's finest establishments"
          )
        ),
        React.createElement(
          'div',
          {
            className: 'bubble-carousel-container',
            onMouseEnter: function() { return setIsHovered(true); },
            onMouseLeave: function() { return setIsHovered(false); }
          },
          React.createElement(
            'button',
            {
              className: 'carousel-button prev',
              onClick: prevPartner
            },
            React.createElement('img', {
              src: '/variables/images/angle-small-left.png',
              alt: 'Previous',
              className: 'carousel-arrow'
            })
          ),
          React.createElement(
            'div',
            { className: 'bubble-carousel' },
            visiblePartners.map(function(partner) {
              return React.createElement(
                'div',
                {
                  key: partner.id + '-' + partner.position,
                  className: 'bubble-item ' + (partner.isCenter ? 'center' : ''),
                  style: {
                    '--position': partner.position,
                  }
                },
                React.createElement(
                  'a',
                  {
                    href: partner.websiteUrl,
                    target: '_blank',
                    rel: 'noopener noreferrer',
                    className: 'partner-link'
                  },
                  React.createElement(
                    'div',
                    { className: 'bubble-logo-container' },
                    React.createElement('img', {
                      src: partner.logoUrl,
                      alt: partner.name,
                      className: 'bubble-logo',
                      onError: function(e) {
                        e.currentTarget.src = '/variables/images/Logo.png';
                        e.currentTarget.alt = partner.name + ' logo';
                      }
                    })
                  ),
                  React.createElement(
                    'div',
                    { className: 'partner-info' },
                    React.createElement(
                      'span',
                      { className: 'partner-name' },
                      partner.name
                    ),
                    React.createElement(
                      'span',
                      { className: 'partner-badge' },
                      'Trusted Partner'
                    )
                  )
                )
              );
            })
          ),
          React.createElement(
            'button',
            {
              className: 'carousel-button next',
              onClick: nextPartner
            },
            React.createElement('img', {
              src: '/variables/images/angle-small-right.png',
              alt: 'Next',
              className: 'carousel-arrow'
            })
          )
        ),
        React.createElement(
          'div',
          { className: 'carousel-indicators' },
          partners.map(function(_, index) {
            return React.createElement(
              'button',
              {
                key: index,
                className: 'indicator ' + (index === currentPartnerIndex ? 'active' : ''),
                onClick: function() { return setCurrentPartnerIndex(index); }
              }
            );
          })
        )
      )
    ),

    // About Section
    React.createElement(
      'section',
      {
        className: 'about',
        id: 'about',
        ref: sectionRefs.about
      },
      React.createElement(
        'div',
        { className: 'container' },
        React.createElement(
          'div',
          { className: 'section-header' },
          React.createElement(
            'h3',
            null,
            'About Our Service'
          ),
          React.createElement(
            'p',
            null,
            "Discover what makes Stan's Taxi the preferred choice in Nantucket"
          )
        ),
        React.createElement(
          'div',
          { className: 'about-content' },
          React.createElement(
            'div',
            { className: 'about-features' },
            React.createElement(
              'div',
              { 
                className: 'feature',
                style: { animationDelay: '1.7s' }
              },
              React.createElement(
                'div',
                { className: 'feature-icon' },
                React.createElement('img', {
                  src: '/variables/images/time-fast.png',
                  alt: '23/7 Availability',
                  className: 'feature-image'
                })
              ),
              React.createElement('h4', null, '23/7 Availability'),
              React.createElement(
                'p',
                null,
                "We're available round the clock for all your transportation needs"
              )
            ),
            React.createElement(
              'div',
              { 
                className: 'feature',
                style: { animationDelay: '1.9s' }
              },
              React.createElement(
                'div',
                { className: 'feature-icon' },
                React.createElement('img', {
                  src: '/variables/images/handshake.png',
                  alt: 'Safe & Reliable',
                  className: 'feature-image'
                })
              ),
              React.createElement('h4', null, 'Safe & Reliable'),
              React.createElement(
                'p',
                null,
                'Our professional drivers prioritize your safety and comfort'
              )
            ),
            React.createElement(
              'div',
              { 
                className: 'feature',
                style: { animationDelay: '2.1s' }
              },
              React.createElement(
                'div',
                { className: 'feature-icon' },
                React.createElement('img', {
                  src: '/variables/images/marker.png',
                  alt: 'Island Service area',
                  className: 'feature-image'
                })
              ),
              React.createElement('h4', null, 'Island-Wide Service'),
              React.createElement(
                'p',
                null,
                'We operate across all main parts of the island excluding isolated and hard-to-reach beach areas'
              )
            )
          )
        )
      )
    ),

    // Contact Section with Booking Form
    React.createElement(
      'section',
      {
        className: 'contact',
        id: 'contact',
        ref: sectionRefs.contact
      },
      React.createElement(
        'div',
        { className: 'container' },
        React.createElement(
          'div',
          { className: 'section-header' },
          React.createElement(
            'h3',
            null,
            'Book a Ride'
          ),
          React.createElement(
            'p',
            null,
            'Schedule your ride with us in just a few clicks'
          )
        ),
        React.createElement(
          'div',
          { className: 'contact-content' },
          React.createElement(
            'div',
            { className: 'contact-info' },
            React.createElement(
              'div',
              { className: 'contact-item' },
              React.createElement(
                'div',
                { className: 'contact-icon' },
                React.createElement('img', {
                  src: '/variables/images/phone-call.png',
                  alt: 'Call Us',
                  className: 'contact-image'
                })
              ),
              React.createElement(
                'div',
                { className: 'contact-details' },
                React.createElement('h4', null, 'Call Us'),
                React.createElement('p', null, '508-500-6565')
              )
            ),
            React.createElement(
              'div',
              { className: 'contact-item' },
              React.createElement(
                'div',
                { className: 'contact-icon' },
                React.createElement('img', {
                  src: '/variables/images/envelope.png',
                  alt: 'Email Us',
                  className: 'contact-image'
                })
              ),
              React.createElement(
                'div',
                { className: 'contact-details' },
                React.createElement('h4', null, 'Email Us'),
                React.createElement('p', null, 'ack@stanstaxinantucket.com')
              )
            ),
            React.createElement(
              'div',
              { className: 'contact-item' },
              React.createElement(
                'div',
                { className: 'contact-icon' },
                React.createElement('img', {
                  src: '/variables/images/marker.png',
                  alt: 'Visit Us',
                  className: 'contact-image'
                })
              ),
              React.createElement(
                'div',
                { className: 'contact-details' },
                React.createElement('h4', null, 'Visit Us'),
                React.createElement('p', null, 'Nantucket Island, MA')
              )
            ),
            React.createElement(
              'div',
              { className: 'contact-item' },
              React.createElement(
                'div',
                { className: 'contact-icon' },
                React.createElement('img', {
                  src: '/variables/images/time-fast.png',
                  alt: 'Operating Hours',
                  className: 'contact-image'
                })
              ),
              React.createElement(
                'div',
                { className: 'contact-details' },
                React.createElement('h4', null, 'Operating Hours'),
                React.createElement('p', null, '23/7 Service Available')
              )
            )
          ),
          bookingsEnabled && React.createElement(
          'div',
          { className: 'booking-form-container' },
          React.createElement(BookingForm)
        )

        )
      )
    )
  );
}

export default Main;