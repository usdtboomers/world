// // // // // const express = require("express");
// // // // // const router = express.Router();
// // // // // const adminAuth = require("../middleware/adminAuth");
// // // // // const Admin = require("../models/Admin"); 
// // // // // const User = require("../models/User");
// // // // // const Transaction = require("../models/Transaction");
// // // // // const Deposit = require("../models/Deposit");
// // // // // const bcrypt = require("bcryptjs");

// // // // // // 💸 POST: Manual Credit/Debit processing
// // // // // router.post("/manual-transaction", adminAuth, async (req, res) => {
// // // // //   try {
// // // // //     console.log("\n--- 👉 Manual Transaction Processing ---");

// // // // //     // 1. Data Extract karo
// // // // //     const { userId, amount, type, txHash, reason, adminNote, adminPassword, password } = req.body;
    
// // // // //     // Admin password handle karein (Frontend se dono naam se aa sakta hai)
// // // // //     const finalPassword = adminPassword || password;

// // // // //     if (!finalPassword) {
// // // // //       return res.status(400).json({ message: "Admin password is required." });
// // // // //     }

// // // // //     // 🔍 2. Token se Admin ID nikalo
// // // // //     const tokenData = req.admin || req.user;
    
// // // // //     // Token me humesha MongoDB ki unique '_id' (24 characters) hoti hai
// // // // //     const adminDbId = tokenData.adminId || tokenData.id || tokenData._id;

// // // // //     console.log(`👉 Searching Admin by DB ID: "${adminDbId}"`);

// // // // //     // 🔍 3. Database Search (Corrected to use findById)
// // // // //     // ✅ FIX: Token me jo ID hai wo MongoDB ki '_id' hai, isliye findById use karna hai
// // // // //     const admin = await Admin.findById(adminDbId);

// // // // //     if (!admin) {
// // // // //       console.log("❌ Admin Record Not Found via Token ID.");
// // // // //       return res.status(404).json({ message: "Admin account not found. Please Re-Login." });
// // // // //     }

// // // // //     // 4. Password Verification (Bcrypt)
// // // // //     const isMatch = await bcrypt.compare(finalPassword, admin.password);
    
// // // // //     if (!isMatch) {
// // // // //       console.log("❌ Password Mismatch");
// // // // //       return res.status(403).json({ message: "Incorrect Admin Password! Access Denied." });
// // // // //     }

// // // // //     console.log("✅ Password Matched & Admin Verified!");

// // // // //     // --- ⬇️ TRANSACTION LOGIC START ---

// // // // //     if (!userId || !amount || !type)
// // // // //       return res.status(400).json({ message: "User ID, amount, and type are required." });

// // // // //     const targetUser = await User.findOne({ userId });
// // // // //     if (!targetUser) return res.status(404).json({ message: "Target User not found." });

// // // // //     const amt = parseFloat(amount);
    
// // // // //     // Duplicate check for TxHash (Agar manual hash provide kiya gaya ho)
// // // // //     if (txHash) {
// // // // //       const existingTx = await Transaction.findOne({ txHash });
// // // // //       const existingDeposit = await Deposit.findOne({ txnHash: txHash });
// // // // //       if (existingTx || existingDeposit) {
// // // // //         return res.status(400).json({ message: "TxHash already used." });
// // // // //       }
// // // // //     }

// // // // //     // Update User Wallet Balance
// // // // //   // Update User Wallet Balance
// // // // //     if (type === "manual_credit") {
// // // // //       targetUser.walletBalance += amt;
// // // // //     } else if (type === "manual_debit") {
// // // // //       if (targetUser.walletBalance < amt) {
// // // // //         return res.status(400).json({ message: "Insufficient balance in user's wallet." });
// // // // //       }
// // // // //       targetUser.walletBalance -= amt;
// // // // //     } else {
// // // // //       return res.status(400).json({ message: "Invalid transaction type." });
// // // // //     }
    
// // // // //     // Save User updated balance
// // // // //     await targetUser.save();

// // // // //     // 🎯 YAHAN CHANGE KIYA HAI (Dynamic Description ke liye)
// // // // //     let defaultDescription = type === "manual_credit" 
// // // // //         ? `Auto-Deposit of ${amt} USDT via BEP-20` 
// // // // //         : `Auto-Withdrawal deduction of ${amt} USDT`;

// // // // //     // Create Transaction History Record
// // // // //   // Create Transaction History Record
// // // // //     const transaction = new Transaction({
// // // // //       userId,
// // // // //       type,
// // // // //       amount: amt,
// // // // //       txHash: txHash || `MANUAL-${Date.now()}-${Math.floor(Math.random() * 1000)}`, 
// // // // //       description: defaultDescription, // ✅ FIX: Ab frontend wala reason hamesha ignore hoga!
// // // // //       adminNote: adminNote || null,
// // // // //       source: "manual",
// // // // //       status: "completed",
// // // // //       plan: null,
// // // // //     });

// // // // //     await transaction.save();

// // // // //     res.json({
// // // // //       success: true,
// // // // //       message: `Successfully ${type === 'manual_credit' ? 'credited' : 'debited'} $${amt} to user ${userId}`,
// // // // //       transaction,
// // // // //     });

// // // // //   } catch (err) {
// // // // //     console.error("❌ Critical Error:", err);
// // // // //     res.status(500).json({ message: "Server Error: " + err.message });
// // // // //   }
// // // // // });

// // // // // // 📜 GET: Fetch recent manual transactions for history table
// // // // // router.get("/manual-transactions", adminAuth, async (req, res) => {
// // // // //     try {
// // // // //         const page = parseInt(req.query.page) || 1;
// // // // //         const limit = parseInt(req.query.limit) || 10;
// // // // //         const filter = { source: "manual" };
        
