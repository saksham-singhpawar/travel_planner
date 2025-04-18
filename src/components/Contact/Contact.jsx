import React from "react";
import "./Contact.css";

function Contact() {
  return (
    <div className="contact-container">
      <div className="contact-header">
        <h1>Get in Touch</h1>
        <p>Have any questions? We'd love to hear from you!</p>
      </div>

      <div className="contact-content">
        {}
        <div className="contact-info">
          <h2>Contact Information</h2>
          <p><i className="fas fa-phone"></i> 9009000678</p>
          <p><i className="fas fa-envelope"></i> support@travelplanner.com</p>
          <p><i className="fas fa-map-marker-alt"></i> VIT Chennai</p>
        </div>

        {}
        <div className="contact-form">
          <h2>Send a Message</h2>
          <form>
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <textarea placeholder="Your Message" rows="4" required></textarea>
            <button type="submit">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;
