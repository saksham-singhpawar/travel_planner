import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Contact.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFacebookF, 
  faTwitter, 
  faInstagram, 
  faLinkedinIn 
} from '@fortawesome/free-brands-svg-icons';
import { 
  faPhone, 
  faEnvelope, 
  faLocationDot,
  faPlus,
  faMinus,
  faCheckCircle,
  faPaperPlane
} from '@fortawesome/free-solid-svg-icons';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [newsletter, setNewsletter] = useState({
    email: "",
    subscribed: false,
    error: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid";
    }
    
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitted(true);
        setFormData({ name: "", email: "", message: "" });
        
        // Reset success message after 5 seconds
        setTimeout(() => {
          setSubmitted(false);
        }, 5000);
      }, 1500);
    }
  };

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const faqItems = [
    {
      question: "How do I create a custom itinerary?",
      answer: "Visit our Itinerary page and use our intuitive planner to create a personalized travel plan based on your preferences. You can select destinations, set dates, specify your budget, and choose activities to build your perfect trip."
    },
    {
      question: "Can I save multiple itineraries?",
      answer: "Yes! You can create and save as many itineraries as you want to compare different travel options. This helps you evaluate various destinations, accommodation choices, and activity combinations before making your final decision."
    },
    {
      question: "How do I share my travel plans?",
      answer: "Once you've created an itinerary, use the share buttons to send it via email or social media to your travel companions. You can also download your itinerary as a PDF to print or save offline for easy access during your trip."
    },
    {
      question: "Are the suggested activities verified?",
      answer: "Yes, all activities in our database are researched and verified by our travel experts. We regularly update our activity listings to ensure they're current, and we include user ratings to help you choose the best experiences."
    },
    {
      question: "What happens if I need to change my travel dates?",
      answer: "You can easily modify your itinerary at any time. Simply open your saved itinerary, click the edit button, and adjust your dates. Our system will automatically update availability for accommodations and activities based on your new schedule."
    }
  ];

  const handleNewsletterChange = (e) => {
    setNewsletter({
      ...newsletter,
      email: e.target.value,
      error: ""
    });
  };

  const subscribeToNewsletter = () => {
    // Validate email
    if (!newsletter.email) {
      setNewsletter({
        ...newsletter,
        error: "Email is required"
      });
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(newsletter.email)) {
      setNewsletter({
        ...newsletter,
        error: "Please enter a valid email address"
      });
      return;
    }
    
    // Simulate API call for newsletter subscription
    setNewsletter({
      ...newsletter,
      submitting: true
    });
    
    setTimeout(() => {
      setNewsletter({
        email: "",
        submitting: false,
        subscribed: true,
        error: ""
      });
      
      // Reset subscribed message after 5 seconds
      setTimeout(() => {
        setNewsletter(prev => ({
          ...prev,
          subscribed: false
        }));
      }, 5000);
    }, 1500);
  };

  return (
    <motion.div 
      className="contact-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="contact-header">
        <h1>Contact Us</h1>
        <p>Have questions about your next adventure? We're here to help!</p>
      </div>

      <div className="contact-content">
        <div className="contact-info">
          <div className="info-item">
            <div className="icon">
              <FontAwesomeIcon icon={faPhone} />
            </div>
            <div>
              <h3>Phone</h3>
              <p>+1 (555) 123-4567</p>
            </div>
          </div>
          <div className="info-item">
            <div className="icon">
              <FontAwesomeIcon icon={faEnvelope} />
            </div>
            <div>
              <h3>Email</h3>
              <p>info@travelplanner.com</p>
            </div>
          </div>
          <div className="info-item">
            <div className="icon">
              <FontAwesomeIcon icon={faLocationDot} />
            </div>
            <div>
              <h3>Address</h3>
              <p>123 Travel Avenue, City, State 12345</p>
            </div>
          </div>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faFacebookF} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faTwitter} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faLinkedinIn} />
            </a>
          </div>
        </div>

        <div className="contact-form">
          <h2>Send Us a Message</h2>
          
          {submitted ? (
            <motion.div 
              className="success-message"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <FontAwesomeIcon icon={faCheckCircle} className="success-icon" />
              <h3>Thank you!</h3>
              <p>Your message has been sent successfully. We'll get back to you shortly.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? "error" : ""}
                  placeholder="Enter your name"
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? "error" : ""}
                  placeholder="Enter your email"
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Your Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  className={errors.message ? "error" : ""}
                  placeholder="How can we help you?"
                ></textarea>
                {errors.message && <span className="error-message">{errors.message}</span>}
              </div>
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className={isSubmitting ? "submitting" : ""}
              >
                {isSubmitting ? (
                  <span className="loading-spinner"></span>
                ) : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </div>
      
      <div className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-items">
          {faqItems.map((faq, index) => (
            <motion.div 
              key={index}
              className={`faq-item ${expandedFaq === index ? 'expanded' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div 
                className="faq-question" 
                onClick={() => toggleFaq(index)}
              >
                <h3>{faq.question}</h3>
                <FontAwesomeIcon icon={expandedFaq === index ? faMinus : faPlus} />
              </div>
              <AnimatePresence>
                {expandedFaq === index && (
                  <motion.div 
                    className="faq-answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p>{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="newsletter-section">
        <h2>Subscribe to Our Newsletter</h2>
        <p>Get travel tips, destination guides, and exclusive offers directly to your inbox.</p>
        
        {newsletter.subscribed ? (
          <motion.div 
            className="newsletter-success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <FontAwesomeIcon icon={faPaperPlane} className="success-icon" />
            <h3>Thank you for subscribing!</h3>
            <p>You're now on the list for our latest travel updates and offers.</p>
          </motion.div>
        ) : (
          <div className="newsletter-form">
            <input 
              type="email" 
              placeholder="Your email address" 
              className={`newsletter-input ${newsletter.error ? 'error' : ''}`}
              value={newsletter.email}
              onChange={handleNewsletterChange}
            />
            <button 
              className="newsletter-btn"
              onClick={subscribeToNewsletter}
              disabled={newsletter.submitting}
            >
              {newsletter.submitting ? (
                <span className="loading-spinner"></span>
              ) : "Subscribe"}
            </button>
          </div>
        )}
        {newsletter.error && <p className="newsletter-error">{newsletter.error}</p>}
        <p className="newsletter-disclaimer">We respect your privacy. Unsubscribe at any time.</p>
      </div>
    </motion.div>
  );
};

export default Contact;
