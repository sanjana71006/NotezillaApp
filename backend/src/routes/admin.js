const express = require('express');
const router = express.Router();
const { authenticate, authorizeRoles } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

// All admin endpoints require admin role
router.use(authenticate, authorizeRoles('Admin'));

router.get('/users', adminController.listUsers);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);
router.get('/analytics', adminController.analytics);

module.exports = router;
