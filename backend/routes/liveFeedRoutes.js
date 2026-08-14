// // require("dotenv").config();
// // const express = require("express");
// // const router = express.Router();
// // const { ethers } = require("ethers");
// // const fs = require("fs");
// // const path = require("path");
// // const authMiddleware = require("../middleware/authMiddleware");

// // const SystemStat = require("../models/SystemStat");
// // const Transaction = require("../models/Transaction");

// // // ==========================================
// // // 🛡️ ANTI-CRASH SYSTEM
// // // ==========================================
// // process.on('uncaughtException', (err) => console.log("⚠️ Uncaught Exception:", err.message));
// // process.on('unhandledRejection', (reason) => console.log("⚠️ Unhandled Rejection:", reason));

// // // ==========================================
// // // 🟢 HELPER: Strict Local Date Formatter (YYYY-MM-DD)
// // // ==========================================
// // const getFormattedDate = (d = new Date()) => {
// //     return d.getFullYear() + "-" +
// //            String(d.getMonth() + 1).padStart(2, '0') + "-" +
// //            String(d.getDate()).padStart(2, '0');
// // };

// // // ==========================================
// // // 1. DATA STORES & CACHE SYSTEM
// // // ==========================================
// // let liveDepositsFeed = [];
// // let liveWithdrawalsFeed = [];

// // const CACHE_FILE = path.join(__dirname, "botFeedCache.txt");

// // function loadCache() {
// //     try {
// //         if (fs.existsSync(CACHE_FILE)) {
// //             const fileData = fs.readFileSync(CACHE_FILE, "utf8");
// //             const parsedData = JSON.parse(fileData);
// //             liveDepositsFeed = parsedData.deposits || [];
// //             liveWithdrawalsFeed = parsedData.withdrawals || [];
// //         }
// //     } catch (err) {}
// // }

// // function saveCache() {
// //     try {
// //         const dataToSave = { deposits: liveDepositsFeed, withdrawals: liveWithdrawalsFeed };
// //         fs.writeFileSync(CACHE_FILE, JSON.stringify(dataToSave, null, 2), "utf8");
// //     } catch (err) {}
// // }

// // loadCache();

// // let depositQueue = [];
// // let withdrawalQueue = [];
// // let processedHashes = new Set();
// // let listenerStarted = false;

// // // WF + 7 Digit ID Generator
// // const generateUserId = () => {
// //     const random7Digit = Math.floor(1000000 + Math.random() * 9000000);
// //     return `WF${random7Digit}`;
// // };

// // // ==========================================
// // // 2. WEB3 SETUP
// // // ==========================================
// // const RPC = process.env.RPC || "https://bsc-dataseed.binance.org/";
// // const USDT_CONTRACT = "0x55d398326f99059ff775485246999027b3197955";
// // const TARGET_WALLET = "0x4e7142Ed9A96e5AC99654f10a463475746Ac961F".toLowerCase();
// // const DECIMALS = 18;

// // let provider;
// // let contract;
// // const ABI = ["event Transfer(address indexed from, address indexed to, uint256 value)"];

// // console.log("🔥 World Finance Super-Stable Scanner Started");

// // // ==========================================
// // // 3. FILTERS FOR EXACT AMOUNTS
// // // ==========================================
// // function isValidDeposit(amount) {
// //     if (![2, 5, 10, 20, 50, 100, 200].includes(amount)) return false;
    
// //     // Chhoti entries zyada pass hongi, badi entries bohot rare
// //     if (amount === 2) return Math.random() <= 0.95;    // 95% chance
// //     if (amount === 5) return Math.random() <= 0.70;    // 70% chance
// //     if (amount === 10) return Math.random() <= 0.30;   // 30% chance
// //     if (amount === 20) return Math.random() <= 0.05;   // 5% chance
// //     if (amount === 50) return Math.random() <= 0.01;   // 1% chance (Bohot kam)
// //     if (amount === 100) return Math.random() <= 0.005; // 0.5% chance (Rare)
// //     if (amount === 200) return Math.random() <= 0.001; // 0.1% chance (Extremely Rare)
    
// //     return false;
// // }

// // function isValidWithdrawal(amount) {
// //     if (![4.5, 6.3, 9, 18, 27, 36, 45].includes(amount)) return false;
// //     if (amount === 4.5 || amount === 6.3) return true; 
// //     if (amount === 9 || amount === 18) return Math.random() <= 0.60; 
// //     if (amount === 27) return Math.random() <= 0.20; 
// //     if (amount === 36) return Math.random() <= 0.10; 
// //     if (amount === 45) return Math.random() <= 0.05; 
// //     return false;
// // }

// // // ==========================================
// // // 4. THE WEB3 LISTENER 
// // // ==========================================
// // function startListener() {
// //     if (listenerStarted) return;
// //     listenerStarted = true;
    
// //     try {
// //         provider = new ethers.JsonRpcProvider(RPC);
// //         contract = new ethers.Contract(USDT_CONTRACT, ABI, provider);

// //         contract.on("Transfer", async (from, to, value, event) => {
// //             try {
// //                 let rawAmount = Number(ethers.formatUnits(value, DECIMALS));
// //                 const amount = Number(rawAmount.toFixed(2));
// //                 const hash = event.log.transactionHash;

// //                 if (processedHashes.has(hash)) return;

// //                 const isTargetIn = to.toLowerCase() === TARGET_WALLET;
// //                 const isTargetOut = from.toLowerCase() === TARGET_WALLET;

// //                 // 🟢 REAL TARGET WALLET LOGIC
// //                 if (isTargetIn || isTargetOut) {
// //                     const instantTx = {
// //                         userId: generateUserId(), 
// //                         fromAddress: from,
// //                         toAddress: to,
// //                         amount: amount,
// //                         hash: hash,
// //                         status: "Success",
// //                         type: "real",
// //                         createdAt: new Date()
// //                     };

// //                     if (isTargetIn) {
// //                         liveDepositsFeed.unshift(instantTx);
// //                         if (liveDepositsFeed.length > 500) liveDepositsFeed.pop();
// //                     } else if (isTargetOut) {
// //                         liveWithdrawalsFeed.unshift(instantTx);
// //                         if (liveWithdrawalsFeed.length > 500) liveWithdrawalsFeed.pop();
// //                     }
// //                     processedHashes.add(hash);
// //                     saveCache(); 
// //                     return; 
// //                 }

// //                 // 🌀 FAKE BOT LOGIC
// //                 if (isValidDeposit(amount) && depositQueue.length < 50) {
// //                     depositQueue.push({
// //                         userId: generateUserId(), 
// //                         fromAddress: from,
// //                         toAddress: to,
// //                         amount: amount,
// //                         hash: hash,
// //                         status: "Success",
// //                         type: "fake",
// //                         detectedAt: new Date().getTime()
// //                     });
// //                     processedHashes.add(hash);
// //                 }

// //                 if (isValidWithdrawal(amount) && withdrawalQueue.length < 50) {
// //                     withdrawalQueue.push({
// //                         userId: generateUserId(), 
// //                         amount: amount,
// //                         hash: hash,
// //                         status: "Success",
// //                         type: "fake",
// //                         detectedAt: new Date().getTime()
// //                     });
// //                     processedHashes.add(hash);
// //                 }

// //                 if(processedHashes.size > 5000) processedHashes.clear();
// //             } catch (err) {}
// //         });

// //         provider.on("error", () => restartListener());
// //     } catch (err) {
// //         restartListener();
// //     }
// // }

// // function restartListener() {
// //     listenerStarted = false;
// //     setTimeout(() => {
// //         if(contract) contract.removeAllListeners();
// //         startListener();
// //     }, 10000); 
// // }

// // // ==========================================
// // // 5. SLOW RELEASE LOOPS
// // // ==========================================
// // const getDepositDelay = () => {
// //     // IST Time ke hisaab se current hour nikalna (0 to 23)
// //     const hourString = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata", hour: 'numeric', hour12: false });
// //     const currentHour = parseInt(hourString);

// //     if (currentHour >= 9 && currentHour < 23) {
// //         // DIN KA TIME (9 AM to 11 PM): Har 2 se 4 minutes (120000ms - 240000ms) me entry
// //         return Math.floor(Math.random() * (240000 - 120000 + 1)) + 120000;
// //     } else {
// //         // RAAT KA TIME (11 PM to 9 AM): Har 8 se 12 minutes (480000ms - 720000ms) me slow entry
// //         return Math.floor(Math.random() * (720000 - 480000 + 1)) + 480000;
// //     }
// // };
// // const getWithdrawalDelay = () => Math.floor(Math.random() * (60000 - 35000 + 1)) + 35000;
// // const isTooOld = (detectedAtTime, maxAgeMinutes) => (new Date().getTime() - detectedAtTime) > (maxAgeMinutes * 60 * 1000);

// // async function depositSenderLoop() {
// //     while (true) {
// //         try {
// //             if (depositQueue.length === 0) {
// //                 await new Promise(r => setTimeout(r, 5000)); 
// //                 continue;
// //             }

// //             const tx = depositQueue.shift();
// //             if (isTooOld(tx.detectedAt, 15)) continue; 

// //             tx.createdAt = new Date(); 
// //             liveDepositsFeed.unshift(tx);
// //             if (liveDepositsFeed.length > 500) liveDepositsFeed.pop();
// //             saveCache();
            
