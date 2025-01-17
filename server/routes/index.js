const express = require('express');
const router = express.Router();

// Import routes
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const caseRoutes = require('./caseRoutes');
const scheduleRoutes = require('./scheduleRoutes');
const notificationRoutes = require('./notificationRoutes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/cases', caseRoutes);
router.use('/schedules', scheduleRoutes);
router.use('/notifications', notificationRoutes);

module.exports = router; 