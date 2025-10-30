import React from 'react';
import Button from '../Button/Button';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="container hero-content">
        <h1>Your Gateway to <br /> Academic Excellence</h1>
        <p>Access thousands of study materials, past papers, and resources shared by students from top universities to excel in your academic journey.</p>
        <div className="hero-buttons">
          <Button isPrimary={true}>Browse Resources</Button>
          <Button isPrimary={false}>Upload Content</Button>
        </div>
        <div className="stats">
            <div className="stat-item">
                <h3>6</h3>
                <p>Resources</p>
            </div>
            <div className="stat-item">
                <h3>3</h3>
                <p>Students</p>
            </div>
            <div className="stat-item">
                <h3>523</h3>
                <p>Downloads</p>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;