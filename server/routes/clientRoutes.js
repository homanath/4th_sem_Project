const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const auth = require('../middleware/auth');

// Get all clients for a lawyer
router.get('/', auth, clientController.getClients);

// Create new client
router.post('/', auth, clientController.createClient);

// Update client status
router.put('/:id/status', auth, clientController.updateClientStatus);

module.exports = router; 