// //             // 🟢 STRICT DATE FIX
// //             const todayStr = getFormattedDate(); 
// //             try {
// //                 await SystemStat.updateOne(
// //                     { date: todayStr },
// //                     { $inc: { todayFakeUsdtAmount: Number(tx.amount) } }, // ✅ Aapke schema ke hisaab se
// //                     { upsert: true }
// //                 );
// //             } catch (dbErr) {
// //                 console.log("Stats DB Update Error:", dbErr.message);
// //             }
            
// //             await new Promise(r => setTimeout(r, getDepositDelay())); 
// //         } catch (err) {
// //             await new Promise(r => setTimeout(r, 5000));
// //         }
// //     }
// // }

// // async function withdrawalSenderLoop() {
// //     while (true) {
// //         try {
// //             if (withdrawalQueue.length === 0) {
// //                 await new Promise(r => setTimeout(r, 5000)); 
// //                 continue;
// //             }
// //             const tx = withdrawalQueue.shift();
// //             if (isTooOld(tx.detectedAt, 25)) continue; 

// //             tx.createdAt = new Date(); 
// //             liveWithdrawalsFeed.unshift(tx);
// //             if (liveWithdrawalsFeed.length > 500) liveWithdrawalsFeed.pop();
// //             saveCache();
            
// //             await new Promise(r => setTimeout(r, getWithdrawalDelay())); 
// //         } catch (err) {
// //             await new Promise(r => setTimeout(r, 5000));
// //         }
// //     }
// // }

// // startListener();
// // depositSenderLoop();
// // withdrawalSenderLoop();

// // // ==========================================
// // // 6. API ROUTES
// // // ==========================================
// // router.get("/deposits/live-feed", authMiddleware, async (req, res) => {
// //     try {
// //         const todayStr = getFormattedDate();
        
// //         // 1. REAL (Sirf Package Activations count hoga, 'deposit' total me nahi judega)
// //         const realTxns = await Transaction.find({
// //             type: 'package_activation', 
// //             status: { $regex: /^success$|^completed$/i } 
// //         });

// //         let totalRealAmount = 0;
// //         let todayRealAmount = 0;
// //         const startOfToday = new Date(todayStr); // Local midnight
// //         startOfToday.setHours(0, 0, 0, 0);

// //         realTxns.forEach(tx => {
// //             const amt = Number(tx.amount) || 0;
// //             totalRealAmount += amt;
// //             const txDate = new Date(tx.createdAt || tx.date);
// //             if (txDate >= startOfToday) {
// //                 todayRealAmount += amt;
// //             }
// //         });

// //         // 2. FAKE BOT DEPOSITS
// //         const allFakeStats = await SystemStat.find();
// //         let totalBotAmount = 0;
// //         let todayBotAmount = 0;

// //         allFakeStats.forEach(stat => {
// //             // 🟢 FIX: 'fakeAmount' ki jagah 'todayFakeUsdtAmount' jo schema me hai
// //             totalBotAmount += (stat.todayFakeUsdtAmount || 0);
            
// //             // 🟢 STRICT DATE MATCH FIX
// //             if (stat.date) {
// //                 const statDateObj = new Date(stat.date);
// //                 // Agar date invalid ban gayi, toh string ka pehla 10 char uthao, warna strict format use karo
// //                 const statDateStr = isNaN(statDateObj.getTime()) ? String(stat.date).substring(0, 10) : getFormattedDate(statDateObj);
                
// //                 if (statDateStr === todayStr) {
// //                     todayBotAmount += (stat.todayFakeUsdtAmount || 0);
// //                 }
// //             }
// //         });

// //         // 🔥 LOG (Text update kar diya taaki confusion na ho)
// //         console.log(`📊 STATS -> Real (Package Only): $${todayRealAmount} | Bot Fake: $${todayBotAmount}`);

// //         // 3. FINAL TOTAL
// //         const totalGrandInvestment = totalRealAmount + totalBotAmount;
// //         const todayTotalInvestment = todayRealAmount + todayBotAmount;

// //         res.json({ 
// //             success: true, 
// //             stats: {
// //                 totalGrandInvestment: totalGrandInvestment,
// //                 todayTotalInvestment: todayTotalInvestment
// //             },
// //             deposits: liveDepositsFeed 
// //         });

// //     } catch (error) {
// //         console.error("Live feed API Error:", error);
// //         res.json({ 
// //             success: false, 
// //             deposits: liveDepositsFeed, 
// //             stats: { totalGrandInvestment: 0, todayTotalInvestment: 0 } 
// //         });
// //     }
// // });

// // router.get("/deposits/recent", authMiddleware, (req, res) => {
// //     res.json({ success: true, deposits: liveDepositsFeed.slice(0, 5) });
// // });

// // router.get("/withdrawals/all", authMiddleware, (req, res) => {
// //     res.json({ success: true, withdrawals: liveWithdrawalsFeed });
// // });

// // router.get("/withdrawals/recent", authMiddleware, (req, res) => {
// //     res.json({ success: true, withdrawals: liveWithdrawalsFeed.slice(0, 5) });
// // });


// // module.exports = router;




// require("dotenv").config();
// const express = require("express");
// const router = express.Router();
// const { ethers } = require("ethers");
// const fs = require("fs");
// const path = require("path");
// const authMiddleware = require("../middleware/authMiddleware");

// // ==========================================
// // 🟢 MODELS IMPORT (Real & Dummy)
// // ==========================================
// const SystemStat = require("../models/SystemStat");
// const Transaction = require("../models/Transaction");
// const DummyUser = require("../models/DummyUser"); 
// const DummyTransaction = require("../models/DummyTransaction"); 

// // ==========================================
// // 🟢 UTILS IMPORT (External Generator Page)
// // ==========================================
//  const { generateUniqueDummyId, generateName } = require("../utils/dummyGenerator");
// // ==========================================
// // 🛡️ ANTI-CRASH SYSTEM
// // ==========================================
// process.on('uncaughtException', (err) => console.log("⚠️ Uncaught Exception:", err.message));
// process.on('unhandledRejection', (reason) => console.log("⚠️ Unhandled Rejection:", reason));

// // ==========================================
// // 🟢 HELPER: Strict Local Date Formatter (YYYY-MM-DD)
// // ==========================================
// const getFormattedDate = (d = new Date()) => {
//     return d.getFullYear() + "-" +
//            String(d.getMonth() + 1).padStart(2, '0') + "-" +
//            String(d.getDate()).padStart(2, '0');
// };

// // ==========================================
// // 1. DATA STORES & CACHE SYSTEM
// // ==========================================
// let liveDepositsFeed = [];
// let liveWithdrawalsFeed = [];

// const CACHE_FILE = path.join(__dirname, "botFeedCache.txt");

// function loadCache() {
//     try {
//         if (fs.existsSync(CACHE_FILE)) {
//             const fileData = fs.readFileSync(CACHE_FILE, "utf8");
//             const parsedData = JSON.parse(fileData);
//             liveDepositsFeed = parsedData.deposits || [];
//             liveWithdrawalsFeed = parsedData.withdrawals || [];
//         }
//     } catch (err) {}
// }

// function saveCache() {
//     try {
//         const dataToSave = { deposits: liveDepositsFeed, withdrawals: liveWithdrawalsFeed };
//         fs.writeFileSync(CACHE_FILE, JSON.stringify(dataToSave, null, 2), "utf8");
//     } catch (err) {}
// }

// loadCache();

// let depositQueue = [];
// let withdrawalQueue = [];
// let processedHashes = new Set();
// let listenerStarted = false;

// // ==========================================
// // 2. WEB3 SETUP
// // ==========================================
// const RPC = process.env.RPC || "https://bsc-dataseed.binance.org/";
// const USDT_CONTRACT = "0x55d398326f99059ff775485246999027b3197955";
// const TARGET_WALLET = "0x4e7142Ed9A96e5AC99654f10a463475746Ac961F".toLowerCase();
// const DECIMALS = 18;

// let provider;
// let contract;
// const ABI = ["event Transfer(address indexed from, address indexed to, uint256 value)"];

// console.log("🔥 World Finance Super-Stable Scanner Started");

// // ==========================================
// // 3. FILTERS FOR EXACT AMOUNTS
// // ==========================================
// function isValidDeposit(amount) {
//     if (![2, 5, 10, 20, 50, 100, 200].includes(amount)) return false;
    
//     // Chhoti entries zyada pass hongi, badi entries bohot rare
//     if (amount === 2) return Math.random() <= 0.95;    // 95% chance
//     if (amount === 5) return Math.random() <= 0.70;    // 70% chance
//     if (amount === 10) return Math.random() <= 0.30;   // 30% chance
//     if (amount === 20) return Math.random() <= 0.05;   // 5% chance
//     if (amount === 50) return Math.random() <= 0.01;   // 1% chance (Bohot kam)
//     if (amount === 100) return Math.random() <= 0.005; // 0.5% chance (Rare)
//     if (amount === 200) return Math.random() <= 0.001; // 0.1% chance (Extremely Rare)
    
//     return false;
// }

// function isValidWithdrawal(amount) {
//     if (![4.5, 6.3, 9, 18, 27, 36, 45].includes(amount)) return false;
//     if (amount === 4.5 || amount === 6.3) return true; 
//     if (amount === 9 || amount === 18) return Math.random() <= 0.60; 
//     if (amount === 27) return Math.random() <= 0.20; 
//     if (amount === 36) return Math.random() <= 0.10; 
//     if (amount === 45) return Math.random() <= 0.05; 
//     return false;
// }

// // ==========================================
// // 4. THE WEB3 LISTENER 
// // ==========================================
// function startListener() {
//     if (listenerStarted) return;
//     listenerStarted = true;
    
//     try {
//         provider = new ethers.JsonRpcProvider(RPC);
//         contract = new ethers.Contract(USDT_CONTRACT, ABI, provider);