// // // // //         const total = await Transaction.countDocuments(filter);
// // // // //         const transactions = await Transaction.find(filter)
// // // // //             .sort({ createdAt: -1 })
// // // // //             .skip((page - 1) * limit)
// // // // //             .limit(limit);
            
// // // // //         res.json({ 
// // // // //             transactions, 
// // // // //             total, 
// // // // //             totalPages: Math.ceil(total / limit), 
// // // // //             currentPage: page 
// // // // //         });
// // // // //     } catch (err) {
// // // // //         console.error("❌ Error loading transactions:", err);
// // // // //         res.status(500).json({ message: "Error loading transactions" });
// // // // //     }
// // // // // });

// // // // // module.exports = router;




// // // // const express = require("express");
// // // // const router = express.Router();
// // // // const adminAuth = require("../middleware/adminAuth");
// // // // const Admin = require("../models/Admin"); 
// // // // const User = require("../models/User");
// // // // const Transaction = require("../models/Transaction");
// // // // const Deposit = require("../models/Deposit");
// // // // const bcrypt = require("bcryptjs");

// // // // // ========================================================
// // // // // 🟢 1. FUND WALLET (walletBalance) ROUTES [PURANA CODE]
// // // // // ========================================================

// // // // // 💸 POST: Manual Credit/Debit processing (For Fund Wallet)
// // // // router.post("/manual-transaction", adminAuth, async (req, res) => {
// // // //   try {
// // // //     console.log("\n--- 👉 Manual Transaction Processing (Fund Wallet) ---");

// // // //     const { userId, amount, type, txHash, reason, adminNote, adminPassword, password } = req.body;
// // // //     const finalPassword = adminPassword || password;

// // // //     if (!finalPassword) {
// // // //       return res.status(400).json({ message: "Admin password is required." });
// // // //     }

// // // //     const tokenData = req.admin || req.user;
// // // //     const adminDbId = tokenData.adminId || tokenData.id || tokenData._id;

// // // //     console.log(`👉 Searching Admin by DB ID: "${adminDbId}"`);
// // // //     const admin = await Admin.findById(adminDbId);

// // // //     if (!admin) {
// // // //       console.log("❌ Admin Record Not Found via Token ID.");
// // // //       return res.status(404).json({ message: "Admin account not found. Please Re-Login." });
// // // //     }

// // // //     const isMatch = await bcrypt.compare(finalPassword, admin.password);
    
// // // //     if (!isMatch) {
// // // //       console.log("❌ Password Mismatch");
// // // //       return res.status(403).json({ message: "Incorrect Admin Password! Access Denied." });
// // // //     }

// // // //     console.log("✅ Password Matched & Admin Verified!");

// // // //     if (!userId || !amount || !type)
// // // //       return res.status(400).json({ message: "User ID, amount, and type are required." });

// // // //     const targetUser = await User.findOne({ userId });
// // // //     if (!targetUser) return res.status(404).json({ message: "Target User not found." });

// // // //     const amt = parseFloat(amount);
    
// // // //     if (txHash) {
// // // //       const existingTx = await Transaction.findOne({ txHash });
// // // //       const existingDeposit = await Deposit.findOne({ txnHash: txHash });
// // // //       if (existingTx || existingDeposit) {
// // // //         return res.status(400).json({ message: "TxHash already used." });
// // // //       }
// // // //     }

// // // //     // Update User FUND Wallet Balance
// // // //     if (type === "manual_credit") {
// // // //       targetUser.walletBalance += amt;
// // // //     } else if (type === "manual_debit") {
// // // //       if (targetUser.walletBalance < amt) {
// // // //         return res.status(400).json({ message: "Insufficient balance in user's Fund Wallet." });
// // // //       }
// // // //       targetUser.walletBalance -= amt;
// // // //     } else {
// // // //       return res.status(400).json({ message: "Invalid transaction type." });
// // // //     }
    
// // // //     await targetUser.save();

// // // //     let defaultDescription = type === "manual_credit" 
// // // //         ? `Auto-Deposit of ${amt} USDT via BEP-20 (Fund Wallet)` 
// // // //         : `Auto-Withdrawal deduction of ${amt} USDT (Fund Wallet)`;

// // // //     const transaction = new Transaction({
// // // //       userId,
// // // //       type,
// // // //       amount: amt,
// // // //       txHash: txHash || `MANUAL-${Date.now()}-${Math.floor(Math.random() * 1000)}`, 
// // // //       description: defaultDescription, 
// // // //       adminNote: adminNote || null,
// // // //       source: "manual",
// // // //       status: "completed",
// // // //       plan: null,
// // // //     });

// // // //     await transaction.save();

// // // //     res.json({
// // // //       success: true,
// // // //       message: `Successfully ${type === 'manual_credit' ? 'credited' : 'debited'} $${amt} to user ${userId} Fund Wallet`,
// // // //       transaction,
// // // //     });

// // // //   } catch (err) {
// // // //     console.error("❌ Critical Error:", err);
// // // //     res.status(500).json({ message: "Server Error: " + err.message });
// // // //   }
// // // // });

// // // // // 📜 GET: Fetch recent manual transactions for Fund Wallet history table
// // // // router.get("/manual-transactions", adminAuth, async (req, res) => {
// // // //     try {
// // // //         const page = parseInt(req.query.page) || 1;
// // // //         const limit = parseInt(req.query.limit) || 10;
// // // //         const filter = { source: "manual" };
        
// // // //         const total = await Transaction.countDocuments(filter);
// // // //         const transactions = await Transaction.find(filter)
// // // //             .sort({ createdAt: -1 })
// // // //             .skip((page - 1) * limit)
// // // //             .limit(limit);
            
