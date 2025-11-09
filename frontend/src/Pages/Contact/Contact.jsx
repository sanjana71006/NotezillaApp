import React, { useState } from 'react';
import { contactsAPI } from '../../services/api';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const categories = [
    { value: '', label: 'Select Category' },
    { value: 'bug-report', label: 'Bug Report' },
    { value: 'upload-issue', label: 'Upload Issue' },
    { value: 'account-help', label: 'Account Help' },
    { value: 'general-inquiry', label: 'General Inquiry' },
    { value: 'feature-request', label: 'Feature Request' },
    { value: 'technical-support', label: 'Technical Support' }
  ];

  const faqs = [
    {
      question: "How do I upload notes?",
      answer: "To upload notes, go to the Upload page from your dashboard. Fill in the required details like title, description, year, semester, and subject. Then select your file (PDF, DOC, PPT, etc.) and click 'Publish Content'. Make sure your file is under 10MB."
    },
    {
      question: "How are downloads tracked?",
      answer: "Every time someone downloads a file, our system automatically increments the download counter. This helps other students identify popular and useful resources. Your download history is also tracked in your 'My Progress' section."
    },
    {
      question: "What file formats are supported?",
      answer: "We support PDF, DOC, DOCX, PPT, PPTX, ZIP, and TXT files. All files must be under 10MB in size. We recommend PDF format for notes and documents as it preserves formatting across all devices."
    },
    {
      question: "Can I edit my uploaded content?",
      answer: "Currently, you cannot edit uploaded content directly. However, you can delete and re-upload your content if needed. We're working on an edit feature for future updates."
    },
    {
      question: "How do I join study groups?",
      answer: "Navigate to the 'Study Groups' section from your dashboard. You can browse existing groups by subject or year, or create your own group. Some groups are open to join, while others require an invitation."
    },
    {
      question: "Is my uploaded content safe?",
      answer: "Yes, we take security seriously. All uploads are scanned for malware, and we have moderation systems in place. However, please ensure you're not uploading copyrighted material without permission."
    },
    {
      question: "How do I report inappropriate content?",
      answer: "If you find inappropriate content, you can report it using the report button available on each resource card. Our moderation team will review reported content within 24 hours."
    },
    {
      question: "Can faculty members upload content?",
      answer: "Absolutely! Faculty members can upload lecture notes, assignments, past papers, and other academic materials. Faculty uploads are marked with a special badge to indicate their credibility."
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Send to backend
      await contactsAPI.create(formData);

      setSubmitSuccess(true);
      setFormData({ name: '', email: '', category: '', message: '' });

      // Hide success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);

    } catch (error) {
      console.error('Submission error:', error);
      setErrors({ submit: error.message || 'Failed to send message. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="container">
        <div className="contact-header">
          <h1>📞 Contact Us</h1>
          <p>Get help, report issues, or share your feedback with our team</p>
        </div>

        <div className="contact-content">
          <div className="contact-form-section">
            <div className="contact-form-container">
              <h2>Send us a Message</h2>
              <p>Fill out the form below and we'll get back to you as soon as possible.</p>

              {submitSuccess && (
                <div className="success-message">
                  <div className="success-icon">✅</div>
                  <div>
                    <h3>Message Sent Successfully!</h3>
                    <p>Thank you for contacting us. We'll respond within 24 hours.</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className={errors.name ? 'error' : ''}
                    />
                    {errors.name && <span className="error-message">{errors.name}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email address"
                      className={errors.email ? 'error' : ''}
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="category">Category *</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={errors.category ? 'error' : ''}
                  >
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                  {errors.category && <span className="error-message">{errors.category}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Describe your issue, question, or feedback in detail..."
                    rows="6"
                    className={errors.message ? 'error' : ''}
                  />
                  {errors.message && <span className="error-message">{errors.message}</span>}
                  <div className="character-count">
                    {formData.message.length}/1000 characters
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="submit-btn"
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner"></span>
                      Sending Message...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </button>

                {errors.submit && (
                  <div className="error-message submit-error">{errors.submit}</div>
                )}
              </form>
            </div>
          </div>

          <div className="contact-info-section">
            <div className="contact-details">
              <h2>Contact Information</h2>
              
              <div className="contact-item">
                <div className="contact-icon">📧</div>
                <div className="contact-text">
                  <h3>Email Support</h3>
                  <p>support@notezilla.com</p>
                  <span>We respond within 24 hours</span>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">📱</div>
                <div className="contact-text">
                  <h3>Phone Support</h3>
                  <p>+1 (555) 123-4567</p>
                  <span>Mon-Fri, 9 AM - 6 PM EST</span>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">💬</div>
                <div className="contact-text">
                  <h3>Live Chat</h3>
                  <p>Available on our website</p>
                  <span>Mon-Fri, 9 AM - 6 PM EST</span>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">🏢</div>
                <div className="contact-text">
                  <h3>Office Address</h3>
                  <p>123 Education Street<br />Learning City, LC 12345</p>
                  <span>Visit by appointment only</span>
                </div>
              </div>
            </div>

            <div className="quick-links">
              <h3>Quick Links</h3>
              <ul>
                <li><a href="#faq">FAQ Section</a></li>
                <li><a href="/upload">Upload Guidelines</a></li>
                <li><a href="/about">About Notezilla</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div id="faq" className="faq-section">
          <h2>📚 Frequently Asked Questions</h2>
          <p>Find quick answers to common questions</p>
          
          <div className="faq-grid">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <div className="faq-question">
                  <h3>{faq.question}</h3>
                </div>
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Support Hours */}
        <div className="support-hours">
          <h2>Support Hours</h2>
          <div className="hours-grid">
            <div className="hours-item">
              <strong>Email Support</strong>
              <span>24/7 - We respond within 24 hours</span>
            </div>
            <div className="hours-item">
              <strong>Live Chat & Phone</strong>
              <span>Monday - Friday: 9:00 AM - 6:00 PM EST</span>
            </div>
            <div className="hours-item">
              <strong>Emergency Issues</strong>
              <span>Contact us immediately via email for urgent matters</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;