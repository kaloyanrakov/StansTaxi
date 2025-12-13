import React, { useEffect, useState } from "react";
import "./BookingsPage.css";

function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  // Past bookings filter: '7' or '30' (default 30 days)
  const [range, setRange] = useState('30');

  // New: booking toggle state
  const [bookingsEnabled, setBookingsEnabled] = useState(true);
  const [savingToggle, setSavingToggle] = useState(false);

  useEffect(function () {
    // fetch bookings
    fetch("http://localhost:8080/bookings")
      .then(function (res) { return res.json(); })
      .then(function (data) {
        setBookings(data);
        setLoading(false);
      })
      .catch(function (err) {
        console.error("Error fetching bookings:", err);
        setLoading(false);
      });

    // fetch bookings-enabled flag
    fetch("http://localhost:8080/settings/bookings-enabled")
      .then(res => res.json())
      .then(data => setBookingsEnabled(!!data.bookingsEnabled))
      .catch(err => console.error("Error fetching settings:", err));
  }, []);

  const handleBack = function () {
    window.location.href = "/";
  };

  const toggleBookings = async () => {
    try {
      setSavingToggle(true);
      const next = !bookingsEnabled;
      const res = await fetch(`http://localhost:8080/settings/bookings-enabled?enabled=${next}`, {
        method: "PATCH"
      });
      if (!res.ok) throw new Error("Failed to update setting");
      const data = await res.json();
      setBookingsEnabled(!!data.bookingsEnabled);
    } catch (e) {
      console.error(e);
      alert("Failed to update the bookings toggle.");
    } finally {
      setSavingToggle(false);
    }
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

  // Top controls including toggle (will be rendered below the header)
  const topControls = React.createElement(
  'div',
  { className: 'bookings-controls' },
  React.createElement(
    'div',
    { className: 'toggle-card' },
    // Current state label
    React.createElement(
      'span',
      { className: 'toggle-label' },
      `Online Bookings: ${bookingsEnabled ? 'ON' : 'OFF'}`
    ),
    // Action button text reflects the next action
    React.createElement('button', {
      className: `toggle-button ${bookingsEnabled ? 'on' : 'off'}`,
      onClick: toggleBookings,
      disabled: savingToggle,
      title: bookingsEnabled ? 'Turn OFF online bookings' : 'Turn ON online bookings'
    }, bookingsEnabled ? 'Turn OFF' : 'Turn ON')
  )
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

  const handleAccept = function (bookingId) {
    fetch(`http://localhost:8080/bookings/${bookingId}/status?status=ACCEPTED`, {
      method: "PATCH"
    })
      .then(res => res.json())
      .then(updated => {
        setBookings(prev =>
          prev.map(b => b.bookingId === bookingId ? updated : b)
        );
      })
      .catch(err => console.error("Error updating booking status:", err));
  };

  const handleTurnDown = function (bookingId) {
    fetch(`http://localhost:8080/bookings/${bookingId}/status?status=REJECTED`, {
      method: "PATCH"
    })
      .then(res => res.json())
      .then(updated => {
        setBookings(prev =>
          prev.map(b => b.bookingId === bookingId ? updated : b)
        );
      })
      .catch(err => console.error("Error updating booking status:", err));
  };

  // Helper: date range filter using bookingDate (preferred) or pickupDate fallback
  const isWithinRange = function(bookingDateStr, days) {
    if (!bookingDateStr) return false;
    const bookingDate = new Date(bookingDateStr); // expects YYYY-MM-DD
    const today = new Date();
    const cutoff = new Date();
    cutoff.setDate(today.getDate() - days);
    const bookingYMD = new Date(bookingDate.getFullYear(), bookingDate.getMonth(), bookingDate.getDate());
    const cutoffYMD = new Date(cutoff.getFullYear(), cutoff.getMonth(), cutoff.getDate());
    return bookingYMD >= cutoffYMD;
  };

  // Create loading state
  let mainContent;
  if (loading) {
    const loadingSpinner = React.createElement('div', { className: 'loading-container' },
      React.createElement('div', { className: 'loading-spinner' }),
      React.createElement('p', { className: 'loading-text' }, 'Loading bookings...')
    );
    mainContent = loadingSpinner;
  } else if (bookings.length === 0) {
    const emptyState = React.createElement(
      'div',
      { className: 'empty-container' },
      React.createElement('i', { className: 'fas fa-clipboard-list empty-icon' }),
      React.createElement('p', { className: 'empty-text' }, 'No bookings found')
    );
    mainContent = emptyState;
  } else {
    // Split bookings into active (pending decisions) and past (decided)
    const activeBookings = bookings.filter(function (b) { return b.status === 'PENDING'; });
    let pastBookings = bookings.filter(function (b) { return b.status !== 'PENDING'; });

    // Apply range filter ONLY to past bookings
    const days = range === '7' ? 7 : 30;
    pastBookings = pastBookings.filter(function (b) {
      const dateStr = b.bookingDate || b.pickupDate;
      return isWithinRange(dateStr, days);
    });

    // Active table headers (no ID shown)
    const activeHeaders = [
      'Pickup', 'Dropoff', 'Date', 'Time',
      'Passengers', 'Pets', 'Phone', 'Status', 'Actions'
    ].map(function (header) {
      return React.createElement('th', { className: 'table-header', key: header }, header);
    });

    const activeHead = React.createElement('thead', null, React.createElement('tr', null, activeHeaders));

    // Active table rows (with Accept/Turn Down actions)
    const activeRows = activeBookings.map(function (booking) {
      const cells = [
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

      const acceptButton = React.createElement(
        'button',
        {
          className: 'btn-accept',
          onClick: function () { handleAccept(booking.bookingId); },
          key: 'accept'
        },
        React.createElement('i', { className: 'fas fa-check' }),
        'Accept'
      );

      const turnDownButton = React.createElement(
        'button',
        {
          className: 'btn-turn-down',
          onClick: function () { handleTurnDown(booking.bookingId); },
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

      return React.createElement('tr', { className: 'table-row', key: booking.bookingId }, cells);
    });

    const activeBody = React.createElement('tbody', null, activeRows);

    const activeTable = React.createElement(
      'div',
      { className: 'table-container' },
      React.createElement('h2', { className: 'table-title' }, 'Active Bookings'),
      React.createElement('table', { className: 'bookings-table' }, activeHead, activeBody)
    );

    // Past bookings table (no actions; shows the final decision in Status)
    const pastHeaders = [
      'Pickup', 'Dropoff', 'Date', 'Time',
      'Passengers', 'Pets', 'Phone', 'Decision'
    ].map(function (header) {
      return React.createElement('th', { className: 'table-header', key: header }, header);
    });

    const pastHead = React.createElement('thead', null, React.createElement('tr', null, pastHeaders));

    const pastRows = pastBookings.map(function (booking) {
      const cells = [
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

      return React.createElement('tr', { className: 'table-row', key: booking.bookingId }, cells);
    });

    const pastBody = React.createElement('tbody', null, pastRows);

    // Past table with title and filter placed BELOW the title, matching styling
    const pastFilterControls = React.createElement(
      'div',
      { className: 'filter-controls' },
      React.createElement('label', { className: 'filter-label' }, 'Show:'),
      React.createElement(
        'select',
        {
          className: 'filter-select',
          value: range,
          onChange: function(e) { setRange(e.target.value); }
        },
        React.createElement('option', { value: '7' }, 'Last 7 days'),
        React.createElement('option', { value: '30' }, 'Last 30 days')
      )
    );

    const pastTable = React.createElement(
      'div',
      { className: 'table-container' },
      React.createElement('h2', { className: 'table-title' }, 'Past Bookings'),
      pastFilterControls, // filter below the title
      React.createElement('table', { className: 'bookings-table' }, pastHead, pastBody)
    );

    // Show both tables
    mainContent = React.createElement('div', null, activeTable, pastTable);
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
    topControls,
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