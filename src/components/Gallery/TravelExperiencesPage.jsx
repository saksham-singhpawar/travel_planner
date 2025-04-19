import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../Home/Header";
import { FaMapMarkerAlt, FaCalendarAlt, FaTag, FaHeart, FaRegHeart, FaSearch } from "react-icons/fa";
import "./Experience.css";

// Travel experiences data
const experiences = [
  {
    id: 1,
    title: "Sunrise at Santorini",
    location: "Santorini, Greece",
    image: "/images/sunrise-santorini.jpg",
    date: "June 15, 2023",
    category: "Scenic Views",
    description: "Watching the sunrise over the caldera with its white-washed buildings and blue domes is an unforgettable experience."
  },
  {
    id: 2,
    title: "Cherry Blossom Festival",
    location: "Tokyo, Japan",
    image: "/images/cherry-blossom-tokyo.jpg",
    date: "April 3, 2023",
    category: "Cultural",
    description: "Experiencing hanami (cherry blossom viewing) in Japan is magical. The parks are filled with people celebrating the fleeting beauty of the sakura."
  },
  {
    id: 3,
    title: "Safari Adventure",
    location: "Serengeti, Tanzania",
    image: "/images/safari-serengeti.jpg",
    date: "August 22, 2023",
    category: "Adventure",
    description: "Witnessing the great migration with thousands of wildebeest crossing the plains is one of nature's most spectacular displays."
  },
  {
    id: 4,
    title: "Northern Lights",
    location: "Tromsø, Norway",
    image: "/images/northern-lights-tromso.jpg",
    date: "January 10, 2023",
    category: "Scenic Views",
    description: "The dancing aurora borealis illuminating the night sky is truly one of the most beautiful natural phenomena on Earth."
  },
  {
    id: 5,
    title: "Street Food Tour",
    location: "Bangkok, Thailand",
    image: "/images/street-food-bangkok.jpg",
    date: "May 5, 2023",
    category: "Food & Cuisine",
    description: "Exploring the bustling street food scene in Bangkok offers an authentic taste of Thai flavors and culture."
  },
  {
    id: 6,
    title: "Snorkeling the Great Barrier Reef",
    location: "Queensland, Australia",
    image: "/images/great-barrier-reef-queensland.jpg",
    date: "February 28, 2023",
    category: "Adventure",
    description: "Swimming alongside colorful coral and tropical fish in the world's largest reef system is a breathtaking underwater adventure."
  },
  {
    id: 7,
    title: "Trekking to Machu Picchu",
    location: "Cusco, Peru",
    image: "/images/machu-picchu-peru.jpg",
    date: "July 18, 2023",
    category: "Adventure",
    description: "Hiking the Inca Trail to discover the ancient citadel of Machu Picchu hidden among the clouds is the journey of a lifetime."
  },
  {
    id: 8,
    title: "Sunset Desert Safari",
    location: "Dubai, UAE",
    image: "/images/dubai-desert-safari.jpg",
    date: "November 12, 2023",
    category: "Adventure",
    description: "Dune bashing, camel riding, and watching the sunset over the golden desert sands offers a magical Arabian experience."
  },
  {
    id: 9,
    title: "Vineyard Tours in Tuscany",
    location: "Florence, Italy",
    image: "/images/tuscany-vineyard-tour.jpg",
    date: "September 30, 2023",
    category: "Food & Cuisine",
    description: "Sampling exquisite wines while overlooking the rolling hills and cypress trees of the Tuscan countryside is pure bliss."
  }
];

// Get unique categories from experiences
const categories = ["All", ...new Set(experiences.map(exp => exp.category))];

function TravelExperiencesPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredExperiences, setFilteredExperiences] = useState(experiences);
  const [favorites, setFavorites] = useState([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Effect to filter experiences based on category, search, and favorites
  useEffect(() => {
    let result = experiences;
    
    // Filter by category
    if (activeCategory !== "All") {
      result = result.filter(exp => exp.category === activeCategory);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        exp => 
          exp.title.toLowerCase().includes(query) ||
          exp.location.toLowerCase().includes(query) ||
          exp.description.toLowerCase().includes(query)
      );
    }
    
    // Filter by favorites
    if (showFavoritesOnly) {
      result = result.filter(exp => favorites.includes(exp.id));
    }
    
    setFilteredExperiences(result);
  }, [activeCategory, searchQuery, favorites, showFavoritesOnly]);

  // Toggle favorite status
  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(favId => favId !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  return (
    <div className="travel-experiences-page">
      <Header />
      
      <div className="experiences-container">
        <motion.h1 
          className="experiences-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Travel Experiences
        </motion.h1>
        
        <motion.p 
          className="experiences-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Discover amazing travel moments from around the world
        </motion.p>
        
        <div className="search-filter-container">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Search experiences..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="favorites-toggle">
            <label className="toggle-label">
              <input 
                type="checkbox" 
                checked={showFavoritesOnly}
                onChange={() => setShowFavoritesOnly(!showFavoritesOnly)}
              />
              <span className="toggle-text">Show Favorites Only</span>
            </label>
          </div>
        </div>
        
        <div className="categories-container">
          {categories.map(category => (
            <button
              key={category}
              className={`category-btn ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        
        <div className="experiences-results">
          <p className="results-count">
            Showing {filteredExperiences.length} {filteredExperiences.length === 1 ? 'experience' : 'experiences'}
          </p>
        </div>
        
        <motion.div 
          className="experiences-grid"
          layout
        >
          <AnimatePresence>
            {filteredExperiences.map(experience => (
              <motion.div 
                key={experience.id}
                className="experience-card"
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -10 }}
              >
                <div className="experience-image-container">
                  <img src={experience.image} alt={experience.title} />
                  <button 
                    className="favorite-btn"
                    onClick={() => toggleFavorite(experience.id)}
                  >
                    {favorites.includes(experience.id) 
                      ? <FaHeart className="heart-filled" /> 
                      : <FaRegHeart className="heart-outline" />}
                  </button>
                  <div className="experience-category">
                    <FaTag className="category-icon" />
                    <span>{experience.category}</span>
                  </div>
                </div>
                
                <div className="experience-content">
                  <h2 className="experience-title">{experience.title}</h2>
                  
                  <div className="experience-meta">
                    <div className="experience-location">
                      <FaMapMarkerAlt className="meta-icon" />
                      <span>{experience.location}</span>
                    </div>
                    <div className="experience-date">
                      <FaCalendarAlt className="meta-icon" />
                      <span>{experience.date}</span>
                    </div>
                  </div>
                  
                  <p className="experience-description">{experience.description}</p>
                  
                  <button className="view-details-btn">View Details</button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        
        {filteredExperiences.length === 0 && (
          <div className="no-results">
            <h3>No experiences found</h3>
            <p>Try changing your search criteria or category filter</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TravelExperiencesPage; 