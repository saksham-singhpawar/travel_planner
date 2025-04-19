import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './Checklist.css';

const defaultChecklistItems = {
  'Essential Documents': [
    { id: 'doc1', text: 'Passport/ID', checked: false },
    { id: 'doc2', text: 'Flight tickets', checked: false },
    { id: 'doc3', text: 'Hotel reservation', checked: false },
    { id: 'doc4', text: 'Travel insurance', checked: false },
    { id: 'doc5', text: 'Driving license', checked: false },
  ],
  'Clothing': [
    { id: 'cloth1', text: 'T-shirts', checked: false },
    { id: 'cloth2', text: 'Pants/shorts', checked: false },
    { id: 'cloth3', text: 'Underwear', checked: false },
    { id: 'cloth4', text: 'Socks', checked: false },
    { id: 'cloth5', text: 'Jacket/sweater', checked: false },
    { id: 'cloth6', text: 'Sleepwear', checked: false },
    { id: 'cloth7', text: 'Swimwear', checked: false },
  ],
  'Toiletries': [
    { id: 'toilet1', text: 'Toothbrush & toothpaste', checked: false },
    { id: 'toilet2', text: 'Shampoo & conditioner', checked: false },
    { id: 'toilet3', text: 'Soap/shower gel', checked: false },
    { id: 'toilet4', text: 'Deodorant', checked: false },
    { id: 'toilet5', text: 'Sunscreen', checked: false },
    { id: 'toilet6', text: 'Personal medications', checked: false },
  ],
  'Electronics': [
    { id: 'tech1', text: 'Phone', checked: false },
    { id: 'tech2', text: 'Phone charger', checked: false },
    { id: 'tech3', text: 'Camera', checked: false },
    { id: 'tech4', text: 'Power adapter', checked: false },
    { id: 'tech5', text: 'Headphones', checked: false },
  ],
  'Miscellaneous': [
    { id: 'misc1', text: 'Day bag/backpack', checked: false },
    { id: 'misc2', text: 'Book/e-reader', checked: false },
    { id: 'misc3', text: 'Travel pillow', checked: false },
    { id: 'misc4', text: 'Snacks', checked: false },
    { id: 'misc5', text: 'Water bottle', checked: false },
  ]
};

// Additional items based on destination type
const destinationSpecificItems = {
  beach: [
    { id: 'beach1', text: 'Beach towel', checked: false },
    { id: 'beach2', text: 'Flip flops', checked: false },
    { id: 'beach3', text: 'Sunglasses', checked: false },
    { id: 'beach4', text: 'Hat', checked: false },
    { id: 'beach5', text: 'After-sun lotion', checked: false },
  ],
  mountain: [
    { id: 'mount1', text: 'Hiking boots', checked: false },
    { id: 'mount2', text: 'Hiking socks', checked: false },
    { id: 'mount3', text: 'Backpack', checked: false },
    { id: 'mount4', text: 'Water bottle', checked: false },
    { id: 'mount5', text: 'First aid kit', checked: false },
  ],
  city: [
    { id: 'city1', text: 'Comfortable walking shoes', checked: false },
    { id: 'city2', text: 'City map/guidebook', checked: false },
    { id: 'city3', text: 'Day bag', checked: false },
    { id: 'city4', text: 'Umbrella', checked: false },
  ],
  cold: [
    { id: 'cold1', text: 'Winter jacket', checked: false },
    { id: 'cold2', text: 'Thermal underwear', checked: false },
    { id: 'cold3', text: 'Gloves', checked: false },
    { id: 'cold4', text: 'Scarf', checked: false },
    { id: 'cold5', text: 'Winter hat', checked: false },
    { id: 'cold6', text: 'Boots', checked: false },
  ]
};

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 50
  },
  in: {
    opacity: 1,
    y: 0
  },
  exit: {
    opacity: 0,
    y: -50
  }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5
};

