const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(authenticate);

// Lawyer dashboard route
router.get('/lawyer', authorize(['lawyer']), dashboardController.getLawyerDashboard);

// Client dashboard route
router.get('/client', dashboardController.getClientDashboard);

module.exports = router; 