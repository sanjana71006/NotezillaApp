const Resource = require('../models/Resource');
const path = require('path');
const fs = require('fs');

exports.listResources = async (req, res) => {
  const q = {};
  try {
    const resources = await Resource.find(q).populate('uploadedBy', 'username email role');
    res.json({ resources });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createResource = async (req, res) => {
  const { title, description, tags, year, semester, subject, examType, category } = req.body;
  const file = req.file; // multer sets this
  try {
    console.log('createResource invoked. file meta:', file);
    const resourceData = {
      title,
      description,
      subject: subject || 'General',
      year,
      semester,
      examType,
      category,
      tags: tags ? tags.split(',').map(t=>t.trim()) : [],
      uploadedBy: req.user ? req.user._id : undefined,
      status: 'approved'
    };

    if (file) {
      // Read file from disk and store in MongoDB
      const fileData = fs.readFileSync(file.path);
      resourceData.fileData = fileData;
      resourceData.fileSize = file.size;
      resourceData.fileType = file.mimetype || '';
      
      // Also keep fileUrl for backward compatibility, but now it references the filename
      resourceData.fileUrl = file.originalname;
      
      console.log('File stored in MongoDB:', {
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
        buffer: fileData.length
      });
      
      // Delete from disk after storing in DB (optional, can keep as backup)
      try {
        fs.unlinkSync(file.path);
      } catch (err) {
        console.warn('Could not delete temp file:', file.path);
      }
    }

    const resource = await Resource.create(resourceData);
    res.json({ resource });
  } catch (err) {
    console.error('createResource error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id).populate('uploadedBy', 'username email role');
    if (!resource) return res.status(404).json({ message: 'Not found' });
    res.json({ resource });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateResource = async (req, res) => {
  try {
    const updates = req.body;
    const resource = await Resource.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!resource) return res.status(404).json({ message: 'Not found' });
    res.json({ resource });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndDelete(req.params.id);
    if (!resource) return res.status(404).json({ message: 'Not found' });
    
    // File is automatically deleted when resource is deleted from MongoDB
    // No need to manually delete disk files since they're stored in DB
    if (resource.fileUrl && !resource.fileData) {
      // Only delete disk files if file is NOT in MongoDB
      const filePath = path.join(__dirname, '..', '..', resource.fileUrl);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          console.warn('Could not delete file:', filePath);
        }
      }
    }
    
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.downloadResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Check if file is stored in MongoDB
    if (resource.fileData && resource.fileData.length > 0) {
      // File is stored in MongoDB
      console.log('Download from MongoDB:', resource._id, resource.fileUrl);
      
      // Increment download count
      await Resource.findByIdAndUpdate(req.params.id, { $inc: { downloads: 1 } });

      // Set proper headers for file download
      const filename = resource.title || resource.fileUrl;
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Type', resource.fileType || 'application/octet-stream');
      res.setHeader('Content-Length', resource.fileData.length);

      // Send the file data
      res.send(resource.fileData);
      return;
    }

    // Fallback: try to get file from disk (for backward compatibility)
    if (!resource.fileUrl) {
      return res.status(404).json({ message: 'File not found' });
    }

    const fileUrlPath = resource.fileUrl.startsWith('/') ? resource.fileUrl.slice(1) : resource.fileUrl;
    const filePath = path.join(__dirname, '..', '..', fileUrlPath);
    const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
    
    console.log('Download from disk:', resource._id);
    console.log('File path:', filePath);

    // Security check: ensure file is in uploads directory
    if (!filePath.startsWith(uploadsDir)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    if (!fs.existsSync(filePath)) {
      console.error('File not found at path:', filePath);
      return res.status(404).json({ message: 'File not found on server' });
    }

    // Increment download count
    await Resource.findByIdAndUpdate(req.params.id, { $inc: { downloads: 1 } });

    // Set proper headers for file download
    const filename = resource.title || path.basename(filePath);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', resource.fileType || 'application/octet-stream');

    // Send the file
    res.download(filePath);
  } catch (err) {
    console.error('Download error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
