import React from 'react';
import FeatureCard from '../FeatureCard/FeatureCard';
import './Features.css';

// In a real app, this might come from an API
const featuresData = [
  {
    icon: '📚', // Placeholder icon, replace with <FaBook /> etc.
    title: 'Vast Library',
    description: 'Access thousands of study materials, past papers, and lecture slides.'
  },
  {
    icon: '🧠',
    title: 'Smart Organization',
    description: 'Resources organized by year, semester, and course for easy navigation.'
  },
  {
    icon: '🤝',
    title: 'Community Driven',
    description: 'Connect with fellow students, share insights, and learn collaboratively.'
  },
  {
    icon: '🔒',
    title: 'Secure & Reliable',
    description: 'Your data is protected with enterprise-grade security and encryption.'
  },
  {
    icon: '🔍',
    title: 'Advanced Search',
    description: 'Find exactly what you need with our powerful search and filter options.'
  },
  {
    icon: '⚡',
    title: 'Real-time Updates',
    description: 'Get notified about new uploads and relevant resources tailored to you.'
  }
];

const Features = () => {
  return (
    <section className="features-section">
      <div className="container">
        <h2 className="section-title">Why Choose Notezilla?</h2>
        <p className="section-subtitle">
          Discover the features that make us the preferred platform for students.
        </p>
        <div className="features-grid">
          {featuresData.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;