import React from 'react';
import './App.css';
import PhoneNumber from './components/PhoneNumber/PhoneNumber';
import BookingForm from './components/BookingForm/BookingForm';
import Main from './components/MainComponent/Main';
import LoginPage from './LoginPage';
import BookingsPage from './BookingsPage';

function App() {
  const path = window.location.pathname;

  let Page;
  if (path === '/login') {
    Page = <LoginPage />;
  } else if (path === '/bookings') {
    Page = <BookingsPage />;
  } else {
    Page = (
      <>
        <Main />
        <PhoneNumber />
        <BookingForm />
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
