import React from 'react';
import Header from '../header/Header';
import './Layout.css';

function Layout({ children }) {
  return (
    <div className="layout">
      <Header />
      <main className="main-content">
        {children}
      </main>
      <footer className="footer">
        {/* footer content */}
      </footer>
    </div>
  );
}

export default Layout;