// // // //         res.json({ 
// // // //             transactions, 
// // // //             total, 
// // // //             totalPages: Math.ceil(total / limit), 
// // // //             currentPage: page 
// // // //         });
// // // //     } catch (err) {
// // // //         console.error("❌ Error loading transactions:", err);
// // // //         res.status(500).json({ message: "Error loading transactions" });
// // // //     }
// // // // });

 
  

// // // // module.exports = router;
















// // // const express = require("express");
// // // const router = express.Router();
// // // const adminAuth = require("../middleware/adminAuth");
// // // const Admin = require("../models/Admin"); 
// // // const User = require("../models/User");
// // // const Transaction = require("../models/Transaction");
// // // const Deposit = require("../models/Deposit");
// // // const bcrypt = require("bcryptjs");
// // // const crypto = require("crypto"); // 🔥 NAYA: Real-looking BSC Hash generate karne ke liye

// // // // ========================================================
// // // // 🟢 1. FUND WALLET (walletBalance) ROUTES
// // // // ========================================================

// // // // 💸 POST: Manual Credit/Debit processing (For Fund Wallet)
// // // router.post("/manual-transaction", adminAuth, async (req, res) => {
// // //   try {
// // //     console.log("\n--- 👉 Manual Transaction Processing (Fund Wallet) ---");

// // //     const { userId, amount, type, txHash, reason, adminNote, adminPassword, password } = req.body;
// // //     const finalPassword = adminPassword || password;

// // //     if (!finalPassword) {
// // //       return res.status(400).json({ message: "Admin password is required." });
// // //     }

// // //     const tokenData = req.admin || req.user;
// // //     const adminDbId = tokenData.adminId || tokenData.id || tokenData._id;

// // //     const admin = await Admin.findById(adminDbId);

// // //     if (!admin) {
// // //       return res.status(404).json({ message: "Admin account not found. Please Re-Login." });
// // //     }

// // //     const isMatch = await bcrypt.compare(finalPassword, admin.password);
    
// // //     if (!isMatch) {
// // //       return res.status(403).json({ message: "Incorrect Admin Password! Access Denied." });
// // //     }

// // //     if (!userId || !amount || !type)
// // //       return res.status(400).json({ message: "User ID, amount, and type are required." });

// // //     const targetUser = await User.findOne({ userId });
// // //     if (!targetUser) return res.status(404).json({ message: "Target User not found." });

// // //     const amt = parseFloat(amount);
    
// // //     // 🔥 Hash Logic: Agar Admin ne hash nahi diya, toh system ek Real-looking BSC Hash (0x...) banayega
// // //     const finalHash = txHash || "0x" + crypto.randomBytes(32).toString("hex");

// // //     if (txHash) {
// // //       const existingTx = await Transaction.findOne({ txHash });
// // //       const existingDeposit = await Deposit.findOne({ txnHash: txHash });
// // //       if (existingTx || existingDeposit) {
// // //         return res.status(400).json({ message: "TxHash already used." });
// // //       }
// // //     }

// // //     // Update User FUND Wallet Balance
// // //     if (type === "manual_credit") {
// // //       targetUser.walletBalance += amt;
// // //     } else if (type === "manual_debit") {
// // //       if (targetUser.walletBalance < amt) {
// // //         return res.status(400).json({ message: "Insufficient balance in user's Fund Wallet." });
// // //       }
// // //       targetUser.walletBalance -= amt;
// // //     } else {
// // //       return res.status(400).json({ message: "Invalid transaction type." });
// // //     }
    
// // //     await targetUser.save();

// // //     let defaultDescription = type === "manual_credit" 
// // //         ? `Auto-Deposit of ${amt} USDT via BEP-20 (Fund Wallet)` 
// // //         : `Auto-Withdrawal deduction of ${amt} USDT (Fund Wallet)`;

// // //     const transaction = new Transaction({
// // //       userId,
// // //       type,
// // //       amount: amt,
// // //       txHash: finalHash, 
// // //       description: defaultDescription, 
// // //       adminNote: adminNote || null,
// // //       source: "manual",
// // //       status: "completed",
// // //       plan: null,
// // //     });

// // //     await transaction.save();

// // //     // =========================================================
// // //     // 🔥 LIVE FEED INTEGRATION LOGIC
// // //     // =========================================================
// // //     const instantFeedTx = {
// // //         userId: targetUser.userId,
// // //         name: targetUser.name || "User",
// // //         fromAddress: type === "manual_credit" ? "Admin_Fund" : targetUser.depositAddress || "Wallet",
// // //         toAddress: type === "manual_credit" ? targetUser.depositAddress || "Wallet" : "Admin_Fund",
// // //         amount: amt,
// // //         hash: finalHash,
// // //         status: "Success",
// // //         type: "real",
// // //         createdAt: new Date()
// // //     };

// // //     // Agar credit hai toh Deposit Feed me dalo, debit hai toh Withdrawal Feed me
// // //     if (type === "manual_credit" && global.liveDepositsFeed) {
// // //         global.liveDepositsFeed.unshift(instantFeedTx);
// // //         if (global.liveDepositsFeed.length > 500) global.liveDepositsFeed.pop();
// // //         if (typeof global.saveCache === 'function') global.saveCache();
// // //     } else if (type === "manual_debit" && global.liveWithdrawalsFeed) {
// // //         global.liveWithdrawalsFeed.unshift(instantFeedTx);
// // //         if (global.liveWithdrawalsFeed.length > 500) global.liveWithdrawalsFeed.pop();
// // //         if (typeof global.saveCache === 'function') global.saveCache();
// // //     }

