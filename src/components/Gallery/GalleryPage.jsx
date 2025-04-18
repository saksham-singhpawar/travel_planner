import React from "react";
import Header from "../Home/Header"; 
import "./Gallery.css";

function GalleryPage() {
  return (
    <div className="gallery-page">
      <Header />
      <h2 className="gallery-title">Explore Beautiful Destinations</h2>
      <div className="gallery">
        <img src="/images/paris.jpg" alt="Paris" />
        <img src="/images/maldives.jpg" alt="Maldives" />
        <img src="/images/switzerland.jpg" alt="Switzerland" />
        <img src="/images/dubai.jpg" alt="Dubai" />
        <img src="/images/tokyo.jpg" alt="Tokyo" />
        <img src="/images/india.jpg" alt="India" />
      </div>
    </div>
  );
}

export default GalleryPage;
