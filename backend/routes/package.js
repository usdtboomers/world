// // const express = require('express');
// // const router = express.Router();

// // // ✅ Sahi path: ../controllers (Kyunki ab file routes folder me hai)
// // const { activatePackage } = require('../controllers/packageController');

// // // Yeh apka POST route hai
// // router.post('/activate', activatePackage);

// // module.exports = router;



// // const express = require('express');
// // const router = express.Router();

// // // 🔥 FIX 1: Apne auth middleware ko import karo
// // // (Agar tumhare middleware ka naam verifyToken ya kuch aur hai, toh wo likhna)
// // const authMiddleware = require('../middleware/authMiddleware'); 

// // // ✅ Sahi path: ../controllers
// // const { activatePackage } = require('../controllers/packageController');

// // // 🔥 FIX 2: Route par authMiddleware laga diya taaki bina login koi hit na kar sake
// // router.post('/activate', authMiddleware, activatePackage);

// // module.exports = router;



// const express = require('express');
// const router = express.Router();

// // 🔥 Auth middleware import
// const authMiddleware = require('../middleware/authMiddleware'); 

// // ✅ Naya function 'getUserPackages' bhi yahan import kar liya hai
// const { activatePackage, getUserPackages } = require('../controllers/packageController');

// // Yeh tumhara POST route hai (Package kharidne/activate karne ke liye)
// router.post('/activate', authMiddleware, activatePackage);

// // 🔥 YEH RAHA NAYA GET ROUTE (User ke packages list karne ke liye)
// // Ispe bhi authMiddleware lagaya hai taaki data safe rahe
// router.get('/user/:userId', authMiddleware, getUserPackages);

// module.exports = router;


const express = require('express');
const router = express.Router();

// 🔥 Auth middleware import
const authMiddleware = require('../middleware/authMiddleware'); 

// ✅ Naye 'activateAutoCompoundPackage' function ko import me add kiya hai
const { 
    activatePackage, 
    getUserPackages, 
    activateAutoCompoundPackage 
} = require('../controllers/packageController');

// Yeh tumhara POST route hai (Normal 5% Package kharidne/activate karne ke liye)
router.post('/activate', authMiddleware, activatePackage);

// 🔥 YEH RAHA NAYA POST ROUTE (Auto Compound 6% Package activate karne ke liye)
router.post('/activate-auto-compound', authMiddleware, activateAutoCompoundPackage);

// User ke packages list karne ke liye GET route
router.get('/user/:userId', authMiddleware, getUserPackages);

module.exports = router;