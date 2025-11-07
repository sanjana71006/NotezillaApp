import React, { useState, useEffect } from 'react';
import './Browse.css';

const Browse = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    year: '',
    semester: '',
    subject: '',
    examType: '',
    category: ''
  });

  // Removed seeded resource data — start with empty list and load from API
  const [resources, setResources] = useState([]);

  const [filteredResources, setFilteredResources] = useState(resources);

  // Filter options
  const filterOptions = {
    years: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
    semesters: ["1st Semester", "2nd Semester", "3rd Semester", "4th Semester", "5th Semester", "6th Semester", "7th Semester", "8th Semester"],
    subjects: ["Computer Science", "Mathematics", "Physics", "Chemistry", "Electronics", "Mechanical Engineering", "Civil Engineering"],
    examTypes: ["T1", "T2", "T3", "T4", "T5"],
    categories: ["Notes", "Question Papers", "Lab Manuals", "Assignments", "Projects"]
  };

  // Search and filter logic
  useEffect(() => {
    let filtered = resources.filter(resource => {
      const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           resource.subject.toLowerCase().includes(searchTerm.toLowerCase());
      
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

  const handleDownload = (resourceId) => {
    // Mock download functionality
    const resource = resources.find(r => r.id === resourceId);
    if (resource) {
      // Update download count
      setResources(prev => prev.map(r => 
        r.id === resourceId ? { ...r, downloads: r.downloads + 1 } : r
      ));
      alert(`Downloading: ${resource.title}`);
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
          {filteredResources.length === 0 ? (
            <div className="no-results">
              <h3>No resources found</h3>
              <p>Try adjusting your search criteria or clearing filters</p>
            </div>
          ) : (
            <div className="resources-grid">
              {filteredResources.map(resource => (
                <div key={resource.id} className="resource-card">
                  <div className="resource-header">
                    <h3>{resource.title}</h3>
                    <span className={`file-type ${resource.fileType.toLowerCase()}`}>
                      {resource.fileType}
                    </span>
                  </div>
                  
                  <p className="resource-description">{resource.description}</p>
                  
                  <div className="resource-meta">
                    <div className="meta-row">
                      <span className="meta-label">Subject:</span>
                      <span className="meta-value">{resource.subject}</span>
                    </div>
                    <div className="meta-row">
                      <span className="meta-label">Year/Semester:</span>
                      <span className="meta-value">{resource.year}, {resource.semester}</span>
                    </div>
                    <div className="meta-row">
                      <span className="meta-label">Exam Type:</span>
                      <span className="meta-value">{resource.examType}</span>
                    </div>
                    <div className="meta-row">
                      <span className="meta-label">Category:</span>
                      <span className="meta-value">{resource.category}</span>
                    </div>
                  </div>

                  <div className="resource-footer">
                    <div className="resource-info">
                      <div className="uploader-info">
                        <span>📤 {resource.uploadedBy}</span>
                        <span className={`user-type ${resource.userType.toLowerCase()}`}>
                          {resource.userType}
                        </span>
                      </div>
                      <div className="resource-stats">
                        <span>📥 {resource.downloads} downloads</span>
                        <span>📅 {resource.uploadDate}</span>
                        <span>📊 {resource.size}</span>
                      </div>
                    </div>
                    
                    <div className="resource-actions">
                      <button className="preview-btn">👁️ Preview</button>
                      <button 
                        className="download-btn"
                        onClick={() => handleDownload(resource.id)}
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