import React from "react";
import Header from "./Header"; // ✅ Fixed Import Path
import HeroSection from "./HeroSection";
import ServiceDescription from "./ServiceDescription";
import "./Home.css";

function Home() {
  return (
    <div className="home">
      <Header /> {/* ✅ Header inside Home Folder */}
      <HeroSection />
      <ServiceDescription />
    </div>
  );
}

export default Home;
