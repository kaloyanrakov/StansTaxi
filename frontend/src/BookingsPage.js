import React, { useEffect, useState } from "react";
import "./BookingsPage.css";

function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(function() {
    fetch("http://localhost:8080/bookings")
      .then(function(res) { return res.json(); })
      .then(function(data) {
        setBookings(data);
        setLoading(false);
      })
      .catch(function(err) {
        console.error("Error fetching bookings:", err);
        setLoading(false);
      });
  }, []);

  const handleBack = function() {
    window.location.href = "/";
  };

  const handleAccept = function(bookingId) {
    console.log("Accept booking:", bookingId);
    // Add your accept logic here
  };

  const handleTurnDown = function(bookingId) {
    console.log("Turn down booking:", bookingId);
    // Add your turn down logic here
  };

  // Create background shapes
  const backgroundShapes = React.createElement(
    'div',
    { className: 'bookings-background-shapes' },
    React.createElement('div', { className: 'shape shape-1' }),
    React.createElement('div', { className: 'shape shape-2' }),
    React.createElement('div', { className: 'shape shape-3' }),
    React.createElement('div', { className: 'shape shape-4' }),
    React.createElement('div', { className: 'shape shape-5' })
  );

  const background = React.createElement(
    'div',
    { className: 'bookings-background' },
    backgroundShapes
  );

  // Create header with logo and title
  const headerLogo = React.createElement(
    'div',
    { className: 'bookings-logo' },
    React.createElement('i', { className: 'fas fa-taxi' })
  );

  const headerTitle = React.createElement(
    'h1',
    { className: 'bookings-title' },
    'Booking Management'
  );

  const headerSubtitle = React.createElement(
    'p',
    { className: 'bookings-subtitle' },
    'Manage and review all taxi bookings'
  );

  const headerContent = React.createElement(
    'div',
    { className: 'bookings-header' },
    headerLogo,
    headerTitle,
    headerSubtitle
  );

  // Create loading state
  let mainContent;
  if (loading) {
    const loadingSpinner = React.createElement('div', { className: 'loading-spinner' });
    const loadingText = React.createElement('p', { className: 'loading-text' }, 'Loading bookings...');
    mainContent = React.createElement(
      'div',
      { className: 'loading-container' },
      loadingSpinner,
      loadingText
    );
  } else if (bookings.length === 0) {
    const emptyIcon = React.createElement('i', { className: 'fas fa-clipboard-list empty-icon' });
    const emptyText = React.createElement('p', { className: 'empty-text' }, 'No bookings found');
    mainContent = React.createElement(
      'div',
      { className: 'empty-container' },
      emptyIcon,
      emptyText
    );
  } else {
    // Create table headers
    const tableHeaders = [
      'ID', 'Pickup', 'Dropoff', 'Date', 'Time', 
      'Passengers', 'Pets', 'Phone', 'Status', 'Actions'
    ].map(function(header) {
      return React.createElement(
        'th',
        { 
          className: 'table-header',
          key: header
        },
        header
      );
    });

    const tableHead = React.createElement(
      'thead',
      null,
      React.createElement('tr', null, tableHeaders)
    );

    // Create table rows
    const tableRows = bookings.map(function(booking) {
      const cells = [
        React.createElement('td', { className: 'table-cell' }, booking.bookingId),
        React.createElement('td', { className: 'table-cell' }, booking.pickUpLocation),
        React.createElement('td', { className: 'table-cell' }, booking.dropOffLocation),
        React.createElement('td', { className: 'table-cell' }, booking.pickupDate),
        React.createElement('td', { className: 'table-cell' }, booking.pickupTime),
        React.createElement('td', { className: 'table-cell' }, booking.passengers),
        React.createElement('td', { className: 'table-cell' }, booking.pets ? "Yes" : "No"),
        React.createElement('td', { className: 'table-cell' }, booking.phoneNumber),
        React.createElement('td', { className: 'table-cell' }, 
          React.createElement('span', { className: 'status-badge ' + booking.status.toLowerCase() }, booking.status)
        )
      ];

      // Create action buttons
      const acceptButton = React.createElement(
        'button',
        {
          className: 'btn-accept',
          onClick: function() { handleAccept(booking.bookingId); },
          key: 'accept'
        },
        React.createElement('i', { className: 'fas fa-check' }),
        'Accept'
      );

      const turnDownButton = React.createElement(
        'button',
        {
          className: 'btn-turn-down',
          onClick: function() { handleTurnDown(booking.bookingId); },
          key: 'turn-down'
        },
        React.createElement('i', { className: 'fas fa-times' }),
        'Turn Down'
      );

      const actionCell = React.createElement(
        'td',
        { className: 'table-cell actions-cell' },
        acceptButton,
        turnDownButton
      );

      cells.push(actionCell);

      return React.createElement(
        'tr',
        { 
          className: 'table-row',
          key: booking.bookingId
        },
        cells
      );
    });

    const tableBody = React.createElement('tbody', null, tableRows);
    
    const table = React.createElement(
      'div',
      { className: 'table-container' },
      React.createElement(
        'table',
        { className: 'bookings-table' },
        tableHead,
        tableBody
      )
    );

    mainContent = table;
  }

  // Create back button
  const backButton = React.createElement(
    'button',
    {
      className: 'btn-back',
      onClick: handleBack
    },
    React.createElement('i', { className: 'fas fa-arrow-left' }),
    'Back to Home'
  );

  // Create main card content
  const cardContent = React.createElement(
    'div',
    { className: 'bookings-card' },
    headerContent,
    mainContent,
    backButton
  );

  // Create main container
  return React.createElement(
    'div',
    { className: 'bookings-container' },
    background,
    cardContent
  );
}

export default BookingsPage;