// const express = require('express');
// const router = express.Router();

// // ✅ Sahi path: ../controllers (Kyunki ab file routes folder me hai)
// const { activatePackage } = require('../controllers/packageController');

// // Yeh apka POST route hai
// router.post('/activate', activatePackage);

// module.exports = router;



const express = require('express');
const router = express.Router();

// 🔥 FIX 1: Apne auth middleware ko import karo
// (Agar tumhare middleware ka naam verifyToken ya kuch aur hai, toh wo likhna)
const authMiddleware = require('../middleware/authMiddleware'); 

// ✅ Sahi path: ../controllers
const { activatePackage } = require('../controllers/packageController');

// 🔥 FIX 2: Route par authMiddleware laga diya taaki bina login koi hit na kar sake
router.post('/activate', authMiddleware, activatePackage);

module.exports = router;