function Checklist() {
  const [checklist, setChecklist] = useState({});
  const [newItemText, setNewItemText] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Miscellaneous');
  const [customCategories, setCustomCategories] = useState([]);
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [progress, setProgress] = useState(0);
  const [destination, setDestination] = useState('');
  const [tripType, setTripType] = useState('general');

  // Generate customized checklist based on destination and trip type
  useEffect(() => {
    let customizedChecklist = { ...defaultChecklistItems };
    
    // Add trip type specific items
    if (tripType === 'beach') {
      customizedChecklist['Beach Essentials'] = destinationSpecificItems.beach;
    } else if (tripType === 'mountain') {
      customizedChecklist['Mountain Gear'] = destinationSpecificItems.mountain;
    } else if (tripType === 'city') {
      customizedChecklist['City Essentials'] = destinationSpecificItems.city;
    } else if (tripType === 'cold') {
      customizedChecklist['Cold Weather Gear'] = destinationSpecificItems.cold;
    }
    
    // Load saved checklist from localStorage if available
    const savedChecklist = localStorage.getItem('travelChecklist');
    const savedCategories = localStorage.getItem('customCategories');
    
    if (savedChecklist) {
      customizedChecklist = JSON.parse(savedChecklist);
    }
    
    if (savedCategories) {
      setCustomCategories(JSON.parse(savedCategories));
    }
    
    setChecklist(customizedChecklist);
  }, [tripType]);

  // Update progress when checklist changes
  useEffect(() => {
    updateProgress();
  }, [checklist]);

  const updateProgress = () => {
    const allItems = Object.values(checklist).flat();
    const totalItems = allItems.length;
    const checkedItems = allItems.filter(item => item.checked).length;
    const progressPercentage = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;
    setProgress(progressPercentage);
  };

  const toggleItem = (categoryKey, itemId) => {
    const updatedChecklist = { ...checklist };
    const categoryItems = [...updatedChecklist[categoryKey]];
    const itemIndex = categoryItems.findIndex(item => item.id === itemId);
    
    categoryItems[itemIndex] = {
      ...categoryItems[itemIndex],
      checked: !categoryItems[itemIndex].checked
    };
    
    updatedChecklist[categoryKey] = categoryItems;
    setChecklist(updatedChecklist);
    
    // Save to localStorage
    localStorage.setItem('travelChecklist', JSON.stringify(updatedChecklist));
  };

  const addNewItem = () => {
    if (!newItemText.trim()) return;
    
    const updatedChecklist = { ...checklist };
    
    if (!updatedChecklist[newItemCategory]) {
      updatedChecklist[newItemCategory] = [];
    }
    
    const newItem = {
      id: `custom-${Date.now()}`,
      text: newItemText.trim(),
      checked: false
    };
    
    updatedChecklist[newItemCategory] = [...updatedChecklist[newItemCategory], newItem];
    setChecklist(updatedChecklist);
    setNewItemText('');
    
    // Save to localStorage
    localStorage.setItem('travelChecklist', JSON.stringify(updatedChecklist));
  };

  const addNewCategory = () => {
    if (!newCategoryInput.trim()) return;
    
    const newCategory = newCategoryInput.trim();
    setCustomCategories([...customCategories, newCategory]);
    setNewCategoryInput('');
    setShowNewCategoryInput(false);
    setNewItemCategory(newCategory);
    
    // Add the new category to the checklist
    const updatedChecklist = { ...checklist };
    updatedChecklist[newCategory] = [];
    setChecklist(updatedChecklist);
    
    // Save to localStorage
    localStorage.setItem('customCategories', JSON.stringify([...customCategories, newCategory]));
  };

  const resetChecklist = () => {
    if (window.confirm('Are you sure you want to reset the checklist? All progress will be lost.')) {
      let resetList = {};
      
      // Reset all items to unchecked
      Object.keys(checklist).forEach(category => {
        resetList[category] = checklist[category].map(item => ({
          ...item,
          checked: false
        }));
      });
      
      setChecklist(resetList);
      localStorage.setItem('travelChecklist', JSON.stringify(resetList));
    }
  };
  
  const handleTripTypeChange = (e) => {
    setTripType(e.target.value);
    // Reset checklist when trip type changes
    localStorage.removeItem('travelChecklist');
  };

  const handleDestinationChange = (e) => {
    setDestination(e.target.value);
  };

  // Enhanced print function with direct rendering
  const printChecklist = () => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Please allow pop-ups to print your checklist");
      return;
    }
    
    // Generate HTML content for the printable checklist
    const printableHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Travel Packing Checklist${destination ? ' for ' + destination : ''}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 30px; }
          h1 { text-align: center; margin-bottom: 15px; color: #333; }
          .destination-info { text-align: center; margin-bottom: 25px; font-size: 16px; }
          .category { margin-bottom: 30px; border: 1px solid #ccc; padding: 15px; break-inside: avoid; page-break-inside: avoid; }
          .category h2 { color: #333; border-bottom: 2px solid #6a11cb; padding-bottom: 8px; margin-top: 0; }
          ul { list-style: none; padding: 0; }
          li { padding: 8px 0; display: flex; align-items: center; border-bottom: 1px dashed #eee; }
          li:last-child { border-bottom: none; }
          .checkbox { display: inline-block; width: 18px; height: 18px; border: 2px solid #6a11cb; border-radius: 3px; margin-right: 10px; position: relative; }
          .checked .checkbox { background-color: #6a11cb; }
          .checked .checkbox:after { content: '✓'; color: white; position: absolute; top: -3px; left: 3px; font-weight: bold; }
          .checked .text { text-decoration: line-through; color: #777; }
          @media print {
            body { padding: 0; }
            .category { break-inside: avoid; page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <h1>Travel Packing Checklist</h1>
        ${destination ? `<div class="destination-info">Destination: ${destination} (${tripType.charAt(0).toUpperCase() + tripType.slice(1)} Trip)</div>` : ''}
        
        ${Object.keys(checklist).map(categoryKey => `
          <div class="category">
            <h2>${categoryKey}</h2>
            <ul>
              ${checklist[categoryKey].map(item => `
                <li class="${item.checked ? 'checked' : ''}">
                  <span class="checkbox"></span>
                  <span class="text">${item.text}</span>
                </li>
              `).join('')}
            </ul>
          </div>
        `).join('')}
        
        <script>
          window.onload = function() {
            window.print();
            // Optional: close window after printing
            // setTimeout(function() { window.close(); }, 500);
          };
        </script>
      </body>
      </html>
    `;
    
    // Write to the new window and print
    printWindow.document.open();
    printWindow.document.write(printableHTML);
    printWindow.document.close();
  };

  return (
    <motion.div 
      className="checklist-page"
      initial="initial"
      animate="in"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
    >
      <div className="checklist-hero">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Travel Packing Checklist ✓
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Never forget essential items for your trip again!
        </motion.p>
      </div>
      
      <motion.div 
        className="checklist-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className="trip-details">
          <div className="input-group">
            <label htmlFor="destination">Your Destination</label>
            <input 
              type="text" 
              id="destination"
              placeholder="Where are you going?"
              value={destination}
              onChange={handleDestinationChange}
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="trip-type">Trip Type</label>
            <select 
              id="trip-type" 
              value={tripType}
              onChange={handleTripTypeChange}
            >
              <option value="general">General Travel</option>
              <option value="beach">Beach Vacation</option>
              <option value="mountain">Mountain/Hiking</option>
              <option value="city">City Break</option>
              <option value="cold">Cold Weather</option>
            </select>
          </div>
        </div>
      
        <div className="travel-checklist">
          <div className="checklist-header">
            <h3>Your Packing List</h3>
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${progress}%` }}></div>
              <span className="progress-text">{progress}% Packed</span>
            </div>
          </div>
          
          <div className="checklist-categories">
            {Object.keys(checklist).map(categoryKey => (
              <div key={categoryKey} className="checklist-category">
                <h4>{categoryKey}</h4>
                <ul>
                  {checklist[categoryKey].map(item => (
                    <li key={item.id} className={item.checked ? 'checked' : ''}>
                      <label>
                        <input 
                          type="checkbox" 
                          checked={item.checked} 
                          onChange={() => toggleItem(categoryKey, item.id)} 
                        />
                        <span className="item-text">{item.text}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="add-item-form">
            <h4>Add Item</h4>
            <div className="form-row">
              <input
                type="text"
                placeholder="Item name"
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                className="item-input"
              />
              
              <select 
                value={newItemCategory} 
                onChange={(e) => setNewItemCategory(e.target.value)}
                className="category-select"
              >
                {Object.keys(checklist).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
                <option value="add-new">+ Add New Category</option>
              </select>
              
              <button 
                onClick={addNewItem} 
                disabled={!newItemText.trim()}
                className="add-btn"
              >
                Add
              </button>
            </div>
            
            {newItemCategory === 'add-new' && (
              <div className="new-category-input">
                <input
                  type="text"
                  placeholder="New category name"
                  value={newCategoryInput}
                  onChange={(e) => setNewCategoryInput(e.target.value)}
                />
                <button 
                  onClick={addNewCategory}
                  disabled={!newCategoryInput.trim()}
                >
                  Create
                </button>
              </div>
            )}
          </div>
          
          <div className="checklist-actions">
            <button onClick={resetChecklist} className="reset-button">
              Reset Checklist
            </button>
            
            <button className="print-button" onClick={printChecklist}>
              Print Checklist
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Checklist; 