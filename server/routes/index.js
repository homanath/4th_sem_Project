const express = require('express');
const router = express.Router();
const caseRoutes = require('./caseRoutes');
const userRoutes = require('./userRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const scheduleRoutes = require('./scheduleRoutes');

// Mount specific route modules
router.use('/cases', caseRoutes);
router.use('/users', userRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/schedules', scheduleRoutes);

// Add a test route to verify routing
router.get('/test', (req, res) => {
  res.json({ message: 'API is working' });
});

module.exports = router; 