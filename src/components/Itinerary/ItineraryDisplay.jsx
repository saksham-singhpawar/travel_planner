import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./Itinerary.css";

function ItineraryDisplay({ itinerary, loading }) {
  const itineraryRef = useRef();

  if (loading) {
    return <div className="loading">⏳ Generating your itinerary...</div>;
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

    // Ensure the UI is fully rendered before capturing
    setTimeout(() => {
      html2canvas(element, {
        scale: 3, // Higher scale = better quality
        useCORS: true, // Allow external fonts/images
        backgroundColor: "#ffffff", // Fix transparent PDF issue
        windowWidth: element.scrollWidth, // Capture full width
        windowHeight: element.scrollHeight, // Capture full height
      }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 10, imgWidth, imgHeight);
        pdf.save("itinerary.pdf");
      }).catch((error) => console.error("❌ PDF Generation Error:", error));
    }, 500);
  };

  return (
    <div className="itinerary-container">
      <div className="itinerary" ref={itineraryRef}>
        <h2>Your AI-Generated Travel Itinerary</h2>
        <div className="itinerary-content">{formatItinerary(itinerary)}</div>
      </div>
      <button className="download-btn" onClick={downloadPDF}>📄 Download PDF</button>
    </div>
  );
}

export default ItineraryDisplay;
