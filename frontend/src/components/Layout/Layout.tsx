import React from 'react';
// Try updating the import path to match the actual file structure and casing
import Header from '../../components/header/header';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
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
};

export default Layout;