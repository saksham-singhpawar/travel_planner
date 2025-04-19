import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaPlusCircle, FaTrash, FaPrint, FaUndo } from 'react-icons/fa';
import './PackingList.css';

// Default packing items based on general travel needs
const defaultPackingItems = {
  'Essential Documents': [
    { id: 'doc1', text: 'Passport/ID', checked: false },
    { id: 'doc2', text: 'Flight tickets', checked: false },
    { id: 'doc3', text: 'Hotel reservation', checked: false },
    { id: 'doc4', text: 'Travel insurance', checked: false },
    { id: 'doc5', text: 'Credit/debit cards', checked: false },
    { id: 'doc6', text: 'Driver\'s license', checked: false },
    { id: 'doc7', text: 'Emergency contacts', checked: false },
  ],
  'Clothing': [
    { id: 'cloth1', text: 'T-shirts', checked: false },
    { id: 'cloth2', text: 'Pants/shorts', checked: false },
    { id: 'cloth3', text: 'Underwear', checked: false },
    { id: 'cloth4', text: 'Socks', checked: false },
    { id: 'cloth5', text: 'Jacket/sweater', checked: false },
    { id: 'cloth6', text: 'Sleepwear', checked: false },
    { id: 'cloth7', text: 'Comfortable walking shoes', checked: false },
    { id: 'cloth8', text: 'Formal outfit', checked: false },
  ],
  'Toiletries': [
    { id: 'toilet1', text: 'Toothbrush & toothpaste', checked: false },
    { id: 'toilet2', text: 'Shampoo & conditioner', checked: false },
    { id: 'toilet3', text: 'Soap/shower gel', checked: false },
    { id: 'toilet4', text: 'Deodorant', checked: false },
    { id: 'toilet5', text: 'Sunscreen', checked: false },
    { id: 'toilet6', text: 'Medications', checked: false },
    { id: 'toilet7', text: 'First aid kit', checked: false },
    { id: 'toilet8', text: 'Hand sanitizer', checked: false },
  ],
  'Electronics': [
    { id: 'tech1', text: 'Phone', checked: false },
    { id: 'tech2', text: 'Phone charger', checked: false },
    { id: 'tech3', text: 'Laptop/tablet', checked: false },
    { id: 'tech4', text: 'Camera', checked: false },
    { id: 'tech5', text: 'Power adapter', checked: false },
    { id: 'tech6', text: 'Headphones', checked: false },
    { id: 'tech7', text: 'Portable charger', checked: false },
  ],
  'Miscellaneous': [
    { id: 'misc1', text: 'Day bag/backpack', checked: false },
    { id: 'misc2', text: 'Water bottle', checked: false },
    { id: 'misc3', text: 'Travel pillow', checked: false },
    { id: 'misc4', text: 'Books/e-reader', checked: false },
    { id: 'misc5', text: 'Snacks', checked: false },
    { id: 'misc6', text: 'Travel locks', checked: false },
    { id: 'misc7', text: 'Eye mask & earplugs', checked: false },
  ]
};

// Destination-specific items
const destinationSpecificItems = {
  paris: [
    { id: 'paris1', text: 'Umbrella (rain is common)', checked: false },
    { id: 'paris2', text: 'Adapter for EU outlets', checked: false },
    { id: 'paris3', text: 'Scarf (for visiting churches)', checked: false },
    { id: 'paris4', text: 'French phrasebook', checked: false },
  ],
  tokyo: [
    { id: 'tokyo1', text: 'Portable wifi/SIM card', checked: false },
    { id: 'tokyo2', text: 'Handkerchief (many restrooms don\'t have paper towels)', checked: false },
    { id: 'tokyo3', text: 'Comfortable shoes (lots of walking)', checked: false },
    { id: 'tokyo4', text: 'Small gifts (omiyage) for hosts', checked: false },
    { id: 'tokyo5', text: 'Japanese phrasebook/translator app', checked: false },
  ],
  newyork: [
    { id: 'ny1', text: 'Layers for variable temperatures', checked: false },
    { id: 'ny2', text: 'Small backpack or crossbody bag', checked: false },
    { id: 'ny3', text: 'Subway map/app', checked: false },
    { id: 'ny4', text: 'Extra comfortable walking shoes', checked: false },
  ]
};

