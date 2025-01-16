const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const auth = require('../middleware/auth');
const lawyerAuth = require('../middleware/lawyerAuth');

const router = express.Router();

// Protect all routes
router.use(auth);

// Lawyer dashboard route
router.get('/lawyer', lawyerAuth, dashboardController.getLawyerDashboard);

// Client dashboard route
router.get('/client', dashboardController.getClientDashboard);

module.exports = router; 