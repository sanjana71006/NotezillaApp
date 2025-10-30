import React from 'react';
import './FeatureCard.css';

// To use actual icons, you can install a library like react-icons
// npm install react-icons
// Then import them: import { FaBook } from 'react-icons/fa';

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="feature-card">
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default FeatureCard;