// // //     res.json({
// // //       success: true,
// // //       message: `Successfully ${type === 'manual_credit' ? 'credited' : 'debited'} $${amt} to user ${userId} Fund Wallet`,
// // //       transaction,
// // //     });

// // //   } catch (err) {
// // //     console.error("❌ Critical Error:", err);
// // //     res.status(500).json({ message: "Server Error: " + err.message });
// // //   }
// // // });

// // // // 📜 GET: Fetch recent manual transactions for Fund Wallet history table
// // // router.get("/manual-transactions", adminAuth, async (req, res) => {
// // //     try {
// // //         const page = parseInt(req.query.page) || 1;
// // //         const limit = parseInt(req.query.limit) || 10;
// // //         const filter = { source: "manual" };
        
// // //         const total = await Transaction.countDocuments(filter);
// // //         const transactions = await Transaction.find(filter)
// // //             .sort({ createdAt: -1 })
// // //             .skip((page - 1) * limit)
// // //             .limit(limit);
            
// // //         res.json({ 
// // //             transactions, 
// // //             total, 
// // //             totalPages: Math.ceil(total / limit), 
// // //             currentPage: page 
// // //         });
// // //     } catch (err) {
// // //         console.error("❌ Error loading transactions:", err);
// // //         res.status(500).json({ message: "Error loading transactions" });
// // //     }
// // // });

// // // module.exports = router;




// // const express = require("express");
// // const router = express.Router();
// // const adminAuth = require("../middleware/adminAuth");
// // const Admin = require("../models/Admin"); 
// // const User = require("../models/User");
// // const Transaction = require("../models/Transaction");
// // const Deposit = require("../models/Deposit");
// // const bcrypt = require("bcryptjs");

// // // ========================================================
// // // 🟢 1. FUND WALLET (walletBalance) ROUTES
// // // ========================================================

// // // 💸 POST: Manual Credit/Debit processing (For Fund Wallet)
// // router.post("/manual-transaction", adminAuth, async (req, res) => {
// //   try {
// //     console.log("\n--- 👉 Manual Transaction Processing (Fund Wallet) ---");

// //     const { userId, amount, type, txHash, reason, adminNote, adminPassword, password } = req.body;
// //     const finalPassword = adminPassword || password;

// //     if (!finalPassword) {
// //       return res.status(400).json({ message: "Admin password is required." });
// //     }

// //     const tokenData = req.admin || req.user;
// //     const adminDbId = tokenData.adminId || tokenData.id || tokenData._id;

// //     const admin = await Admin.findById(adminDbId);

// //     if (!admin) {
// //       return res.status(404).json({ message: "Admin account not found. Please Re-Login." });
// //     }

// //     const isMatch = await bcrypt.compare(finalPassword, admin.password);
    
// //     if (!isMatch) {
// //       return res.status(403).json({ message: "Incorrect Admin Password! Access Denied." });
// //     }

// //     if (!userId || !amount || !type)
// //       return res.status(400).json({ message: "User ID, amount, and type are required." });

// //     const targetUser = await User.findOne({ userId });
// //     if (!targetUser) return res.status(404).json({ message: "Target User not found." });

// //     const amt = parseFloat(amount);
    
// //     // =========================================================
// //     // 🔥 REAL BSC HASH LOGIC (From Live Bot Queue)
// //     // =========================================================
// //     // let finalHash = txHash;

// //     // if (!finalHash) {
// //     //     let matchedTx = null;

// //     //     // 1. Try to find EXACT amount match in Promo Queue
// //     //     if (global.promoQueue && global.promoQueue.length > 0) {
// //     //         let exactIdx = global.promoQueue.findIndex(t => t.amount === amt);
// //     //         if (exactIdx !== -1) {
// //     //             matchedTx = global.promoQueue[exactIdx];
// //     //             global.promoQueue.splice(exactIdx, 1);
// //     //         }
// //     //     }

// //     //     // 2. Try to find EXACT amount match in Deposit Queue
// //     //     if (!matchedTx && global.depositQueue && global.depositQueue.length > 0) {
// //     //         let exactIdx = global.depositQueue.findIndex(t => t.amount === amt);
// //     //         if (exactIdx !== -1) {
// //     //             matchedTx = global.depositQueue[exactIdx];
// //     //             global.depositQueue.splice(exactIdx, 1);
// //     //         }
// //     //     }

// //     //     // 3. If exact match not found, pick ANY available real hash from Deposit Queue
// //     //     if (!matchedTx && global.depositQueue && global.depositQueue.length > 0) {
// //     //         matchedTx = global.depositQueue.shift();
// //     //     }

// //     //     // 4. If still not found, pick ANY from Promo Queue
// //     //     if (!matchedTx && global.promoQueue && global.promoQueue.length > 0) {
// //     //         matchedTx = global.promoQueue.shift();
// //     //     }

// //     //     if (matchedTx) {
// //     //         finalHash = matchedTx.hash;
// //     //     } else {
// //     //         // Agar queue khali hai (jaise server turant restart hua ho) toh fake hash nahi denge!
// //     //         return res.status(400).json({ 
// //     //             success: false, 
// //     //             message: "System syncing with Binance Network... Please wait 10-15 seconds to fetch a REAL Hash, then click again." 
// //     //         });
// //     //     }
// //     // }



// //     // =========================================================
// //     // 🔥 REAL BSC HASH LOGIC (10 MIN FRESHNESS CHECK ADDED)
// //     // =========================================================
// //     // let finalHash = txHash;

// //     // if (!finalHash) {
// //     //     let matchedTx = null;
        
// //     //     // 🚀 NAYA LOGIC: 10 Minute se purane saare hashes delete kar do
// //     //     const now = new Date().getTime();
// //     //     const TEN_MINUTES = 10 * 60 * 1000;

