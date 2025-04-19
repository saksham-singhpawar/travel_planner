import React, { useState, useEffect } from 'react';
import './Itinerary.css';

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

function TravelChecklist({ destination, preferences }) {
  const [checklist, setChecklist] = useState({});
  const [newItemText, setNewItemText] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Miscellaneous');
  const [customCategories, setCustomCategories] = useState([]);
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [progress, setProgress] = useState(0);

  // Generate customized checklist based on destination and preferences
  useEffect(() => {
    let customizedChecklist = { ...defaultChecklistItems };
    const allCategories = Object.keys(customizedChecklist);
    
    // Add destination-specific items
    if (destination) {
      const destination_lower = destination.toLowerCase();
      
      if (destination_lower.includes('beach') || 
          destination_lower.includes('island') || 
          destination_lower.includes('coast') ||
          preferences?.toLowerCase().includes('beach')) {
        customizedChecklist['Beach Essentials'] = destinationSpecificItems.beach;
      }
      
      if (destination_lower.includes('mountain') || 
          destination_lower.includes('hiking') || 
          destination_lower.includes('trek') ||
          preferences?.toLowerCase().includes('hiking')) {
        customizedChecklist['Mountain Gear'] = destinationSpecificItems.mountain;
      }
      
      if (destination_lower.includes('city') || 
          destination_lower.includes('urban') || 
          preferences?.toLowerCase().includes('city')) {
        customizedChecklist['City Essentials'] = destinationSpecificItems.city;
      }
      
      if (destination_lower.includes('winter') || 
          destination_lower.includes('snow') || 
          destination_lower.includes('cold') ||
          preferences?.toLowerCase().includes('winter')) {
        customizedChecklist['Cold Weather Gear'] = destinationSpecificItems.cold;
      }
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
  }, [destination, preferences]);

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

  return (
    <div className="travel-checklist">
      <div className="checklist-header">
        <h3>Travel Packing Checklist</h3>
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
          />
          
          <select 
            value={newItemCategory} 
            onChange={(e) => setNewItemCategory(e.target.value)}
          >
            {Object.keys(checklist).map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
            <option value="add-new">+ Add New Category</option>
          </select>
          
          <button onClick={addNewItem} disabled={!newItemText.trim()}>
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
      
      <button onClick={resetChecklist} className="reset-button">
        Reset Checklist
      </button>
    </div>
  );
}

export default TravelChecklist; 