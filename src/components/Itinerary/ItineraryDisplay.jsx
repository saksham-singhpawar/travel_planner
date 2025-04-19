import React, { useState, useRef } from 'react';
import './Itinerary.css';
import { FaShareAlt, FaDownload, FaTwitter, FaFacebook, FaWhatsapp } from 'react-icons/fa';
import { toast } from 'react-toastify';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ItineraryDisplay = ({ itinerary, onSave, isGenerated, destination, preferences, loading, userLoggedIn }) => {
  const itineraryRef = useRef();
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Debug logs to identify the issue
  console.log("ItineraryDisplay props:", { 
    itineraryReceived: itinerary ? 'yes' : 'no',
    itineraryType: typeof itinerary, 
    itineraryLength: itinerary?.length,
    firstChars: itinerary?.substring(0, 30),
    loading
  });

  // Function to toggle share options visibility
  const toggleShareOptions = () => {
    setShowShareOptions(!showShareOptions);
  };

  // Function to handle sharing on social media
  const shareOnPlatform = (platform) => {
    const url = window.location.href;
    const text = "Check out my travel itinerary!";
    
    let shareUrl;
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
    setShowShareOptions(false);
  };

  // Function to download the itinerary as PDF
  const downloadAsPDF = async () => {
    if (!itineraryRef.current) return;
    
    setIsDownloading(true);
    try {
      // Set white background for PDF
      const originalBg = itineraryRef.current.style.background;
      itineraryRef.current.style.background = 'white';
      
      // Temporarily adjust styling for PDF capture
      const elementsToAdjust = itineraryRef.current.querySelectorAll('h2, .day-header, .time-heading');
      const originalStyles = Array.from(elementsToAdjust).map(el => ({
        element: el,
        color: el.style.color,
      }));
      
      // Make headings darker for PDF
      elementsToAdjust.forEach(el => {
        el.style.color = '#1a5dc8';
      });
      
      const canvas = await html2canvas(itineraryRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      
      // Restore original styles
      itineraryRef.current.style.background = originalBg;
      originalStyles.forEach(item => {
        item.element.style.color = item.color;
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      
      let heightLeft = imgHeight;
      let position = 0;
      
      // First page
      pdf.addImage(
        imgData,
        'PNG',
        imgX,
        position,
        imgWidth * ratio,
        imgHeight * ratio
      );
      heightLeft -= pdfHeight;
      
      // Additional pages if needed
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(
          imgData,
          'PNG',
          imgX,
          position,
          imgWidth * ratio,
          imgHeight * ratio
        );
        heightLeft -= pdfHeight;
      }
      
      pdf.save('travel-itinerary.pdf');
      toast.success('Itinerary downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to download itinerary. Please try again.');
    }
    setIsDownloading(false);
  };

  // Function to format day activities with proper line breaks
  const formatDayActivities = (text) => {
    if (!text) return null;
    
    // Replace asterisks with line breaks and properly format
    const formattedText = text.split('*').map(item => item.trim()).filter(item => item);
    
    if (formattedText.length <= 1) {
      return <p>{text}</p>;
    }
    
    return (
      <ul className="activity-list">
        {formattedText.map((item, index) => (
          <li key={index} className="activity-item">{item}</li>
        ))}
      </ul>
    );
  };

  const formatItinerary = (itinerary) => {
    // Additional debugging to see what's happening inside formatItinerary
    console.log("formatItinerary called with:", {
      itineraryExists: itinerary ? 'yes' : 'no',
      type: typeof itinerary,
      length: itinerary?.length
    });
    
    if (!itinerary || typeof itinerary !== 'string') {
      console.log("Itinerary is not a valid string");
      return null;
    }

    // Simple pre-formatted display for testing purposes
    // This bypasses the complex parsing logic to see if that's the issue
    return (
      <div className="simple-format">
        {itinerary.split('\n').map((line, index) => {
          if (line.startsWith('**')) {
            // It's a header
            return <h3 key={index} className="day-header">{line.replace(/\*\*/g, '')}</h3>;
          } else if (line.startsWith('*')) {
            // It's a list item
            return <p key={index} className="activity-item">• {line.replace('* ', '')}</p>;
          } else {
            // Regular text
            return line.trim() ? <p key={index}>{line}</p> : <br key={index} />;
          }
        })}
      </div>
    );

    /* Commented out complex parsing for testing
    const sections = [];
    let currentSection = null;
    let lines = itinerary.trim().split('\n');

    // Handle empty itinerary
    if (lines.length === 0) {
      return (
        <div className="no-content">
          <p>No itinerary content to display. Please try again.</p>
        </div>
      );
    }

    // Process each line
    lines.forEach(line => {
      // Handle day headers (Day 1, Day 2, etc.)
      if (line.match(/^Day \d+:/)) {
        if (currentSection) {
          sections.push(currentSection);
        }
        currentSection = {
          type: 'day',
          title: line.trim(),
          content: []
        };
      } 
      // Handle time-based activities (Morning, Afternoon, Evening)
      else if (line.match(/^(Morning|Afternoon|Evening|Night|Lunch|Dinner|Breakfast):/i) && currentSection) {
        const timeMatch = line.match(/^(Morning|Afternoon|Evening|Night|Lunch|Dinner|Breakfast):/i);
        const timePrefix = timeMatch[0];
        const activities = line.substring(timePrefix.length).trim();
        
        currentSection.content.push({
          type: 'time',
          time: timeMatch[1],
          activities: activities
        });
      }
      // Handle section headers (Accommodation, Transportation, etc.)
      else if (line.match(/^(Accommodation|Transportation|Budget Breakdown|Travel Tips|Packing List):/i)) {
        if (currentSection) {
          sections.push(currentSection);
        }
        const headerMatch = line.match(/^([^:]+):/);
        currentSection = {
          type: 'section',
          title: headerMatch ? headerMatch[1] : 'Section',
          content: [line.replace(headerMatch[0], '').trim()]
        };
      }
      // Handle list items
      else if (line.match(/^\s*[-•]\s/) && currentSection) {
        currentSection.content.push(line.trim());
      }
      // Add to current section content
      else if (line.trim() && currentSection) {
        if (typeof currentSection.content === 'string') {
          currentSection.content += ' ' + line.trim();
        } else if (Array.isArray(currentSection.content)) {
          currentSection.content.push(line.trim());
        }
      }
    });

    if (currentSection) {
      sections.push(currentSection);
    }

    return (
      <div className="itinerary-content">
        {sections.map((section, sectionIndex) => {
          if (section.type === 'day') {
            return (
              <div key={sectionIndex} className="day-section">
                <div className="day-block">
                  <h3 className="day-header">{section.title}</h3>
                  <div className="day-activities">
                    {section.content.map((item, itemIndex) => {
                      if (item.type === 'time') {
                        return (
                          <div key={itemIndex} className="time-activity">
                            <h4 className="time-heading">{item.time}</h4>
                            {formatDayActivities(item.activities)}
                          </div>
                        );
                      } else {
                        return (
                          <div key={itemIndex} className="regular-activity">
                            {item}
                          </div>
                        );
                      }
                    })}
                  </div>
                </div>
              </div>
            );
          } else if (section.type === 'section') {
            return (
              <div key={sectionIndex} className="section-content">
                <h2>{section.title}</h2>
                {Array.isArray(section.content) ? (
                  <ul className="itinerary-list">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="regular-activity">
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>{section.content}</p>
                )}
              </div>
            );
          }
          return null;
        })}
      </div>
    );
    */
  };

  // Render loading state if needed
  if (loading) {
    return (
      <div className="skeleton-container">
        <div className="loading-text">Creating your dream itinerary...</div>
        <div className="skeleton-itinerary">
          <div className="skeleton-header"></div>
          <div className="skeleton-line"></div>
          <div className="skeleton-line"></div>
          <div className="skeleton-line"></div>
          <div className="skeleton-day">
            <div className="skeleton-day-header"></div>
            <div className="skeleton-line"></div>
            <div className="skeleton-line"></div>
            <div className="skeleton-line short"></div>
          </div>
          <div className="skeleton-day">
            <div className="skeleton-day-header"></div>
            <div className="skeleton-line"></div>
            <div className="skeleton-line"></div>
            <div className="skeleton-line short"></div>
          </div>
          <div className="skeleton-day">
            <div className="skeleton-day-header"></div>
            <div className="skeleton-line"></div>
            <div className="skeleton-line"></div>
            <div className="skeleton-line short"></div>
          </div>
        </div>
        <div className="skeleton-button"></div>
    </div>
  );
}

  // Render the component
  return (
    <div className="itinerary-display">
      {itinerary ? (
        <>
          <div className="itinerary-container">
            <div id="itinerary-content" className="itinerary" ref={itineraryRef}>
              <div className="itinerary-header">
                <h2>Your AI-Generated Travel Itinerary</h2>
                <div className="itinerary-icon">🛫</div>
              </div>
              
              {/* Direct rendering of itinerary without complex parsing */}
              <div className="simple-format">
                {itinerary.split('\n').map((line, index) => {
                  if (line.startsWith('**')) {
                    // It's a header
                    return <h3 key={index} className="day-header">{line.replace(/\*\*/g, '')}</h3>;
                  } else if (line.startsWith('*')) {
                    // It's a list item
                    return <p key={index} className="activity-item">• {line.replace('* ', '')}</p>;
                  } else {
                    // Regular text
                    return line.trim() ? <p key={index}>{line}</p> : <br key={index} />;
                  }
                })}
              </div>
              
              {/* Original complex parsing - commented out for testing 
              {formatItinerary(itinerary)}
              */}
            </div>
            
            <div className="itinerary-actions">
              <button 
                className="download-btn" 
                onClick={downloadAsPDF}
                disabled={isDownloading}
              >
                <FaDownload className="download-icon" />
                {isDownloading ? 'Downloading...' : 'Download PDF'}
              </button>
              
              <button className="share-btn" onClick={toggleShareOptions}>
                <FaShareAlt className="share-icon" /> Share Itinerary
              </button>
              
              {showShareOptions && (
                <div className="share-options">
                  <button onClick={() => shareOnPlatform('twitter')} className="share-option twitter">
                    <FaTwitter /> Twitter
                  </button>
                  <button onClick={() => shareOnPlatform('facebook')} className="share-option facebook">
                    <FaFacebook /> Facebook
                  </button>
                  <button onClick={() => shareOnPlatform('whatsapp')} className="share-option whatsapp">
                    <FaWhatsapp /> WhatsApp
                  </button>
                </div>
              )}
              
              {!isGenerated && (
                <button className="save-btn" onClick={() => onSave && onSave(destination, preferences)}>
                  Save Itinerary
                </button>
              )}
            </div>
          </div>
        </>
      ) : (
        <p className="no-itinerary">Generate an itinerary to see details here.</p>
      )}
    </div>
  );
};

export default ItineraryDisplay;
