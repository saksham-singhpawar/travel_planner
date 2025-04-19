import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import Form from "./Form";
import ItineraryDisplay from "./ItineraryDisplay";
import WeatherWidget from "./WeatherWidget";
import SavedItineraries from './SavedItineraries';
import "./Itinerary.css";

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    x: 100
  },
  in: {
    opacity: 1,
    x: 0
  },
  exit: {
    opacity: 0,
    x: -100
  }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5
};

function Itinerary() {
  const [itinerary, setItinerary] = useState('');
  const [loading, setLoading] = useState(false);
  const [budget, setBudget] = useState(0);
  const [preferences, setPreferences] = useState([]);
  const [destination, setDestination] = useState('');
  const [savedItineraries, setSavedItineraries] = useState(() => {
    const saved = localStorage.getItem('savedItineraries');
    return saved ? JSON.parse(saved) : [];
  });

  // Save itineraries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('savedItineraries', JSON.stringify(savedItineraries));
  }, [savedItineraries]);

  const handleBudgetUpdate = (newBudget) => {
    setBudget(parseFloat(newBudget) || 0);
  };

  const handleDestinationUpdate = (newDestination) => {
    setDestination(newDestination);
  };

  const generateItinerary = async (formData) => {
    setLoading(true);
    setItinerary('');
    
    try {
      // In a real app, this would be an API call to a backend service
      // For demo purposes, we'll create a simulated delay and response
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Create a sample itinerary based on the formData
      const sampleItinerary = createSampleItinerary(formData);
      setItinerary(sampleItinerary);
      
      // Handle saving the new itinerary if it's unique
      if (sampleItinerary) {
        const newItinerary = {
          id: Date.now(),
          destination: formData.destination,
          startDate: formData.startDate,
          endDate: formData.endDate,
          content: sampleItinerary,
          createdAt: new Date().toISOString()
        };
        
        // Check if we already have an itinerary with the same destination and dates
        const isDuplicate = savedItineraries.some(
          saved => 
            saved.destination === newItinerary.destination && 
            saved.startDate === newItinerary.startDate && 
            saved.endDate === newItinerary.endDate
        );
        
        if (!isDuplicate) {
          setSavedItineraries(prev => [newItinerary, ...prev]);
        }
      }
    } catch (error) {
      console.error("Error generating itinerary:", error);
      setItinerary("Sorry, there was an error generating your itinerary. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const deleteItinerary = (id) => {
    setSavedItineraries(prev => prev.filter(item => item.id !== id));
  };

  return (
    <motion.div 
      className="itinerary-page"
      initial="initial"
      animate="in"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
    >
      <motion.div className="itinerary-content-wrapper">
        <motion.h1 
          className="title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Plan Your Dream Trip ✈️
        </motion.h1>
        
        <motion.div
          className="itinerary-main"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Form 
            onSubmit={generateItinerary} 
            onBudgetChange={handleBudgetUpdate}
            onDestinationChange={handleDestinationUpdate}
            setPreferences={setPreferences}
          />
          
          <div className="planning-tools">
            {destination && !loading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="weather-container"
              >
                <WeatherWidget destination={destination} />
              </motion.div>
            )}
    </div>
          
          {itinerary ? (
            <ItineraryDisplay 
              itinerary={itinerary} 
              loading={loading} 
              destination={destination}
              preferences={preferences}
            />
          ) : loading ? (
            <ItineraryDisplay loading={loading} />
          ) : null}
          
          <SavedItineraries 
            itineraries={savedItineraries} 
            onDelete={deleteItinerary}
            onSelect={setItinerary}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// Helper function to create a sample itinerary based on form data
const createSampleItinerary = (formData) => {
  const { destination, startDate, endDate, budget, preferences } = formData;
  
  // Calculate trip duration
  const start = new Date(startDate);
  const end = new Date(endDate);
  const tripDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  
  // Format dates for display
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  // Generate a personalized greeting
  let itinerary = `**Your ${tripDays}-Day Adventure in ${destination}**\n\n`;
  
  // Add trip summary
  itinerary += `**Trip Summary:**\n`;
  itinerary += `* Destination: ${destination}\n`;
  itinerary += `* Duration: ${tripDays} days\n`;
  itinerary += `* Dates: ${formatDate(startDate)} to ${formatDate(endDate)}\n`;
  itinerary += `* Budget: $${budget}\n\n`;
  
  // Convert preferences string to array if it's a string
  const preferencesArray = typeof preferences === 'string' 
    ? preferences.split(',').map(p => p.trim()).filter(p => p !== '') 
    : (Array.isArray(preferences) ? preferences : []);
  
  if (preferencesArray.length > 0) {
    itinerary += `**Your Preferences:**\n`;
    preferencesArray.forEach(pref => {
      itinerary += `* ${pref}\n`;
    });
    itinerary += '\n';
  }
  
  // Add custom itinerary for each destination
  if (destination.toLowerCase().includes('paris')) {
    itinerary += createParisItinerary(tripDays, preferencesArray, budget);
  } else if (destination.toLowerCase().includes('tokyo')) {
    itinerary += createTokyoItinerary(tripDays, preferencesArray, budget);
  } else if (destination.toLowerCase().includes('new york')) {
    itinerary += createNewYorkItinerary(tripDays, preferencesArray, budget);
  } else {
    itinerary += createGenericItinerary(destination, tripDays, preferencesArray, budget);
  }
  
  // Add trip tips based on preferences
  itinerary += `\n**Travel Tips:**\n`;
  
  if (preferencesArray.some(p => p.toLowerCase().includes('food') || p.toLowerCase().includes('dining'))) {
    itinerary += `* Research and make reservations at popular restaurants in advance\n`;
    itinerary += `* Try local street food for an authentic experience\n`;
  }
  
  if (preferencesArray.some(p => p.toLowerCase().includes('sight'))) {
    itinerary += `* Buy city passes for discounted attraction entry\n`;
    itinerary += `* Consider guided tours for historical context\n`;
  }
  
  if (preferencesArray.some(p => p.toLowerCase().includes('culture'))) {
    itinerary += `* Learn a few phrases in the local language\n`;
    itinerary += `* Visit during local festivals if possible\n`;
  }
  
  if (preferencesArray.some(p => p.toLowerCase().includes('adventure'))) {
    itinerary += `* Book adventure activities in advance\n`;
    itinerary += `* Check if you need special insurance coverage\n`;
  }
  
  if (preferencesArray.some(p => p.toLowerCase().includes('relax'))) {
    itinerary += `* Pack comfortable clothing and footwear\n`;
    itinerary += `* Schedule downtime between activities\n`;
  }
  
  // Add packing suggestions
  itinerary += `\n**Packing Suggestions:**\n`;
  itinerary += `* Travel documents (passport, visa, insurance)\n`;
  itinerary += `* Appropriate clothing for the season\n`;
  itinerary += `* Comfortable walking shoes\n`;
  itinerary += `* Travel adapter/converter\n`;
  itinerary += `* Basic medications and first aid\n`;
  itinerary += `* Camera/phone for photos\n`;
  
  return itinerary;
};

// Helper functions for destination-specific itineraries
const createParisItinerary = (days, preferences, budget) => {
  let itinerary = '';
  const budgetPerDay = budget / days;
  
  // Day 1 is always Eiffel Tower and Seine
  itinerary += `**Day 1: Welcome to Paris!**\n`;
  itinerary += `* Morning: Arrive and check in to your accommodation\n`;
  itinerary += `* Afternoon: Visit the Eiffel Tower (€26 for summit access)\n`;
  itinerary += `* Evening: Seine River cruise (€15) followed by dinner at a local bistro\n\n`;
  
  if (days >= 2) {
    itinerary += `**Day 2: Art and Culture**\n`;
    itinerary += `* Morning: Louvre Museum (€17) - home to Mona Lisa\n`;
    
    if (preferences.some(p => p.toLowerCase().includes('food') || p.toLowerCase().includes('dining'))) {
      itinerary += `* Lunch: Gourmet experience at Café Marly overlooking the Louvre pyramid\n`;
    } else {
      itinerary += `* Lunch: Picnic in the Tuileries Garden\n`;
    }
    
    itinerary += `* Afternoon: Explore Le Marais district\n`;
    itinerary += `* Evening: Dinner in the Latin Quarter\n\n`;
  }
  
  if (days >= 3) {
    itinerary += `**Day 3: Historic Paris**\n`;
    itinerary += `* Morning: Notre-Dame Cathedral (exterior view due to reconstruction)\n`;
    itinerary += `* Midday: Sainte-Chapelle (€11.50) and Conciergerie\n`;
    
    if (preferences.some(p => p.toLowerCase().includes('culture'))) {
      itinerary += `* Afternoon: French cooking class (€90-150)\n`;
    } else {
      itinerary += `* Afternoon: Luxembourg Gardens and Saint-Germain-des-Prés\n`;
    }
    
    itinerary += `* Evening: Dinner cruise on the Seine (€70)\n\n`;
  }
  
  if (days >= 4) {
    itinerary += `**Day 4: Montmartre and Arts**\n`;
    itinerary += `* Morning: Sacré-Cœur Basilica (free) and Place du Tertre\n`;
    itinerary += `* Midday: Lunch at a traditional café in Montmartre\n`;
    
    if (preferences.some(p => p.toLowerCase().includes('sight'))) {
      itinerary += `* Afternoon: Musée d'Orsay (€16) with its impressive Impressionist collection\n`;
    } else if (budgetPerDay > 100) {
      itinerary += `* Afternoon: Shopping along Champs-Élysées\n`;
    } else {
      itinerary += `* Afternoon: Walk along the Canal Saint-Martin\n`;
    }
    
    itinerary += `* Evening: Moulin Rouge show (€115+) or jazz club in Saint-Germain\n\n`;
  }
  
  if (days >= 5) {
    itinerary += `**Day 5: Royal Experience**\n`;
    itinerary += `* Full day: Palace of Versailles excursion (€20 plus €18 train ticket)\n`;
    
    if (preferences.some(p => p.toLowerCase().includes('relax'))) {
      itinerary += `* Evening: Spa treatment at a Parisian spa\n\n`;
    } else {
      itinerary += `* Evening: Opera Garnier tour or performance\n\n`;
    }
  }
  
  // Additional days if applicable
  if (days > 5) {
    itinerary += `**Remaining Days: Explore Further**\n`;
    itinerary += `* Centre Pompidou (€14) for modern art\n`;
    itinerary += `* Day trip to Giverny to see Monet's gardens\n`;
    itinerary += `* Catacombs of Paris (€15) for a unique underground experience\n`;
    itinerary += `* Disneyland Paris day trip (€56+)\n`;
    itinerary += `* Explore the covered passages of Paris\n`;
    itinerary += `* Food tour of a Parisian market\n\n`;
  }
  
  return itinerary;
};

const createTokyoItinerary = (days, preferences, budget) => {
  let itinerary = '';
  const budgetPerDay = budget / days;
  
  // Day 1 is always Tokyo orientation
  itinerary += `**Day 1: Welcome to Tokyo!**\n`;
  itinerary += `* Morning: Arrive and check in to your accommodation\n`;
  itinerary += `* Afternoon: Visit Tokyo Metropolitan Government Building Observatory (free) for a panoramic view\n`;
  itinerary += `* Evening: Explore Shinjuku and dinner at an izakaya\n\n`;
  
  if (days >= 2) {
    itinerary += `**Day 2: Traditional Tokyo**\n`;
    itinerary += `* Morning: Meiji Shrine (free) and Yoyogi Park\n`;
    
    if (preferences.some(p => p.toLowerCase().includes('food') || p.toLowerCase().includes('dining'))) {
      itinerary += `* Lunch: Traditional Japanese cuisine in Harajuku\n`;
    } else {
      itinerary += `* Lunch: Quick bite at a 7-Eleven or Lawson (surprisingly good in Japan!)\n`;
    }
    
    itinerary += `* Afternoon: Takeshita Street in Harajuku for youth fashion\n`;
    itinerary += `* Evening: Shibuya Crossing and dinner nearby\n\n`;
  }
  
  if (days >= 3) {
    itinerary += `**Day 3: Historic Tokyo**\n`;
    itinerary += `* Morning: Imperial Palace Gardens (free)\n`;
    itinerary += `* Midday: Asakusa district and Senso-ji Temple\n`;
    
    if (preferences.some(p => p.toLowerCase().includes('culture'))) {
      itinerary += `* Afternoon: Tea ceremony experience (¥4,000-6,000)\n`;
    } else {
      itinerary += `* Afternoon: Tokyo National Museum (¥1,000)\n`;
    }
    
    itinerary += `* Evening: River cruise on the Sumida River\n\n`;
  }
  
  if (days >= 4) {
    itinerary += `**Day 4: Modern Tokyo**\n`;
    itinerary += `* Morning: TeamLab Borderless Digital Art Museum (¥3,200)\n`;
    
    if (preferences.some(p => p.toLowerCase().includes('sight'))) {
      itinerary += `* Midday: Tokyo SkyTree (¥2,100) for city views\n`;
    } else if (budgetPerDay > 100) {
      itinerary += `* Midday: Shopping in Ginza\n`;
    } else {
      itinerary += `* Midday: Explore Akihabara Electric Town\n`;
    }
    
    itinerary += `* Evening: Explore Roppongi Hills and dinner\n\n`;
  }
  
  if (days >= 5) {
    itinerary += `**Day 5: Day Trip**\n`;
    
    if (preferences.includes('Adventure Activities')) {
      itinerary += `* Full day: Mount Fuji and Hakone tour (¥13,000+)\n`;
    } else if (preferences.includes('Cultural Experiences')) {
      itinerary += `* Full day: Kamakura with the Great Buddha (¥3,000 for transport plus temple fees)\n`;
    } else {
      itinerary += `* Full day: Nikko National Park and shrines (¥8,000+ for tour)\n`;
    }
    
    itinerary += `* Evening: Relaxing onsen bath if in Hakone, or return to Tokyo\n\n`;
  }
  
  // Additional days if applicable
  if (days > 5) {
    itinerary += `**Remaining Days: Explore Further**\n`;
    itinerary += `* Ueno Park and its museums\n`;
    itinerary += `* Tsukiji Outer Market for food lovers\n`;
    itinerary += `* Odaiba entertainment district\n`;
    itinerary += `* Day trip to Yokohama Chinatown\n`;
    itinerary += `* Tokyo Disneyland or DisneySea\n`;
    itinerary += `* Robot Restaurant show in Shinjuku\n\n`;
  }
  
  return itinerary;
};

const createNewYorkItinerary = (days, preferences, budget) => {
  let itinerary = '';
  const budgetPerDay = budget / days;
  
  // Day 1 is always Central Park and Midtown
  itinerary += `**Day 1: Welcome to New York City!**\n`;
  itinerary += `* Morning: Arrive and check in to your accommodation\n`;
  itinerary += `* Afternoon: Explore Central Park\n`;
  itinerary += `* Evening: Times Square and dinner nearby\n\n`;
  
  if (days >= 2) {
    itinerary += `**Day 2: Iconic NYC**\n`;
    
    if (preferences.some(p => p.toLowerCase().includes('sight'))) {
      itinerary += `* Morning: Empire State Building ($44) for city views\n`;
    } else {
      itinerary += `* Morning: Grand Central Terminal (free) and the New York Public Library\n`;
    }
    
    itinerary += `* Midday: Walk along Fifth Avenue\n`;
    
    if (preferences.some(p => p.toLowerCase().includes('food') || p.toLowerCase().includes('dining'))) {
      itinerary += `* Lunch: Classic New York deli experience\n`;
    } else {
      itinerary += `* Lunch: Food hall at Bryant Park\n`;
    }
    
    itinerary += `* Afternoon: MoMA (Museum of Modern Art, $25) or Rockefeller Center\n`;
    itinerary += `* Evening: Broadway show (ticket prices vary, typically $100+)\n\n`;
  }
  
  if (days >= 3) {
    itinerary += `**Day 3: Downtown Exploration**\n`;
    itinerary += `* Morning: Statue of Liberty and Ellis Island ($24.50 for ferry and access)\n`;
    itinerary += `* Midday: Financial District and Wall Street\n`;
    
    if (preferences.some(p => p.toLowerCase().includes('culture'))) {
      itinerary += `* Afternoon: 9/11 Memorial & Museum ($28)\n`;
    } else {
      itinerary += `* Afternoon: Walk across the Brooklyn Bridge\n`;
    }
    
    itinerary += `* Evening: Dinner in Chinatown or Little Italy\n\n`;
  }
  
  if (days >= 4) {
    itinerary += `**Day 4: Museum and Culture Day**\n`;
    
    if (preferences.some(p => p.toLowerCase().includes('adventure'))) {
      itinerary += `* Morning: Bike rental and ride through Central Park ($15-20/hour)\n`;
    } else {
      itinerary += `* Morning: Metropolitan Museum of Art ($25 suggested donation)\n`;
    }
    
    itinerary += `* Midday: Lunch on the Upper East Side\n`;
    
    if (budgetPerDay > 150) {
      itinerary += `* Afternoon: Shopping in SoHo\n`;
    } else {
      itinerary += `* Afternoon: High Line elevated park (free)\n`;
    }
    
    itinerary += `* Evening: Dinner and comedy show in Greenwich Village\n\n`;
  }
  
  if (days >= 5) {
    itinerary += `**Day 5: Borough Exploration**\n`;
    
    if (preferences.some(p => p.toLowerCase().includes('food') || p.toLowerCase().includes('dining'))) {
      itinerary += `* Morning: Food tour in Brooklyn ($50-70)\n`;
    } else {
      itinerary += `* Morning: Brooklyn Heights Promenade and DUMBO\n`;
    }
    
    itinerary += `* Midday: Explore Williamsburg, Brooklyn\n`;
    
    if (preferences.some(p => p.toLowerCase().includes('relax'))) {
      itinerary += `* Afternoon: Spa day or Brooklyn Botanic Garden ($18)\n`;
    } else {
      itinerary += `* Afternoon: Brooklyn Museum ($16 suggested donation)\n`;
    }
    
    itinerary += `* Evening: Dinner with a view at a rooftop restaurant\n\n`;
  }
  
  // Additional days if applicable
  if (days > 5) {
    itinerary += `**Remaining Days: Explore Further**\n`;
    itinerary += `* Bronx Zoo or New York Botanical Garden\n`;
    itinerary += `* Coney Island (seasonal)\n`;
    itinerary += `* The Cloisters museum and gardens\n`;
    itinerary += `* Queens food tour for international cuisine\n`;
    itinerary += `* Day trip to Hudson Valley or Beacon\n`;
    itinerary += `* Shopping at Hudson Yards and The Vessel\n\n`;
  }
  
  return itinerary;
};

const createGenericItinerary = (destination, days, preferences, budget) => {
  let itinerary = '';
  const budgetPerDay = budget / days;
  
  // Day 1 is always orientation and settling in
  itinerary += `**Day 1: Welcome to ${destination}!**\n`;
  itinerary += `* Morning: Arrive and check in to your accommodation\n`;
  itinerary += `* Afternoon: Orientation walk around your neighborhood\n`;
  itinerary += `* Evening: Dinner at a local restaurant to try regional cuisine\n\n`;
  
  // Remaining days
  for (let day = 2; day <= days; day++) {
    itinerary += `**Day ${day}: Exploring ${destination}**\n`;
    
    // Morning activities based on preferences
    if (day % 3 === 0 && preferences.some(p => p.toLowerCase().includes('sight'))) {
      itinerary += `* Morning: Visit the main historical sites and monuments\n`;
    } else if (day % 3 === 1 && preferences.some(p => p.toLowerCase().includes('culture'))) {
      itinerary += `* Morning: Visit local museums or cultural centers\n`;
    } else if (day % 3 === 2 && preferences.some(p => p.toLowerCase().includes('adventure'))) {
      itinerary += `* Morning: Outdoor adventure or hiking in nearby natural areas\n`;
    } else {
      itinerary += `* Morning: Explore the downtown area and local markets\n`;
    }
    
    // Midday meal based on budget
    if (budgetPerDay > 100 && preferences.some(p => p.toLowerCase().includes('food') || p.toLowerCase().includes('dining'))) {
      itinerary += `* Lunch: Fine dining experience with local specialties\n`;
    } else {
      itinerary += `* Lunch: Casual meal at a local favorite spot\n`;
    }
    
    // Afternoon activities
    if (day % 2 === 0 && preferences.some(p => p.toLowerCase().includes('relax'))) {
      itinerary += `* Afternoon: Relax at a park, beach, or spa\n`;
    } else if (preferences.some(p => p.toLowerCase().includes('shop'))) {
      itinerary += `* Afternoon: Shopping at local boutiques and artisan shops\n`;
    } else {
      itinerary += `* Afternoon: Visit another neighborhood and discover hidden gems\n`;
    }
    
    // Evening plans
    if (day === days) {
      itinerary += `* Evening: Farewell dinner and reflecting on your journey\n\n`;
    } else if (day % 4 === 0 && preferences.some(p => p.toLowerCase().includes('night'))) {
      itinerary += `* Evening: Experience local nightlife and entertainment\n\n`;
    } else if (day % 4 === 2 && preferences.some(p => p.toLowerCase().includes('culture'))) {
      itinerary += `* Evening: Attend a cultural performance or local event\n\n`;
    } else {
      itinerary += `* Evening: Dinner and leisurely stroll to see the city at night\n\n`;
    }
  }
  
  return itinerary;
};

export default Itinerary;
