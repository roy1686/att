import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import './Layout.css';

export default function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="layout-container">
      <div className="mobile-header">
        <button className="hamburger-btn" onClick={() => setIsMobileMenuOpen(true)}>
          <Menu size={24} />
        </button>
        <h2 className="mobile-title">GIST Computer Education</h2>
      </div>
      
      <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      
      <main className="main-content">
        <div className="content-wrapper">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
