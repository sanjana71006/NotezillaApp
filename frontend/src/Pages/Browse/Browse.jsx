import React, { useState, useEffect } from 'react';
import './Browse.css';
import { resourcesAPI } from '../../services/api';

const Browse = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    year: '',
    semester: '',
    subject: '',
    examType: '',
    category: ''
  });
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredResources, setFilteredResources] = useState([]);

  // Filter options
  const filterOptions = {
    years: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
    semesters: ["1st Semester", "2nd Semester", "3rd Semester", "4th Semester", "5th Semester", "6th Semester", "7th Semester", "8th Semester"],
    subjects: ["Computer Science", "Mathematics", "Physics", "Chemistry", "Electronics", "Mechanical Engineering", "Civil Engineering"],
    examTypes: ["T1", "T2", "T3", "T4", "T5"],
    categories: ["Notes", "Question Papers", "Lab Manuals", "Assignments", "Projects"]
  };

  // Fetch resources from API on mount
  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const result = await resourcesAPI.getAll();
        setResources(result.resources || []);
      } catch (err) {
        console.error('Failed to fetch resources:', err);
        setResources([]);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = resources.filter(resource => {
      const matchesSearch = 
        (resource.title && resource.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (resource.description && resource.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (resource.subject && resource.subject.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesFilters = 
        (filters.year === '' || resource.year === filters.year) &&
        (filters.semester === '' || resource.semester === filters.semester) &&
        (filters.subject === '' || resource.subject === filters.subject) &&
        (filters.examType === '' || resource.examType === filters.examType) &&
        (filters.category === '' || resource.category === filters.category);

      return matchesSearch && matchesFilters;
    });

    setFilteredResources(filtered);
  }, [searchTerm, filters, resources]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      year: '',
      semester: '',
      subject: '',
      examType: '',
      category: ''
    });
    setSearchTerm('');
  };

  const handleDownload = async (resourceId) => {
    try {
      // Make request to backend download endpoint
      const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');
      const response = await fetch(`${API_URL}/resources/${resourceId}/download`);
      
      if (!response.ok) {
        alert('Failed to download file');
        return;
      }

      // Create a blob and download
      const blob = await response.blob();
      const resource = resources.find(r => r._id === resourceId);
      const filename = resource?.title || 'download';
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
      alert('Failed to download file');
    }
  };

  return (
    <div className="browse-page">
      <div className="container">
        <div className="browse-header">
          <h1>📚 Browse Resources</h1>
          <p>Discover and download study materials shared by students and faculty</p>
        </div>

        {/* Search Bar */}
        <div className="search-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search for notes, subjects, or topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button className="search-btn">🔍</button>
          </div>
        </div>

        {/* Filters Section */}
        <div className="filters-section">
          <h3>Filters</h3>
          <div className="filters-grid">
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="filter-select"
            >
              <option value="">All Categories</option>
              {filterOptions.categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={filters.year}
              onChange={(e) => handleFilterChange('year', e.target.value)}
              className="filter-select"
            >
              <option value="">All Years</option>
              {filterOptions.years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            <select
              value={filters.semester}
              onChange={(e) => handleFilterChange('semester', e.target.value)}
              className="filter-select"
            >
              <option value="">All Semesters</option>
              {filterOptions.semesters.map(semester => (
                <option key={semester} value={semester}>{semester}</option>
              ))}
            </select>

            <select
              value={filters.subject}
              onChange={(e) => handleFilterChange('subject', e.target.value)}
              className="filter-select"
            >
              <option value="">All Subjects</option>
              {filterOptions.subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>

            <select
              value={filters.examType}
              onChange={(e) => handleFilterChange('examType', e.target.value)}
              className="filter-select"
            >
              <option value="">All Exam Types</option>
              {filterOptions.examTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <button onClick={clearFilters} className="clear-filters-btn">
              Clear All
            </button>
          </div>
        </div>

        {/* Results Summary */}
        <div className="results-summary">
          <p>Found {filteredResources.length} resources</p>
        </div>

        {/* Resources List */}
        <div className="resources-section">
          {loading ? (
            <div className="no-results">
              <h3>Loading resources...</h3>
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="no-results">
              <h3>No resources found</h3>
              <p>Try adjusting your search criteria or clearing filters</p>
            </div>
          ) : (
            <div className="resources-grid">
              {filteredResources.map(resource => (
                <div key={resource._id} className="resource-card">
                  <div className="resource-header">
                    <h3>{resource.title}</h3>
                    <span className={`file-type ${(resource.fileType || 'pdf').toLowerCase()}`}>
                      {resource.fileType || 'PDF'}
                    </span>
                  </div>
                  
                  <p className="resource-description">{resource.description || 'No description'}</p>
                  
                  <div className="resource-meta">
                    {resource.subject && (
                      <div className="meta-row">
                        <span className="meta-label">Subject:</span>
                        <span className="meta-value">{resource.subject}</span>
                      </div>
                    )}
                    {(resource.year || resource.semester) && (
                      <div className="meta-row">
                        <span className="meta-label">Year/Semester:</span>
                        <span className="meta-value">{resource.year || 'N/A'}, {resource.semester || 'N/A'}</span>
                      </div>
                    )}
                    {resource.examType && (
                      <div className="meta-row">
                        <span className="meta-label">Exam Type:</span>
                        <span className="meta-value">{resource.examType}</span>
                      </div>
                    )}
                    {resource.category && (
                      <div className="meta-row">
                        <span className="meta-label">Category:</span>
                        <span className="meta-value">{resource.category}</span>
                      </div>
                    )}
                  </div>

                  <div className="resource-footer">
                    <div className="resource-info">
                      <div className="uploader-info">
                        <span>📤 {resource.uploadedByName || 'Anonymous'}</span>
                      </div>
                      <div className="resource-stats">
                        <span>📥 {resource.downloads || 0} downloads</span>
                        <span>📅 {new Date(resource.createdAt).toLocaleDateString()}</span>
                        {resource.fileSize && <span>📊 {(resource.fileSize / 1024).toFixed(2)} KB</span>}
                      </div>
                    </div>
                    
                    <div className="resource-actions">
                      <button 
                        className="download-btn"
                        onClick={() => handleDownload(resource._id)}
                      >
                        ⬇️ Download
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Browse;