// Preference-specific items
const preferenceItems = {
  adventure: [
    { id: 'adv1', text: 'Hiking boots', checked: false },
    { id: 'adv2', text: 'Quick-dry clothing', checked: false },
    { id: 'adv3', text: 'Backpack with hydration system', checked: false },
    { id: 'adv4', text: 'Sunglasses with strap', checked: false },
    { id: 'adv5', text: 'Bug spray', checked: false },
  ],
  beach: [
    { id: 'beach1', text: 'Swimsuit', checked: false },
    { id: 'beach2', text: 'Beach towel', checked: false },
    { id: 'beach3', text: 'Sandals/flip flops', checked: false },
    { id: 'beach4', text: 'High SPF sunscreen', checked: false },
    { id: 'beach5', text: 'After-sun lotion', checked: false },
    { id: 'beach6', text: 'Beach bag', checked: false },
  ],
  cultural: [
    { id: 'cult1', text: 'Modest clothing for religious sites', checked: false },
    { id: 'cult2', text: 'Local language phrasebook', checked: false },
    { id: 'cult3', text: 'Small gifts for hosts', checked: false },
    { id: 'cult4', text: 'Journal for notes', checked: false },
  ],
  food: [
    { id: 'food1', text: 'Antacids/digestive aids', checked: false },
    { id: 'food2', text: 'Reusable utensils', checked: false },
    { id: 'food3', text: 'Food allergy translation cards', checked: false },
  ],
  winter: [
    { id: 'winter1', text: 'Heavy coat/parka', checked: false },
    { id: 'winter2', text: 'Thermal underwear', checked: false },
    { id: 'winter3', text: 'Gloves and hat', checked: false },
    { id: 'winter4', text: 'Scarf', checked: false },
    { id: 'winter5', text: 'Winter boots', checked: false },
    { id: 'winter6', text: 'Lip balm and moisturizer', checked: false },
  ]
};

