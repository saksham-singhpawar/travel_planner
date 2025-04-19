import React from "react";
import { motion } from "framer-motion";
import HeroSection from "./HeroSection";
import ServiceDescription from "./ServiceDescription";
import FeaturedDestinations from "./FeaturedDestinations";
import Testimonials from "./Testimonials";
import TravelStats from "./TravelStats";
import "./Home.css";

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 50
  },
  in: {
    opacity: 1,
    y: 0
  },
  exit: {
    opacity: 0,
    y: -50
  }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5
};

function Home() {
  return (
    <motion.div 
      className="home"
      initial="initial"
      animate="in"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
    >
      <HeroSection />
      <ServiceDescription />
      <FeaturedDestinations />
      <TravelStats />
      <Testimonials />
    </motion.div>
  );
}

export default Home;
