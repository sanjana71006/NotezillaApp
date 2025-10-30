import React from 'react';
import ResourceCard from '../ResourceCard/ResourceCard';
import './PopularResources.css';

// In a real app, this data would come from an API
const resources = [
  {
    title: 'Database Management Systems - Midterm',
    tags: ['2nd Year', 'Semester 3', 'PDF'],
    views: 142,
    date: 'Jan 15, 2024',
    description: 'Mid-term exam questions covering normalization, transactions, and...'
  },
  {
    title: 'Software Engineering Project Report Template',
    tags: ['4th Year', 'Semester 7', 'DOCX'],
    views: 89,
    date: 'Jan 12, 2024',
    description: 'Professional template for final year project reports with proper...'
  },
  {
    title: 'Data Structures Lab Manual',
    tags: ['2nd Year', 'Semester 2', 'PDF'],
    views: 90,
    date: 'Jan 10, 2024',
    description: 'Complete lab manual with implementations of stacks, queues...'
  },
  // Add more resource objects here to match your design
];

const PopularResources = () => {
  return (
    <section className="popular-resources">
      <div className="container">
        <h2 className="section-title">Popular Resources</h2>
        <div className="resources-grid">
          {resources.map((resource, index) => (
            <ResourceCard key={index} data={resource} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularResources;