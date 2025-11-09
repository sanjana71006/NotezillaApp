const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { authenticate, authorizeRoles } = require('../middleware/auth');
const resourceController = require('../controllers/resourceController');

// Setup multer to store uploads in ../uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

router.get('/', resourceController.listResources);
// Allow any authenticated user to upload resources (students can upload too)
router.post('/', authenticate, upload.single('file'), resourceController.createResource);
router.get('/:id', resourceController.getResource);
router.put('/:id', authenticate, authorizeRoles('Faculty', 'Admin'), resourceController.updateResource);
router.delete('/:id', authenticate, authorizeRoles('Admin'), resourceController.deleteResource);

module.exports = router;
