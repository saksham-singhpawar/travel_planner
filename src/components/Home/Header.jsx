import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">Travel Planner</Link>
      </div>
      <nav className="nav">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/itinerary">Plan Your Trip</Link></li>
          <li><Link to="/gallery">Gallery</Link></li>
          <li><Link to="/contact">Contact Us</Link></li> 
          <li><Link to="/signin" className="signin-button">Sign In</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