// //     //     if (global.promoQueue) {
// //     //         global.promoQueue = global.promoQueue.filter(t => (now - t.detectedAt) <= TEN_MINUTES);
// //     //     }
// //     //     if (global.depositQueue) {
// //     //         global.depositQueue = global.depositQueue.filter(t => (now - t.detectedAt) <= TEN_MINUTES);
// //     //     }

// //     //     // 1. Try to find EXACT amount match in Promo Queue
// //     //     if (global.promoQueue && global.promoQueue.length > 0) {
// //     //         let exactIdx = global.promoQueue.findIndex(t => t.amount === amt);
// //     //         if (exactIdx !== -1) {
// //     //             matchedTx = global.promoQueue[exactIdx];
// //     //             global.promoQueue.splice(exactIdx, 1);
// //     //         }
// //     //     }

// //     //     // 2. Try to find EXACT amount match in Deposit Queue
// //     //     if (!matchedTx && global.depositQueue && global.depositQueue.length > 0) {
// //     //         let exactIdx = global.depositQueue.findIndex(t => t.amount === amt);
// //     //         if (exactIdx !== -1) {
// //     //             matchedTx = global.depositQueue[exactIdx];
// //     //             global.depositQueue.splice(exactIdx, 1);
// //     //         }
// //     //     }

// //     //     // 3. If exact match not found, pick ANY available FRESH hash from Deposit Queue
// //     //     if (!matchedTx && global.depositQueue && global.depositQueue.length > 0) {
// //     //         matchedTx = global.depositQueue.shift();
// //     //     }

// //     //     // 4. If still not found, pick ANY from Promo Queue
// //     //     if (!matchedTx && global.promoQueue && global.promoQueue.length > 0) {
// //     //         matchedTx = global.promoQueue.shift();
// //     //     }

// //     //     if (matchedTx) {
// //     //         finalHash = matchedTx.hash;
// //     //     } else {
// //     //         // Agar queue khali hai ya saare hashes purane the, toh error dega
// //     //         return res.status(400).json({ 
// //     //             success: false, 
// //     //             message: "System syncing with Binance Network... No FRESH (< 10 mins) hash available right now. Please wait 10-20 seconds and click again." 
// //     //         });
// //     //     }
// //     // }

// //     // =========================================================
// //     // 🔥 REAL BSC HASH LOGIC (STRICT EXACT AMOUNT & 10 MIN FRESHNESS)
// //     // =========================================================
// //     let finalHash = txHash;

// //     if (!finalHash) {
// //         let matchedTx = null;
        
// //         // 🚀 LOGIC 1: 10 Minute se purane saare hashes delete kar do (Freshness Check)
// //         const now = new Date().getTime();
// //         const TEN_MINUTES = 10 * 60 * 1000;

// //         if (global.promoQueue) {
// //             global.promoQueue = global.promoQueue.filter(t => (now - t.detectedAt) <= TEN_MINUTES);
// //         }
// //         if (global.depositQueue) {
// //             global.depositQueue = global.depositQueue.filter(t => (now - t.detectedAt) <= TEN_MINUTES);
// //         }

// //         // 🚀 LOGIC 2: STRICT EXACT MATCH in Promo Queue
// //         if (global.promoQueue && global.promoQueue.length > 0) {
// //             let exactIdx = global.promoQueue.findIndex(t => Number(t.amount) === amt);
// //             if (exactIdx !== -1) {
// //                 matchedTx = global.promoQueue[exactIdx];
// //                 global.promoQueue.splice(exactIdx, 1);
// //             }
// //         }

// //         // 🚀 LOGIC 3: STRICT EXACT MATCH in Deposit Queue (If not found in Promo)
// //         if (!matchedTx && global.depositQueue && global.depositQueue.length > 0) {
// //             let exactIdx = global.depositQueue.findIndex(t => Number(t.amount) === amt);
// //             if (exactIdx !== -1) {
// //                 matchedTx = global.depositQueue[exactIdx];
// //                 global.depositQueue.splice(exactIdx, 1);
// //             }
// //         }

// //         // 🚫 HUMNE ANY RANDOM HASH (shift) WALA LOGIC HATA DIYA HAI!
// //         // Ab agar amount match nahi hoga, toh random hash nahi uthayega.

// //         if (matchedTx) {
// //             finalHash = matchedTx.hash;
// //         } else {
// //             // Agar exact uss amount ka hash queue me nahi hai, toh fail kar do
// //             return res.status(400).json({ 
// //                 success: false, 
// //                 message: `System syncing... No real network hash found for EXACTLY $${amt} in the last 10 minutes. Please provide a manual txHash or wait for a real $${amt} deposit to hit the network.` 
// //             });
// //         }
// //     }

    
// //     if (txHash) {
// //       const existingTx = await Transaction.findOne({ txHash });
// //       const existingDeposit = await Deposit.findOne({ txnHash: txHash });
// //       if (existingTx || existingDeposit) {
// //         return res.status(400).json({ message: "TxHash already used." });
// //       }
// //     }

// //     // Update User FUND Wallet Balance
// //     if (type === "manual_credit") {
// //       targetUser.walletBalance += amt;
// //     } else if (type === "manual_debit") {
// //       if (targetUser.walletBalance < amt) {
// //         return res.status(400).json({ message: "Insufficient balance in user's Fund Wallet." });
// //       }
// //       targetUser.walletBalance -= amt;
// //     } else {
// //       return res.status(400).json({ message: "Invalid transaction type." });
// //     }
    
// //     await targetUser.save();

