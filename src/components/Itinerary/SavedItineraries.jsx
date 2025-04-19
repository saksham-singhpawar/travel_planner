import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Itinerary.css';

const SavedItineraries = ({ itineraries, onSelect, onDelete }) => {
  const [showAll, setShowAll] = useState(false);

  // If no saved itineraries, don't render anything
  if (!itineraries || itineraries.length === 0) {
    return null;
  }

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  // Format date nicely
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <motion.div
      className="saved-itineraries-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.4 }}
    >
      <h3 onClick={toggleShowAll} className="saved-itineraries-title">
        Saved Itineraries ({itineraries.length})
        <span className="toggle-icon">{showAll ? '▲' : '▼'}</span>
      </h3>
      
      <AnimatePresence>
        {showAll && (
          <motion.div
            className="saved-itineraries-list"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {itineraries.map((item) => (
              <motion.div 
                key={item.id} 
                className="saved-itinerary-item"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="itinerary-info">
                  <h4>{item.destination}</h4>
                  <p>{formatDate(item.startDate)} - {formatDate(item.endDate)}</p>
                  <small>Created on {formatDate(item.createdAt)}</small>
                </div>
                <div className="itinerary-actions">
                  <button 
                    className="view-btn"
                    onClick={() => onSelect(item.content)}
                  >
                    View
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to delete this ${item.destination} itinerary?`)) {
                        onDelete(item.id);
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SavedItineraries; 