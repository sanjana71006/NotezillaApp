import React from 'react';
import Button from '../Button/Button';
import './ResourceCard.css';

const ResourceCard = ({ data }) => {
  const { title, tags, views, date, description } = data;

  return (
    <div className="resource-card">
      <div className="card-header">
        <h3 className="card-title">{title}</h3>
        <div className="tags">
          {tags.map((tag, index) => (
            <span key={index} className="tag">{tag}</span>
          ))}
        </div>
      </div>
      <p className="card-description">{description}</p>
      <div className="card-footer">
        <div className="card-meta">
          <span>👁️ {views}</span>
          <span>📅 {date}</span>
        </div>
        <Button isPrimary={false}>View</Button>
      </div>
    </div>
  );
};

export default ResourceCard;