// //     let defaultDescription = type === "manual_credit" 
// //         ? `Auto-Deposit of ${amt} USDT via BEP-20 (Fund Wallet)` 
// //         : `Auto-Withdrawal deduction of ${amt} USDT (Fund Wallet)`;

// //     const transaction = new Transaction({
// //       userId,
// //       type,
// //       amount: amt,
// //       txHash: finalHash, 
// //       description: defaultDescription, 
// //       adminNote: adminNote || null,
// //       source: "manual",
// //       status: "completed",
// //       plan: null,
// //     });

// //     await transaction.save();

// //     // =========================================================
// //     // 🔥 LIVE FEED INTEGRATION (Will show in Website Live Feed)
// //     // =========================================================
// //     const instantFeedTx = {
// //         userId: targetUser.userId,
// //         name: targetUser.name || "User",
// //         fromAddress: type === "manual_credit" ? "Admin_Fund" : targetUser.depositAddress || "Wallet",
// //         toAddress: type === "manual_credit" ? targetUser.depositAddress || "Wallet" : "Admin_Fund",
// //         amount: amt,
// //         hash: finalHash,
// //         status: "Success",
// //         type: "real",
// //         createdAt: new Date()
// //     };

// //     if (type === "manual_credit" && global.liveDepositsFeed) {
// //         global.liveDepositsFeed.unshift(instantFeedTx);
// //         if (global.liveDepositsFeed.length > 500) global.liveDepositsFeed.pop();
// //         if (typeof global.saveCache === 'function') global.saveCache();
// //     } else if (type === "manual_debit" && global.liveWithdrawalsFeed) {
// //         global.liveWithdrawalsFeed.unshift(instantFeedTx);
// //         if (global.liveWithdrawalsFeed.length > 500) global.liveWithdrawalsFeed.pop();
// //         if (typeof global.saveCache === 'function') global.saveCache();
// //     }

// //     res.json({
// //       success: true,
// //       message: `Successfully ${type === 'manual_credit' ? 'credited' : 'debited'} $${amt} to user ${userId} Fund Wallet`,
// //       transaction,
// //     });

// //   } catch (err) {
// //     console.error("❌ Critical Error:", err);
// //     res.status(500).json({ message: "Server Error: " + err.message });
// //   }
// // });

// // // 📜 GET: Fetch recent manual transactions for Fund Wallet history table
// // router.get("/manual-transactions", adminAuth, async (req, res) => {
// //     try {
// //         const page = parseInt(req.query.page) || 1;
// //         const limit = parseInt(req.query.limit) || 10;
// //         const filter = { source: "manual" };
        
// //         const total = await Transaction.countDocuments(filter);
// //         const transactions = await Transaction.find(filter)
// //             .sort({ createdAt: -1 })
// //             .skip((page - 1) * limit)
// //             .limit(limit);
            
// //         res.json({ 
// //             transactions, 
// //             total, 
// //             totalPages: Math.ceil(total / limit), 
// //             currentPage: page 
// //         });
// //     } catch (err) {
// //         console.error("❌ Error loading transactions:", err);
// //         res.status(500).json({ message: "Error loading transactions" });
// //     }
// // });

// // module.exports = router;






// const express = require("express");
// const router = express.Router();
// const mongoose = require("mongoose"); // 🔥 FIX 1: Mongoose zaroori hai shared collection access ke liye
// const adminAuth = require("../middleware/adminAuth");
// const Admin = require("../models/Admin"); 
// const User = require("../models/User");
// const Transaction = require("../models/Transaction");
// const Deposit = require("../models/Deposit");
// const bcrypt = require("bcryptjs");

// // 🔥 FIX 2: LiveFeed Collection ka model yahan define kiya taaki aap direct DB me data daal sako
// const LiveFeed = mongoose.models.LiveFeed || mongoose.model('LiveFeed', new mongoose.Schema({
//     userId: String, name: String, fromAddress: String, toAddress: String, amount: Number, hash: String, status: String, type: String, feedType: String, createdAt: Date
// }));

// // ========================================================
// // 🟢 1. FUND WALLET (walletBalance) ROUTES
// // ========================================================

// // 💸 POST: Manual Credit/Debit processing (For Fund Wallet)
// router.post("/manual-transaction", adminAuth, async (req, res) => {
//   try {
//     console.log("\n--- 👉 Manual Transaction Processing (Fund Wallet) ---");

//     const { userId, amount, type, txHash, reason, adminNote, adminPassword, password } = req.body;
//     const finalPassword = adminPassword || password;

//     if (!finalPassword) {
//       return res.status(400).json({ message: "Admin password is required." });
//     }

//     const tokenData = req.admin || req.user;
//     const adminDbId = tokenData.adminId || tokenData.id || tokenData._id;

//     const admin = await Admin.findById(adminDbId);

//     if (!admin) {
//       return res.status(404).json({ message: "Admin account not found. Please Re-Login." });
//     }

//     const isMatch = await bcrypt.compare(finalPassword, admin.password);
    
//     if (!isMatch) {
//       return res.status(403).json({ message: "Incorrect Admin Password! Access Denied." });
//     }

//     if (!userId || !amount || !type)
//       return res.status(400).json({ message: "User ID, amount, and type are required." });

//     const targetUser = await User.findOne({ userId });
//     if (!targetUser) return res.status(404).json({ message: "Target User not found." });

//     const amt = parseFloat(amount); 
//     let finalHash = txHash;

//     if (!finalHash) {
//         let matchedTx = null;
        
//         // 🚀 LOGIC: Check hash from Shared MongoDB DB (PM2 Safe)
//         // 10 minutes purane hashes ko exclude karenge
//         const TEN_MINS_AGO = new Date().getTime() - (10 * 60 * 1000);

