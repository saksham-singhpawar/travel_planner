import React from "react";
import { motion } from "framer-motion";
import { FaStar, FaMapMarkerAlt, FaPlane } from "react-icons/fa";
import "./Home.css";

const destinations = [
  {
    id: 1,
    name: "Paris, France",
    image: "/images/paris.jpg",
    description: "Experience the romance, cuisine, and iconic landmarks of the City of Light.",
    rating: 4.8,
    duration: "5-7 days"
  },
  {
    id: 2,
    name: "Santorini, Greece",
    image: "/images/santorini.jpg",
    description: "Explore stunning white buildings, blue domes, and breathtaking sunsets.",
    rating: 4.9,
    duration: "4-6 days"
  },
  {
    id: 3,
    name: "Tokyo, Japan",
    image: "/images/tokyo.jpg",
    description: "Discover a perfect blend of traditional culture and futuristic technology.",
    rating: 4.7,
    duration: "7-10 days"
  },
  {
    id: 4,
    name: "Bali, Indonesia",
    image: "/images/bali.jpg",
    description: "Relax on beautiful beaches and immerse yourself in rich spiritual culture.",
    rating: 4.6,
    duration: "8-12 days"
  }
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12
    }
  }
};

function FeaturedDestinations() {
  return (
    <section className="featured-destinations-section">
      <div className="section-container">
        <h2 className="section-title">Popular Destinations</h2>
        <p className="section-subtitle">Explore these incredible locations loved by our travelers</p>
        
        <motion.div 
          className="destinations-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {destinations.map((destination) => (
            <motion.div 
              className="destination-card" 
              key={destination.id}
              variants={itemVariants}
            >
              <div className="destination-image-container">
                <img src={destination.image} alt={destination.name} />
                <div className="destination-overlay">
                  <span className="destination-duration">
                    <FaPlane /> {destination.duration}
                  </span>
                </div>
              </div>
              <div className="destination-content">
                <h3 className="destination-name">
                  <FaMapMarkerAlt className="destination-icon" /> 
                  {destination.name}
                </h3>
                <p className="destination-description">{destination.description}</p>
                <div className="destination-rating">
                  <span className="rating-score">{destination.rating}</span>
                  <div className="rating-stars">
                    {[...Array(5)].map((_, i) => (
                      <FaStar 
                        key={i} 
                        className={i < Math.floor(destination.rating) ? "star filled" : "star"} 
                      />
                    ))}
                  </div>
                </div>
                <button className="destination-button">Explore</button>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <div className="view-all-container">
          <button className="view-all-button">View All Destinations</button>
        </div>
      </div>
    </section>
  );
}

export default FeaturedDestinations; 