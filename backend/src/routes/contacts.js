const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// POST /api/contacts - create new contact message
router.post('/', contactController.createContact);

module.exports = router;
