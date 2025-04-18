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

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
