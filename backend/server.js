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
const WEATHER_API_KEY = process.env.WEATHER_API_KEY || "YOUR_OPENWEATHER_API_KEY"; // You'll need to add this to your .env file

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

// New endpoint to get weather information for a destination
app.get("/api/weather", async (req, res) => {
  const { location } = req.query;
  
  if (!location) {
    return res.status(400).json({ error: "Location is required" });
  }
  
  try {
    // First get the coordinates for the location
    const geoResponse = await axios.get(
      `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${WEATHER_API_KEY}`
    );
    
    if (!geoResponse.data || geoResponse.data.length === 0) {
      return res.status(404).json({ error: "Location not found" });
    }
    
    const { lat, lon } = geoResponse.data[0];
    
    // Get the current weather using the coordinates
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`
    );
    
    // Get the 5-day forecast
    const forecastResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`
    );
    
    // Process forecast data to get daily forecasts
    const dailyForecasts = processForecastData(forecastResponse.data.list);
    
    res.json({
      current: {
        temp: weatherResponse.data.main.temp,
        feels_like: weatherResponse.data.main.feels_like,
        humidity: weatherResponse.data.main.humidity,
        description: weatherResponse.data.weather[0].description,
        icon: weatherResponse.data.weather[0].icon,
        wind_speed: weatherResponse.data.wind.speed,
        location: `${weatherResponse.data.name}, ${weatherResponse.data.sys.country}`,
        timestamp: weatherResponse.data.dt * 1000
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

// Helper function to process forecast data into daily forecasts
function processForecastData(forecastList) {
  const dailyData = {};
  
  forecastList.forEach(item => {
    const date = new Date(item.dt * 1000).toISOString().split('T')[0];
    
    if (!dailyData[date]) {
      dailyData[date] = {
        date,
        temp_min: item.main.temp_min,
        temp_max: item.main.temp_max,
        description: item.weather[0].description,
        icon: item.weather[0].icon
      };
    } else {
      // Update min/max temperatures
      if (item.main.temp_min < dailyData[date].temp_min) {
        dailyData[date].temp_min = item.main.temp_min;
      }
      if (item.main.temp_max > dailyData[date].temp_max) {
        dailyData[date].temp_max = item.main.temp_max;
      }
    }
  });
  
  return Object.values(dailyData);
}

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