//         contract.on("Transfer", async (from, to, value, event) => {
//             try {
//                 let rawAmount = Number(ethers.formatUnits(value, DECIMALS));
//                 const amount = Number(rawAmount.toFixed(2));
//                 const hash = event.log.transactionHash;

//                 if (processedHashes.has(hash)) return;

//                 const isTargetIn = to.toLowerCase() === TARGET_WALLET;
//                 const isTargetOut = from.toLowerCase() === TARGET_WALLET;

//                 // 🟢 REAL TARGET WALLET LOGIC (No changes here, runs normally)
//                 if (isTargetIn || isTargetOut) {
//                     const instantTx = {
//                         userId: "N/A", // Real users fetch ID from actual DB
//                         fromAddress: from,
//                         toAddress: to,
//                         amount: amount,
//                         hash: hash,
//                         status: "Success",
//                         type: "real",
//                         createdAt: new Date()
//                     };

//                     if (isTargetIn) {
//                         liveDepositsFeed.unshift(instantTx);
//                         if (liveDepositsFeed.length > 500) liveDepositsFeed.pop();
//                     } else if (isTargetOut) {
//                         liveWithdrawalsFeed.unshift(instantTx);
//                         if (liveWithdrawalsFeed.length > 500) liveWithdrawalsFeed.pop();
//                     }
//                     processedHashes.add(hash);
//                     saveCache(); 
//                     return; 
//                 }

//                 // 🌀 FAKE BOT LOGIC - With External Generator 
//               // 🌀 FAKE BOT LOGIC - With External Generator 
//                 if (isValidDeposit(amount) && depositQueue.length < 50) {
//                     const uniqueId = await generateUniqueDummyId(); // 🔥 await lagana zaroori hai
//                     depositQueue.push({
//                         userId: uniqueId, 
//                         name: generateName(), // 🔥 Ab ye sahi naam uthayega
//                         fromAddress: from,
//                         toAddress: to,
//                         amount: amount,
//                         hash: hash,
//                         status: "Success",
//                         type: "fake",
//                         detectedAt: new Date().getTime()
//                     });
//                     processedHashes.add(hash);
//                 }

//                 if (isValidWithdrawal(amount) && withdrawalQueue.length < 50) {
//                     const uniqueId = await generateUniqueDummyId(); // 🔥 await lagana zaroori hai
//                     withdrawalQueue.push({
//                         userId: uniqueId, 
//                         name: generateName(), // 🔥 Ab ye sahi naam uthayega
//                         amount: amount,
//                         hash: hash,
//                         status: "Success",
//                         type: "fake",
//                         detectedAt: new Date().getTime()
//                     });
//                     processedHashes.add(hash);
//                 }

//                 if(processedHashes.size > 5000) processedHashes.clear();
//             } catch (err) {}
//         });

//         provider.on("error", () => restartListener());
//     } catch (err) {
//         restartListener();
//     }
// }

// function restartListener() {
//     listenerStarted = false;
//     setTimeout(() => {
//         if(contract) contract.removeAllListeners();
//         startListener();
//     }, 10000); 
// }

// // ==========================================
// // 5. SLOW RELEASE LOOPS (WITH DUMMY DB SAVE)
// // ==========================================
// const getDepositDelay = () => {
//     const hourString = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata", hour: 'numeric', hour12: false });
//     const currentHour = parseInt(hourString);

//     if (currentHour >= 9 && currentHour < 23) {
//         return Math.floor(Math.random() * (240000 - 120000 + 1)) + 120000;
//         // return Math.floor(Math.random() * (10000 - 5000 + 1)) + 5000;
//     } else {
//         return Math.floor(Math.random() * (720000 - 480000 + 1)) + 480000;
//     }
// };
// const getWithdrawalDelay = () => Math.floor(Math.random() * (60000 - 35000 + 1)) + 35000;
// const isTooOld = (detectedAtTime, maxAgeMinutes) => (new Date().getTime() - detectedAtTime) > (maxAgeMinutes * 60 * 1000);

// async function depositSenderLoop() {
//     while (true) {
//         try {
//             if (depositQueue.length === 0) {
//                 await new Promise(r => setTimeout(r, 5000)); 
//                 continue;
//             }

//             const tx = depositQueue.shift();
//             if (isTooOld(tx.detectedAt, 15)) continue; 

//             tx.createdAt = new Date(); 
            
//             // 🔥 SAVE FAKE USER AND TRANSACTION IN DB
//             try {
//                 // 1. Create User
//                 await DummyUser.create({
//                     userId: tx.userId,
//                     name: tx.name
//                 });

//                 // 2. Create Transaction Record
//                 await DummyTransaction.create({
//                     userId: tx.userId,
//                     name: tx.name,
//                     amount: tx.amount,
//                     type: "deposit",
//                     hash: tx.hash,
//                     status: "Success",
//                     createdAt: tx.createdAt
//                 });
//             } catch (dbErr) {
//                 console.log("⚠️ Dummy DB Save Error:", dbErr.message);
//             }

//             liveDepositsFeed.unshift(tx);
//             if (liveDepositsFeed.length > 500) liveDepositsFeed.pop();
//             saveCache();
            
//             // Update Stats
//             const todayStr = getFormattedDate(); 
//             try {
//                 await SystemStat.updateOne(
//                     { date: todayStr },
//                     { $inc: { todayFakeUsdtAmount: Number(tx.amount) } }, 
//                     { upsert: true }
//                 );
//             } catch (dbErr) {
//                 console.log("Stats DB Update Error:", dbErr.message);
//             }
            
//             await new Promise(r => setTimeout(r, getDepositDelay())); 
//         } catch (err) {
//             await new Promise(r => setTimeout(r, 5000));
//         }
//     }
// }

// async function withdrawalSenderLoop() {
//     while (true) {
//         try {
//             if (withdrawalQueue.length === 0) {
//                 await new Promise(r => setTimeout(r, 5000)); 
//                 continue;
//             }
//             const tx = withdrawalQueue.shift();
//             if (isTooOld(tx.detectedAt, 25)) continue; 

//             tx.createdAt = new Date(); 

//             // 🔥 SAVE FAKE USER AND TRANSACTION IN DB
//             try {
//                 await DummyUser.create({
//                     userId: tx.userId,
//                     name: tx.name
//                 });

//                 await DummyTransaction.create({
//                     userId: tx.userId,
//                     name: tx.name,
//                     amount: tx.amount,
//                     type: "withdrawal",
//                     hash: tx.hash,
//                     status: "Success",
//                     createdAt: tx.createdAt
//                 });
//             } catch (dbErr) {
//                 console.log("⚠️ Dummy DB Save Error:", dbErr.message);
//             }

//             liveWithdrawalsFeed.unshift(tx);
//             if (liveWithdrawalsFeed.length > 500) liveWithdrawalsFeed.pop();
//             saveCache();
            
//             await new Promise(r => setTimeout(r, getWithdrawalDelay())); 
//         } catch (err) {
//             await new Promise(r => setTimeout(r, 5000));
//         }
//     }
// }

// startListener();
// depositSenderLoop();
// withdrawalSenderLoop();

// // ==========================================
// // 6. API ROUTES
// // ==========================================
// router.get("/deposits/live-feed", authMiddleware, async (req, res) => {
//     try {
//         const todayStr = getFormattedDate();
        
//         // 1. REAL
//         const realTxns = await Transaction.find({
//             type: 'package_activation', 
//             status: { $regex: /^success$|^completed$/i } 
//         });

//         let totalRealAmount = 0;
//         let todayRealAmount = 0;
//         const startOfToday = new Date(todayStr); 
//         startOfToday.setHours(0, 0, 0, 0);

//         realTxns.forEach(tx => {
//             const amt = Number(tx.amount) || 0;
//             totalRealAmount += amt;
//             const txDate = new Date(tx.createdAt || tx.date);
//             if (txDate >= startOfToday) {
//                 todayRealAmount += amt;
//             }
//         });

//         // 2. FAKE BOT DEPOSITS
//         const allFakeStats = await SystemStat.find();
//         let totalBotAmount = 0;
//         let todayBotAmount = 0;

//         allFakeStats.forEach(stat => {
//             totalBotAmount += (stat.todayFakeUsdtAmount || 0);
            
//             if (stat.date) {
//                 const statDateObj = new Date(stat.date);
//                 const statDateStr = isNaN(statDateObj.getTime()) ? String(stat.date).substring(0, 10) : getFormattedDate(statDateObj);
                
//                 if (statDateStr === todayStr) {
//                     todayBotAmount += (stat.todayFakeUsdtAmount || 0);
//                 }
//             }
//         });

//         console.log(`📊 STATS -> Real (Package Only): $${todayRealAmount} | Bot Fake: $${todayBotAmount}`);

//         // 3. FINAL TOTAL
//         const totalGrandInvestment = totalRealAmount + totalBotAmount;
//         const todayTotalInvestment = todayRealAmount + todayBotAmount;

//         res.json({ 
//             success: true, 
//             stats: {
//                 totalGrandInvestment: totalGrandInvestment,
//                 todayTotalInvestment: todayTotalInvestment
//             },
//             deposits: liveDepositsFeed 
//         });

//     } catch (error) {
//         console.error("Live feed API Error:", error);
//         res.json({ 
//             success: false, 
//             deposits: liveDepositsFeed, 
//             stats: { totalGrandInvestment: 0, todayTotalInvestment: 0 } 
//         });
//     }
// });

