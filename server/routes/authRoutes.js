const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

// Define specific paths for each auth action
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

module.exports = router;