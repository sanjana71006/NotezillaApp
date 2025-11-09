import React, { useState } from 'react';
import './Upload.css';
import { resourcesAPI } from '../../services/api';

const Upload = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    year: '',
    semester: '',
    subject: '',
    examType: '',
    category: ''
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [isDraft, setIsDraft] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  // Form options
  const formOptions = {
    years: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
    semesters: ["1st Semester", "2nd Semester", "3rd Semester", "4th Semester", "5th Semester", "6th Semester", "7th Semester", "8th Semester"],
    subjects: ["Computer Science", "Mathematics", "Physics", "Chemistry", "Electronics", "Mechanical Engineering", "Civil Engineering", "Business Studies", "Economics", "English", "Biology"],
    examTypes: ["T1", "T2", "T3", "T4", "T5", "Final Exam", "Mid-term", "Assignment"],
    categories: ["Notes", "Question Papers", "Lab Manuals", "Assignments", "Projects", "Reference Materials"]
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileError('');

    if (file) {
      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        setFileError('File size must be under 10MB');
        setSelectedFile(null);
        return;
      }

      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/vnd.ms-powerpoint',
        'application/zip',
        'application/x-zip-compressed',
        'text/plain'
      ];

      if (!allowedTypes.includes(file.type)) {
        setFileError('Please upload a valid file (PDF, DOC, DOCX, PPT, PPTX, ZIP, TXT)');
        setSelectedFile(null);
        return;
      }

      setSelectedFile(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters long';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters long';
    }

    if (!formData.year) {
      newErrors.year = 'Year is required';
    }

    if (!formData.semester) {
      newErrors.semester = 'Semester is required';
    }

    if (!formData.subject) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.examType) {
      newErrors.examType = 'Exam type is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!selectedFile && !isDraft) {
      newErrors.file = 'File is required for publishing';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsUploading(true);

    try {
      // Prepare multipart form data
      const fd = new FormData();
      fd.append('title', formData.title);
      fd.append('description', formData.description);
      fd.append('year', formData.year);
      fd.append('semester', formData.semester);
      fd.append('subject', formData.subject);
      fd.append('examType', formData.examType);
      fd.append('category', formData.category);
      if (selectedFile) fd.append('file', selectedFile);
      fd.append('isDraft', isDraft ? 'true' : 'false');

      const res = await resourcesAPI.upload(fd);
      console.log('Upload response:', res);

      setUploadSuccess(true);
      
      // Reset form after successful upload
      setTimeout(() => {
        setFormData({
          title: '',
          description: '',
          year: '',
          semester: '',
          subject: '',
          examType: '',
          category: ''
        });
        setSelectedFile(null);
        setUploadSuccess(false);
        setIsDraft(false);
      }, 3000);

    } catch (error) {
      console.error('Upload error:', error);
      setErrors({ submit: 'Upload failed. Please try again.' });
    } finally {
      setIsUploading(false);
    }
  };

  const getFileIcon = () => {
    if (!selectedFile) return '📄';
    
    const type = selectedFile.type;
    if (type.includes('pdf')) return '📕';
    if (type.includes('word')) return '📘';
    if (type.includes('presentation')) return '📊';
    if (type.includes('zip')) return '🗂️';
    return '📄';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (uploadSuccess) {
    return (
      <div className="upload-page">
        <div className="container">
          <div className="upload-success">
            <div className="success-icon">✅</div>
            <h2>Upload Successful!</h2>
            <p>
              Your {isDraft ? 'draft has been saved' : 'content has been published'} successfully.
              {!isDraft && ' It will be available for download by other students shortly.'}
            </p>
            <button 
              onClick={() => setUploadSuccess(false)}
              className="upload-another-btn"
            >
              Upload Another File
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="upload-page">
      <div className="container">
        <div className="upload-header">
          <h1>📤 Upload Content</h1>
          <p>Share your study materials with fellow students</p>
        </div>

        <div className="upload-container">
          <form onSubmit={handleSubmit} className="upload-form">
            {/* Title */}
            <div className="form-group">
              <label htmlFor="title">Document Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Data Structures - Complete Notes"
                className={errors.title ? 'error' : ''}
              />
              {errors.title && <span className="error-message">{errors.title}</span>}
            </div>

            {/* Description */}
            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Provide a brief description of the content, topics covered, etc."
                rows="4"
                className={errors.description ? 'error' : ''}
              />
              {errors.description && <span className="error-message">{errors.description}</span>}
              <div className="character-count">
                {formData.description.length}/500 characters
              </div>
            </div>

            {/* Academic Details */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="year">Year *</label>
                <select
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  className={errors.year ? 'error' : ''}
                >
                  <option value="">Select Year</option>
                  {formOptions.years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                {errors.year && <span className="error-message">{errors.year}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="semester">Semester *</label>
                <select
                  id="semester"
                  name="semester"
                  value={formData.semester}
                  onChange={handleInputChange}
                  className={errors.semester ? 'error' : ''}
                >
                  <option value="">Select Semester</option>
                  {formOptions.semesters.map(semester => (
                    <option key={semester} value={semester}>{semester}</option>
                  ))}
                </select>
                {errors.semester && <span className="error-message">{errors.semester}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="subject">Subject *</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className={errors.subject ? 'error' : ''}
                >
                  <option value="">Select Subject</option>
                  {formOptions.subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
                {errors.subject && <span className="error-message">{errors.subject}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="examType">Exam Type *</label>
                <select
                  id="examType"
                  name="examType"
                  value={formData.examType}
                  onChange={handleInputChange}
                  className={errors.examType ? 'error' : ''}
                >
                  <option value="">Select Exam Type</option>
                  {formOptions.examTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.examType && <span className="error-message">{errors.examType}</span>}
              </div>
            </div>

            {/* Category */}
            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={errors.category ? 'error' : ''}
              >
                <option value="">Select Category</option>
                {formOptions.categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {errors.category && <span className="error-message">{errors.category}</span>}
            </div>

            {/* File Upload */}
            <div className="form-group">
              <label htmlFor="file">Upload File *</label>
              <div className="file-upload-area">
                <input
                  type="file"
                  id="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.zip,.txt"
                  className="file-input"
                />
                <div className="file-upload-content">
                  {selectedFile ? (
                    <div className="file-selected">
                      <div className="file-icon">{getFileIcon()}</div>
                      <div className="file-details">
                        <div className="file-name">{selectedFile.name}</div>
                        <div className="file-size">{formatFileSize(selectedFile.size)}</div>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => setSelectedFile(null)}
                        className="remove-file-btn"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="file-upload-placeholder">
                      <div className="upload-icon">📁</div>
                      <p>Click to select file or drag and drop</p>
                      <p className="file-requirements">
                        Supported: PDF, DOC, DOCX, PPT, PPTX, ZIP, TXT (Max 10MB)
                      </p>
                    </div>
                  )}
                </div>
              </div>
              {fileError && <span className="error-message">{fileError}</span>}
              {errors.file && <span className="error-message">{errors.file}</span>}
            </div>

            {/* Submit Options */}
            <div className="form-actions">
              <div className="draft-option">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={isDraft}
                    onChange={(e) => setIsDraft(e.target.checked)}
                  />
                  Save as Draft
                </label>
                <span className="draft-info">
                  (Drafts are saved privately and can be published later)
                </span>
              </div>

              <div className="submit-buttons">
                <button 
                  type="submit" 
                  disabled={isUploading}
                  className="submit-btn primary"
                >
                  {isUploading ? (
                    <>
                      <span className="spinner"></span>
                      {isDraft ? 'Saving Draft...' : 'Publishing...'}
                    </>
                  ) : (
                    isDraft ? 'Save Draft' : 'Publish Content'
                  )}
                </button>
              </div>
            </div>

            {errors.submit && (
              <div className="error-message submit-error">{errors.submit}</div>
            )}
          </form>

          {/* Upload Guidelines */}
          <div className="upload-guidelines">
            <h3>📋 Upload Guidelines</h3>
            <ul>
              <li>Ensure content is original or properly attributed</li>
              <li>Files should be relevant to academic studies</li>
              <li>Use descriptive titles and detailed descriptions</li>
              <li>Organize content properly with correct year/semester/subject</li>
              <li>Maximum file size: 10MB</li>
              <li>Supported formats: PDF, DOC, DOCX, PPT, PPTX, ZIP, TXT</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;