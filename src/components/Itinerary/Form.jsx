import React, { useState } from "react";
import axios from "axios";
import "./Itinerary.css";

function Form({ setItinerary, setLoading }) {
  const [formData, setFormData] = useState({
    fromLocation: "",  // ✅ Added Starting Location
    destination: "",
    startDate: "",
    endDate: "",
    budget: "",
    preferences: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateItinerary = async () => {
    setLoading(true);  // ✅ Show loading animation

    try {
      console.log("Sending request to backend...", formData);
      const response = await axios.post("http://localhost:7000/api/plan-trip", formData);
      console.log("Response received:", response.data);
      setItinerary(response.data.itinerary);  
    } catch (error) {
      console.error("Error fetching itinerary:", error);
      alert("Failed to generate itinerary. Check console for details.");
    }

    setLoading(false);  // ✅ Hide loading animation
  };

  return (
    <div className="form-container">
      <input type="text" name="fromLocation" placeholder="Starting Location" onChange={handleChange} />
      <input type="text" name="destination" placeholder="Destination" onChange={handleChange} />
      <input type="date" name="startDate" onChange={handleChange} />
      <input type="date" name="endDate" onChange={handleChange} />
      <input type="number" name="budget" placeholder="Budget ($)" onChange={handleChange} />
      <input type="text" name="preferences" placeholder="Preferences (Adventure, Beaches, Food...)" onChange={handleChange} />
      <button onClick={generateItinerary}>Generate Itinerary</button>
    </div>
  );
}

export default Form;
