import React, { useState } from "react";
import Form from "./Form";
import ItineraryDisplay from "./ItineraryDisplay";
import "./Itinerary.css";

function Itinerary() {
  const [itinerary, setItinerary] = useState(null);  // ✅ Store structured itinerary
  const [loading, setLoading] = useState(false);  // ✅ Track API loading state

  return (
    <div className="itinerary-page">
      <h1 className="title">Plan Your Trip ✈️</h1>
      <Form setItinerary={setItinerary} setLoading={setLoading} />
      <ItineraryDisplay itinerary={itinerary} loading={loading} />
    </div>
  );
}

export default Itinerary;
