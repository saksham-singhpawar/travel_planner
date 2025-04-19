import React, { useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./Itinerary.css";

function ItineraryDisplay({ itinerary, loading }) {
  const itineraryRef = useRef();
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [downloadStarted, setDownloadStarted] = useState(false);

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

  if (!itinerary) return null;

  const formatItinerary = (text) => {
    return text.split("\n\n").map((section, index) => {
      if (section.startsWith("**")) {
        return <h2 key={index}>{section.replace(/\*\*/g, "")}</h2>;
      } else if (section.startsWith("*")) {
        return (
          <ul key={index}>
            {section.split("\n").map((item, i) =>
              item.startsWith("*") ? <li key={i}>{item.replace("* ", "")}</li> : null
            )}
          </ul>
        );
      } else {
        return <p key={index}>{section}</p>;
      }
    });
  };

  const downloadPDF = () => {
    const element = itineraryRef.current;
    if (!element) return;
    
    setDownloadStarted(true);

    // Style modifications for better PDF output
    const originalStyles = window.getComputedStyle(element);
    const originalPadding = element.style.padding;
    const originalWidth = element.style.width;
    
    // Make background white for PDF
    element.style.background = 'white';
    
    // Ensure content is fully rendered and visible before capture
    setTimeout(() => {
      html2canvas(element, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: true,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc) => {
          // Find the cloned element in the cloned document
          const clonedElement = clonedDoc.getElementById(element.id);
          if (clonedElement) {
            // Apply specific styling to the clone for better PDF rendering
            clonedElement.style.padding = '20px';
            clonedElement.style.width = '100%';
            clonedElement.style.height = 'auto';
            clonedElement.style.boxShadow = 'none';
            
            // Make sure all content is visible in the clone
            const contentElements = clonedElement.querySelectorAll('p, h2, ul, li');
            contentElements.forEach(el => {
              el.style.color = '#000';
              el.style.opacity = '1';
              if (el.tagName === 'H2') {
                el.style.borderBottom = '1px solid #000';
                el.style.paddingBottom = '5px';
              }
            });
          }
        }
      }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = 10;
        
        pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
        pdf.save('travel-itinerary.pdf');
        
        // Restore original styles
        element.style.padding = originalPadding;
        element.style.width = originalWidth;
        element.style.background = originalStyles.background;
        
        setDownloadStarted(false);
      }).catch(error => {
        console.error('PDF Generation Error:', error);
        setDownloadStarted(false);
        alert('There was an error generating the PDF. Please try again.');
      });
    }, 500);
  };

  const toggleShareOptions = () => {
    setShowShareOptions(!showShareOptions);
  };

  const shareOnSocialMedia = (platform) => {
    // Create the share text
    const shareText = "Check out my travel itinerary created with Travel Planner!";
    const shareUrl = window.location.href;
    
    let shareLink = '';
    
    switch (platform) {
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
        break;
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
        break;
      case 'whatsapp':
        shareLink = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
        break;
      case 'email':
        shareLink = `mailto:?subject=${encodeURIComponent('My Travel Itinerary')}&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`;
        break;
      default:
        return;
    }
    
    // Open in a new tab
    window.open(shareLink, '_blank');
  };

  return (
    <div className="itinerary-container">
      <div id="itinerary-content" className="itinerary" ref={itineraryRef}>
        <div className="itinerary-header">
          <h2>Your AI-Generated Travel Itinerary</h2>
          <div className="itinerary-icon">🛫</div>
        </div>
        <div className="itinerary-content">{formatItinerary(itinerary)}</div>
      </div>
      
      <div className="itinerary-actions">
        <button 
          className="download-btn" 
          onClick={downloadPDF}
          disabled={downloadStarted}
        >
          <span className="download-icon">
            {downloadStarted ? '⏳' : '📄'}
          </span> 
          {downloadStarted ? 'Generating PDF...' : 'Download PDF'}
        </button>
        
        <button className="share-btn" onClick={toggleShareOptions}>
          <span className="share-icon">🔗</span> Share Itinerary
        </button>
        
        {showShareOptions && (
          <div className="share-options">
            <button className="share-option facebook" onClick={() => shareOnSocialMedia('facebook')}>
              Facebook
            </button>
            <button className="share-option twitter" onClick={() => shareOnSocialMedia('twitter')}>
              Twitter
            </button>
            <button className="share-option whatsapp" onClick={() => shareOnSocialMedia('whatsapp')}>
              WhatsApp
            </button>
            <button className="share-option email" onClick={() => shareOnSocialMedia('email')}>
              Email
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ItineraryDisplay;
