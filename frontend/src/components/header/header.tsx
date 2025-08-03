import React from 'react';
import '../header.css';
import LogoImage from '../../variables/images/Logo.png';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="logo-box">
        <img src={LogoImage} alt="Stan's Taxi Logo" className="logo-image" />
      </div>
      <nav className="navigation">
        {/* Add navigation items here */}
      </nav>
    </header>
  );
};

export default Header;