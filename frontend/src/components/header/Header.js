import React from 'react';
import './Header.css';


function Header() {
  return (
    <header className="header">
      <div className="logo-box">
        <img src="/variables/images/Logo.png"  alt="Stan's Taxi Logo" className="logo-image" />
      </div>
      <nav className="navigation">
        {/* Add navigation items here */}
      </nav>
    </header>
  );
}

export default Header;
