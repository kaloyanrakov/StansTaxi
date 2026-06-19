import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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

  // Refs for GSAP
  const navRef = useRef(null);
  const heroImgRef = useRef(null);
  const ctaRef = useRef(null);

  // 3-D tilt handlers for feature cards
  const handleFeatureMouseMove = function(e) {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(card, {
      rotateX: -(y / rect.height) * 12,
      rotateY:  (x / rect.width)  * 12,
      transformPerspective: 800,
      duration: 0.3,
      ease: 'power2.out'
    });
  };

  const handleFeatureMouseLeave = function(e) {
    gsap.to(e.currentTarget, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.4)'
    });
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

  // ─── GSAP animations ────────────────────────────────────────────
  useLayoutEffect(function() {
    gsap.registerPlugin(ScrollTrigger);

    // ── Only hide hero elements (guaranteed to animate via heroTl) ──
    if (navRef.current) {
      gsap.set(navRef.current, { y: -100, autoAlpha: 0 });
    }
    const homeEl = sectionRefs.home.current;
    if (homeEl) {
      gsap.set(homeEl.querySelectorAll('.hero-text h2'), { y: 50, autoAlpha: 0 });
      gsap.set(homeEl.querySelectorAll('.hero-subtitle'),  { y: 30, autoAlpha: 0 });
      gsap.set(homeEl.querySelectorAll('.btn-book-hero'),  { y: 30, autoAlpha: 0 });
    }
    if (heroImgRef.current) {
      gsap.set(heroImgRef.current, { x: 80, autoAlpha: 0 });
    }

    // ── Hero entrance timeline ────────────────────────────────────
    var heroTl = gsap.timeline({ delay: 0.15, defaults: { ease: 'power3.out' } });

    if (navRef.current) {
      heroTl.to(navRef.current, { y: 0, autoAlpha: 1, duration: 0.7 });
    }
    if (homeEl) {
      heroTl
        .to(homeEl.querySelectorAll('.hero-text h2'),   { y: 0, autoAlpha: 1, duration: 0.9 }, '-=0.3')
        .to(homeEl.querySelectorAll('.hero-subtitle'),   { y: 0, autoAlpha: 1, duration: 0.7 }, '-=0.5')
        .to(homeEl.querySelectorAll('.btn-book-hero'),   { y: 0, autoAlpha: 1, duration: 0.6 }, '-=0.4');
    }
    if (heroImgRef.current) {
      heroTl.to(heroImgRef.current, { x: 0, autoAlpha: 1, duration: 1, ease: 'power2.out' }, '-=0.8');
    }

    // ── Navbar scroll shrink ──────────────────────────────────────
    if (navRef.current) {
      ScrollTrigger.create({
        start: 'top -80',
        onUpdate: function(self) {
          gsap.to(navRef.current, {
            padding: self.progress > 0 ? '8px 0' : '15px 0',
            duration: 0.3,
            overwrite: 'auto'
          });
        }
      });
    }

    // ── Scroll reveals — use onEnter so elements stay visible if trigger is killed ──
    if (ctaRef.current) {
      ScrollTrigger.create({
        trigger: ctaRef.current, start: 'top 88%', once: true,
        onEnter: function() {
          gsap.fromTo(ctaRef.current.querySelectorAll('.cta-text, .phone-number'),
            { y: 40, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, stagger: 0.2, duration: 0.8, ease: 'power3.out' }
          );
        }
      });
    }

    if (sectionRefs.partners.current) {
      ScrollTrigger.create({
        trigger: sectionRefs.partners.current, start: 'top 78%', once: true,
        onEnter: function() {
          gsap.fromTo(sectionRefs.partners.current.querySelectorAll('.section-header'),
            { y: 30, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.7, ease: 'power3.out' }
          );
        }
      });
    }

    if (sectionRefs.about.current) {
      ScrollTrigger.create({
        trigger: sectionRefs.about.current, start: 'top 75%', once: true,
        onEnter: function() {
          gsap.fromTo(sectionRefs.about.current.querySelectorAll('.section-header'),
            { y: 30, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.7, ease: 'power3.out' }
          );
          gsap.fromTo(sectionRefs.about.current.querySelectorAll('.feature'),
            { y: 60, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, stagger: 0.18, duration: 0.9, ease: 'power3.out', delay: 0.2 }
          );
        }
      });
    }

    if (sectionRefs.contact.current) {
      ScrollTrigger.create({
        trigger: sectionRefs.contact.current, start: 'top 78%', once: true,
        onEnter: function() {
          gsap.fromTo(sectionRefs.contact.current.querySelectorAll('.section-header'),
            { y: 30, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.7, ease: 'power3.out' }
          );
          gsap.fromTo(sectionRefs.contact.current.querySelectorAll('.contact-item'),
            { x: -50, autoAlpha: 0 },
            { x: 0, autoAlpha: 1, stagger: 0.15, duration: 0.7, ease: 'power2.out', delay: 0.15 }
          );
          var bEl = sectionRefs.contact.current.querySelector('.booking-form-container');
          if (bEl) {
            gsap.fromTo(bEl,
              { x: 50, autoAlpha: 0 },
              { x: 0, autoAlpha: 1, duration: 0.9, ease: 'power2.out', delay: 0.15 }
            );
          }
        }
      });
    }

    return function() {
      ScrollTrigger.getAll().forEach(function(t) { t.kill(); });
      heroTl.kill();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const nextPartner = function() {
    setCurrentPartnerIndex(function(prev) {
      return prev === partners.length - 1 ? 0 : prev + 1;
    });
  };

  const prevPartner = function() {
    setCurrentPartnerIndex(function(prev) {
      return prev === 0 ? partners.length - 1 : prev - 1;
    });
  };

  // Compute inline carousel styles for each partner (stable positions with smooth CSS transitions)
  const getPartnerStyle = function(arrIndex) {
    var total = partners.length;
    var rawPos = (arrIndex - currentPartnerIndex + total) % total;
    var pos = rawPos > 2 ? rawPos - total : rawPos; // normalise to -2..2

    var isCenter = pos === 0;
    var abPos = Math.abs(pos);

    return {
      style: {
        transform: 'translateX(' + (pos * 220) + 'px) scale(' + (isCenter ? 1.15 : 1 - 0.14 * abPos) + ')',
        opacity:   abPos >= 2 ? 0 : (isCenter ? 1 : 0.6),
        filter:    isCenter ? 'grayscale(0%) brightness(1)' : 'grayscale(70%) brightness(0.85)',
        zIndex:    isCenter ? 10 : (3 - abPos),
        pointerEvents: abPos >= 2 ? 'none' : 'auto'
      },
      isCenter: isCenter
    };
  };

  // Wave divider — SVG wave that smoothly transitions between sections
  var waveDivider = function(fillColor) {
    return React.createElement(
      'div',
      { className: 'section-wave', 'aria-hidden': 'true' },
      React.createElement(
        'svg',
        { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 1440 70', preserveAspectRatio: 'none' },
        React.createElement('path', {
          className: 'wave-front',
          d: 'M0,35 C180,68 360,2 540,35 C720,68 900,2 1080,35 C1260,68 1380,20 1440,35 L1440,70 L0,70 Z',
          fill: fillColor
        }),
        React.createElement('path', {
          className: 'wave-back',
          d: 'M0,50 C240,18 480,58 720,38 C960,18 1200,55 1440,40 L1440,70 L0,70 Z',
          fill: fillColor,
          opacity: '0.4'
        })
      )
    );
  };

  return React.createElement(
    'div',
    { className: 'stans-taxi' },
    
    // Header Section
    React.createElement(
      'header',
      { className: 'header', ref: navRef },
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
              className: 'combined-image',
              ref: heroImgRef
            })
          )
        )
      )
    ),

    // Call to Action
    React.createElement(
      'section',
      { className: 'cta-bar', ref: ctaRef },
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
      ),
      waveDivider('#f0f9fb')
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
            partners.map(function(partner, arrIndex) {
              var partnerStyle = getPartnerStyle(arrIndex);
              return React.createElement(
                'div',
                {
                  key: partner.id,
                  className: 'bubble-item ' + (partnerStyle.isCenter ? 'center' : ''),
                  style: partnerStyle.style
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
                      loading: 'lazy',
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
      ),
      waveDivider('#4bbccc')
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
                onMouseMove: handleFeatureMouseMove,
                onMouseLeave: handleFeatureMouseLeave
              },
              React.createElement(
                'div',
                { className: 'feature-icon' },
                React.createElement('img', {
                  src: '/variables/images/time-fast.png',
                  alt: 'Availability',
                  className: 'feature-image'
                })
              ),
              React.createElement('h4', null, 'Availability'),
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
                onMouseMove: handleFeatureMouseMove,
                onMouseLeave: handleFeatureMouseLeave
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
                onMouseMove: handleFeatureMouseMove,
                onMouseLeave: handleFeatureMouseLeave
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
        ),
        waveDivider('#f5f5f7')
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
                  alt: 'Airport Fixed Rate',
                  className: 'contact-image'
                })
              ),
              React.createElement(
                'div',
                { className: 'contact-details' },
                React.createElement('h4', null, 'Airport Fixed Rate'),
                React.createElement('p', null, 'Trips from the airport to the centre are at a fixed $15')
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