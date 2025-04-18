import React from "react";
import "./Home.css";

function ServiceDescription() {
  return (
    <div className="service-description">
      <img src="/images/travel.jpg" alt="Travel" className="service-image" />
      <div className="service-text">
        <h2>Why Choose Our Travel Planner? ✈️</h2>
        <p>
          Plan your perfect journey with our <strong>AI-powered travel assistant</strong>.  
          We provide <strong>personalized itineraries</strong> based on your **preferences, budget, and schedule**.  
          Our smart system helps you find the <strong>best flight deals</strong>, <strong>top-rated hotels</strong>, and <strong>must-visit attractions</strong>.
        </p>
        <p>
          Whether you're an <strong>adventure seeker</strong>, a <strong>food lover</strong>,  
          or someone who enjoys <strong>relaxing on beaches</strong> or <strong>exploring history</strong>,  
          we ensure every moment of your trip is **unforgettable**.
        </p>
        <p>
          Just enter your details, and let our AI craft the <strong>perfect travel experience</strong> for you!  
        </p>
      </div>
    </div>
  );
}

export default ServiceDescription;
