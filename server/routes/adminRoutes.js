const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Protect all admin routes
router.use(auth);
router.use(adminAuth);

// Admin dashboard stats
router.get('/dashboard', adminController.getDashboardStats);

module.exports = router; 