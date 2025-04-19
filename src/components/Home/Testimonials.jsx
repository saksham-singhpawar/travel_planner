import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaQuoteLeft, FaChevronLeft, FaChevronRight, FaStar } from "react-icons/fa";
import "./Home.css";

const testimonials = [
  {
    id: 1,
    name: "Emma Johnson",
    location: "London, UK",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    text: "This travel planner made our trip to Japan so much easier! The AI suggested places we never would have found on our own. Will definitely use for all our future trips!",
    rating: 5
  },
  {
    id: 2,
    name: "Michael Chen",
    location: "Toronto, Canada",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    text: "The attention to detail in our itinerary was amazing. Every restaurant recommendation was perfect for our tastes, and the activities matched exactly what we were looking for.",
    rating: 5
  },
  {
    id: 3,
    name: "Sophia Martinez",
    location: "Barcelona, Spain",
    image: "https://randomuser.me/api/portraits/women/66.jpg",
    text: "I was skeptical about an AI travel planner at first, but I was blown away by how personalized everything felt. It's like having a friend who knows all the best spots!",
    rating: 4
  },
  {
    id: 4,
    name: "David Wilson",
    location: "Sydney, Australia",
    image: "https://randomuser.me/api/portraits/men/22.jpg",
    text: "As someone who hates planning trips, this tool is a lifesaver. In minutes, I had a complete itinerary that perfectly matched our interests and budget. Incredible!",
    rating: 5
  }
];

const variants = {
  enter: (direction) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    };
  }
};

function Testimonials() {
  const [[page, direction], setPage] = useState([0, 0]);
  const [autoplay, setAutoplay] = useState(true);
  
  // Calculate current testimonial index
  const testimonialIndex = ((page % testimonials.length) + testimonials.length) % testimonials.length;
  
  // Handle changing to the next/previous testimonial
  const paginate = (newDirection) => {
    setAutoplay(false);
    setPage([page + newDirection, newDirection]);
  };
  
  // Autoplay functionality
  useEffect(() => {
    if (!autoplay) return;
    
    const timer = setTimeout(() => {
      setPage([page + 1, 1]);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [page, autoplay]);

  return (
    <section className="testimonials-section">
      <div className="section-container">
        <h2 className="section-title">What Our Travelers Say</h2>
        <p className="section-subtitle">Real experiences from people who've used our service</p>
        
        <div className="testimonials-carousel-container">
          <button className="testimonial-arrow prev" onClick={() => paginate(-1)}>
            <FaChevronLeft />
          </button>
          
          <div className="testimonials-wrapper">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={page}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                className="testimonial-card"
              >
                <div className="testimonial-quote">
                  <FaQuoteLeft className="quote-icon" />
                </div>
                <p className="testimonial-text">{testimonials[testimonialIndex].text}</p>
                <div className="testimonial-rating">
                  {[...Array(5)].map((_, i) => (
                    <FaStar 
                      key={i} 
                      className={i < testimonials[testimonialIndex].rating ? "star filled" : "star"} 
                    />
                  ))}
                </div>
                <div className="testimonial-author">
                  <div className="author-image">
                    <img src={testimonials[testimonialIndex].image} alt={testimonials[testimonialIndex].name} />
                  </div>
                  <div className="author-info">
                    <h3 className="author-name">{testimonials[testimonialIndex].name}</h3>
                    <p className="author-location">{testimonials[testimonialIndex].location}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          
          <button className="testimonial-arrow next" onClick={() => paginate(1)}>
            <FaChevronRight />
          </button>
        </div>
        
        <div className="testimonial-dots">
          {testimonials.map((_, i) => (
            <span 
              key={i} 
              className={`testimonial-dot ${testimonialIndex === i ? 'active' : ''}`}
              onClick={() => {
                setAutoplay(false);
                setPage([i, i > testimonialIndex ? 1 : -1]);
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials; 