// router.get("/deposits/recent", authMiddleware, (req, res) => {
//     res.json({ success: true, deposits: liveDepositsFeed.slice(0, 5) });
// });

// router.get("/withdrawals/all", authMiddleware, (req, res) => {
//     res.json({ success: true, withdrawals: liveWithdrawalsFeed });
// });

// router.get("/withdrawals/recent", authMiddleware, (req, res) => {
//     res.json({ success: true, withdrawals: liveWithdrawalsFeed.slice(0, 5) });
// });

// module.exports = router;
















// require("dotenv").config();
// const express = require("express");
// const router = express.Router();
// const { ethers } = require("ethers");
// const fs = require("fs");
// const path = require("path");
// const authMiddleware = require("../middleware/authMiddleware");

// // ==========================================
// // 🟢 MODELS IMPORT (Real & Dummy)
// // ==========================================
// const SystemStat = require("../models/SystemStat");
// const Transaction = require("../models/Transaction");
// const DummyUser = require("../models/DummyUser"); 
// const DummyTransaction = require("../models/DummyTransaction"); 
// const User = require("../models/User");
//  // ==========================================
// // 🟢 UTILS IMPORT (External Generator Page)
// // ==========================================
// const { generateUniqueDummyId, generateName } = require("../utils/dummyGenerator");

// // ==========================================
// // 🛡️ ANTI-CRASH SYSTEM
// // ==========================================
// process.on('uncaughtException', (err) => console.log("⚠️ Uncaught Exception:", err.message));
// process.on('unhandledRejection', (reason) => console.log("⚠️ Unhandled Rejection:", reason));

// // ==========================================
// // 🟢 HELPER: Strict Local Date Formatter (YYYY-MM-DD)
// // ==========================================
// // const getFormattedDate = (d = new Date()) => {
// //     return d.getFullYear() + "-" +
// //            String(d.getMonth() + 1).padStart(2, '0') + "-" +
// //            String(d.getDate()).padStart(2, '0');
// // };

// // ==========================================
// // 🟢 HELPER: Strict IST Date Formatter (YYYY-MM-DD)
// // ==========================================
// const getFormattedDate = (d = new Date()) => {
//     // Ye line kisi bhi date ko exactly Indian Time me convert kar degi
//     const istTimeStr = new Date(d).toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
//     const istDate = new Date(istTimeStr);
    
//     return istDate.getFullYear() + "-" +
//            String(istDate.getMonth() + 1).padStart(2, '0') + "-" +
//            String(istDate.getDate()).padStart(2, '0');
// };

// // ==========================================
// // 1. DATA STORES & CACHE SYSTEM
// // ==========================================
// let liveDepositsFeed = [];
// let liveWithdrawalsFeed = [];

// const CACHE_FILE = path.join(__dirname, "botFeedCache.txt");

// function loadCache() {
//     try {
//         if (fs.existsSync(CACHE_FILE)) {
//             const fileData = fs.readFileSync(CACHE_FILE, "utf8");
//             const parsedData = JSON.parse(fileData);
//             liveDepositsFeed = parsedData.deposits || [];
//             liveWithdrawalsFeed = parsedData.withdrawals || [];
//         }
//     } catch (err) {}
// }

// function saveCache() {
//     try {
//         const dataToSave = { deposits: liveDepositsFeed, withdrawals: liveWithdrawalsFeed };
//         fs.writeFileSync(CACHE_FILE, JSON.stringify(dataToSave, null, 2), "utf8");
//     } catch (err) {}
// }

// loadCache();

// let depositQueue = [];
// let withdrawalQueue = [];
// let processedHashes = new Set();
// let listenerStarted = false;

// // ==========================================
// // 2. WEB3 SETUP
// // ==========================================
// const RPC = process.env.RPC || "https://bsc-dataseed.binance.org/";
// const USDT_CONTRACT = "0x55d398326f99059ff775485246999027b3197955";
// const TARGET_WALLET = "0x4e7142Ed9A96e5AC99654f10a463475746Ac961F".toLowerCase();
// const DECIMALS = 18;

// let provider;
// let contract;
// const ABI = ["event Transfer(address indexed from, address indexed to, uint256 value)"];

// console.log("🔥 World Finance Super-Stable Scanner Started");

// // ==========================================
// // 3. FILTERS FOR EXACT AMOUNTS
// // ==========================================
// // function isValidDeposit(amount) {
// //     if (![2, 5, 10, 20, 50, 100, 200].includes(amount)) return false;
// //     if (amount === 2) return Math.random() <= 0.95;    // 95% chance
// //     if (amount === 5) return Math.random() <= 0.70;    // 70% chance
// //     if (amount === 10) return Math.random() <= 0.30;   // 30% chance
// //     if (amount === 20) return Math.random() <= 0.05;   // 5% chance
// //     if (amount === 50) return Math.random() <= 0.01;   // 1% chance (Bohot kam)
// //     if (amount === 100) return Math.random() <= 0.005; // 0.5% chance (Rare)
// //     if (amount === 200) return Math.random() <= 0.001; // 0.1% chance (Extremely Rare)
// //     return false;
// // }

// // ==========================================
// // 3. FILTERS FOR EXACT AMOUNTS
// // ==========================================
// function isValidDeposit(amount) {
//     // Sirf aapke original amounts hi hain, kuch naya add nahi kiya
//     if (![2, 5, 10, 20, 50, 100, 200].includes(amount)) return false;

//     // 100 aur 50 ki priority badha di (daily 5000 volume hit karne ke liye)
//     if (amount === 100) return Math.random() <= 0.30;  // 30% chance
//     if (amount === 50) return Math.random() <= 0.60;   // 60% chance

//     // Baaki sab aapke purane code jaisa hi set rakha hai
//     if (amount === 2) return Math.random() <= 0.95;    // 95% chance
//     if (amount === 5) return Math.random() <= 0.70;    // 70% chance
//     if (amount === 10) return Math.random() <= 0.30;   // 30% chance
//     if (amount === 20) return Math.random() <= 0.05;   // 5% chance
//     if (amount === 200) return Math.random() <= 0.001; // 0.1% chance (Extremely Rare)
    
//     return false;
// }



// function isValidWithdrawal(amount) {
//     if (![4.5, 6.3, 9, 18, 27, 36, 45].includes(amount)) return false;
//     if (amount === 4.5 || amount === 6.3) return true; 
//     if (amount === 9 || amount === 18) return Math.random() <= 0.60; 
//     if (amount === 27) return Math.random() <= 0.20; 
//     if (amount === 36) return Math.random() <= 0.10; 
//     if (amount === 45) return Math.random() <= 0.05; 
//     return false;
// }

// // ==========================================
// // 4. THE WEB3 LISTENER (FIXED: NO ID GENERATION HERE)
// // ==========================================
// // function startListener() {
// //     if (listenerStarted) return;
// //     listenerStarted = true;
    
// //     try {
// //         provider = new ethers.JsonRpcProvider(RPC);
// //         contract = new ethers.Contract(USDT_CONTRACT, ABI, provider);

// //         contract.on("Transfer", async (from, to, value, event) => {
// //             try {
// //                 let rawAmount = Number(ethers.formatUnits(value, DECIMALS));
// //                 const amount = Number(rawAmount.toFixed(2));
// //                 const hash = event.log.transactionHash;

// //                 if (processedHashes.has(hash)) return;

// //                 const isTargetIn = to.toLowerCase() === TARGET_WALLET;
// //                 const isTargetOut = from.toLowerCase() === TARGET_WALLET;

// //                 // 🟢 REAL TARGET WALLET LOGIC
// //                 // if (isTargetIn || isTargetOut) {
// //                 //     const instantTx = {
// //                 //         userId: "N/A", 
// //                 //         fromAddress: from,
// //                 //         toAddress: to,
// //                 //         amount: amount,
// //                 //         hash: hash,
// //                 //         status: "Success",
// //                 //         type: "real",
// //                 //         createdAt: new Date()
// //                 //     };

// //                 //     if (isTargetIn) {
// //                 //         liveDepositsFeed.unshift(instantTx);
// //                 //         if (liveDepositsFeed.length > 500) liveDepositsFeed.pop();
// //                 //     } else if (isTargetOut) {
// //                 //         liveWithdrawalsFeed.unshift(instantTx);
// //                 //         if (liveWithdrawalsFeed.length > 500) liveWithdrawalsFeed.pop();
// //                 //     }
// //                 //     processedHashes.add(hash);
// //                 //     saveCache(); 
// //                 //     return; 
// //                 // }

// //                 // 🟢 REAL TARGET WALLET LOGIC (UPDATED WITH USER LOOKUP)
// // if (isTargetIn || isTargetOut) {
// //     let matchedUserId = "N/A";
// //     let matchedName = "user";

// //     try {
// //         const cleanFromAddress = from ? from.trim() : "";
// //         if (cleanFromAddress) {
// //             // 🔥 Yahi wahi query hai jo depositAddress se match karegi
// //             const dbUser = await User.findOne({ 
// //                 depositAddress: { $regex: new RegExp(`^${cleanFromAddress}$`, "i") } 
// //             });

// //             if (dbUser) {
// //                 matchedUserId = dbUser.userId || "N/A";
// //                 matchedName = dbUser.name || "user";
// //                 console.log(`✅ Real User Matched! ID: ${matchedUserId} | Name: ${matchedName}`);
// //             }
// //         }
// //     } catch (dbErr) {
// //         console.log("⚠️ Real user lookup error:", dbErr.message);
// //     }

