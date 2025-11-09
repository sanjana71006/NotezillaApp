const ContactMessage = require('../models/ContactMessage');

// Create a new contact message
exports.createContact = async (req, res) => {
  try {
    const { name, email, category, message } = req.body;

    if (!name || !email || !category || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const contact = new ContactMessage({ name, email, category, message });
    await contact.save();

    return res.status(201).json({ message: 'Contact message saved', data: contact });
  } catch (err) {
    console.error('createContact error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
