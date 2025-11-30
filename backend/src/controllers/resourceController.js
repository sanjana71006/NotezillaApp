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
      const fullPath = file.path || path.join(__dirname, '..', '..', 'uploads', file.filename);
      const exists = fs.existsSync(fullPath);
      console.log('Expected uploaded fullPath:', fullPath, 'exists:', exists);
      if (!exists) {
        console.error('Uploaded file missing at expected path:', fullPath);
        return res.status(500).json({ message: 'Uploaded file missing on server', path: fullPath });
      }

      const stats = fs.statSync(fullPath);
      resourceData.fileUrl = `/uploads/${file.filename}`;
      resourceData.fileSize = stats.size;
      resourceData.fileType = file.mimetype || '';
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
    if (resource.fileUrl) {
      const filePath = path.join(__dirname, '..', '..', resource.fileUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
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
    if (!resource || !resource.fileUrl) {
      return res.status(404).json({ message: 'Resource or file not found' });
    }

    // Parse the file path correctly
    const fileUrlPath = resource.fileUrl.startsWith('/') ? resource.fileUrl.slice(1) : resource.fileUrl;
    const filePath = path.join(__dirname, '..', '..', fileUrlPath);
    const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
    
    console.log('Download requested for resource:', resource._id);
    console.log('File URL from DB:', resource.fileUrl);
    console.log('Computed file path:', filePath);
    console.log('Uploads directory:', uploadsDir);
    console.log('File exists:', fs.existsSync(filePath));

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