// //     const instantTx = {
// //         userId: matchedUserId, // 🔥 Real User ID
// //         name: matchedName,     // 🔥 Real User Name
// //         fromAddress: from,
// //         toAddress: to,
// //         amount: amount,
// //         hash: hash,
// //         status: "Success",
// //         type: "real",
// //         createdAt: new Date()
// //     };

// //     if (isTargetIn) {
// //         liveDepositsFeed.unshift(instantTx);
// //         if (liveDepositsFeed.length > 500) liveDepositsFeed.pop();
// //         console.log("⚡ INSTANT REAL TARGET IN (Deposit): $", amount, "| User:", matchedUserId);
// //     } else if (isTargetOut) {
// //         liveWithdrawalsFeed.unshift(instantTx);
// //         if (liveWithdrawalsFeed.length > 500) liveWithdrawalsFeed.pop();
// //         console.log("⚡ INSTANT REAL TARGET OUT (Withdrawal): $", amount, "| User:", matchedUserId);
// //     }
    
// //     processedHashes.add(hash);
// //     saveCache(); 
// //     return; 
// // }

// //                 // 🌀 FAKE BOT LOGIC - Just push raw data to Queue, NO ID generation here
// //                 if (isValidDeposit(amount) && depositQueue.length < 50) {
// //                     depositQueue.push({
// //                         fromAddress: from,
// //                         toAddress: to,
// //                         amount: amount,
// //                         hash: hash,
// //                         detectedAt: new Date().getTime()
// //                     });
// //                     processedHashes.add(hash);
// //                 }

// //                 if (isValidWithdrawal(amount) && withdrawalQueue.length < 50) {
// //                     withdrawalQueue.push({
// //                         amount: amount,
// //                         hash: hash,
// //                         detectedAt: new Date().getTime()
// //                     });
// //                     processedHashes.add(hash);
// //                 }

// //                 if(processedHashes.size > 5000) processedHashes.clear();
// //             } catch (err) {}
// //         });

// //         provider.on("error", () => restartListener());
// //     } catch (err) {
// //         restartListener();
// //     }
// // }

// // ==========================================
// // 4. THE WEB3 LISTENER (UPDATED WITH DIRECT TRANSFER FILTER)
// // ==========================================
// function startListener() {
//     if (listenerStarted) return;
//     listenerStarted = true;
    
//     try {
//         provider = new ethers.JsonRpcProvider(RPC);
//         contract = new ethers.Contract(USDT_CONTRACT, ABI, provider);

//         contract.on("Transfer", async (from, to, value, event) => {
//             try {
//                 let rawAmount = Number(ethers.formatUnits(value, DECIMALS));
//                 const amount = Number(rawAmount.toFixed(2));
//                 const hash = event.log.transactionHash;

//                 if (processedHashes.has(hash)) return;

//                 const isTargetIn = to.toLowerCase() === TARGET_WALLET;
//                 const isTargetOut = from.toLowerCase() === TARGET_WALLET;

//                 // 🟢 REAL TARGET WALLET LOGIC (UPDATED WITH USER LOOKUP)
//                 if (isTargetIn || isTargetOut) {
//                     let matchedUserId = "N/A";
//                     let matchedName = "user";

//                     try {
//                         const cleanFromAddress = from ? from.trim() : "";
//                         if (cleanFromAddress) {
//                             // 🔥 Yahi wahi query hai jo depositAddress se match karegi
//                             const dbUser = await User.findOne({ 
//                                 depositAddress: { $regex: new RegExp(`^${cleanFromAddress}$`, "i") } 
//                             });

//                             if (dbUser) {
//                                 matchedUserId = dbUser.userId || "N/A";
//                                 matchedName = dbUser.name || "user";
//                                 console.log(`✅ Real User Matched! ID: ${matchedUserId} | Name: ${matchedName}`);
//                             }
//                         }
//                     } catch (dbErr) {
//                         console.log("⚠️ Real user lookup error:", dbErr.message);
//                     }

//                     const instantTx = {
//                         userId: matchedUserId, // 🔥 Real User ID
//                         name: matchedName,     // 🔥 Real User Name
//                         fromAddress: from,
//                         toAddress: to,
//                         amount: amount,
//                         hash: hash,
//                         status: "Success",
//                         type: "real",
//                         createdAt: new Date()
//                     };

//                     if (isTargetIn) {
//                         liveDepositsFeed.unshift(instantTx);
//                         if (liveDepositsFeed.length > 500) liveDepositsFeed.pop();
//                         console.log("⚡ INSTANT REAL TARGET IN (Deposit): $", amount, "| User:", matchedUserId);
//                     } else if (isTargetOut) {
//                         liveWithdrawalsFeed.unshift(instantTx);
//                         if (liveWithdrawalsFeed.length > 500) liveWithdrawalsFeed.pop();
//                         console.log("⚡ INSTANT REAL TARGET OUT (Withdrawal): $", amount, "| User:", matchedUserId);
//                     }
                    
//                     processedHashes.add(hash);
//                     saveCache(); 
//                     return; 
//                 }

//                 // 🌀 FAKE BOT LOGIC - With Direct "Simple Transfer" Filter
//                 if ((isValidDeposit(amount) && depositQueue.length < 50) || (isValidWithdrawal(amount) && withdrawalQueue.length < 50)) {
                    
//                     try {
//                         // 🔥 NAYA FILTER: Main transaction detail nikal kar check karenge
//                         const txDetail = await provider.getTransaction(hash);
                        
//                         // 1. txDetail.to USDT contract hona chahiye (Direct interaction)
//                         // 2. data "0xa9059cbb" se start hona chahiye (Standard Transfer Method)
//                         if (!txDetail || 
//                             !txDetail.to ||
//                             txDetail.to.toLowerCase() !== USDT_CONTRACT.toLowerCase() || 
//                             !txDetail.data.startsWith("0xa9059cbb")) {
//                             return; // Agar complex contract call ya swap hai, toh is hash ko discard kar do!
//                         }
//                     } catch (err) {
//                         return; // Agar RPC limit ka error aaye toh chup-chap skip kardo
//                     }

//                     // ✅ Yahan wahi hashes aayenge jo 100% clean direct transfers hain
//                     if (isValidDeposit(amount) && depositQueue.length < 50) {
//                         depositQueue.push({
//                             fromAddress: from,
//                             toAddress: to,
//                             amount: amount,
//                             hash: hash,
//                             detectedAt: new Date().getTime()
//                         });
//                         processedHashes.add(hash);
//                     }

//                     if (isValidWithdrawal(amount) && withdrawalQueue.length < 50) {
//                         withdrawalQueue.push({
//                             amount: amount,
//                             hash: hash,
//                             detectedAt: new Date().getTime()
//                         });
//                         processedHashes.add(hash);
//                     }
//                 }

//                 if(processedHashes.size > 5000) processedHashes.clear();
//             } catch (err) {}
//         });

//         provider.on("error", () => restartListener());
//     } catch (err) {
//         restartListener();
//     }
// }

// function restartListener() {
//     listenerStarted = false;
//     setTimeout(() => {
//         if(contract) contract.removeAllListeners();
//         startListener();
//     }, 10000); 
// }

// // ==========================================
// // 5. SLOW RELEASE LOOPS (FIXED: ID GENERATION HAPPENS HERE)
// // ==========================================
// // const getDepositDelay = () => {
// //     const hourString = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata", hour: 'numeric', hour12: false });
// //     const currentHour = parseInt(hourString);

// //     if (currentHour >= 9 && currentHour < 23) {
// //         return Math.floor(Math.random() * (240000 - 120000 + 1)) + 120000;
        
// //     } else {
// //         return Math.floor(Math.random() * (720000 - 480000 + 1)) + 480000;
// //     }
// // };


// // ==========================================
// // 🔥 STRICT IST COOLDOWN (Server Chahe Kahi Bhi Ho)
// // ==========================================
// // const getDepositDelay = () => {
// //     // Ye line hamesha India ka exact date aur time banayegi
// //     const istTimeStr = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
// //     const istDate = new Date(istTimeStr);
    
// //     // .getHours() ab strictly India ka ghanta (0 se 23) dega
// //     const currentHour = istDate.getHours();

// //     if (currentHour >= 8 && currentHour < 23) {
// //         // ☀️ Din ka Time (India: Subah 9:00 baje se Raat 10:59 baje tak)
// //         // Delay: 2 min (120000ms) se 4 min (240000ms) ke beech
// //         return Math.floor(Math.random() * (240000 - 120000 + 1)) + 120000;
// //     } else {
// //           // 🌙 Raat ka Time - Delay: 15 min (900000ms) se 20 min (1200000ms) ke beech
// // return Math.floor(Math.random() * (1200000 - 900000 + 1)) + 900000;
// //     }
// // };


// const getDepositDelay = () => {
//     // Ye line hamesha India ka exact date aur time banayegi
//     const istTimeStr = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
//     const istDate = new Date(istTimeStr);
    
//     // .getHours() ab strictly India ka ghanta (0 se 23) dega
//     const currentHour = istDate.getHours();

//     if (currentHour >= 8 && currentHour < 23) {
//         // ☀️ Din ka Time (India: Subah 8:00 baje se Raat 10:59 baje tak)
//         // 🔥 NAYA DELAY: 4 min (240000ms) se 8 min (480000ms) ke beech
//         return Math.floor(Math.random() * (480000 - 240000 + 1)) + 240000;
//     } else {
//         // 🌙 Raat ka Time - Delay: 15 min (900000ms) se 20 min (1200000ms) ke beech
//         // Raat ka time waisa hi rakha hai kyunki raat me waise hi transactions kam aani chahiye
//         return Math.floor(Math.random() * (1200000 - 900000 + 1)) + 900000;
//     }
// };


