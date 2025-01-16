const express = require("express");
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");
const lawyerAuth = require('../middleware/lawyerAuth');
const upload = require('../middleware/upload');

const router = express.Router();

// Profile routes
router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, upload.single('profilePicture'), userController.updateProfile);
router.put('/password', auth, userController.updatePassword);
router.post('/profile/picture', auth, upload.single('profilePicture'), userController.updateProfilePicture);

// Client management routes
router.get('/clients', auth, lawyerAuth, userController.getClients);
router.get('/clients/:id', auth, lawyerAuth, userController.getClientById);
router.post('/register/client', auth, lawyerAuth, userController.createClient);
router.put('/clients/:id/status', auth, lawyerAuth, userController.updateClientStatus);

module.exports = router;
