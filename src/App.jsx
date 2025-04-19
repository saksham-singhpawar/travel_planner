import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Home from "./components/Home/Home";
import TravelExperiencesPage from "./components/Gallery/TravelExperiencesPage";
import Itinerary from "./components/Itinerary/Itinerary"; 
import Contact from "./components/Contact/Contact"; 
import Header from "./components/Home/Header"; 
import Checklist from "./components/Checklist/Checklist";
import Auth from "./components/Auth/Auth";
import "./App.css";

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<TravelExperiencesPage />} />
        <Route path="/itinerary" element={<Itinerary />} />
        <Route path="/contact" element={<Contact />} /> 
        <Route path="/checklist" element={<Checklist />} />
        <Route path="/signin" element={<Auth />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <Header /> 
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
