const express = require('express');
const router = express.Router();

// ✅ Sahi path: ../controllers (Kyunki ab file routes folder me hai)
const { activatePackage } = require('../controllers/packageController');

// Yeh apka POST route hai
router.post('/activate', activatePackage);

module.exports = router;