// const getWithdrawalDelay = () => Math.floor(Math.random() * (60000 - 35000 + 1)) + 35000;
// const isTooOld = (detectedAtTime, maxAgeMinutes) => (new Date().getTime() - detectedAtTime) > (maxAgeMinutes * 60 * 1000);

// // async function depositSenderLoop() {
// //     while (true) {
// //         try {
// //             if (depositQueue.length === 0) {
// //                 await new Promise(r => setTimeout(r, 5000)); 
// //                 continue;
// //             }

// //             const tx = depositQueue.shift();
// //             if (isTooOld(tx.detectedAt, 15)) continue; 

// //             // 🔥 1. GENERATE ID & NAME NOW (Aaram se bina load ke)
// //             tx.userId = await generateUniqueDummyId();
// //             tx.name = generateName();
// //             tx.type = "fake";
// //             tx.status = "Success";
// //             tx.createdAt = new Date(); 
            
// //             // 🔥 2. SAVE TO DATABASE
// //             try {
// //                 await DummyUser.create({
// //                     userId: tx.userId,
// //                     name: tx.name
// //                 });

// //                 await DummyTransaction.create({
// //                     userId: tx.userId,
// //                     name: tx.name,
// //                     amount: tx.amount,
// //                     type: "deposit",
// //                     hash: tx.hash,
// //                     status: tx.status,
// //                     createdAt: tx.createdAt
// //                 });
// //             } catch (dbErr) {
// //                 console.log("⚠️ Dummy DB Save Error:", dbErr.message);
// //             }

// //             // 🔥 3. UPDATE LIVE FEED
// //             liveDepositsFeed.unshift(tx);
// //             if (liveDepositsFeed.length > 500) liveDepositsFeed.pop();
// //             saveCache();
            
// //             // 🔥 4. UPDATE STATS
// //             const todayStr = getFormattedDate(); 
// //             try {
// //                 await SystemStat.updateOne(
// //                     { date: todayStr },
// //                     { $inc: { todayFakeUsdtAmount: Number(tx.amount) } }, 
// //                     { upsert: true }
// //                 );
// //             } catch (dbErr) {
// //                 console.log("Stats DB Update Error:", dbErr.message);
// //             }
            
// //             await new Promise(r => setTimeout(r, getDepositDelay())); 
// //         } catch (err) {
// //             await new Promise(r => setTimeout(r, 5000));
// //         }
// //     }
// // }

// async function depositSenderLoop() {
//     while (true) {
//         try {
//             if (depositQueue.length === 0) {
//                 await new Promise(r => setTimeout(r, 5000)); 
//                 continue;
//             }

//             const tx = depositQueue.shift();
//             console.log("➡️ Queue Processing Started for Amount:", tx.amount); // TRACING STEP 1

//             if (isTooOld(tx.detectedAt, 15)) continue; 

//             // 🔥 1. GENERATE ID & NAME NOW
//             tx.userId = await generateUniqueDummyId();
//             console.log("➡️ ID Generated & Assigned:", tx.userId); // TRACING STEP 2
            
//             tx.name = generateName(); // Agar yahan error hai, toh next line print nahi hogi!
//             console.log("➡️ Name Assigned:", tx.name); // TRACING STEP 3
            
//             tx.type = "deposit"; 
//             tx.status = "Success";
//             tx.createdAt = new Date(); 

//             // 🔥 2. SAVE TO DATABASE
//             console.log("➡️ Attempting DB Save..."); // TRACING STEP 4
//             try {
//                 const savedUser = await DummyUser.create({
//                     userId: tx.userId,
//                     name: tx.name
//                 });

//                 const savedTx = await DummyTransaction.create({
//                     userId: tx.userId,
//                     name: tx.name,
//                     amount: tx.amount,
//                     type: tx.type, 
//                     hash: tx.hash,
//                     status: tx.status,
//                     createdAt: tx.createdAt
//                 });
                
//                 console.log(`💾 DB SAVED -> User: ${savedUser.userId} | Tx: $${savedTx.amount}`);
                
//             } catch (dbErr) {
//                 console.log("⚠️ Dummy DB Save Error:", dbErr.message);
//             }

//             // 🔥 3. UPDATE LIVE FEED
//             liveDepositsFeed.unshift(tx);
//             if (liveDepositsFeed.length > 500) liveDepositsFeed.pop();
//             if (typeof saveCache === 'function') saveCache();
            
//             // 🔥 4. UPDATE STATS
//             if (typeof getFormattedDate === 'function') {
//                 const todayStr = getFormattedDate(); 
//                 try {
//                     await SystemStat.updateOne(
//                         { date: todayStr },
//                         { $inc: { todayFakeUsdtAmount: Number(tx.amount) } }, 
//                         { upsert: true }
//                     );
//                 } catch (dbErr) {
//                     console.log("⚠️ Stats DB Update Error:", dbErr.message);
//                 }
//             }
            
//             await new Promise(r => setTimeout(r, typeof getDepositDelay === 'function' ? getDepositDelay() : 5000)); 
//         } catch (err) {
//             // 🛑 YAHAN PAR ERROR HIDE HO RAHA THA! AB YE TERMINAL ME BATA EGA KYA FAT RAHA HAI.
//             console.log("🛑 CRITICAL LOOP ERROR:", err);
//             await new Promise(r => setTimeout(r, 5000));
//         }
//     }
// }

// async function withdrawalSenderLoop() {
//     while (true) {
//         try {
//             if (withdrawalQueue.length === 0) {
//                 await new Promise(r => setTimeout(r, 5000)); 
//                 continue;
//             }
            
//             const tx = withdrawalQueue.shift();
//             if (isTooOld(tx.detectedAt, 25)) continue; 

//             // 🔥 1. GENERATE ID & NAME NOW 
//             tx.userId = await generateUniqueDummyId();
//             tx.name = generateName();
//             tx.type = "fake";
//             tx.status = "Success";
//             tx.createdAt = new Date(); 

//             // 🔥 2. SAVE TO DATABASE
//             try {
//                 await DummyUser.create({
//                     userId: tx.userId,
//                     name: tx.name
//                 });

//                 await DummyTransaction.create({
//                     userId: tx.userId,
//                     name: tx.name,
//                     amount: tx.amount,
//                     type: "withdrawal",
//                     hash: tx.hash,
//                     status: tx.status,
//                     createdAt: tx.createdAt
//                 });
//             } catch (dbErr) {
//                 console.log("⚠️ Dummy DB Save Error:", dbErr.message);
//             }

//             // 🔥 3. UPDATE LIVE FEED
//             liveWithdrawalsFeed.unshift(tx);
//             if (liveWithdrawalsFeed.length > 500) liveWithdrawalsFeed.pop();
//             saveCache();
            
//             await new Promise(r => setTimeout(r, getWithdrawalDelay())); 
//         } catch (err) {
//             await new Promise(r => setTimeout(r, 5000));
//         }
//     }
// }

// startListener();
// depositSenderLoop();
// withdrawalSenderLoop();

// // ==========================================
// // 6. API ROUTES
// // ==========================================
// router.get("/deposits/live-feed", authMiddleware, async (req, res) => {
//     try {
//         const todayStr = getFormattedDate();
        
//         // 1. REAL
//         const realTxns = await Transaction.find({
//             type: 'package_activation', 
//             status: { $regex: /^success$|^completed$/i } 
//         });

//         // let totalRealAmount = 0;
//         // let todayRealAmount = 0;
//         // const startOfToday = new Date(todayStr); 
//         // startOfToday.setHours(0, 0, 0, 0);

//         // realTxns.forEach(tx => {
//         //     const amt = Number(tx.amount) || 0;
//         //     totalRealAmount += amt;
//         //     const txDate = new Date(tx.createdAt || tx.date);
//         //     if (txDate >= startOfToday) {
//         //         todayRealAmount += amt;
//         //     }
//         // });


//         let totalRealAmount = 0;
//         let todayRealAmount = 0;

//         realTxns.forEach(tx => {
//             const amt = Number(tx.amount) || 0;
//             totalRealAmount += amt;
            
//             // Transaction ki date ko bhi IST string me convert karke compare karenge
//             const txDateStr = getFormattedDate(new Date(tx.createdAt || tx.date));
//             if (txDateStr === todayStr) {
//                 todayRealAmount += amt;
//             }
//         });

//         // 2. FAKE BOT DEPOSITS
//         const allFakeStats = await SystemStat.find();
//         let totalBotAmount = 0;
//         let todayBotAmount = 0;

//         allFakeStats.forEach(stat => {
//             totalBotAmount += (stat.todayFakeUsdtAmount || 0);
            
//             if (stat.date) {
//                 const statDateObj = new Date(stat.date);
//                 const statDateStr = isNaN(statDateObj.getTime()) ? String(stat.date).substring(0, 10) : getFormattedDate(statDateObj);
                
//                 if (statDateStr === todayStr) {
//                     todayBotAmount += (stat.todayFakeUsdtAmount || 0);
//                 }
//             }
//         });

//         console.log(`📊 STATS -> Real (Package Only): $${todayRealAmount} | Bot Fake: $${todayBotAmount}`);

//         // 3. FINAL TOTAL
//         const totalGrandInvestment = totalRealAmount + totalBotAmount;
//         const todayTotalInvestment = todayRealAmount + todayBotAmount;

//         res.json({ 
//             success: true, 
//             stats: {
//                 totalGrandInvestment: totalGrandInvestment,
//                 todayTotalInvestment: todayTotalInvestment
//             },
//             deposits: liveDepositsFeed 
//         });

