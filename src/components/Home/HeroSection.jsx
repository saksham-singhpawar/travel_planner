import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import "./Home.css";

function HeroSection() {
  const navigate = useNavigate();
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const buttonRef = useRef(null);


  const images = [
    "/images/paris.jpg",
    "/images/maldives.jpg",
    "/images/switzerland.jpg",
    "/images/dubai.jpg",
    "/images/tokyo.jpg",
    "/images/india.jpg",
  ];

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);


  useEffect(() => {
    gsap.fromTo(titleRef.current, { opacity: 0, y: -50 }, { opacity: 1, y: 0, duration: 1, ease: "power2.out" });
    gsap.fromTo(subtitleRef.current, { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: 1, delay: 0.3, ease: "power2.out" });
    gsap.fromTo(buttonRef.current, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 1, delay: 0.6, ease: "power2.out" });
  }, []);

  return (
    <div className="hero-section" style={{ backgroundImage: `url(${images[currentImage]})` }}>
      <div className="overlay"></div>
      <div className="hero-content">
        <h1 ref={titleRef} className="hero-title">Explore the World 🌍</h1>
        <p ref={subtitleRef} className="hero-subtitle">Your AI-powered travel planner for the perfect itinerary.</p>
        <button ref={buttonRef} className="hero-button" onClick={() => navigate("/Itinerary")}>
          Plan My Trip
        </button>
      </div>
    </div>
  );
}

export default HeroSection;