const PackingList = ({ destination, preferences = [] }) => {
  const [packingList, setPackingList] = useState({});
  const [newItemText, setNewItemText] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Miscellaneous');
  const [progress, setProgress] = useState(0);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [savedTemplates, setSavedTemplates] = useState(() => {
    const saved = localStorage.getItem('packingListTemplates');
    return saved ? JSON.parse(saved) : [];
  });
  const [templateName, setTemplateName] = useState('');
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);
  const [showLoadTemplate, setShowLoadTemplate] = useState(false);

  // Generate destination key
  const getDestinationKey = () => {
    const dest = destination?.toLowerCase() || '';
    if (dest.includes('paris')) return 'paris';
    if (dest.includes('tokyo')) return 'tokyo';
    if (dest.includes('new york')) return 'newyork';
    return null;
  };

  // Initialize packing list on component mount
  useEffect(() => {
    initializePackingList();
  }, [destination, preferences]);

  // Update progress when packing list changes
  useEffect(() => {
    updateProgress();
  }, [packingList]);

  // Initialize packing list with appropriate items
  const initializePackingList = () => {
    // Start with default items
    let initialList = JSON.parse(JSON.stringify(defaultPackingItems));
    
    // Add destination-specific items
    const destKey = getDestinationKey();
    if (destKey && destinationSpecificItems[destKey]) {
      if (!initialList['Destination Specific']) {
        initialList['Destination Specific'] = [];
      }
      
      initialList['Destination Specific'] = [
        ...initialList['Destination Specific'] || [],
        ...destinationSpecificItems[destKey]
      ];
    }
    
    // Add preference-specific items
    preferences.forEach(pref => {
      const prefLower = pref.toLowerCase();
      
      if (prefLower.includes('adventure') && preferenceItems.adventure) {
        if (!initialList['Activity Specific']) initialList['Activity Specific'] = [];
        initialList['Activity Specific'] = [
          ...initialList['Activity Specific'],
          ...preferenceItems.adventure
        ];
      }
      
      if ((prefLower.includes('beach') || prefLower.includes('relax')) && preferenceItems.beach) {
        if (!initialList['Activity Specific']) initialList['Activity Specific'] = [];
        initialList['Activity Specific'] = [
          ...initialList['Activity Specific'],
          ...preferenceItems.beach
        ];
      }
      
      if (prefLower.includes('culture') && preferenceItems.cultural) {
        if (!initialList['Activity Specific']) initialList['Activity Specific'] = [];
        initialList['Activity Specific'] = [
          ...initialList['Activity Specific'],
          ...preferenceItems.cultural
        ];
      }
      
      if (prefLower.includes('food') && preferenceItems.food) {
        if (!initialList['Activity Specific']) initialList['Activity Specific'] = [];
        initialList['Activity Specific'] = [
          ...initialList['Activity Specific'],
          ...preferenceItems.food
        ];
      }
    });
    
    // Check for winter conditions
    const isWinter = checkIfWinterDestination();
    if (isWinter && preferenceItems.winter) {
      if (!initialList['Weather Specific']) initialList['Weather Specific'] = [];
      initialList['Weather Specific'] = [
        ...initialList['Weather Specific'] || [],
        ...preferenceItems.winter
      ];
    }
    
    // Try to load from localStorage if available
    const savedList = localStorage.getItem(`packingList-${destination}`);
    if (savedList) {
      try {
        const parsedList = JSON.parse(savedList);
        setPackingList(parsedList);
      } catch (e) {
        console.error('Error parsing saved packing list', e);
        setPackingList(initialList);
      }
    } else {
      setPackingList(initialList);
    }
  };

  // Check if destination is likely to be cold
  const checkIfWinterDestination = () => {
    // Simplified logic - would need more detailed implementation for a real app
    const dest = destination?.toLowerCase() || '';
    return dest.includes('winter') || dest.includes('snow') || dest.includes('iceland');
  };

  // Update progress calculation
  const updateProgress = () => {
    const allItems = Object.values(packingList).flat();
    const totalItems = allItems.length;
    const checkedItems = allItems.filter(item => item.checked).length;
    const progressPercentage = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;
    setProgress(progressPercentage);
  };

  // Toggle item checked status
  const toggleItem = (categoryKey, itemId) => {
    const updatedList = { ...packingList };
    const categoryItems = [...updatedList[categoryKey]];
    const itemIndex = categoryItems.findIndex(item => item.id === itemId);
    
    // Toggle the checked status
    const newCheckedStatus = !categoryItems[itemIndex].checked;
    
    categoryItems[itemIndex] = {
      ...categoryItems[itemIndex],
      checked: newCheckedStatus
    };
    
    updatedList[categoryKey] = categoryItems;
    setPackingList(updatedList);
    
    // Save to localStorage
    localStorage.setItem(`packingList-${destination}`, JSON.stringify(updatedList));
    
    // Check if all items are packed and show a message
    if (newCheckedStatus) {
      const allItems = Object.values(updatedList).flat();
      const totalItems = allItems.length;
      const checkedItems = allItems.filter(item => item.checked).length;
      
      if (checkedItems === totalItems) {
        setTimeout(() => {
          alert("Congratulations! You've packed everything on your list. Have a great trip!");
        }, 500);
      }
    }
  };

  // Add a new item to the list
  const addNewItem = () => {
    if (!newItemText.trim()) return;
    
    const updatedList = { ...packingList };
    
    if (!updatedList[newItemCategory]) {
      updatedList[newItemCategory] = [];
    }
    
    const newItem = {
      id: `custom-${Date.now()}`,
      text: newItemText.trim(),
      checked: false
    };
    
    updatedList[newItemCategory] = [...updatedList[newItemCategory], newItem];
    setPackingList(updatedList);
    setNewItemText('');
    setIsAddingItem(false);
    
    // Save to localStorage
    localStorage.setItem(`packingList-${destination}`, JSON.stringify(updatedList));
  };

  // Add a new category to the list
  const addNewCategory = () => {
    if (!newCategoryName.trim()) return;
    
    const updatedList = { ...packingList };
    updatedList[newCategoryName.trim()] = [];
    
    setPackingList(updatedList);
    setNewCategoryName('');
    setNewItemCategory(newCategoryName.trim());
    setIsAddingCategory(false);
    
    // Save to localStorage
    localStorage.setItem(`packingList-${destination}`, JSON.stringify(updatedList));
  };

  // Remove an item from the list
  const removeItem = (categoryKey, itemId) => {
    const updatedList = { ...packingList };
    const categoryItems = updatedList[categoryKey].filter(item => item.id !== itemId);
    
    if (categoryItems.length === 0 && !Object.keys(defaultPackingItems).includes(categoryKey)) {
      // Remove empty custom category
      delete updatedList[categoryKey];
    } else {
      updatedList[categoryKey] = categoryItems;
    }
    
    setPackingList(updatedList);
    
    // Save to localStorage
    localStorage.setItem(`packingList-${destination}`, JSON.stringify(updatedList));
  };

  // Reset the packing list
  const resetPackingList = () => {
    if (window.confirm('Are you sure you want to reset your packing list? All progress will be lost.')) {
      // Reset by re-initializing
      localStorage.removeItem(`packingList-${destination}`);
      initializePackingList();
    }
  };

  // Print the packing list - FIXED: Now properly generates printable content
  const printPackingList = () => {
    window.print();
  };

  // Save the current packing list as a template
  const saveAsTemplate = () => {
    if (!templateName.trim()) return;
    
    const newTemplate = {
      id: Date.now(),
      name: templateName.trim(),
      items: packingList,
      createdAt: new Date().toISOString()
    };
    
    const updatedTemplates = [...savedTemplates, newTemplate];
    setSavedTemplates(updatedTemplates);
    localStorage.setItem('packingListTemplates', JSON.stringify(updatedTemplates));
    
    setTemplateName('');
    setShowSaveTemplate(false);
  };
  
  // Load a saved template
  const loadTemplate = (templateId) => {
    const template = savedTemplates.find(t => t.id === templateId);
    if (template) {
      setPackingList(template.items);
      localStorage.setItem(`packingList-${destination}`, JSON.stringify(template.items));
      setShowLoadTemplate(false);
    }
  };
  
  // Delete a saved template
  const deleteTemplate = (templateId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this template?')) {
      const updatedTemplates = savedTemplates.filter(t => t.id !== templateId);
      setSavedTemplates(updatedTemplates);
      localStorage.setItem('packingListTemplates', JSON.stringify(updatedTemplates));
    }
  };

  return (
    <motion.div
      className="packing-list-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="packing-list-header">
        <h3>Travel Packing List</h3>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          <span className="progress-text">{progress}% Packed</span>
        </div>
      </div>
      
      <div className="packing-list-actions">
        <button className="action-btn add-btn" onClick={() => setIsAddingItem(!isAddingItem)}>
          <FaPlusCircle /> Add Item
        </button>
        <button className="action-btn" onClick={() => setIsAddingCategory(!isAddingCategory)}>
          <FaPlusCircle /> New Category
        </button>
        <button className="action-btn template-btn" onClick={() => setShowSaveTemplate(!showSaveTemplate)}>
          Save as Template
        </button>
        <button className="action-btn template-btn" onClick={() => setShowLoadTemplate(!showLoadTemplate)}>
          Load Template
        </button>
        <button className="action-btn print-btn" onClick={printPackingList}>
          <FaPrint /> Print
        </button>
        <button className="action-btn reset-btn" onClick={resetPackingList}>
          <FaUndo /> Reset
        </button>
      </div>
      
      <AnimatePresence>
        {isAddingItem && (
          <motion.div 
            className="add-item-form"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="form-row">
              <input
                type="text"
                className="item-input"
                placeholder="Enter item name"
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
              />
              <select
                className="category-select"
                value={newItemCategory}
                onChange={(e) => setNewItemCategory(e.target.value)}
              >
                {Object.keys(packingList).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <button 
                className="add-item-btn"
                onClick={addNewItem}
                disabled={!newItemText.trim()}
              >
                Add
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {isAddingCategory && (
          <motion.div 
            className="add-category-form"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="form-row">
              <input
                type="text"
                className="item-input"
                placeholder="Enter category name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
              <button 
                className="add-item-btn"
                onClick={addNewCategory}
                disabled={!newCategoryName.trim()}
              >
                Add
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {showSaveTemplate && (
          <motion.div 
            className="template-form"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="form-row">
              <input
                type="text"
                className="item-input"
                placeholder="Enter template name"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
              />
              <button 
                className="save-template-btn"
                onClick={saveAsTemplate}
                disabled={!templateName.trim()}
              >
                Save
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {showLoadTemplate && (
          <motion.div 
            className="templates-list"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h4>Saved Templates</h4>
            {savedTemplates.length === 0 ? (
              <p className="no-templates">No saved templates yet</p>
            ) : (
              <ul>
                {savedTemplates.map(template => (
                  <li key={template.id} onClick={() => loadTemplate(template.id)}>
                    <span className="template-name">{template.name}</span>
                    <span className="template-date">
                      {new Date(template.createdAt).toLocaleDateString()}
                    </span>
                    <button 
                      className="delete-template-btn"
                      onClick={(e) => deleteTemplate(template.id, e)}
                    >
                      <FaTrash />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="packing-categories">
        {Object.keys(packingList).map(category => (
          <motion.div 
            key={category} 
            className="packing-category"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h4>{category}</h4>
            <ul>
              {packingList[category].map(item => (
                <motion.li 
                  key={item.id} 
                  className={item.checked ? 'checked' : ''}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="item-content">
                    <label>
                      <input 
                        type="checkbox" 
                        checked={item.checked} 
                        onChange={() => toggleItem(category, item.id)} 
                      />
                      <span className="item-text">{item.text}</span>
                    </label>
                  </div>
                  <button 
                    className="remove-item-btn"
                    onClick={() => removeItem(category, item.id)}
                  >
                    <FaTrash />
                  </button>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default PackingList;