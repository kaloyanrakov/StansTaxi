import React, { useEffect, useState } from 'react';
import './App.css';
import LoginPage from './LoginPage';
import BookingsPage from './BookingsPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/auth/check-session`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => setIsAuthenticated(!!data.isAuthenticated))
      .catch(() => setIsAuthenticated(false));
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="App">
        <header className="App-header"><p>Checking session...</p></header>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        {isAuthenticated ? <BookingsPage /> : <LoginPage />}
      </header>
    </div>
  );
}

export default App;