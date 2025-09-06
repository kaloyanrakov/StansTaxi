import React from 'react';
import './App.css';
import PhoneNumber from './components/PhoneNumber/PhoneNumber'
import BookingForm from './components/BookingForm/BookingForm'
import Main from './components/MainComponent/Main';

function App() {
  return (
    <div className="App">
      {/* Render the Main component with partners data   <Main partners={partners} /> */}
      
      {/* Keep your existing components if needed */}
      <header className="App-header">
        <Main/>
        <PhoneNumber/>
        <BookingForm />
        
      </header>
    </div>
  );
}

export default App;