import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import GalleryPage from "./components/Gallery/GalleryPage";
import Itinerary from "./components/Itinerary/Itinerary"; 
import Contact from "./components/Contact/Contact"; 
import Header from "./components/Home/Header"; 

function App() {
  return (
    <Router>
      <Header /> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/itinerary" element={<Itinerary />} />
        <Route path="/contact" element={<Contact />} /> 
      </Routes>
    </Router>
  );
}

export default App;
