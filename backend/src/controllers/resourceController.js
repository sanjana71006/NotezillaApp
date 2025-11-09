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
  const { title, description, tags } = req.body;
  const file = req.file; // multer sets this
  try {
    console.log('createResource invoked. file meta:', file);
    const resourceData = {
      title,
      description,
      tags: tags ? tags.split(',').map(t=>t.trim()) : [],
      uploadedBy: req.user ? req.user._id : undefined
    };

    if (file) {
      // Multer should have saved the file; verify it exists and capture metadata
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
    // Return the error message to the client to aid debugging
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
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
