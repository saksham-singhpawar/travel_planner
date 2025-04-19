import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Header.css";

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="logo">
        <Link to="/">
          <span className="logo-icon">✈️</span>
          <span className="logo-text">Travel Planner</span>
        </Link>
      </div>
      
      <div className="menu-toggle" onClick={toggleMenu}>
        <div className={`hamburger ${menuOpen ? 'active' : ''}`}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      
      <nav className={`nav ${menuOpen ? 'active' : ''}`}>
        <ul>
          <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
          <li><Link to="/itinerary" onClick={() => setMenuOpen(false)}>Plan Your Trip</Link></li>
          <li><Link to="/checklist" onClick={() => setMenuOpen(false)}>Packing Checklist</Link></li>
          <li><Link to="/gallery" onClick={() => setMenuOpen(false)}>Travel Experiences</Link></li>
          <li><Link to="/contact" onClick={() => setMenuOpen(false)}>Contact Us</Link></li> 
          <li><Link to="/signin" className="signin-button" onClick={() => setMenuOpen(false)}>Sign In</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
