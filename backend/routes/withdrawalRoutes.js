const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth'); 

// Apni nayi file ko yahan import karo
const withdrawalController = require('../controllers/withdrawalController'); 

// Frontend jab call karega toh ye route chalega
router.post('/withdraw', authMiddleware, withdrawalController.withdrawFunds);

module.exports = router;