import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FaMapMarkedAlt, FaUsers, FaCalendarCheck, FaStar } from "react-icons/fa";
import "./Home.css";

const stats = [
  {
    id: 1,
    icon: <FaMapMarkedAlt />,
    title: "Destinations",
    value: 120,
    suffix: "+",
    color: "#ff6b6b"
  },
  {
    id: 2,
    icon: <FaUsers />,
    title: "Happy Travelers",
    value: 15000,
    suffix: "+",
    color: "#4ecdc4"
  },
  {
    id: 3,
    icon: <FaCalendarCheck />,
    title: "Trips Planned",
    value: 25000,
    suffix: "+",
    color: "#ffbe0b"
  },
  {
    id: 4,
    icon: <FaStar />,
    title: "5-Star Reviews",
    value: 12500,
    suffix: "+",
    color: "#3a86ff"
  }
];

function Counter({ value, suffix, duration = 2 }) {
  const [count, setCount] = useState(0);
  const nodeRef = useRef(null);
  const isInView = useInView(nodeRef, { once: true, amount: 0.5 });
  
  useEffect(() => {
    if (!isInView) return;
    
    let start = 0;
    const end = parseInt(value.toString().substring(0, 3));
    const incrementTime = duration / end * 1000;
    
    // Don't run counter for very large numbers, just jump to them
    if (value > 10000) {
      setCount(value);
      return;
    }
    
    let timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);
    
    return () => {
      clearInterval(timer);
    };
  }, [value, duration, isInView]);
  
  // Format the count to include commas
  const formattedCount = value > 10000 
    ? value.toLocaleString() 
    : count.toLocaleString();
  
  return (
    <span ref={nodeRef} className="counter-value">
      {isInView ? formattedCount : "0"}
      {suffix}
    </span>
  );
}

function TravelStats() {
  return (
    <section className="stats-section">
      <div className="section-container">
        <motion.div 
          className="stats-grid"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {stats.map((stat) => (
            <motion.div 
              key={stat.id}
              className="stat-card"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: stat.id * 0.1 }}
            >
              <div className="stat-icon" style={{ color: stat.color }}>
                {stat.icon}
              </div>
              <h3 className="stat-value">
                <Counter value={stat.value} suffix={stat.suffix} />
              </h3>
              <p className="stat-title">{stat.title}</p>
            </motion.div>
          ))}
        </motion.div>
        
        <div className="stats-message">
          <h2>Your dream vacation is just a few clicks away</h2>
          <button className="stats-cta-button" onClick={() => window.location.href = '/itinerary'}>
            Start Planning Now
          </button>
        </div>
      </div>
    </section>
  );
}

export default TravelStats; 