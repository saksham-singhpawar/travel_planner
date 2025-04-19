import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Itinerary.css';

function WeatherWidget({ destination }) {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!destination) return;

    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`http://localhost:7000/api/weather?location=${encodeURIComponent(destination)}`);
        setWeatherData(response.data);
      } catch (err) {
        console.error('Error fetching weather:', err);
        setError('Unable to load weather data');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [destination]);

  if (!destination) return null;
  if (loading) return <div className="weather-loading">Loading weather...</div>;
  if (error) return <div className="weather-error">{error}</div>;
  if (!weatherData) return null;

  const { current, forecast } = weatherData;
  const iconUrl = `https://openweathermap.org/img/wn/${current.icon}@2x.png`;

  return (
    <div className="weather-widget">
      <div className="weather-header">
        <h3>Weather in {current.location}</h3>
      </div>
      
      <div className="current-weather">
        <div className="weather-icon">
          <img src={iconUrl} alt={current.description} />
        </div>
        <div className="weather-info">
          <div className="weather-temp">{Math.round(current.temp)}°C</div>
          <div className="weather-desc">{current.description}</div>
          <div className="weather-details">
            <span>Feels like: {Math.round(current.feels_like)}°C</span> | 
            <span>Humidity: {current.humidity}%</span> |
            <span>Wind: {current.wind_speed} m/s</span>
          </div>
        </div>
      </div>
      
      <div className="forecast">
        <h4>5-Day Forecast</h4>
        <div className="forecast-days">
          {forecast.slice(0, 5).map(day => (
            <div key={day.date} className="forecast-day">
              <div className="forecast-date">{formatDate(day.date)}</div>
              <img 
                src={`https://openweathermap.org/img/wn/${day.icon}.png`} 
                alt={day.description} 
                className="forecast-icon" 
              />
              <div className="forecast-temp">
                <span className="max">{Math.round(day.temp_max)}°</span>
                <span className="min">{Math.round(day.temp_min)}°</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Helper function to format date
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export default WeatherWidget; 