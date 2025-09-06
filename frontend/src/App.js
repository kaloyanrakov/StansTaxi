import React from 'react';
import './App.css';
import PhoneNumber from './components/PhoneNumber/PhoneNumber'
import BookingForm from './components/BookingForm/BookingForm'
import Header from './components/header/Header';
import Layout from './components/Layout/Layout';

function App() {
  //partner data
  const partners = [
    {
      id: 1,
      name: "21 Broad",
      logoUrl: "/images/partners/21broad.png",
      websiteUrl: ""
    },
    {
      id: 2,
      name: "Veranda",
      logoUrl: "/images/partners/veranda.png",
      websiteUrl: ""
    },
    {
      id: 3,
      name: "The Veranda House",
      logoUrl: "/images/partners/verandahouse.png",
      websiteUrl: ""
    },
    {
      id: 4,
      name: "Luxury Hotel",
      logoUrl: "/images/partners/lh.png",
      websiteUrl: ""
    }
  ];

  return (
    <div className="App">
      {/* Render the Main component with partners data   <Main partners={partners} /> */}
      
      {/* Keep your existing components if needed */}
      <header className="App-header">
        <Header />
        <PhoneNumber/>
        <BookingForm />
        
      </header>
    </div>
  );
}

export default App;