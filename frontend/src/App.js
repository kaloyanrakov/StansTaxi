import React, { useEffect, useState } from 'react';
import './App.css';
import Main from './components/MainComponent/Main';
import LoginPage from './LoginPage';
import BookingsPage from './BookingsPage';
import Footer from './FooterComponent/Footer';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading
  const path = window.location.pathname;

  useEffect(() => {
    fetch('http://localhost:8080/auth/check-session', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setIsAuthenticated(!!data.isAuthenticated);
      })
      .catch(err => {
        console.error('Error checking session:', err);
        setIsAuthenticated(false);
      });
  }, []);

  // While we don't know yet, show loading for /bookings
  if (isAuthenticated === null && path === '/bookings') {
    return (
      <div className="App">
        <header className="App-header">
          <p>Checking session...</p>
        </header>
      </div>
    );
  }

  let Page;
  if (path === '/login') {
    Page = <LoginPage />;
  } else if (path === '/bookings') {
    Page = isAuthenticated ? <BookingsPage /> : <LoginPage />;
  } else {
    Page = (
      <>
        <Main />
        <Footer />
      </>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        {Page}
      </header>
    </div>
  );
}

export default App;