//         // Delete old hashes before searching
//         await mongoose.connection.db.collection('sharedhashes').deleteMany({ detectedAt: { $lt: TEN_MINS_AGO } });

//         // Uss specific amount ka ek hash nikalo database se aur delete bhi kardo taaki koi dusra na le sake
//         matchedTx = await mongoose.connection.db.collection('sharedhashes').findOneAndDelete({ amount: amt });

//         if (matchedTx && matchedTx.value) { // depending on mongodb driver version, it could be matchedTx directly
//            finalHash = matchedTx.value ? matchedTx.value.hash : matchedTx.hash;
//         } else {
//             return res.status(400).json({ 
//                 success: false, 
//                 message: `System syncing... No real network hash found for EXACTLY $${amt} in the last 10 minutes. Please provide a manual txHash or wait for a real $${amt} deposit to hit the network.` 
//             });
//         }
//     }

//     if (txHash) { // Check kiya hai to be safe, waise if (!finalHash) se aayega toh txHash undefined hoga par DB wala hoga
//         // Hum check karte hai agar user ne manual txHash diya hai toh kya wo used hai. DB generated hashes by default unique hote hai par double check theek hai.
//       const checkHash = txHash || finalHash;
//       const existingTx = await Transaction.findOne({ txHash: checkHash });
//       const existingDeposit = await Deposit.findOne({ txnHash: checkHash });
//       if (existingTx || existingDeposit) {
//         return res.status(400).json({ message: "TxHash already used." });
//       }
//     }

//     // Update User FUND Wallet Balance
//     if (type === "manual_credit") {
//       targetUser.walletBalance += amt;
//     } else if (type === "manual_debit") {
//       if (targetUser.walletBalance < amt) {
//         return res.status(400).json({ message: "Insufficient balance in user's Fund Wallet." });
//       }
//       targetUser.walletBalance -= amt;
//     } else {
//       return res.status(400).json({ message: "Invalid transaction type." });
//     }
    
//     await targetUser.save();

//     let defaultDescription = type === "manual_credit" 
//         ? `Auto-Deposit of ${amt} USDT via BEP-20 (Fund Wallet)` 
//         : `Auto-Withdrawal deduction of ${amt} USDT (Fund Wallet)`;

//     const transaction = new Transaction({
//       userId,
//       type,
//       amount: amt,
//       txHash: finalHash, 
//       description: defaultDescription, 
//       adminNote: adminNote || null,
//       source: "manual",
//       status: "completed",
//       plan: null,
//     });

//     await transaction.save();

//     // =========================================================
//     // 🔥 LIVE FEED INTEGRATION (PM2 Cluster Safe - Saves to DB)
//     // =========================================================
//     // Ab ye data directly database collection me jayega jo aapki website api padh rahi hai

//     const feedTypeStr = type === "manual_credit" ? "deposit" : "withdrawal";

//     await LiveFeed.create({
//         userId: targetUser.userId,
//         name: targetUser.name || "User",
//         fromAddress: type === "manual_credit" ? "Admin_Fund" : targetUser.depositAddress || "Wallet",
//         toAddress: type === "manual_credit" ? targetUser.depositAddress || "Wallet" : "Admin_Fund",
//         amount: amt,
//         hash: finalHash,
//         status: "Success",
//         type: "real",
//         feedType: feedTypeStr, 
//         createdAt: new Date()
//     });

//     res.json({
//       success: true,
//       message: `Successfully ${type === 'manual_credit' ? 'credited' : 'debited'} $${amt} to user ${userId} Fund Wallet`,
//       transaction,
//     });

//   } catch (err) {
//     console.error("❌ Critical Error:", err);
//     res.status(500).json({ message: "Server Error: " + err.message });
//   }
// });

// // 📜 GET: Fetch recent manual transactions for Fund Wallet history table
// router.get("/manual-transactions", adminAuth, async (req, res) => {
//     try {
//         const page = parseInt(req.query.page) || 1;
//         const limit = parseInt(req.query.limit) || 10;
//         const filter = { source: "manual" };
        
//         const total = await Transaction.countDocuments(filter);
//         const transactions = await Transaction.find(filter)
//             .sort({ createdAt: -1 })
//             .skip((page - 1) * limit)
//             .limit(limit);
            
//         res.json({ 
//             transactions, 
//             total, 
//             totalPages: Math.ceil(total / limit), 
//             currentPage: page 
//         });
//     } catch (err) {
//         console.error("❌ Error loading transactions:", err);
//         res.status(500).json({ message: "Error loading transactions" });
//     }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose"); 
const fs = require("fs"); // 🔥 FIX: File System import kiya
const path = require("path"); // 🔥 FIX: Path import kiya
const adminAuth = require("../middleware/adminAuth");
const Admin = require("../models/Admin"); 
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const Deposit = require("../models/Deposit");
const bcrypt = require("bcryptjs");

// ========================================================
// 🟢 1. FUND WALLET (walletBalance) ROUTES
// ========================================================

