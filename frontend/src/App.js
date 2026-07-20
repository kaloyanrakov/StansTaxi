import React from 'react';
import './App.css';
import Main from './components/MainComponent/Main';
import Footer from './FooterComponent/Footer';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Main />
        <Footer />
      </header>
    </div>
  );
}

export default App;