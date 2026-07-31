const express = require('express');
const router = express.Router();

// 🔥 Controller import (Naam match kar diya: verifyAndProcessDeposit)
const { getDepositAddress, verifyAndProcessDeposit } = require('../controllers/depositController');

// Middleware import
const authMiddleware = require('../middleware/authMiddleware'); 

// GET Route (QR Code / Address ke liye)
router.get('/get-address', authMiddleware, getDepositAddress);

// 🚀 POST ROUTE: Jab user manual check/verify dabayega
router.post('/verify-deposit', authMiddleware, verifyAndProcessDeposit);

module.exports = router;