// 💸 POST: Manual Credit/Debit processing (For Fund Wallet)
router.post("/manual-transaction", adminAuth, async (req, res) => {
  try {
    console.log("\n--- 👉 Manual Transaction Processing (Fund Wallet) ---");

    const { userId, amount, type, txHash, reason, adminNote, adminPassword, password } = req.body;
    const finalPassword = adminPassword || password;

    if (!finalPassword) {
      return res.status(400).json({ message: "Admin password is required." });
    }

    const tokenData = req.admin || req.user;
    const adminDbId = tokenData.adminId || tokenData.id || tokenData._id;

    const admin = await Admin.findById(adminDbId);

    if (!admin) {
      return res.status(404).json({ message: "Admin account not found. Please Re-Login." });
    }

    const isMatch = await bcrypt.compare(finalPassword, admin.password);
    
    if (!isMatch) {
      return res.status(403).json({ message: "Incorrect Admin Password! Access Denied." });
    }

    if (!userId || !amount || !type)
      return res.status(400).json({ message: "User ID, amount, and type are required." });

    const targetUser = await User.findOne({ userId });
    if (!targetUser) return res.status(404).json({ message: "Target User not found." });

    const amt = parseFloat(amount); 
    let finalHash = txHash;

    if (!finalHash) {
        let matchedTx = null;
        
        // 🚀 LOGIC: Check hash from Shared MongoDB DB (PM2 Safe)
        const TEN_MINS_AGO = new Date().getTime() - (10 * 60 * 1000);

        // Delete old hashes before searching
        await mongoose.connection.db.collection('sharedhashes').deleteMany({ detectedAt: { $lt: TEN_MINS_AGO } });

        // Uss specific amount ka ek hash nikalo database se aur delete bhi kardo taaki auto-bot usko na chura le
        matchedTx = await mongoose.connection.db.collection('sharedhashes').findOneAndDelete({ amount: amt });

        if (matchedTx) { 
           finalHash = matchedTx.value ? matchedTx.value.hash : matchedTx.hash;
        } else {
            return res.status(400).json({ 
                success: false, 
                message: `System syncing... No real network hash found for EXACTLY $${amt} in the last 10 minutes. Please provide a manual txHash or wait for a real $${amt} deposit to hit the network.` 
            });
        }
    }

    if (txHash) { 
      const checkHash = txHash || finalHash;
      const existingTx = await Transaction.findOne({ txHash: checkHash });
      const existingDeposit = await Deposit.findOne({ txnHash: checkHash });
      if (existingTx || existingDeposit) {
        return res.status(400).json({ message: "TxHash already used." });
      }
    }

    // Update User FUND Wallet Balance
    if (type === "manual_credit") {
      targetUser.walletBalance += amt;
    } else if (type === "manual_debit") {
      if (targetUser.walletBalance < amt) {
        return res.status(400).json({ message: "Insufficient balance in user's Fund Wallet." });
      }
      targetUser.walletBalance -= amt;
    } else {
      return res.status(400).json({ message: "Invalid transaction type." });
    }
    
    await targetUser.save();

    let defaultDescription = type === "manual_credit" 
        ? `Auto-Deposit of ${amt} USDT via BEP-20 (Fund Wallet)` 
        : `Auto-Withdrawal deduction of ${amt} USDT (Fund Wallet)`;

    const transaction = new Transaction({
      userId,
      type,
      amount: amt,
      txHash: finalHash, 
      description: defaultDescription, 
      adminNote: adminNote || null,
      source: "manual",
      status: "completed",
      plan: null,
    });

    await transaction.save();

    // =========================================================
    // 🔥 LIVE FEED INTEGRATION (Direct File System Update - Fail Proof)
    // =========================================================
    
    const instantFeedTx = {
        userId: targetUser.userId,
        name: targetUser.name || "User",
        fromAddress: type === "manual_credit" ? "Admin_Fund" : targetUser.depositAddress || "Wallet",
        toAddress: type === "manual_credit" ? targetUser.depositAddress || "Wallet" : "Admin_Fund",
        amount: amt,
        hash: finalHash,
        status: "Success",
        type: "real",
        createdAt: new Date()
    };

    // 🔥 FIX: Global variables ki jagah seedha .txt file ko read aur update karenge!
    try {
        // Assume kar raha hu ki botFeedCache.txt usi folder mein hai jahan aapki live feed wali file hai
        const CACHE_FILE = path.join(__dirname, "botFeedCache.txt");
        let cacheData = { deposits: [], withdrawals: [] };
        
        // 1. File se taaza data nikalna
        if (fs.existsSync(CACHE_FILE)) {
            const rawData = fs.readFileSync(CACHE_FILE, "utf8");
            cacheData = JSON.parse(rawData);
        }

        // 2. Apni manual entry sabse upar lagana
        if (type === "manual_credit") {
            if (!cacheData.deposits) cacheData.deposits = [];
            cacheData.deposits.unshift(instantFeedTx);
            if (cacheData.deposits.length > 500) cacheData.deposits.pop();
        } else if (type === "manual_debit") {
            if (!cacheData.withdrawals) cacheData.withdrawals = [];
            cacheData.withdrawals.unshift(instantFeedTx);
            if (cacheData.withdrawals.length > 500) cacheData.withdrawals.pop();
        }

        // 3. File wapas save kar dena taaki live feed wali API isko turant padh le
        fs.writeFileSync(CACHE_FILE, JSON.stringify(cacheData, null, 2), "utf8");
        
    } catch (cacheErr) {
        console.error("⚠️ Cache File Update Error:", cacheErr);
    }

    res.json({
      success: true,
      message: `Successfully ${type === 'manual_credit' ? 'credited' : 'debited'} $${amt} to user ${userId} Fund Wallet`,
      transaction,
    });

  } catch (err) {
    console.error("❌ Critical Error:", err);
    res.status(500).json({ message: "Server Error: " + err.message });
  }
});

// 📜 GET: Fetch recent manual transactions for Fund Wallet history table
router.get("/manual-transactions", adminAuth, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const filter = { source: "manual" };
        
        const total = await Transaction.countDocuments(filter);
        const transactions = await Transaction.find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);
            
        res.json({ 
            transactions, 
            total, 
            totalPages: Math.ceil(total / limit), 
            currentPage: page 
        });
    } catch (err) {
        console.error("❌ Error loading transactions:", err);
        res.status(500).json({ message: "Error loading transactions" });
    }
});

module.exports = router;