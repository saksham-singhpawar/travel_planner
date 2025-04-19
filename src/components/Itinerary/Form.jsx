import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Itinerary.css";

function Form({ onSubmit, onBudgetChange, onDestinationChange, setPreferences }) {
  const [formData, setFormData] = useState({
    fromLocation: "",
    destination: "",
    startDate: "",
    endDate: "",
    budget: "",
    preferences: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Update parent component when preferences change
  useEffect(() => {
    if (formData.preferences) {
      // Parse preferences string into array
      const preferencesArray = formData.preferences.split(',').map(p => p.trim()).filter(p => p !== '');
      setPreferences?.(preferencesArray);
    }
  }, [formData.preferences, setPreferences]);

  // Update parent component when budget changes
  useEffect(() => {
    if (formData.budget) {
      onBudgetChange?.(formData.budget);
    }
  }, [formData.budget, onBudgetChange]);

  // Update parent component when destination changes
  useEffect(() => {
    if (formData.destination) {
      onDestinationChange?.(formData.destination);
    }
  }, [formData.destination, onDestinationChange]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Validate on change
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let newErrors = { ...errors };
    
    switch (name) {
      case "fromLocation":
        if (!value.trim()) {
          newErrors.fromLocation = "Starting location is required";
        } else {
          delete newErrors.fromLocation;
        }
        break;
      
      case "destination":
        if (!value.trim()) {
          newErrors.destination = "Destination is required";
        } else {
          delete newErrors.destination;
        }
        break;
      
      case "startDate":
        if (!value) {
          newErrors.startDate = "Start date is required";
        } else if (new Date(value) < new Date().setHours(0, 0, 0, 0)) {
          newErrors.startDate = "Start date cannot be in the past";
        } else {
          delete newErrors.startDate;
        }
        break;
      
      case "endDate":
        if (!value) {
          newErrors.endDate = "End date is required";
        } else if (formData.startDate && new Date(value) < new Date(formData.startDate)) {
          newErrors.endDate = "End date must be after start date";
        } else {
          delete newErrors.endDate;
        }
        break;
      
      case "budget":
        if (!value) {
          newErrors.budget = "Budget is required";
        } else if (isNaN(value) || Number(value) <= 0) {
          newErrors.budget = "Budget must be a positive number";
        } else {
          delete newErrors.budget;
        }
        break;
      
      case "preferences":
        if (!value.trim()) {
          newErrors.preferences = "Please indicate some preferences";
        } else {
          delete newErrors.preferences;
        }
        break;
      
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = () => {
    let isValid = true;
    let newErrors = {};
    let allTouched = {};
    
    // Mark all fields as touched
    Object.keys(formData).forEach(field => {
      allTouched[field] = true;
      if (!validateField(field, formData[field])) {
        isValid = false;
      }
    });
    
    setTouched(allTouched);
    return isValid;
  };

  const generateItinerary = async () => {
    if (!validateForm()) {
      return;
    }
    
    // Format the data before submission
    const formattedData = {
      ...formData,
      // Parse preferences string into array
      preferences: formData.preferences.split(',').map(p => p.trim()).filter(p => p !== '')
    };
    
    // Call the onSubmit prop with the formatted form data
    if (onSubmit) {
      onSubmit(formattedData);
    }
  };

  return (
    <div className="form-container">
      <div className="form-group">
        <input 
          type="text" 
          name="fromLocation" 
          placeholder="Starting Location" 
          value={formData.fromLocation}
          onChange={handleChange}
          onBlur={handleBlur}
          className={errors.fromLocation && touched.fromLocation ? "error" : ""}
        />
        {errors.fromLocation && touched.fromLocation && (
          <div className="error-message">{errors.fromLocation}</div>
        )}
      </div>

      <div className="form-group">
        <input 
          type="text" 
          name="destination" 
          placeholder="Destination" 
          value={formData.destination}
          onChange={handleChange}
          onBlur={handleBlur}
          className={errors.destination && touched.destination ? "error" : ""}
        />
        {errors.destination && touched.destination && (
          <div className="error-message">{errors.destination}</div>
        )}
      </div>

      <div className="form-group">
        <input 
          type="date" 
          name="startDate" 
          value={formData.startDate}
          onChange={handleChange}
          onBlur={handleBlur}
          className={errors.startDate && touched.startDate ? "error" : ""}
        />
        {errors.startDate && touched.startDate && (
          <div className="error-message">{errors.startDate}</div>
        )}
      </div>

      <div className="form-group">
        <input 
          type="date" 
          name="endDate" 
          value={formData.endDate}
          onChange={handleChange}
          onBlur={handleBlur}
          className={errors.endDate && touched.endDate ? "error" : ""}
        />
        {errors.endDate && touched.endDate && (
          <div className="error-message">{errors.endDate}</div>
        )}
      </div>

      <div className="form-group">
        <input 
          type="number" 
          name="budget" 
          placeholder="Budget ($)" 
          value={formData.budget}
          onChange={handleChange}
          onBlur={handleBlur}
          className={errors.budget && touched.budget ? "error" : ""}
        />
        {errors.budget && touched.budget && (
          <div className="error-message">{errors.budget}</div>
        )}
      </div>

      <div className="form-group">
        <input 
          type="text" 
          name="preferences" 
          placeholder="Preferences (Adventure, Beaches, Food...)" 
          value={formData.preferences}
          onChange={handleChange}
          onBlur={handleBlur}
          className={errors.preferences && touched.preferences ? "error" : ""}
        />
        {errors.preferences && touched.preferences && (
          <div className="error-message">{errors.preferences}</div>
        )}
      </div>

      <button onClick={generateItinerary} className="generate-button">Generate Itinerary</button>
    </div>
  );
}

export default Form;