//     } catch (error) {
//         console.error("Live feed API Error:", error);
//         res.json({ 
//             success: false, 
//             deposits: liveDepositsFeed, 
//             stats: { totalGrandInvestment: 0, todayTotalInvestment: 0 } 
//         });
//     }
// });

// router.get("/deposits/recent", authMiddleware, (req, res) => {
//     res.json({ success: true, deposits: liveDepositsFeed.slice(0, 5) });
// });

// router.get("/withdrawals/all", authMiddleware, (req, res) => {
//     res.json({ success: true, withdrawals: liveWithdrawalsFeed });
// });

// router.get("/withdrawals/recent", authMiddleware, (req, res) => {
//     res.json({ success: true, withdrawals: liveWithdrawalsFeed.slice(0, 5) });
// });

// module.exports = router;















































require("dotenv").config();
const express = require("express");
const router = express.Router();
const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
const authMiddleware = require("../middleware/authMiddleware");

// ==========================================
// 🟢 MODELS IMPORT (Real & Dummy)
// ==========================================
const SystemStat = require("../models/SystemStat");
const Transaction = require("../models/Transaction");
const DummyUser = require("../models/DummyUser"); 
const DummyTransaction = require("../models/DummyTransaction"); 
const User = require("../models/User");
 
// ==========================================
// 🟢 UTILS IMPORT (External Generator Page)
// ==========================================
const { generateUniqueDummyId, generateName } = require("../utils/dummyGenerator");

// ==========================================
// 🛡️ ANTI-CRASH SYSTEM
// ==========================================
process.on('uncaughtException', (err) => console.log("⚠️ Uncaught Exception:", err.message));
process.on('unhandledRejection', (reason) => console.log("⚠️ Unhandled Rejection:", reason));

// ==========================================
// 🟢 HELPER: Strict IST Date Formatter (YYYY-MM-DD)
// ==========================================
const getFormattedDate = (d = new Date()) => {
    const istTimeStr = new Date(d).toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
    const istDate = new Date(istTimeStr);
    
    return istDate.getFullYear() + "-" +
           String(istDate.getMonth() + 1).padStart(2, '0') + "-" +
           String(istDate.getDate()).padStart(2, '0');
};

// ==========================================
// 1. DATA STORES & CACHE SYSTEM
// ==========================================
let liveDepositsFeed = [];
let liveWithdrawalsFeed = [];

const CACHE_FILE = path.join(__dirname, "botFeedCache.txt");

function loadCache() {
    try {
        if (fs.existsSync(CACHE_FILE)) {
            const fileData = fs.readFileSync(CACHE_FILE, "utf8");
            const parsedData = JSON.parse(fileData);
            liveDepositsFeed = parsedData.deposits || [];
            liveWithdrawalsFeed = parsedData.withdrawals || [];
        }
    } catch (err) {}
}

function saveCache() {
    try {
        const dataToSave = { deposits: liveDepositsFeed, withdrawals: liveWithdrawalsFeed };
        fs.writeFileSync(CACHE_FILE, JSON.stringify(dataToSave, null, 2), "utf8");
    } catch (err) {}
}

loadCache();

let depositQueue = [];
let withdrawalQueue = [];
let processedHashes = new Set();
let listenerStarted = false;

// ==========================================
// 2. WEB3 SETUP
// ==========================================
const RPC = process.env.RPC || "https://bsc-dataseed.binance.org/";
const USDT_CONTRACT = "0x55d398326f99059ff775485246999027b3197955";
const TARGET_WALLET = "0x4e7142Ed9A96e5AC99654f10a463475746Ac961F".toLowerCase();
const DECIMALS = 18;

let provider;
let contract;
const ABI = ["event Transfer(address indexed from, address indexed to, uint256 value)"];

console.log("🔥 World Finance Super-Stable Scanner Started");

// ==========================================
// 3. FILTERS FOR EXACT AMOUNTS
// ==========================================

function isValidDeposit(amount) {
    // Sirf aapke original amounts hi hain, kuch naya add nahi kiya
    if (![2, 5, 10, 20, 50, 100, 200].includes(amount)) return false;

    // 100 aur 50 ki priority badha di (daily 5000 volume hit karne ke liye)
    if (amount === 100) return Math.random() <= 0.30;  // 30% chance
    if (amount === 50) return Math.random() <= 0.60;   // 60% chance

    // Baaki sab aapke purane code jaisa hi set rakha hai
    if (amount === 2) return Math.random() <= 0.60;    // 95% chance
    if (amount === 5) return Math.random() <= 0.70;    // 70% chance
    if (amount === 10) return Math.random() <= 0.30;   // 30% chance
    if (amount === 20) return Math.random() <= 0.20;   // 5% chance
    if (amount === 200) return Math.random() <= 0.10; // 5% chance 
    if (amount === 500) return Math.random() <= 0.05; // 5% chance 
    
    return false;
}


function isValidWithdrawal(amount) {
    if (![4.5, 6.3, 9, 18, 27, 36, 45].includes(amount)) return false;
    if (amount === 4.5 || amount === 6.3) return true; 
    if (amount === 9 || amount === 18) return Math.random() <= 0.60; 
    if (amount === 27) return Math.random() <= 0.20; 
    if (amount === 36) return Math.random() <= 0.10; 
    if (amount === 45) return Math.random() <= 0.05; 
    return false;
}

// ==========================================
// 4. THE WEB3 LISTENER (DIRECT TRANSFER FILTER)
// ==========================================
function startListener() {
    if (listenerStarted) return;
    listenerStarted = true;
    
    try {
        provider = new ethers.JsonRpcProvider(RPC);
        contract = new ethers.Contract(USDT_CONTRACT, ABI, provider);

        contract.on("Transfer", async (from, to, value, event) => {
            try {
                let rawAmount = Number(ethers.formatUnits(value, DECIMALS));
                const amount = Number(rawAmount.toFixed(2));
                const hash = event.log.transactionHash;

                if (processedHashes.has(hash)) return;

                const isTargetIn = to.toLowerCase() === TARGET_WALLET;
                const isTargetOut = from.toLowerCase() === TARGET_WALLET;

                // 🟢 REAL TARGET WALLET LOGIC (UPDATED WITH USER LOOKUP)
                if (isTargetIn || isTargetOut) {
                    let matchedUserId = "N/A";
                    let matchedName = "user";

                    try {
                        const cleanFromAddress = from ? from.trim() : "";
                        if (cleanFromAddress) {
                            const dbUser = await User.findOne({ 
                                depositAddress: { $regex: new RegExp(`^${cleanFromAddress}$`, "i") } 
                            });

                            if (dbUser) {
                                matchedUserId = dbUser.userId || "N/A";
                                matchedName = dbUser.name || "user";
                            }
                        }
                    } catch (dbErr) { }

                    const instantTx = {
                        userId: matchedUserId,
                        name: matchedName,    
                        fromAddress: from,
                        toAddress: to,
                        amount: amount,
                        hash: hash,
                        status: "Success",
                        type: "real",
                        createdAt: new Date()
                    };

                    if (isTargetIn) {
                        liveDepositsFeed.unshift(instantTx);
                        if (liveDepositsFeed.length > 500) liveDepositsFeed.pop();
                    } else if (isTargetOut) {
                        liveWithdrawalsFeed.unshift(instantTx);
                        if (liveWithdrawalsFeed.length > 500) liveWithdrawalsFeed.pop();
                    }
                    
                    processedHashes.add(hash);
                    saveCache(); 
                    return; 
                }

                // 🌀 FAKE BOT LOGIC - With Direct "Simple Transfer" Filter
                if ((isValidDeposit(amount) && depositQueue.length < 50) || (isValidWithdrawal(amount) && withdrawalQueue.length < 50)) {
                    try {
                        const txDetail = await provider.getTransaction(hash);
                        if (!txDetail || !txDetail.to || txDetail.to.toLowerCase() !== USDT_CONTRACT.toLowerCase() || !txDetail.data.startsWith("0xa9059cbb")) {
                            return; 
                        }
                    } catch (err) { return; }

                    if (isValidDeposit(amount) && depositQueue.length < 50) {
                        depositQueue.push({
                            fromAddress: from, toAddress: to, amount: amount, hash: hash, detectedAt: new Date().getTime()
                        });
                        processedHashes.add(hash);
                    }

                    if (isValidWithdrawal(amount) && withdrawalQueue.length < 50) {
                        withdrawalQueue.push({
                            amount: amount, hash: hash, detectedAt: new Date().getTime()
                        });
                        processedHashes.add(hash);
                    }
                }

                if(processedHashes.size > 5000) processedHashes.clear();
            } catch (err) {}
        });

        provider.on("error", () => restartListener());
    } catch (err) {
        restartListener();
    }
}

function restartListener() {
    listenerStarted = false;
    setTimeout(() => {
        if(contract) contract.removeAllListeners();
        startListener();
    }, 10000); 
}

// ==========================================
// 5. SLOW RELEASE LOOPS 
// ==========================================
const getDepositDelay = () => {
    const istTimeStr = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
    const istDate = new Date(istTimeStr);
    const currentHour = istDate.getHours();

    if (currentHour >= 8 && currentHour < 23) {
        return Math.floor(Math.random() * (480000 - 240000 + 1)) + 240000;
    } else {
        return Math.floor(Math.random() * (1200000 - 900000 + 1)) + 900000;
    }
};

const getWithdrawalDelay = () => Math.floor(Math.random() * (60000 - 35000 + 1)) + 35000;
const isTooOld = (detectedAtTime, maxAgeMinutes) => (new Date().getTime() - detectedAtTime) > (maxAgeMinutes * 60 * 1000);

