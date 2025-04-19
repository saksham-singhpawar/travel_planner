require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 7000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY || "YOUR_WEATHERAPI_KEY"; // You'll need to add this to your .env file

app.post("/api/plan-trip", async (req, res) => {
  const { destination, startDate, endDate, budget, preferences } = req.body;

  // Validate input
  if (!destination || !startDate || !endDate || !budget || !preferences) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: "Missing Google Gemini API Key" });
  }

  const prompt = `
  Plan a detailed **day-wise travel itinerary** for a trip to **${destination}** from **${startDate}** to **${endDate}** within a **budget of $${budget}**.
  
  The user prefers: **${preferences}**. Include:
  1. **Flights** (recommended airlines, estimated costs, best airports).
  2. **Accommodation** (hotels, Airbnb, budget-friendly options).
  3. **Transportation** (rental cars, public transport passes, trains).
  4. **Daily activities** (tourist attractions, adventure activities, cultural experiences).
  5. **Food recommendations** (local dishes to try, famous restaurants).
  6. **Cost breakdown** (ensure budget balance).
  7. **Essential travel tips** (weather, safety, best time to visit).

  Format the response as:
  - **Day 1**: Arrival, check-in, evening activity.
  - **Day 2**: Morning activity, afternoon adventure, evening relaxation.
  - **Day X**: Departure details.
  `;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }]
      }
    );

    const itinerary = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No itinerary generated.";
    res.json({ itinerary });

  } catch (error) {
    console.error("❌ Gemini API Error:", error.response?.data || error.message);
    
    let errorMessage = "Failed to generate itinerary.";
    if (error.response?.status === 400) errorMessage = "Invalid request to Gemini API.";
    if (error.response?.status === 403) errorMessage = "Access denied. Check API key permissions.";
    if (error.response?.status === 500) errorMessage = "Gemini API encountered an internal error.";

    res.status(error.response?.status || 500).json({ error: errorMessage });
  }
});

// Weather endpoint - updated for WeatherAPI.com
app.get("/api/weather", async (req, res) => {
  const { location } = req.query;
  
  if (!location) {
    return res.status(400).json({ error: "Location is required" });
  }
  
  try {
    // WeatherAPI.com provides current weather and forecast in one call
    const response = await axios.get(
      `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(location)}&days=5&aqi=no&alerts=no`
    );
    
    const { current, forecast, location: locationData } = response.data;
    
    // Process forecast data to match our expected format
    const dailyForecasts = forecast.forecastday.map(day => ({
      date: day.date,
      temp_min: day.day.mintemp_c,
      temp_max: day.day.maxtemp_c,
      description: day.day.condition.text,
      icon: day.day.condition.icon
    }));
    
    res.json({
      current: {
        temp: current.temp_c,
        feels_like: current.feelslike_c,
        humidity: current.humidity,
        description: current.condition.text,
        icon: current.condition.icon,
        wind_speed: current.wind_kph,
        location: `${locationData.name}, ${locationData.country}`,
        timestamp: current.last_updated_epoch * 1000
      },
      forecast: dailyForecasts
    });
    
  } catch (error) {
    console.error("❌ Weather API Error:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ 
      error: "Failed to fetch weather data"
    });
  }
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
