const Resource = require('../models/Resource');

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
    const resource = await Resource.create({
      title,
      description,
      tags: tags ? tags.split(',').map(t=>t.trim()) : [],
      fileUrl: file ? `/uploads/${file.filename}` : undefined,
      uploadedBy: req.user ? req.user._id : undefined
    });
    res.json({ resource });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
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