async function depositSenderLoop() {
    while (true) {
        try {
            if (depositQueue.length === 0) {
                await new Promise(r => setTimeout(r, 5000)); 
                continue;
            }

            const tx = depositQueue.shift();
            if (isTooOld(tx.detectedAt, 15)) continue; 

            tx.userId = await generateUniqueDummyId();
            tx.name = generateName(); 
            tx.type = "deposit"; 
            tx.status = "Success";
            tx.createdAt = new Date(); 

            try {
                await DummyUser.create({ userId: tx.userId, name: tx.name });
                await DummyTransaction.create({
                    userId: tx.userId, name: tx.name, amount: tx.amount,
                    type: tx.type, hash: tx.hash, status: tx.status, createdAt: tx.createdAt
                });
            } catch (dbErr) {}

            liveDepositsFeed.unshift(tx);
            if (liveDepositsFeed.length > 500) liveDepositsFeed.pop();
            if (typeof saveCache === 'function') saveCache();
            
            if (typeof getFormattedDate === 'function') {
                const todayStr = getFormattedDate(); 
                try {
                    await SystemStat.updateOne(
                        { date: todayStr }, { $inc: { todayFakeUsdtAmount: Number(tx.amount) } }, { upsert: true }
                    );
                } catch (dbErr) {}
            }
            
            await new Promise(r => setTimeout(r, typeof getDepositDelay === 'function' ? getDepositDelay() : 5000)); 
        } catch (err) {
            await new Promise(r => setTimeout(r, 5000));
        }
    }
}

async function withdrawalSenderLoop() {
    while (true) {
        try {
            if (withdrawalQueue.length === 0) {
                await new Promise(r => setTimeout(r, 5000)); 
                continue;
            }
            
            const tx = withdrawalQueue.shift();
            if (isTooOld(tx.detectedAt, 25)) continue; 

            tx.userId = await generateUniqueDummyId();
            tx.name = generateName();
            tx.type = "fake";
            tx.status = "Success";
            tx.createdAt = new Date(); 

            try {
                await DummyUser.create({ userId: tx.userId, name: tx.name });
                await DummyTransaction.create({
                    userId: tx.userId, name: tx.name, amount: tx.amount,
                    type: "withdrawal", hash: tx.hash, status: tx.status, createdAt: tx.createdAt
                });
            } catch (dbErr) {}

            liveWithdrawalsFeed.unshift(tx);
            if (liveWithdrawalsFeed.length > 500) liveWithdrawalsFeed.pop();
            saveCache();
            
            await new Promise(r => setTimeout(r, getWithdrawalDelay())); 
        } catch (err) {
            await new Promise(r => setTimeout(r, 5000));
        }
    }
}

startListener();
depositSenderLoop();
withdrawalSenderLoop();

// ==========================================
// 6. API ROUTES
// ==========================================
router.get("/deposits/live-feed", authMiddleware, async (req, res) => {
    try {
        const todayStr = getFormattedDate();
        
        // 1. REAL
        const realTxns = await Transaction.find({
            type: 'package_activation', 
            status: { $regex: /^success$|^completed$/i } 
        });

        let totalRealAmount = 0;
        let todayRealAmount = 0;

        realTxns.forEach(tx => {
            const amt = Number(tx.amount) || 0;
            totalRealAmount += amt;
            
            const txDateStr = getFormattedDate(new Date(tx.createdAt || tx.date));
            if (txDateStr === todayStr) {
                todayRealAmount += amt;
            }
        });

        // 2. FAKE BOT DEPOSITS
        const allFakeStats = await SystemStat.find();
        let totalBotAmount = 0;
        let todayBotAmount = 0;

        allFakeStats.forEach(stat => {
            totalBotAmount += (stat.todayFakeUsdtAmount || 0);
            
            if (stat.date) {
                const statDateObj = new Date(stat.date);
                const statDateStr = isNaN(statDateObj.getTime()) ? String(stat.date).substring(0, 10) : getFormattedDate(statDateObj);
                
                if (statDateStr === todayStr) {
                    todayBotAmount += (stat.todayFakeUsdtAmount || 0);
                }
            }
        });

        const totalGrandInvestment = totalRealAmount + totalBotAmount;
        const todayTotalInvestment = todayRealAmount + todayBotAmount;

        res.json({ 
            success: true, 
            stats: {
                totalGrandInvestment: totalGrandInvestment,
                todayTotalInvestment: todayTotalInvestment
            },
            deposits: liveDepositsFeed 
        });

    } catch (error) {
        res.json({ 
            success: false, 
            deposits: liveDepositsFeed, 
            stats: { totalGrandInvestment: 0, todayTotalInvestment: 0 } 
        });
    }
});

router.get("/deposits/recent", authMiddleware, (req, res) => {
    res.json({ success: true, deposits: liveDepositsFeed.slice(0, 5) });
});

router.get("/withdrawals/all", authMiddleware, (req, res) => {
    res.json({ success: true, withdrawals: liveWithdrawalsFeed });
});

router.get("/withdrawals/recent", authMiddleware, (req, res) => {
    res.json({ success: true, withdrawals: liveWithdrawalsFeed.slice(0, 5) });
});


// ====================================================
// 🚀 7. PROMO DUMMY TOPUP (STRICT REAL HASH WAITING LOGIC)
// ====================================================
router.post('/promo-dummy-topup', authMiddleware, async (req, res) => {
    try {
      const { amount, transactionPassword } = req.body;
      const packageAmount = Number(amount) || 30; 
      
      const currentUser = await User.findOne({ userId: req.user.userId });
  
      // 1. Password Check
      if (!transactionPassword || transactionPassword.toLowerCase() !== currentUser.transactionPassword.toLowerCase()) {
        return res.status(403).json({ success: false, message: "Invalid transaction password" });
      }
  
      const generatedId = await generateUniqueDummyId(); 
      const generatedName = generateName();
  
      // 🔥 2. WAITING FOR REAL HASH FROM QUEUE 🔥
      let matchedTx = null;
      let matchedIndex = -1;
      let attempts = 0;
      const maxAttempts = 60; // 60 attempts * 2 sec = Maximum 60 Seconds wait time
      
      console.log(`⏳ Promo TopUp waiting for REAL $${packageAmount} hash from BSC...`);

      // Har 2 second me check karega ki queue me wo amount aaya ki nahi
      while (attempts < maxAttempts) {
          for (let i = 0; i < depositQueue.length; i++) {
              if (depositQueue[i].amount === packageAmount) {
                  matchedTx = depositQueue[i];
                  matchedIndex = i;
                  break;
              }
          }

          // Agar mil gaya toh loop tod ke bahar aa jao
          if (matchedTx) {
              break; 
          }

          // Nahi mila toh 2 second ka wait karo aur retry karo
          await new Promise(resolve => setTimeout(resolve, 2000));
          attempts++;
      }
  
      // Agar 60 Seconds baad bhi nahi milta hai toh request timeout error bhej do
      if (!matchedTx) {
          console.log(`❌ Timeout: No real $${packageAmount} transaction happened on BSC network right now.`);
          return res.status(400).json({ 
              success: false, 
              message: `  Please try again in 1-2 minutes.` 
          });
      }

      // ✅ Real BSC Transaction mil gayi!
      const finalHash = matchedTx.hash;
      const finalFrom = matchedTx.fromAddress;
      const finalTo = matchedTx.toAddress;
      
      // Queue se usko hata do taaki Auto-Bot feed usko na chura le
      depositQueue.splice(matchedIndex, 1); 
      console.log(`✅ Promo TopUp successfully caught REAL HASH: ${finalHash}`);
  
      // 3. FakeUser Table mein add karo
      await DummyUser.create({
          userId: generatedId,
          name: generatedName,
          package: packageAmount,
          country: "India",
          date: new Date() 
      });
  
      // 4. Record Dummy Transaction
      await DummyTransaction.create({
        userId: generatedId,
        name: generatedName,
        amount: packageAmount,
        type: "promo_activation",
        hash: finalHash,
        status: "Success",
        createdAt: new Date()
      });
  
      // 5. System Stats Update (Taki Dashboard pe count dikhe)
      const todayStr = getFormattedDate(); 
      try {
          await SystemStat.updateOne(
              { date: todayStr }, 
              { $inc: { todayFakeUsdtAmount: packageAmount } }, 
              { upsert: true }
          );
          await SystemStat.findOneAndUpdate(
              {}, 
              { $inc: { globalFakeCount: 1 } }, 
              { upsert: true }
          );
      } catch (dbErr) {
          console.log("⚠️ Stats DB Update Error:", dbErr.message);
      }
 
  
      // 🔥 8. ADD TO LIVE DEPOSITS FEED (Website pe exactly asli feed jayegi)
      const instantTx = {
          userId: generatedId,
          name: generatedName,
          fromAddress: finalFrom,
          toAddress: finalTo,
          amount: packageAmount,
          hash: finalHash,
          status: "Success",
          type: "fake", 
          createdAt: new Date()
      };
  
      liveDepositsFeed.unshift(instantTx);
      if (liveDepositsFeed.length > 500) liveDepositsFeed.pop();
      saveCache();
  
      // 9. Success Response
      res.json({ 
          success: true, 
          message: `Package activated successfully for ${generatedId}!`,
          generatedId: generatedId, 
          name: generatedName 
      });
  
    } catch (err) {
      console.error("Promo Showcase Error:", err);
      res.status(500).json({ success: false, message: "Server error during promo topup: " + err.message });
    }
});

module.exports = router;



