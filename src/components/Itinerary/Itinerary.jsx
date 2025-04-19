import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
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
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

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
      console.log("Generating itinerary with data:", formData);
      
      // In a real app, this would be an API call to a backend service
      // For demo purposes, we'll create a simulated delay and response
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Create a sample itinerary based on the formData
      const sampleItinerary = createSampleItinerary(formData);
      console.log("Generated itinerary:", sampleItinerary);
      
      setItinerary(sampleItinerary);
      
      // Handle saving the new itinerary if it's unique
      if (sampleItinerary) {
        const newItinerary = {
          id: Date.now(),
          destination: formData.destination,
          startDate: formData.startDate,
          endDate: formData.endDate,
          content: sampleItinerary,
          preferences: formData.preferences,
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

  const selectSavedItinerary = (savedItinerary) => {
    setItinerary(savedItinerary.content);
    // Update destination and preferences to match the saved itinerary
    setDestination(savedItinerary.destination);
    // If preferences were saved with the itinerary, use them; otherwise, use empty array
    setPreferences(savedItinerary.preferences || []);
  };

  const saveItinerary = (destination, preferences) => {
    // Only proceed if there is an itinerary to save
    if (itinerary) {
      const newItinerary = {
        id: Date.now(),
        destination: destination,
        startDate: new Date().toISOString(), // Default to current date since we don't have these values
        endDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(), // Default to 7 days
        content: itinerary,
        preferences: preferences || [],
        createdAt: new Date().toISOString()
      };
      
      // Check if we already have an itinerary with the same content
      const isDuplicate = savedItineraries.some(
        saved => saved.content === newItinerary.content
      );
      
      if (!isDuplicate) {
        setSavedItineraries(prev => [newItinerary, ...prev]);
        // Show success message
        setShowSaveSuccess(true);
        setTimeout(() => setShowSaveSuccess(false), 3000);
      } else {
        alert('This itinerary is already saved.');
      }
    }
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
      <AnimatePresence>
        {showSaveSuccess && (
          <motion.div
            className="save-success"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            Itinerary saved successfully!
          </motion.div>
        )}
      </AnimatePresence>
      
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
          
          {/* Debug output for itinerary state */}
          <div style={{ color: 'white', margin: '10px 0', textAlign: 'left', padding: '10px', background: 'rgba(0,0,0,0.5)', borderRadius: '5px' }}>
            <p>Itinerary state: {itinerary ? `Has content (${itinerary.length} chars)` : 'Empty'}</p>
            <p>Loading: {loading ? 'Yes' : 'No'}</p>
            <button 
              onClick={() => {
                console.log('Full itinerary:', itinerary);
                // Force a simple itinerary for testing
                const testItinerary = "**Day 1: Test**\n* Morning: Test activity\n* Afternoon: Test activity\n* Evening: Test activity";
                setItinerary(testItinerary);
              }}
              style={{ padding: '5px 10px', background: '#2575fc', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
            >
              Test Simple Itinerary
            </button>
          </div>
          
          {itinerary ? (
            <ItineraryDisplay 
              itinerary={itinerary} 
              onSave={saveItinerary}
              isGenerated={false}
              destination={destination}
              preferences={preferences}
            />
          ) : loading ? (
            <ItineraryDisplay loading={loading} />
          ) : null}
          
          <SavedItineraries 
            itineraries={savedItineraries} 
            onDelete={deleteItinerary}
            onSelect={selectSavedItinerary}
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

  // Simple guaranteed-to-work itinerary string
  let itinerary = `**Your ${tripDays}-Day Adventure in ${destination}**\n\n`;
  
  // Add trip summary
  itinerary += `**Trip Summary:**\n`;
  itinerary += `* Destination: ${destination}\n`;
  itinerary += `* Duration: ${tripDays} days\n`;
  itinerary += `* Dates: ${formatDate(startDate)} to ${formatDate(endDate)}\n`;
  itinerary += `* Budget: $${budget}\n\n`;
  
  // Add preferences section
  const preferencesArray = Array.isArray(preferences) ? preferences : [];
  if (preferencesArray.length > 0) {
    itinerary += `**Your Preferences:**\n`;
    preferencesArray.forEach(pref => {
      itinerary += `* ${pref}\n`;
    });
    itinerary += '\n';
  }
  
  // Add sample day itineraries
  for (let day = 1; day <= Math.min(tripDays, 5); day++) {
    itinerary += `**Day ${day}: Exploring ${destination}**\n`;
    itinerary += `* Morning: Breakfast at a local café\n`;
    itinerary += `* Afternoon: Visit main attractions\n`;
    itinerary += `* Evening: Dinner at a recommended restaurant\n\n`;
  }
  
  // Add budget breakdown section
  itinerary += `\n**Estimated Budget Breakdown:**\n`;
  itinerary += `* Accommodation: $${Math.round(budget * 0.40)} (40% of budget)\n`;
  itinerary += `* Food & Dining: $${Math.round(budget * 0.25)} (25% of budget)\n`;
  itinerary += `* Attractions & Activities: $${Math.round(budget * 0.15)} (15% of budget)\n`;
  itinerary += `* Local Transportation: $${Math.round(budget * 0.10)} (10% of budget)\n`;
  itinerary += `* Shopping & Souvenirs: $${Math.round(budget * 0.05)} (5% of budget)\n`;
  itinerary += `* Contingency Fund: $${Math.round(budget * 0.05)} (5% of budget)\n\n`;
  
  // Add accommodation recommendations
  itinerary += `**Accommodation Recommendations:**\n`;
  itinerary += `* Budget Option: Hostels or budget hotels ($50-100/night)\n`;
  itinerary += `* Mid-Range Option: 3-star hotels ($100-200/night)\n`;
  itinerary += `* Luxury Option: 4-5 star hotels or resorts ($200+/night)\n\n`;
  
  // Add packing suggestions
  itinerary += `**Packing Suggestions:**\n`;
  itinerary += `* Essential Documents: Passport/ID, flight tickets, hotel reservations\n`;
  itinerary += `* Clothing: Weather-appropriate clothes, comfortable walking shoes\n`;
  itinerary += `* Electronics: Phone, charger, camera, adapters\n`;
  itinerary += `* Toiletries: Toothbrush, toothpaste, personal hygiene items\n`;
  
  return itinerary;
};

// Helper functions for destination-specific itineraries
const createParisItinerary = (days, preferences, budget) => {
  let itinerary = '';
  const budgetPerDay = budget / days;
  
  // Day 1 is always Eiffel Tower and Seine
  itinerary += `**Day 1: Welcome to Paris!**\n`;
  itinerary += `* Morning: Arrive and check in to your accommodation\n`;
  itinerary += `* Afternoon: Visit the Eiffel Tower (€26.80 for summit access, €17.10 for 2nd floor only)\n`;
  itinerary += `  - Best time to visit: 9-11am or after 5pm to avoid crowds\n`;
  itinerary += `  - Book tickets online at least 2 months in advance: www.toureiffel.paris\n`;
  itinerary += `  - Consider the stairs option to the 2nd floor for shorter lines (€10.70)\n`;
  itinerary += `* Evening: Seine River cruise (€15-20) followed by dinner at a local bistro (€25-40 per person)\n`;
  itinerary += `  - Recommended cruise companies: Bateaux Parisiens or Bateaux Mouches\n`;
  itinerary += `  - Nearby dining options: Les Ombres, Café Constant, or Le Recrutement\n\n`;
  
  if (days >= 2) {
    itinerary += `**Day 2: Art and Culture**\n`;
    itinerary += `* Morning: Louvre Museum (€17 online, €20 at the door) - home to Mona Lisa\n`;
    itinerary += `  - Opening hours: 9am-6pm (closed Tuesdays)\n`;
    itinerary += `  - Enter through Porte des Lions entrance to avoid the longest lines\n`;
    itinerary += `  - Must-see works: Mona Lisa, Venus de Milo, Winged Victory of Samothrace\n`;
    
    if (preferences.some(p => p.toLowerCase().includes('food') || p.toLowerCase().includes('dining'))) {
      itinerary += `* Lunch: Gourmet experience at Café Marly overlooking the Louvre pyramid (€30-50 per person)\n`;
      itinerary += `  - Reserve a table on the terrace for the best views\n`;
      itinerary += `  - Try their signature club sandwich or salmon tartare\n`;
    } else {
      itinerary += `* Lunch: Picnic in the Tuileries Garden (€10-15 for supplies)\n`;
      itinerary += `  - Pick up supplies at Carrefour Express on Rue de Rivoli\n`;
      itinerary += `  - Find a shady spot near the Grand Bassin Rond fountain\n`;
    }
    
    itinerary += `* Afternoon: Explore Le Marais district\n`;
    itinerary += `  - Visit Place des Vosges, the oldest planned square in Paris\n`;
    itinerary += `  - Browse boutiques on Rue des Francs-Bourgeois\n`;
    itinerary += `  - Stop at Maison Victor Hugo (free admission)\n`;
    itinerary += `* Evening: Dinner in the Latin Quarter (€20-35 per person)\n`;
    itinerary += `  - Try traditional French cuisine at La Jacobine or Le Petit Prince\n`;
    itinerary += `  - Take an evening stroll along the Seine near Notre-Dame\n\n`;
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
  itinerary += `  - Opening hours: 9:30am-11:00pm (closed some Mondays)\n`;
  itinerary += `  - Both North and South towers offer different views\n`;
  itinerary += `  - Go around sunset for day and night views of the city\n`;
  itinerary += `* Evening: Explore Shinjuku and dinner at an izakaya (¥3,000-5,000 per person)\n`;
  itinerary += `  - Recommended areas: Omoide Yokocho (Memory Lane) for authentic yakitori\n`;
  itinerary += `  - Try Torikizoku for budget-friendly yakitori (all items ¥298)\n`;
  itinerary += `  - Experience the neon lights of Kabukicho entertainment district\n\n`;
  
  if (days >= 2) {
    itinerary += `**Day 2: Traditional Tokyo**\n`;
    itinerary += `* Morning: Meiji Shrine (free) and Yoyogi Park\n`;
    itinerary += `  - Best time to visit: Early morning (before 9am) to avoid crowds\n`;
    itinerary += `  - Try to catch a traditional wedding if you're lucky\n`;
    itinerary += `  - Write a wish on an ema (wooden plaque) for ¥500\n`;
    
    if (preferences.some(p => p.toLowerCase().includes('food') || p.toLowerCase().includes('dining'))) {
      itinerary += `* Lunch: Traditional Japanese cuisine in Harajuku (¥2,000-4,000 per person)\n`;
      itinerary += `  - Try Maisen for excellent tonkatsu (breaded pork cutlet)\n`;
      itinerary += `  - Gyukatsu Motomura for beef cutlet (¥1,300-2,000)\n`;
      itinerary += `  - Consider a bento box for a variety of items\n`;
    } else {
      itinerary += `* Lunch: Quick bite at a 7-Eleven or Lawson (¥500-800)\n`;
      itinerary += `  - Try onigiri (rice balls), sandwiches, or bento boxes\n`;
      itinerary += `  - Japanese convenience stores have high-quality, affordable food\n`;
      itinerary += `  - Great for travelers on a budget\n`;
    }
    
    itinerary += `* Afternoon: Takeshita Street in Harajuku for youth fashion\n`;
    itinerary += `  - Shop for unique souvenirs and see Japanese street fashion\n`;
    itinerary += `  - Try a crepe from one of the many stands (¥500-700)\n`;
    itinerary += `  - Visit the Daiso 100 yen shop for affordable souvenirs\n`;
    itinerary += `* Evening: Shibuya Crossing and dinner nearby (¥2,000-4,000 per person)\n`;
    itinerary += `  - Take a photo at the famous Shibuya Scramble Crossing\n`;
    itinerary += `  - Visit the Shibuya Sky observation deck (¥2,000) for sunset views\n`;
    itinerary += `  - Dine at Ichiran Ramen (¥1,000-1,500) or Shibuya Hikarie restaurants\n\n`;
  }
  
  if (days >= 3) {
    itinerary += `**Day 3: Historic Tokyo**\n`;
    itinerary += `* Morning: Imperial Palace Gardens (free)\n`;
    itinerary += `  - Open 9am-4:30pm, closed Mondays and Fridays\n`;
    itinerary += `  - Join a free guided tour in English (registration required)\n`;
    itinerary += `  - Explore the East Gardens, which are open to the public\n`;
    itinerary += `* Midday: Asakusa district and Senso-ji Temple (free)\n`;
    itinerary += `  - Shop for souvenirs along Nakamise Shopping Street\n`;
    itinerary += `  - Try traditional street food like ningyo-yaki (¥500-700)\n`;
    itinerary += `  - Don't miss the massive Kaminarimon Gate and five-story pagoda\n`;
    
    if (preferences.some(p => p.toLowerCase().includes('culture'))) {
      itinerary += `* Afternoon: Tea ceremony experience (¥4,000-6,000)\n`;
      itinerary += `  - Recommended: Nadeshiko tea ceremony in Asakusa\n`;
      itinerary += `  - Learn about the history and meaning behind the ceremony\n`;
      itinerary += `  - Make your own matcha tea under expert guidance\n`;
    } else {
      itinerary += `* Afternoon: Tokyo National Museum (¥1,000)\n`;
      itinerary += `  - Japan's oldest and largest museum\n`;
      itinerary += `  - See samurai armor, ancient pottery, and art\n`;
      itinerary += `  - Free English audio guides available\n`;
    }
    
    itinerary += `* Evening: River cruise on the Sumida River (¥1,000-1,800)\n`;
    itinerary += `  - Recommended: The futuristic Himiko or Hotaluna boats\n`;
    itinerary += `  - See Tokyo SkyTree and illuminated bridges\n`;
    itinerary += `  - Follow with dinner at a riverside restaurant (¥3,000-5,000)\n\n`;
  }
  
  if (days >= 4) {
    itinerary += `**Day 4: Modern Tokyo**\n`;
    itinerary += `* Morning: TeamLab Borderless Digital Art Museum (¥3,200)\n`;
    itinerary += `  - Book tickets in advance online to avoid sellouts\n`;
    itinerary += `  - Allow at least 3 hours to fully experience the museum\n`;
    itinerary += `  - Wear comfortable shoes and clothes that can handle projections\n`;
    
    if (preferences.some(p => p.toLowerCase().includes('sight'))) {
      itinerary += `* Midday: Tokyo SkyTree (¥2,100 for main deck, ¥3,400 for both decks)\n`;
      itinerary += `  - Japan's tallest structure at 634 meters\n`;
      itinerary += `  - Fast ticket option available to skip lines (additional ¥1,000)\n`;
      itinerary += `  - Have lunch at the Sky Restaurant (reservation recommended)\n`;
    } else if (budgetPerDay > 100) {
      itinerary += `* Midday: Shopping in Ginza\n`;
      itinerary += `  - Visit Japan's most luxurious shopping district\n`;
      itinerary += `  - Explore Ginza Six or the newly renovated Mitsukoshi department store\n`;
      itinerary += `  - Have lunch at a high-end restaurant (¥5,000+) or more affordable basement food hall (¥1,500-2,500)\n`;
    } else {
      itinerary += `* Midday: Explore Akihabara Electric Town\n`;
      itinerary += `  - Browse electronics, anime, and manga shops\n`;
      itinerary += `  - Visit a maid café for a unique experience (¥2,000-3,000)\n`;
      itinerary += `  - Try conveyor belt sushi for lunch (¥1,000-1,500)\n`;
    }
    
    itinerary += `* Evening: Explore Roppongi Hills and dinner (¥3,000-6,000)\n`;
    itinerary += `  - Visit Mori Art Museum (¥1,800) and Tokyo City View observation deck\n`;
    itinerary += `  - Shop at boutiques and Japanese designer stores\n`;
    itinerary += `  - Try an international restaurant or izakaya for dinner\n\n`;
  }
  
  if (days >= 5) {
    itinerary += `**Day 5: Day Trip**\n`;
    
    if (preferences.includes('Adventure Activities')) {
      itinerary += `* Full day: Mount Fuji and Hakone tour (¥13,000-20,000)\n`;
      itinerary += `  - Book through a reputable tour company like JTB or Viator\n`;
      itinerary += `  - Includes Lake Ashi cruise and Mt. Komagatake Ropeway\n`;
      itinerary += `  - Best viewing seasons are winter and early spring\n`;
    } else if (preferences.includes('Cultural Experiences')) {
      itinerary += `* Full day: Kamakura with the Great Buddha (¥3,000 for transport plus ¥300-1,500 for temple fees)\n`;
      itinerary += `  - Take the JR Yokosuka Line from Tokyo Station (about 1 hour)\n`;
      itinerary += `  - Visit Kotoku-in Temple to see the bronze Great Buddha (¥300)\n`;
      itinerary += `  - Explore Hasedera Temple and its beautiful gardens (¥400)\n`;
      itinerary += `  - Hike the Daibutsu trail for nature and smaller temples\n`;
    } else {
      itinerary += `* Full day: Nikko National Park and shrines (¥8,000+ for tour or ¥5,000 self-guided)\n`;
      itinerary += `  - Visit the lavishly decorated Toshogu Shrine (¥1,300)\n`;
      itinerary += `  - See the sacred Shinkyo Bridge (¥300)\n`;
      itinerary += `  - Explore Rinnoji Temple (¥400) and its peaceful gardens\n`;
      itinerary += `  - Take in natural landscapes at Lake Chuzenji and Kegon Falls\n`;
    }
    
    itinerary += `* Evening: Relaxing onsen bath if in Hakone, or return to Tokyo for dinner\n`;
    itinerary += `  - Public onsen entry fee: ¥1,000-2,000\n`;
    itinerary += `  - If in Tokyo, try monjayaki in Tsukishima (¥2,000-3,000)\n\n`;
  }
  
  // Additional days if applicable
  if (days > 5) {
    itinerary += `**Remaining Days: Explore Further**\n`;
    itinerary += `* Ueno Park and its museums (¥600-1,200 per museum)\n`;
    itinerary += `  - Visit the Tokyo National Museum, National Science Museum, or Zoo\n`;
    itinerary += `* Tsukiji Outer Market for food lovers (free entry, budget ¥3,000-5,000 for food)\n`;
    itinerary += `  - Join a guided food tour (¥10,000-15,000) or explore independently\n`;
    itinerary += `  - Try fresh sushi, tamagoyaki, and seafood dishes\n`;
    itinerary += `* Odaiba entertainment district\n`;
    itinerary += `  - Visit the life-sized Gundam statue (free)\n`;
    itinerary += `  - Enjoy Palette Town and DiverCity shopping centers\n`;
    itinerary += `  - Relax at Oedo Onsen Monogatari spa (¥2,700)\n`;
    itinerary += `* Day trip to Yokohama Chinatown (¥1,000 round trip, plus food and activities)\n`;
    itinerary += `  - 30 minutes by train from Tokyo\n`;
    itinerary += `  - Try authentic Chinese cuisine (¥2,000-4,000)\n`;
    itinerary += `* Tokyo Disneyland or DisneySea (¥7,900-9,400 per day)\n`;
    itinerary += `  - Consider multi-day passes for savings\n`;
    itinerary += `  - Budget extra for food (¥3,000-5,000) and souvenirs\n`;
    itinerary += `* Robot Restaurant show in Shinjuku (¥8,000, dinner separate)\n`;
    itinerary += `  - A uniquely Japanese entertainment experience\n`;
    itinerary += `  - Look for discount tickets online\n\n`;
  }
  
  return itinerary;
};

const createNewYorkItinerary = (days, preferences, budget) => {
  let itinerary = '';
  const budgetPerDay = budget / days;
  
  // Day 1 is always Central Park and Midtown
  itinerary += `**Day 1: Welcome to New York City!**\n`;
  itinerary += `* Morning: Arrive and check in to your accommodation\n`;
  itinerary += `* Afternoon: Explore Central Park (free)\n`;
  itinerary += `  - Visit Bethesda Fountain, Strawberry Fields, and The Mall\n`;
  itinerary += `  - Rent a rowboat at The Lake ($20 per hour) or bikes ($12-15 per hour)\n`;
  itinerary += `  - Take a guided walking tour ($25-35) or self-guided tour with map\n`;
  itinerary += `* Evening: Times Square and dinner nearby ($30-60 per person)\n`;
  itinerary += `  - Experience the dazzling lights and billboards\n`;
  itinerary += `  - Dine at Los Tacos No. 1 (budget), John's Pizzeria (moderate), or Carmine's (family style)\n`;
  itinerary += `  - Visit the TKTS booth for discounted Broadway tickets for your stay\n\n`;
  
  if (days >= 2) {
    itinerary += `**Day 2: Iconic NYC**\n`;
    
    if (preferences.some(p => p.toLowerCase().includes('sight'))) {
      itinerary += `* Morning: Empire State Building ($44 for main deck, $77 for both decks)\n`;
      itinerary += `  - Arrives early (8-9am) to avoid long lines\n`;
      itinerary += `  - Express Pass available for an additional $33\n`;
      itinerary += `  - Allow 1-2 hours for the complete experience\n`;
    } else {
      itinerary += `* Morning: Grand Central Terminal (free) and the New York Public Library (free)\n`;
      itinerary += `  - See the famous constellation ceiling in the Main Concourse\n`;
      itinerary += `  - Visit the Whispering Gallery near the Oyster Bar\n`;
      itinerary += `  - Take a photo with the famous stone lions at the library\n`;
    }
    
    itinerary += `* Midday: Walk along Fifth Avenue\n`;
    itinerary += `  - See St. Patrick's Cathedral (free)\n`;
    itinerary += `  - Window shop at luxury boutiques\n`;
    itinerary += `  - Visit the iconic Saks Fifth Avenue and Tiffany & Co.\n`;
    
    if (preferences.some(p => p.toLowerCase().includes('food') || p.toLowerCase().includes('dining'))) {
      itinerary += `* Lunch: Classic New York deli experience ($20-30)\n`;
      itinerary += `  - Try Katz's Deli for the famous pastrami sandwich ($23.95)\n`;
      itinerary += `  - Visit Carnegie Deli or 2nd Ave Deli for authentic flavors\n`;
      itinerary += `  - Portions are large, consider sharing\n`;
    } else {
      itinerary += `* Lunch: Food hall at Bryant Park ($15-25)\n`;
      itinerary += `  - Multiple options for various diets and preferences\n`;
      itinerary += `  - Enjoy your meal in the park with views of the library\n`;
      itinerary += `  - In winter, visit the seasonal ice skating rink\n`;
    }
    
    itinerary += `* Afternoon: MoMA (Museum of Modern Art, $25) or Rockefeller Center\n`;
    itinerary += `  - MoMA houses famous works by Van Gogh, Picasso, and Warhol\n`;
    itinerary += `  - Free on Friday evenings (4-8pm), but very crowded\n`;
    itinerary += `  - At Rockefeller Center, see the NBC Studios or go to Top of the Rock ($40)\n`;
    itinerary += `* Evening: Broadway show (ticket prices vary, typically $100-300+)\n`;
    itinerary += `  - Check TKTS, Today Tix app, or rush tickets for discounts\n`;
    itinerary += `  - Popular shows often require booking months in advance\n`;
    itinerary += `  - Have a pre-theater dinner in the area ($40-70 per person)\n\n`;
  }
  
  if (days >= 3) {
    itinerary += `**Day 3: Downtown Exploration**\n`;
    itinerary += `* Morning: Statue of Liberty and Ellis Island ($23.50 for ferry and access)\n`;
    itinerary += `  - Book Statue Cruises tickets in advance, especially for crown access ($21.50 extra)\n`;
    itinerary += `  - First ferry departs at 8:30am - arrive early to avoid lines\n`;
    itinerary += `  - Allow 4-5 hours for both islands\n`;
    itinerary += `* Midday: Financial District and Wall Street (free self-guided tour)\n`;
    itinerary += `  - See the New York Stock Exchange and Charging Bull statue\n`;
    itinerary += `  - Visit Federal Hall where George Washington was inaugurated\n`;
    itinerary += `  - Stop by Trinity Church and its historic cemetery\n`;
    
    if (preferences.some(p => p.toLowerCase().includes('culture'))) {
      itinerary += `* Afternoon: 9/11 Memorial & Museum ($26 for museum, memorial is free)\n`;
      itinerary += `  - Allow 2 hours for the museum experience\n`;
      itinerary += `  - Visit the reflecting pools at the memorial\n`;
      itinerary += `  - Consider the guided tour for additional context ($20 extra)\n`;
    } else if (budgetPerDay > 100) {
      itinerary += `* Afternoon: Shopping in SoHo\n`;
      itinerary += `  - Browse designer boutiques and flagship stores\n`;
      itinerary += `  - Explore the cast-iron architecture of the district\n`;
      itinerary += `  - Stop by unique shops like the MoMA Design Store\n`;
    } else {
      itinerary += `* Afternoon: Walk the Brooklyn Bridge (free)\n`;
      itinerary += `  - Allow 1 hour for the crossing, plus photo stops\n`;
      itinerary += `  - Best time is early morning or sunset for photos\n`;
      itinerary += `  - Start from the Manhattan side for the best views\n`;
    }
    
    itinerary += `* Evening: Explore Brooklyn Heights and DUMBO\n`;
    itinerary += `  - Visit the Brooklyn Heights Promenade for Manhattan skyline views\n`;
    itinerary += `  - Take photos at the iconic DUMBO spot with Manhattan Bridge\n`;
    itinerary += `  - Dine at Grimaldi's Pizza ($25-30) or River Café (upscale, $100+)\n\n`;
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
  
  // Add destination-specific packing suggestions
  itinerary += `\n**Packing Suggestions:**\n`;
  
  // Essential items for all destinations
  itinerary += `* Essential Documents: Passport/ID, flight tickets, hotel reservations, travel insurance\n`;
  itinerary += `* Electronics: Phone, chargers, camera, power adapters, portable charger\n`;
  itinerary += `* Toiletries: Toothbrush, toothpaste, shampoo, soap, medications\n`;
  
  // Destination-specific packing items
  if (destination.toLowerCase().includes('paris')) {
    itinerary += `* Paris Essentials: Comfortable walking shoes, umbrella (rain is common), adapter for EU outlets\n`;
    itinerary += `* Fashion Items: Scarf (useful for visiting churches), light layers for variable weather\n`;
    itinerary += `* Optional: French phrasebook, portable umbrella, picnic blanket for parks\n`;
  } else if (destination.toLowerCase().includes('tokyo')) {
    itinerary += `* Tokyo Essentials: Comfortable shoes (lots of walking), portable wifi/SIM card, handkerchief (many restrooms don't have paper towels)\n`;
    itinerary += `* Cultural Items: Small gifts for hosts if staying in homestay, slip-on shoes (for temples/homes)\n`;
    itinerary += `* Optional: Japanese phrasebook, pocket trash bag (public trash bins are rare)\n`;
  } else if (destination.toLowerCase().includes('new york')) {
    itinerary += `* New York Essentials: Comfortable walking shoes, layers for variable temperatures, small backpack or crossbody bag\n`;
    itinerary += `* City Items: Portable phone charger, subway map/app, reusable water bottle\n`;
    itinerary += `* Optional: Lightweight rain jacket, comfortable dressy outfit for nice restaurants\n`;
  } else {
    itinerary += `* General Travel: Comfortable walking shoes, weather-appropriate clothing, day bag\n`;
    itinerary += `* Security Items: Money belt, copies of important documents, travel locks\n`;
    itinerary += `* Optional: Travel pillow, eye mask, ear plugs for comfortable transit\n`;
  }
  
  // Add preference-specific packing suggestions
  if (preferences.some(p => p.toLowerCase().includes('adventure'))) {
    itinerary += `* Adventure Gear: Quick-dry clothing, hiking boots, backpack with hydration system\n`;
    itinerary += `* Safety: First aid kit, insect repellent, sunscreen, hat with brim\n`;
  }
  
  if (preferences.some(p => p.toLowerCase().includes('beach') || p.toLowerCase().includes('relax'))) {
    itinerary += `* Beach Essentials: Swimwear, beach towel, sandals, high SPF sunscreen, after-sun lotion\n`;
    itinerary += `* Comfort: Beach bag, hat, sunglasses, cover-up, waterproof phone case\n`;
  }
  
  if (preferences.some(p => p.toLowerCase().includes('culture'))) {
    itinerary += `* Cultural Visits: Modest clothing for religious sites, journal for notes, small gifts for local hosts\n`;
    itinerary += `* Learning: Local language phrasebook, guidebook with cultural information\n`;
  }
  
  if (preferences.some(p => p.toLowerCase().includes('food'))) {
    itinerary += `* Food Exploration: Antacids/digestive aids, food allergy translation cards, reusable utensils\n`;
    itinerary += `* Optional: Small food journal, camera for food photography\n`;
  }
  
  itinerary += `* Note: Use the interactive packing list feature below to customize and track your packing progress.\n`;
  
  return itinerary;
};

export default Itinerary;
