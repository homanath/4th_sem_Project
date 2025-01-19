const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const caseRoutes = require('./caseRoutes');
const userRoutes = require('./userRoutes');

// Auth routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/logout', authController.logout);

// Other routes
router.use('/cases', caseRoutes);
router.use('/users', userRoutes);

module.exports = router; 