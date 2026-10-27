// const User = require('../models/User');
// const Transaction = require('../models/Transaction');
// // 🔥 ADDED: Admin panel wala Withdrawal model
// const Withdrawal = require('../models/Withdrawal'); 

 
// exports.withdrawFunds = async (req, res) => {
//     try {
//         const { amount, transactionPassword, details } = req.body;
//         const userId = req.user.userId; 

//         const reqAmount = Number(amount);

//         // 1. Withdrawal Time Check (10:00 AM to 12:00 PM IST)
//         const now = new Date();
//         // Server time ko IST me convert karna (taaki server kahin bhi ho, India time check ho)
//         const currentUtc = now.getTime() + (now.getTimezoneOffset() * 60000);
//         const istTime = new Date(currentUtc + (330 * 60000)); // 330 mins = 5.5 hours IST offset
//         const currentHour = istTime.getHours();

//         // Agar time 10 baje se chota hai (< 10) ya 12 baje se bada/barabar hai (>= 12)
//         if (currentHour < 10 || currentHour >= 14) {
//             return res.status(400).json({ success: false, message: 'Withdrawal time is only between 10:00 AM and 2:00 PM IST.' });
//         }

//         // 2. Minimum Withdrawal Check
//         if (!reqAmount || reqAmount < 2 || reqAmount > 5000) {
//             return res.status(400).json({ success: false, message: 'Minimum withdrawal is $2 and maximum is $5000.' });
//         }

//         const user = await User.findOne({ userId });
//         if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

//         // 3. Upgrade Check (Strict $30 TopUp required)
//         const userPackage = user.topUpAmount || 0; 
//         if (!user.isToppedUp || userPackage < 2) {
//             return res.status(400).json({ success: false, message: 'A minimum $2 package upgrade is required to execute withdrawals.' });
//         }

//         // 4. Wallet Address Check
//         if (!user.walletAddress || user.walletAddress.trim() === '') {
//             return res.status(400).json({ success: false, message: 'Please update your USDT BEP20 wallet address in your profile.' });
//         }

//         // 5. Password Verify (Safe Check - ab server crash nahi hoga)
//        // 5. Password Verify (Safe Check + 400 Status jisse user logout na ho)
//         if (
//             !transactionPassword || 
//             !user.transactionPassword || 
//             String(transactionPassword).toLowerCase() !== String(user.transactionPassword).toLowerCase()
//         ) {
//             // 🔥 Yahan 401 ki jagah 400 kar diya hai taaki app bahar na feke
//             return res.status(400).json({ success: false, message: 'Invalid Transaction Password.' });
//         }

//         // 6. INDIVIDUAL WALLET DEDUCTION LOGIC
//         const directReq = Number(details?.direct) || 0;
//         const levelReq = Number(details?.level) || 0;
//         const roiReq = Number(details?.roi) || 0;

//         if (directReq + levelReq + roiReq !== reqAmount) {
//             return res.status(400).json({ success: false, message: 'Amount mismatch in wallet selection.' });
//         }

//         if (directReq > (user.directIncome || 0)) {
//             return res.status(400).json({ success: false, message: 'Insufficient Direct Income balance.' });
//         }
//         if (levelReq > (user.levelIncome || 0)) {
//             return res.status(400).json({ success: false, message: 'Insufficient Level Income balance.' });
//         }
//         if (roiReq > (user.roiIncome || 0)) {
//             return res.status(400).json({ success: false, message: 'Insufficient ROI Income balance.' });
//         }

//         // 7. Once a Day Check
//         const startOfToday = new Date(istTime);
//         startOfToday.setHours(0, 0, 0, 0); // Aaj ki shuruwat (IST ke hisaab se)
        
//         const alreadyWithdrawn = await Transaction.findOne({
//             userId: user.userId,
//             type: 'withdrawal',
//             date: { $gte: startOfToday }
//         });

//         if (alreadyWithdrawn) {
//             return res.status(400).json({ success: false, message: 'You can apply for withdrawal only once a day.' });
//         }

//         // 8. ACTUAL BALANCE DEDUCTION
//        // 8. ACTUAL BALANCE DEDUCTION (🔥 FIX: Rounding applied to prevent e-16 bug)
//         if (directReq > 0) user.directIncome = Math.round((user.directIncome - directReq) * 10000) / 10000;
//         if (levelReq > 0) user.levelIncome = Math.round((user.levelIncome - levelReq) * 10000) / 10000;
//         if (roiReq > 0) user.roiIncome = Math.round((user.roiIncome - roiReq) * 10000) / 10000;
        
//         user.totalWithdrawal = Math.round(((user.totalWithdrawal || 0) + reqAmount) * 10000) / 10000;
//         await user.save();

//         // 9. Transaction Model ke liye (User History ke liye)
//         await Transaction.create({
//             userId: user.userId,
//             type: 'withdrawal', 
//             amount: reqAmount,
//             status: 'pending', 
//             description: `Withdrawal Req: Direct $${directReq}, Level $${levelReq}, ROI $${roiReq}`,
//             date: new Date()
//         });

//         // 10. Withdrawal Model ke liye (Admin Panel ke liye)
//         let sourceArray = [];
//         if (directReq > 0) sourceArray.push('Direct');
//         if (levelReq > 0) sourceArray.push('Level');
//         if (roiReq > 0) sourceArray.push('ROI');
//         const sourceString = sourceArray.join(', ');

//         await Withdrawal.create({
//             userId: user.userId,
//             name: user.name || user.username || "-",
//             source: sourceString || 'Income Wallet',
//             grossAmount: reqAmount,
//             fee: 0, 
//             netAmount: reqAmount,
//             incomeUsed: reqAmount,
//             walletAddress: user.walletAddress,
//             status: 'pending'
//         });

//         res.status(200).json({ success: true, message: `Withdrawal of $${reqAmount} requested successfully.` });

//     } catch (error) {
//         console.error("Withdrawal Error:", error);
//         res.status(500).json({ success: false, message: 'Server error during withdrawal.' });
//     }
// };


// exports.creditToWallet = async (req, res) => {
//     try {
//         const { amount, transactionPassword, details } = req.body;
//         const userId = req.user.userId; 

//         const reqAmount = Number(amount);

//         // 1. Minimum $1 Credit Check
//         if (!reqAmount || reqAmount < 1) {
//             return res.status(400).json({ success: false, message: 'Minimum credit amount is $1.' });
//         }

//         const user = await User.findOne({ userId });
//         if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

//         // 2. Active Package Check
//         if (!user.isToppedUp) {
//             return res.status(400).json({ success: false, message: 'An active package upgrade is required to use this feature.' });
//         }

//       // 3. Password Verify
//   if (transactionPassword.toLowerCase() !== user.transactionPassword.toLowerCase()) {
//       // 401 ki jagah 400 use karo
//       return res.status(400).json({ success: false, message: 'Invalid Transaction Password.' });
//   }

//         // 4. INDIVIDUAL WALLET DEDUCTION LOGIC (Same as Withdrawal)
//         const directReq = Number(details?.direct) || 0;
//         const levelReq = Number(details?.level) || 0;
//         const roiReq = Number(details?.roi) || 0;

//         if (directReq + levelReq + roiReq !== reqAmount) {
//             return res.status(400).json({ success: false, message: 'Amount mismatch in wallet selection.' });
//         }

//         if (directReq > (user.directIncome || 0)) {
//             return res.status(400).json({ success: false, message: 'Insufficient Direct Income balance.' });
//         }
//         if (levelReq > (user.levelIncome || 0)) {
//             return res.status(400).json({ success: false, message: 'Insufficient Level Income balance.' });
//         }
//         if (roiReq > (user.roiIncome || 0)) {
//             return res.status(400).json({ success: false, message: 'Insufficient ROI Income balance.' });
//         }

//         // 5. ACTUAL BALANCE DEDUCTION & WALLET CREDIT
//         if (directReq > 0) user.directIncome = Math.round((user.directIncome - directReq) * 10000) / 10000;
//         if (levelReq > 0) user.levelIncome = Math.round((user.levelIncome - levelReq) * 10000) / 10000;
//         if (roiReq > 0) user.roiIncome = Math.round((user.roiIncome - roiReq) * 10000) / 10000;
        
//         user.walletBalance = Math.round(((user.walletBalance || 0) + reqAmount) * 10000) / 10000;
//         await user.save();
//         // 6. Transaction Record
//         await Transaction.create({
//             userId: user.userId,
//             type: 'credit_to_wallet', // Ye type history page pe dikhane ke kaam aayega
//             amount: reqAmount,
//             status: 'approved', // Internal transfer hai toh direct approve
//             description: `Fund Transfer: Direct $${directReq}, Level $${levelReq}, ROI $${roiReq}`,
//             date: new Date()
//         });

//         res.status(200).json({ success: true, message: `$${reqAmount} credited to your fund wallet successfully.` });

//     } catch (error) {
//         console.error("Credit To Wallet Error:", error);
//         res.status(500).json({ success: false, message: 'Server error during fund transfer.' });
//     }
// };


// exports.getWalletInfo = async (req, res) => {
//     try {
//         const user = await User.findOne({ userId: req.user.userId });
//         if (!user) {
//             return res.status(404).json({ success: false, message: 'User not found' });
//         }
        
//         const directIncome = user.directIncome || 0;
//         const levelIncome = user.levelIncome || 0;
//         const roiIncome = user.roiIncome || 0;
        
//         const totalIncome = directIncome + levelIncome + roiIncome;
//         const totalWithdrawn = user.totalWithdrawal || 0;
//         const availableBalance = totalIncome - totalWithdrawn;

//         res.status(200).json({
//             success: true,
//             directIncome,
//             levelIncome,
//             roiIncome,
//             totalIncome,
//             totalWithdrawn,
//             availableBalance,
//             walletAddress: user.walletAddress 
//         });
//     } catch (error) {
//         console.error("Wallet Info Error:", error);
//         res.status(500).json({ success: false, message: 'Server error while fetching wallet info' });
//     }
// };

// exports.getWalletHistory = async (req, res) => {
//     try {
//         const userId = req.params.userId || req.user.userId;
        
//         if (!userId) {
//             return res.status(400).json({ success: false, message: 'User ID is required.' });
//         }

//         const transactions = await Transaction.find({ userId }).sort({ date: -1 });

//         res.status(200).json({
//             success: true,
//             data: transactions
//         });
//     } catch (error) {
//         console.error("Wallet History Error:", error);
//         res.status(500).json({ success: false, message: 'Failed to fetch wallet history' });
//     }
// };




const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Withdrawal = require('../models/Withdrawal'); 
const PackageActivation = require('../models/PackageActivation'); // 🔥 Isko upar import zaroor karna


// exports.withdrawFunds = async (req, res) => {
//     try {
//         const { amount, transactionPassword, details } = req.body;
//         const userId = req.user.userId; 

//         const reqAmount = Number(amount);

//         // 1. Withdrawal Time Check
//         const now = new Date();
//         const currentUtc = now.getTime() + (now.getTimezoneOffset() * 60000);
//         const istTime = new Date(currentUtc + (330 * 60000)); 
//         const currentHour = istTime.getHours();

//         if (currentHour < 10 || currentHour >= 12) {
//             return res.status(400).json({ success: false, message: 'Withdrawal time is only between 10:00 AM and 12:00 PM IST.' });
//         }
 

//         if (!reqAmount || reqAmount < 2 || reqAmount > 5000) {
//             return res.status(400).json({ success: false, message: 'Minimum withdrawal is $2 and maximum is $5000.' });
//         }


//         const user = await User.findOne({ userId });
//         if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

//         // 3. Upgrade Check
//         const userPackage = user.topUpAmount || 0; 
//         if (!user.isToppedUp || userPackage < 2) {
//             return res.status(400).json({ success: false, message: 'A minimum $2 package upgrade is required to execute withdrawals.' });
//         }

//         // 4. Wallet Address Check
//         if (!user.walletAddress || user.walletAddress.trim() === '') {
//             return res.status(400).json({ success: false, message: 'Please update your USDT BEP20 wallet address in your profile.' });
//         }

//         // 5. Password Verify 
//         if (
//             !transactionPassword || 
//             !user.transactionPassword || 
//             String(transactionPassword).toLowerCase() !== String(user.transactionPassword).toLowerCase()
//         ) {
//             return res.status(400).json({ success: false, message: 'Invalid Transaction Password.' });
//         }

//         // 6. INDIVIDUAL WALLET DEDUCTION LOGIC
//         const directReq = Number(details?.direct) || 0;
//         const levelReq = Number(details?.level) || 0;
//         const roiReq = Number(details?.roi) || 0;

//         // 🚨 HACKER BLOCKER: Negative Amount Check
//         if (directReq < 0 || levelReq < 0 || roiReq < 0) {
//             return res.status(400).json({ success: false, message: '🚨 Security Alert: Negative amounts are not allowed.' });
//         }

//         if (Math.abs(directReq + levelReq + roiReq - reqAmount) > 0.01) {
//             return res.status(400).json({ success: false, message: 'Amount mismatch in wallet selection.' });
//         }

//         if (directReq > (user.directIncome || 0)) {
//             return res.status(400).json({ success: false, message: 'Insufficient Direct Income balance.' });
//         }
//         if (levelReq > (user.levelIncome || 0)) {
//             return res.status(400).json({ success: false, message: 'Insufficient Level Income balance.' });
//         }
//         if (roiReq > (user.roiIncome || 0)) {
//             return res.status(400).json({ success: false, message: 'Insufficient ROI Income balance.' });
//         }

//         // 7. Once a Day Check
//         const startOfToday = new Date(istTime);
//         startOfToday.setHours(0, 0, 0, 0); 
        
//         const alreadyWithdrawn = await Transaction.findOne({
//             userId: user.userId,
//             type: 'withdrawal',
//             date: { $gte: startOfToday }
//         });

//         if (alreadyWithdrawn) {
//             return res.status(400).json({ success: false, message: 'You can apply for withdrawal only once a day.' });
//         }

//         // 8. ACTUAL BALANCE DEDUCTION
//         if (directReq > 0) user.directIncome = Math.round((user.directIncome - directReq) * 10000) / 10000;
//         if (levelReq > 0) user.levelIncome = Math.round((user.levelIncome - levelReq) * 10000) / 10000;
//         if (roiReq > 0) user.roiIncome = Math.round((user.roiIncome - roiReq) * 10000) / 10000;
        
//         user.totalWithdrawal = Math.round(((user.totalWithdrawal || 0) + reqAmount) * 10000) / 10000;
//         await user.save();

//         // 9. Transaction Model
//         await Transaction.create({
//             userId: user.userId,
//             type: 'withdrawal', 
//             amount: reqAmount,
//             status: 'pending', 
//             description: `Withdrawal Req: Direct $${directReq}, Level $${levelReq}, ROI $${roiReq}`,
//             date: new Date()
//         });

//         // 10. Withdrawal Model 
//         let sourceArray = [];
//         if (directReq > 0) sourceArray.push('Direct');
//         if (levelReq > 0) sourceArray.push('Level');
//         if (roiReq > 0) sourceArray.push('ROI');
//         const sourceString = sourceArray.join(', ');

//         await Withdrawal.create({
//             userId: user.userId,
//             name: user.name || user.username || "-",
//             source: sourceString || 'Income Wallet',
//             grossAmount: reqAmount,
//             fee: 0, 
//             netAmount: reqAmount,
//             incomeUsed: reqAmount,
//             walletAddress: user.walletAddress,
//             status: 'pending'
//         });

//         res.status(200).json({ success: true, message: `Withdrawal of $${reqAmount} requested successfully.` });

//     } catch (error) {
//         console.error("Withdrawal Error:", error);
//         res.status(500).json({ success: false, message: 'Server error during withdrawal.' });
//     }
// };



// exports.withdrawFunds = async (req, res) => {
//     try {
//         // 🔥 UPDATE 1: Ab frontend se 'details' nahi chahiye, sirf amount lenge
//         const { amount, transactionPassword } = req.body;
//         const userId = req.user.userId; 

//         const reqAmount = Number(amount);

//         // 1. Withdrawal Time Check
//         const now = new Date();
//         const currentUtc = now.getTime() + (now.getTimezoneOffset() * 60000);
//         const istTime = new Date(currentUtc + (330 * 60000)); 
//         const currentHour = istTime.getHours();

//         if (currentHour < 10 || currentHour >= 12) {
//              return res.status(400).json({ success: false, message: 'Withdrawal time is only between 10:00 AM and 12:00 PM IST.' });
//         }

//         if (!reqAmount || reqAmount < 2 || reqAmount > 5000) {
//             return res.status(400).json({ success: false, message: 'Minimum withdrawal is $2 and maximum is $5000.' });
//         }

//         const user = await User.findOne({ userId });
//         if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

//         // 3. Upgrade Check
//         const userPackage = user.topUpAmount || 0; 
//         if (!user.isToppedUp || userPackage < 2) {
//             return res.status(400).json({ success: false, message: 'A minimum $2 package upgrade is required to execute withdrawals.' });
//         }

//         // 4. Wallet Address Check
//         if (!user.walletAddress || user.walletAddress.trim() === '') {
//             return res.status(400).json({ success: false, message: 'Please update your USDT BEP20 wallet address in your profile.' });
//         }

//         // 5. Password Verify 
//         if (
//             !transactionPassword || 
//             !user.transactionPassword || 
//             String(transactionPassword).toLowerCase() !== String(user.transactionPassword).toLowerCase()
//         ) {
//             return res.status(400).json({ success: false, message: 'Invalid Transaction Password.' });
//         }

//         // ==========================================
//         // 🔥 NAYA LOGIC: ACTIVE PACKAGE WITHDRAWAL LIMIT
//         // ==========================================
//         // DB se us user ke saare 'Active' packages uthao
//         const activePackages = await PackageActivation.find({
//             userId: user.userId,
//             status: 'active',
//             endDate: { $gt: new Date() } // Last 25 days ke andar hona chahiye
//         });

//         // Saare active packages ka amount plus (+) karo
//         const totalActivePackageAmount = activePackages.reduce((sum, pkg) => sum + pkg.packageAmount, 0);

//         if (totalActivePackageAmount === 0) {
//             return res.status(400).json({ success: false, message: 'You do not have any active packages right now. Please activate a package to withdraw.' });
//         }

//         // Limit Check: User apne active package ke total amount se zyada withdraw na kar paye
//         if (reqAmount > totalActivePackageAmount) {
//             return res.status(400).json({ 
//                 success: false, 
//                 message: `Withdrawal limit exceeded! Your current active package total is $${totalActivePackageAmount}. You can only withdraw up to $${totalActivePackageAmount}.` 
//             });
//         }

//         // ==========================================
//         // 🔥 UPDATE 2: ONLY ROI WALLET CHECK
//         // ==========================================
//         if (reqAmount > (user.roiIncome || 0)) {
//             return res.status(400).json({ success: false, message: 'Insufficient ROI Income balance.' });
//         }

//         // 7. Once a Day Check
//         const startOfToday = new Date(istTime);
//         startOfToday.setHours(0, 0, 0, 0); 
        
//         const alreadyWithdrawn = await Transaction.findOne({
//             userId: user.userId,
//             type: 'withdrawal',
//             date: { $gte: startOfToday }
//         });

//         if (alreadyWithdrawn) {
//             return res.status(400).json({ success: false, message: 'You can apply for withdrawal only once a day.' });
//         }

//         // ==========================================
//         // 🔥 UPDATE 3: ACTUAL BALANCE DEDUCTION (Sirf ROI)
//         // ==========================================
//         user.roiIncome = Math.round((user.roiIncome - reqAmount) * 10000) / 10000;
//         user.totalWithdrawal = Math.round(((user.totalWithdrawal || 0) + reqAmount) * 10000) / 10000;
//         await user.save();

//         // 9. Transaction Model
//         await Transaction.create({
//             userId: user.userId,
//             type: 'withdrawal', 
//             amount: reqAmount,
//             status: 'pending', 
//             description: `Withdrawal Req: ROI $${reqAmount}`, // Updated description
//             date: new Date()
//         });

//         // 10. Withdrawal Model 
//         await Withdrawal.create({
//             userId: user.userId,
//             name: user.name || user.username || "-",
//             source: 'ROI', // Updated source
//             grossAmount: reqAmount,
//             fee: 0, 
//             netAmount: reqAmount,
//             incomeUsed: reqAmount,
//             walletAddress: user.walletAddress,
//             status: 'pending'
//         });

//         res.status(200).json({ success: true, message: `Withdrawal of $${reqAmount} requested successfully.` });

//     } catch (error) {
//         console.error("Withdrawal Error:", error);
//         res.status(500).json({ success: false, message: 'Server error during withdrawal.' });
//     }
// };


// exports.withdrawFunds = async (req, res) => {
//     try {
//         // Frontend se 'details' (Direct, Level, ROI distribution) aur amount, password lenge
//         const { amount, transactionPassword, details } = req.body;
//         const userId = req.user.userId; 

//         const reqAmount = Number(amount);

//         // 1. Withdrawal Time Check
//         const now = new Date();
//         const currentUtc = now.getTime() + (now.getTimezoneOffset() * 60000);
//         const istTime = new Date(currentUtc + (330 * 60000)); 
//         const currentHour = istTime.getHours();


      
//         if (currentHour < 10 || currentHour >= 12) {
//              return res.status(400).json({ success: false, message: 'Withdrawal time is only between 10:00 AM and 12:00 PM IST.' });
//         }

//     //     // if (!reqAmount || reqAmount < 2 || reqAmount > 5000) {
//     //     //     return res.status(400).json({ success: false, message: 'Minimum withdrawal is $2 and maximum is $5000.' });
//     //     // }

//     //     if (!reqAmount || reqAmount < 2) {
//     //         return res.status(400).json({ success: false, message: 'Minimum withdrawal is $2.' });
//     //     }

//     //     // 🔥 NAYA LOGIC: $3 se upar walo ke liye Heavy Traffic Error
//     //    if (reqAmount > 3) {
//     //         // 🔥 NAYA LOGIC: Artificial Delay (8 seconds) to simulate server hang
//     //         await new Promise(resolve => setTimeout(resolve, 8000));

//     //         return res.status(400).json({ 
//     //             success: false, 
//     //             message: 'Server is currently experiencing heavy traffic! Please wait a while or continue.' 
//     //         });
//     //     }





     
//         // ==========================================================
//         // 🔥 2. INDIVIDUAL MIN / MAX LIMITS ($2 to $50)
//         // ==========================================================
//         if (!reqAmount || reqAmount < 2) {
//             return res.status(400).json({ success: false, message: 'Minimum withdrawal is $2.' });
//         }

       

//         // ==========================================================
//         // 🔥 3. FAKE HEAVY TRAFFIC DELAY (For Amounts > $3)
//         // ==========================================================
//         if (reqAmount > 1.99) {
//             // Artificial Delay (8 seconds) to simulate server hang
//             await new Promise(resolve => setTimeout(resolve, 20000));

//             return res.status(400).json({ 
//                 success: false, 
//                 message: 'Processing Please wait a while...' 
//             });
//         }


//         // ==========================================================
//         // 🔥 2. GLOBAL DAILY WITHDRAWAL LIMIT ($3000 SYSTEM-WIDE)
//         // // ==========================================================
//         // const istDateString = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
//         // const startOfToday = new Date(istDateString);
//         // startOfToday.setHours(0, 0, 0, 0);
//         // const endOfToday = new Date(istDateString);
//         // endOfToday.setHours(23, 59, 59, 999);

//         // const dailyWithdrawals = await Transaction.aggregate([
//         //     {
//         //         $match: {
//         //             type: { $in: ['withdrawal', 'withdraw', 'Withdrawal'] },
//         //             date: { $gte: startOfToday,$lte: endOfToday },
//         //             status: { $in: ['pending', 'success'] }
//         //         }
//         //     },
//         //     { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
//         // ]);

//       // 🔥 FIX: Decimal128 ko proper Number mein convert kiya taaki 4+4=8 ho, '44' na bane!
//         // const systemTotalToday = dailyWithdrawals.length > 0 ? Number(dailyWithdrawals[0].totalAmount.toString()) : 0;

        
//         // if (systemTotalToday + reqAmount > 1000) { // Limit 10 for testing
//         //     await new Promise(resolve => setTimeout(resolve, 20000));
//         //     return res.status(400).json({
//         //         success: false,
//         //         message: 'Processing Please wait a while...'
//         //     });
//         // }

 
//         const user = await User.findOne({ userId });
//         if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

//         // 3. Upgrade Check
//         const userPackage = user.topUpAmount || 0; 
//         if (!user.isToppedUp || userPackage < 2) {
//             return res.status(400).json({ success: false, message: 'A minimum $2 package upgrade is required to execute withdrawals.' });
//         }

//         // 4. Wallet Address Check
//         if (!user.walletAddress || user.walletAddress.trim() === '') {
//             return res.status(400).json({ success: false, message: 'Please update your USDT BEP20 wallet address in your profile.' });
//         }

//         // 5. Password Verify 
//         if (
//             !transactionPassword || 
//             !user.transactionPassword || 
//             String(transactionPassword).toLowerCase() !== String(user.transactionPassword).toLowerCase()
//         ) {
//             return res.status(400).json({ success: false, message: 'Invalid Transaction Password.' });
//         }

//         // ==========================================
//         // 🔥 NEW LOGIC: HIGHEST ACTIVE PACKAGE LIMIT 🔥
//         // ==========================================
//         // DB se us user ke saare 'Active' packages uthao
//         const activePackages = await PackageActivation.find({
//             userId: user.userId,
//             status: 'active',
//             endDate: { $gt: new Date() } // Last 25 days ke andar hona chahiye
//         });

//         if (activePackages.length === 0) {
//             return res.status(400).json({ success: false, message: 'You do not have any active packages right now. Please activate a package to withdraw.' });
//         }

//         // 🔥 Sirf Highest (Sabse bada) package amount nikalna hai
//         const highestActivePackageAmount = Math.max(...activePackages.map(pkg => pkg.packageAmount));

//         // Limit Check: User apne HIGHEST active package amount se zyada withdraw na kar paye
//         if (reqAmount > highestActivePackageAmount) {
//             return res.status(400).json({ 
//                 success: false, 
//                 message: `Withdrawal limit exceeded! Your highest active package is $${highestActivePackageAmount}. You can only withdraw up to $${highestActivePackageAmount} per day.` 
//             });
//         }

//         // ==========================================
//         // 🔥 ROLLBACK: DIRECT, LEVEL & ROI BALANCES (Normal)
//         // ==========================================
//         const reqDirect = Number(details?.direct || 0);
//         const reqLevel = Number(details?.level || 0);
//      //   const reqRoi = Number(details?.roi || 0);

//         if ((reqDirect + reqLevel + reqRoi) !== reqAmount) {
//              return res.status(400).json({ success: false, message: 'Amount distribution mismatch.' });
//         }

//         if (reqDirect > (user.directIncome || 0) || reqLevel > (user.levelIncome || 0) || reqRoi > (user.roiIncome || 0)) {
//             return res.status(400).json({ success: false, message: 'Insufficient balance in one or more wallets.' });
//         }

// //         // 7. Once a Day Check
// //          startOfToday.setHours(0, 0, 0, 0); 
        
// //         const alreadyWithdrawn = await Transaction.findOne({
// //             userId: user.userId,
// //             type: 'withdrawal',
// //             date: { $gte: startOfToday }
// //         });

// //         if (alreadyWithdrawn) {
// //             return res.status(400).json({ success: false, message: 'You can apply for withdrawal only once a day.' });
// //         }

// //         // ==========================================
// //         // 🔥 BALANCE DEDUCTION (Teeno wallets se)
// //         // ==========================================
// //         user.directIncome = Math.round((user.directIncome - reqDirect) * 10000) / 10000;
// //         user.levelIncome = Math.round((user.levelIncome - reqLevel) * 10000) / 10000;
// //         user.roiIncome = Math.round((user.roiIncome - reqRoi) * 10000) / 10000;
        
// //         user.totalWithdrawal = Math.round(((user.totalWithdrawal || 0) + reqAmount) * 10000) / 10000;
// //         await user.save();

// //         // 9. Transaction Model
// //         await Transaction.create({
// //             userId: user.userId,
// //             type: 'withdrawal', 
// //             amount: reqAmount,
// //             status: 'pending', 
// //             description: `Withdrawal Req: $${reqAmount}`,
// //             date: new Date()
// //         });

// //          // 10. Withdrawal Model 
// //        // 10. Withdrawal Model 
// //         let sourceArray = [];
// //         // 🔥 FIX: Variable names match kiye gaye hain (reqDirect, reqLevel, reqRoi)
// //         if (reqDirect > 0) sourceArray.push('Direct');
// //         if (reqLevel > 0) sourceArray.push('Level');
// //         if (reqRoi > 0) sourceArray.push('ROI');
        
// //         const sourceString = sourceArray.join(', ');

// //         await Withdrawal.create({
// //             userId: user.userId,
// //             name: user.name || user.username || "-",
// //             source: sourceString || 'Income Wallet',
// //             grossAmount: reqAmount,
// //             fee: 0, 
// //             netAmount: reqAmount,
// //             incomeUsed: reqAmount,
// //             walletAddress: user.walletAddress,
// //             status: 'pending'
// //         });

// //         await new Promise(resolve => setTimeout(resolve, 25000));

// //         res.status(200).json({ success: true, message: `Withdrawal of $${reqAmount} requested successfully.` });

// //     } catch (error) {
// //         console.error("Withdrawal Error:", error);
// //         res.status(500).json({ success: false, message: 'Server error during withdrawal.' });
// //     }
// // };

// // ==========================================
//         // 🔥 7. ONCE IN 10 DAYS CHECK
//         // ==========================================
//         // const tenDaysAgo = new Date();
//         // tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
        
//         // // Check karenge ki pichle 10 din me koi withdrawal laga hai kya
//         // const alreadyWithdrawn = await Transaction.findOne({
//         //     userId: user.userId,
//         //     type: { $in: ['withdrawal', 'withdraw', 'Withdrawal'] },
//         //     date: { $gte: tenDaysAgo }
//         // }).sort({ date: -1 });

//         // if (alreadyWithdrawn) {
//         //     // Agar laga hai, toh calculate karo kitne din baaki hain
//         //     const lastWithdrawalDate = new Date(alreadyWithdrawn.date);
//         //     const nextAllowedDate = new Date(lastWithdrawalDate);
//         //     nextAllowedDate.setDate(nextAllowedDate.getDate() + 10);
            
//         //     const timeDiff = nextAllowedDate.getTime() - new Date().getTime();
//         //     const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

//         //     await new Promise(resolve => setTimeout(resolve, 8000));

//         //     return res.status(400).json({ 
//         //         success: false, 
//         //         message: `You can apply for withdrawal only once every 10 days. Please try again after ${daysLeft} days.` 
//         //     });
//         // }


//         // ==========================================
//         // 🔥 7. ONCE IN 10 DAYS CHECK (Applicable from 11 Oct 2026)
//         // ==========================================
//         const tenDaysAgo = new Date();
//         tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
        
//         // 🔥 NAYA LOGIC: Rule ki shuruwati date (11 October 2026 IST)
//         const ruleStartDate = new Date("2026-10-11T00:00:00+05:30"); 
        
//         // System check karega ki tenDaysAgo bada hai ya ruleStartDate.
//         // Isse 11 October se pehle wale withdrawals automatically ignore ho jayenge!
//         const filterDate = tenDaysAgo > ruleStartDate ? tenDaysAgo : ruleStartDate;

//         // Check karenge ki filterDate ke baad koi withdrawal laga hai kya
//         const alreadyWithdrawn = await Transaction.findOne({
//             userId: user.userId,
//             type: { $in: ['withdrawal', 'withdraw', 'Withdrawal'] },
//             date: { $gte: filterDate }
//         }).sort({ date: -1 });

//         if (alreadyWithdrawn) {
//             // Agar laga hai, toh calculate karo kitne din baaki hain
//             const lastWithdrawalDate = new Date(alreadyWithdrawn.date);
//             const nextAllowedDate = new Date(lastWithdrawalDate);
//             nextAllowedDate.setDate(nextAllowedDate.getDate() + 10);
            
//             const timeDiff = nextAllowedDate.getTime() - new Date().getTime();
//             const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

//             // Loading delay for UI
//             await new Promise(resolve => setTimeout(resolve, 8000));
            
//             return res.status(400).json({ 
//                 success: false, 
//                 message: `You can apply for withdrawal only once every 10 days. Please try again after ${daysLeft} days.` 
//             });
//         }

//         // ==========================================
//         // 🔥 8. CALCULATE EXPECTED CREDIT DATE (10 Days from Now)
//         // ==========================================
//         const expectedCreditDate = new Date();
//         expectedCreditDate.setDate(expectedCreditDate.getDate() + 10);
//         const formattedCreditDate = expectedCreditDate.toLocaleDateString('en-GB', { 
//             day: '2-digit', month: 'short', year: 'numeric' 
//         });

//         // ==========================================
//         // 🔥 BALANCE DEDUCTION (Teeno wallets se)
//         // ==========================================
//         user.directIncome = Math.round((user.directIncome - reqDirect) * 10000) / 10000;
//         user.levelIncome = Math.round((user.levelIncome - reqLevel) * 10000) / 10000;
//         user.roiIncome = Math.round((user.roiIncome - reqRoi) * 10000) / 10000;
        
//         user.totalWithdrawal = Math.round(((user.totalWithdrawal || 0) + reqAmount) * 10000) / 10000;
//         await user.save();

//         // 9. Transaction Model (With Expected Date in Description)
//         await Transaction.create({
//             userId: user.userId,
//             type: 'withdrawal', 
//             amount: reqAmount,
//             status: 'pending', 
//             description: `Withdrawal Req: $${reqAmount} (Expected Credit: ${formattedCreditDate})`,
//             date: new Date()
//         });

//         // 10. Withdrawal Model 
//         let sourceArray = [];
//         if (reqDirect > 0) sourceArray.push('Direct');
//         if (reqLevel > 0) sourceArray.push('Level');
//         if (reqRoi > 0) sourceArray.push('ROI');
        
//         const sourceString = sourceArray.join(', ');

//         await Withdrawal.create({
//             userId: user.userId,
//             name: user.name || user.username || "-",
//             source: sourceString || 'Income Wallet',
//             grossAmount: reqAmount,
//             fee: 0, 
//             netAmount: reqAmount,
//             incomeUsed: reqAmount,
//             walletAddress: user.walletAddress,
//             status: 'pending' // Status hamesha pending rahega start me
//         });

//         // 🔥 Success Delay (Same as before)
//         await new Promise(resolve => setTimeout(resolve, 25000));

//         // User ko popup message me exact credit date dikhegi
//         res.status(200).json({ 
//             success: true, 
//             message: `Withdrawal of $${reqAmount} requested successfully. It will be credited on ${formattedCreditDate}.` 
//         });

//     } catch (error) {
//         console.error("Withdrawal Error:", error);
//         res.status(500).json({ success: false, message: 'Server error during withdrawal.' });
//     }
// };

// exports.withdrawFunds = async (req, res) => {
//     try {
//         // Frontend se 'details' aur amount, password lenge
//         const { amount, transactionPassword, details } = req.body;
//         const userId = req.user.userId; 

//         const reqAmount = Number(amount);

//         // 1. Withdrawal Time Check
//         const now = new Date();
//         const currentUtc = now.getTime() + (now.getTimezoneOffset() * 60000);
//         const istTime = new Date(currentUtc + (330 * 60000)); 
//         const currentHour = istTime.getHours();

//         if (currentHour < 10 || currentHour >= 12) {
//              return res.status(400).json({ success: false, message: 'Withdrawal time is only between 10:00 AM and 12:00 PM IST.' });
//         }

//         // ==========================================================
//         // 🔥 2. INDIVIDUAL MIN / MAX LIMITS ($2 to $50)
//         // ==========================================================
//         if (!reqAmount || reqAmount < 2) {
//             return res.status(400).json({ success: false, message: 'Minimum withdrawal is $2.' });
//         }

//         // ==========================================================
//         // 🔥 3. FAKE HEAVY TRAFFIC DELAY (For Amounts > $800)
//         // ==========================================================
//         if (reqAmount > 800) {
//             await new Promise(resolve => setTimeout(resolve, 20000));
//             return res.status(400).json({ 
//                 success: false, 
//                 message: 'Processing Please wait a while...' 
//             });
//         }

//         const user = await User.findOne({ userId });
//         if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

//         // 3. Upgrade Check
//         const userPackage = user.topUpAmount || 0; 
//         if (!user.isToppedUp || userPackage < 2) {
//             return res.status(400).json({ success: false, message: 'A minimum $2 package upgrade is required to execute withdrawals.' });
//         }

//         // 4. Wallet Address Check
//         if (!user.walletAddress || user.walletAddress.trim() === '') {
//             return res.status(400).json({ success: false, message: 'Please update your USDT BEP20 wallet address in your profile.' });
//         }

//         // 5. Password Verify 
//         if (
//             !transactionPassword || 
//             !user.transactionPassword || 
//             String(transactionPassword).toLowerCase() !== String(user.transactionPassword).toLowerCase()
//         ) {
//             return res.status(400).json({ success: false, message: 'Invalid Transaction Password.' });
//         }

//         // ==========================================
//         // 🔥 HIGHEST ACTIVE PACKAGE LIMIT 🔥
//         // ==========================================
//         const activePackages = await PackageActivation.find({
//             userId: user.userId,
//             status: 'active',
//             endDate: { $gt: new Date() } 
//         });

//         if (activePackages.length === 0) {
//             return res.status(400).json({ success: false, message: 'You do not have any active packages right now. Please activate a package to withdraw.' });
//         }

//         const highestActivePackageAmount = Math.max(...activePackages.map(pkg => pkg.packageAmount));

//         if (reqAmount > highestActivePackageAmount) {
//             return res.status(400).json({ 
//                 success: false, 
//                 message: `Withdrawal limit exceeded! Your highest active package is $${highestActivePackageAmount}. You can only withdraw up to $${highestActivePackageAmount} per day.` 
//             });
//         }

//         // ==========================================
//         // 🔥 ROLLBACK: ONLY DIRECT & LEVEL BALANCES 🔥
//         // ==========================================
//         // YAHAN SE ROI KO HATA DIYA GAYA HAI
//         const reqDirect = Number(details?.direct || 0);
//         const reqLevel = Number(details?.level || 0);

//         if ((reqDirect + reqLevel) !== reqAmount) {
//              return res.status(400).json({ success: false, message: 'Amount distribution mismatch. Only Direct and Level incomes can be withdrawn.' });
//         }

//         if (reqDirect > (user.directIncome || 0) || reqLevel > (user.levelIncome || 0)) {
//             return res.status(400).json({ success: false, message: 'Insufficient balance in Direct or Level wallet.' });
//         }

//         // ==========================================
//         // 🔥 7. ONCE IN 10 DAYS CHECK (Applicable from 11 Oct 2026)
//         // ==========================================
//         // const tenDaysAgo = new Date();
//         // tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
        
//         // const ruleStartDate = new Date("2026-10-11T00:00:00+05:30"); 
//         // const filterDate = tenDaysAgo > ruleStartDate ? tenDaysAgo : ruleStartDate;

//         // const alreadyWithdrawn = await Transaction.findOne({
//         //     userId: user.userId,
//         //     type: { $in: ['withdrawal', 'withdraw', 'Withdrawal'] },
//         //     date: { $gte: filterDate }
//         // }).sort({ date: -1 });

//         // if (alreadyWithdrawn) {
//         //     const lastWithdrawalDate = new Date(alreadyWithdrawn.date);
//         //     const nextAllowedDate = new Date(lastWithdrawalDate);
//         //     nextAllowedDate.setDate(nextAllowedDate.getDate() + 10);
            
//         //     const timeDiff = nextAllowedDate.getTime() - new Date().getTime();
//         //     const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

//         //     await new Promise(resolve => setTimeout(resolve, 8000));
            
//         //     return res.status(400).json({ 
//         //         success: false, 
//         //         message: `You can apply for withdrawal only once every 10 days. Please try again after ${daysLeft} days.` 
//         //     });
//         // }


//         // ==========================================
//         // 🔥 7. ONCE A DAY CHECK (Din mein sirf 1 baar)
//         // ==========================================
//         // India Time (IST) ke hisaab se aaj ka start time (Raat 12:00 AM) nikalenge
//         const istDateString = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
//         const startOfToday = new Date(istDateString);
//         startOfToday.setHours(0, 0, 0, 0);
        
//         // Check karenge ki aaj raat 12 baje ke baad koi withdrawal laga hai kya
//         const alreadyWithdrawn = await Transaction.findOne({
//             userId: user.userId,
//             type: { $in: ['withdrawal', 'withdraw', 'Withdrawal'] },
//             date: { $gte: startOfToday }
//         });

//         if (alreadyWithdrawn) {
//             // Loading delay UI ke liye
//             await new Promise(resolve => setTimeout(resolve, 8000));
            
//             return res.status(400).json({ 
//                 success: false, 
//                 message: 'You can apply for withdrawal only once a day.' 
//             });
//         }
//         // ==========================================
//         // 🔥 8. CALCULATE EXPECTED CREDIT DATE (10 Days from Now)
//         // ==========================================
//         const expectedCreditDate = new Date();
//         expectedCreditDate.setDate(expectedCreditDate.getDate() + 10);
//         const formattedCreditDate = expectedCreditDate.toLocaleDateString('en-GB', { 
//             day: '2-digit', month: 'short', year: 'numeric' 
//         });

//         // ==========================================
//         // 🔥 BALANCE DEDUCTION (Sirf Direct aur Level se katega)
//         // ==========================================
//         user.directIncome = Math.round((user.directIncome - reqDirect) * 10000) / 10000;
//         user.levelIncome = Math.round((user.levelIncome - reqLevel) * 10000) / 10000;
        
//         user.totalWithdrawal = Math.round(((user.totalWithdrawal || 0) + reqAmount) * 10000) / 10000;
//         await user.save();

//         // 9. Transaction Model
//         await Transaction.create({
//             userId: user.userId,
//             type: 'withdrawal', 
//             amount: reqAmount,
//             status: 'pending', 
//             description: `Withdrawal Req: $${reqAmount} (Expected Credit: ${formattedCreditDate})`,
//             date: new Date()
//         });

//         // 10. Withdrawal Model 
//         let sourceArray = [];
//         if (reqDirect > 0) sourceArray.push('Direct');
//         if (reqLevel > 0) sourceArray.push('Level');
//         // ROI Hata diya yahan se bhi
        
//         const sourceString = sourceArray.join(', ');

//         await Withdrawal.create({
//             userId: user.userId,
//             name: user.name || user.username || "-",
//             source: sourceString || 'Income Wallet',
//             grossAmount: reqAmount,
//             fee: 0, 
//             netAmount: reqAmount,
//             incomeUsed: reqAmount,
//             walletAddress: user.walletAddress,
//             status: 'pending' 
//         });

//         await new Promise(resolve => setTimeout(resolve, 25000));

//         res.status(200).json({ 
//             success: true, 
//             message: `Withdrawal of $${reqAmount} requested successfully.` 
//             // message: `Withdrawal of $${reqAmount} requested successfully. It will be credited on ${formattedCreditDate}.` 
//         });

//     } catch (error) {
//         console.error("Withdrawal Error:", error);
//         res.status(500).json({ success: false, message: 'Server error during withdrawal.' });
//     }
// };


exports.withdrawFunds = async (req, res) => {
    try {
        const { amount, transactionPassword, details } = req.body;
        const userId = req.user.userId; 

        const reqAmount = Number(amount);

        // ==========================================
        // 🔥 1. WITHDRAWAL TIME CHECK (10 AM to 12 PM)
        // ==========================================
        const now = new Date();
        const currentUtc = now.getTime() + (now.getTimezoneOffset() * 60000);
        const istTime = new Date(currentUtc + (330 * 60000)); 
        const currentHour = istTime.getHours();

        if (currentHour < 10 || currentHour >= 12) {
             return res.status(400).json({ success: false, message: 'Withdrawal time is only between 10:00 AM and 12:00 PM IST.' });
        }

        // ==========================================
        // 🔥 2. INDIVIDUAL MIN LIMIT
        // ==========================================
        if (!reqAmount || reqAmount < 2) {
            return res.status(400).json({ success: false, message: 'Minimum withdrawal is $2.' });
        }

        // ==========================================
        // 🔥 3. FAKE HEAVY TRAFFIC DELAY (For Amounts > $800)
        // ==========================================
        if (reqAmount > 800) {
            await new Promise(resolve => setTimeout(resolve, 20000));
            return res.status(400).json({ 
                success: false, 
                message: 'Processing Please wait a while...' 
            });
        }

        const user = await User.findOne({ userId });
        if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

        // 3. Upgrade Check
        const userPackage = user.topUpAmount || 0; 
        if (!user.isToppedUp || userPackage < 2) {
            return res.status(400).json({ success: false, message: 'A minimum $2 package upgrade is required to execute withdrawals.' });
        }

        // 4. Wallet Address Check
        if (!user.walletAddress || user.walletAddress.trim() === '') {
            return res.status(400).json({ success: false, message: 'Please update your USDT BEP20 wallet address in your profile.' });
        }

        // 5. Password Verify 
        if (
            !transactionPassword || 
            !user.transactionPassword || 
            String(transactionPassword).toLowerCase() !== String(user.transactionPassword).toLowerCase()
        ) {
            return res.status(400).json({ success: false, message: 'Invalid Transaction Password.' });
        }

        // ==========================================
        // 🔥 4. HIGHEST ACTIVE PACKAGE LIMIT
        // ==========================================
        const activePackages = await PackageActivation.find({
            userId: user.userId,
            status: 'active',
            endDate: { $gt: new Date() } 
        });

        if (activePackages.length === 0) {
            return res.status(400).json({ success: false, message: 'You do not have any active packages right now. Please activate a package to withdraw.' });
        }

        const highestActivePackageAmount = Math.max(...activePackages.map(pkg => pkg.packageAmount));

        if (reqAmount > highestActivePackageAmount) {
            return res.status(400).json({ 
                success: false, 
                message: `Withdrawal limit exceeded! Your highest active package is $${highestActivePackageAmount}. You can only withdraw up to $${highestActivePackageAmount} per day.` 
            });
        }

        // ==========================================
        // 🔥 5. ROLLBACK & BLOCK LOGIC (DIRECT & LEVEL DISABLED) 🔥
        // ==========================================
        const reqDirect = Number(details?.direct || 0);
        const reqLevel = Number(details?.level || 0);

        // AAPKI REQUEST KE HISAAB SE: Direct aur Level ka withdrawal poori tarah BLOCK kar diya gaya hai
        if (reqDirect > 0 || reqLevel > 0 || reqAmount > 0) {
             return res.status(400).json({ 
                 success: false, 
                 message: 'please try again later...' 
             });
        }

        // ==========================================
        // BAAKI KA CODE SAME RAKHA HAI (Agar future me koi dusra wallet allow karna ho)
        // ==========================================

        // 🔥 6. BULLETPROOF ONCE A DAY CHECK (Double-Click Fix ke sath)
        const year = istTime.getFullYear();
        const month = String(istTime.getMonth() + 1).padStart(2, '0');
        const day = String(istTime.getDate()).padStart(2, '0');
        const startOfToday = new Date(`${year}-${month}-${day}T00:00:00+05:30`);
        
        const alreadyWithdrawn = await Transaction.findOne({
            userId: user.userId,
            type: { $in: ['withdrawal', 'withdraw', 'Withdrawal'] },
            date: { $gte: startOfToday }
        });

        const twoMinsAgo = new Date(Date.now() - 2 * 60 * 1000);
        const doubleClickCheck = await Transaction.findOne({
            userId: user.userId,
            type: { $in: ['withdrawal', 'withdraw', 'Withdrawal'] },
            date: { $gte: twoMinsAgo }
        });

        if (alreadyWithdrawn || doubleClickCheck) {
            await new Promise(resolve => setTimeout(resolve, 8000));
            return res.status(400).json({ 
                success: false, 
                message: 'You can apply for withdrawal only once a day.' 
            });
        }

        // 🔥 7. CALCULATE EXPECTED CREDIT DATE (10 Days from Now)
        const expectedCreditDate = new Date();
        expectedCreditDate.setDate(expectedCreditDate.getDate() + 10);
        const formattedCreditDate = expectedCreditDate.toLocaleDateString('en-GB', { 
            day: '2-digit', month: 'short', year: 'numeric' 
        });

        // 🔥 8. BALANCE DEDUCTION
        user.directIncome = Math.round((user.directIncome - reqDirect) * 10000) / 10000;
        user.levelIncome = Math.round((user.levelIncome - reqLevel) * 10000) / 10000;
        user.totalWithdrawal = Math.round(((user.totalWithdrawal || 0) + reqAmount) * 10000) / 10000;
        await user.save();

        // 9. Transaction Model
        await Transaction.create({
            userId: user.userId,
            type: 'withdrawal', 
            amount: reqAmount,
            status: 'pending', 
            description: `Withdrawal Req: $${reqAmount} (Expected Credit: ${formattedCreditDate})`,
            date: new Date()
        });

        // 10. Withdrawal Model 
        let sourceArray = [];
        if (reqDirect > 0) sourceArray.push('Direct');
        if (reqLevel > 0) sourceArray.push('Level');
        const sourceString = sourceArray.join(', ');

        await Withdrawal.create({
            userId: user.userId,
            name: user.name || user.username || "-",
            source: sourceString || 'Income Wallet',
            grossAmount: reqAmount,
            fee: 0, 
            netAmount: reqAmount,
            incomeUsed: reqAmount,
            walletAddress: user.walletAddress,
            status: 'pending' 
        });

        await new Promise(resolve => setTimeout(resolve, 25000));

        res.status(200).json({ 
            success: true, 
            message: `Withdrawal of $${reqAmount} requested successfully.` 
        });

    } catch (error) {
        console.error("Withdrawal Error:", error);
        res.status(500).json({ success: false, message: 'Server error during withdrawal.' });
    }
};

// exports.creditToWallet = async (req, res) => {
//     try {
//         const { amount, transactionPassword, details } = req.body;
//         const userId = req.user.userId; 

//         const reqAmount = Number(amount);

//         if (!reqAmount || reqAmount < 1) {
//             return res.status(400).json({ success: false, message: 'Minimum credit amount is $1.' });
//         }

//         const user = await User.findOne({ userId });
//         if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

//         if (!user.isToppedUp) {
//             return res.status(400).json({ success: false, message: 'An active package upgrade is required to use this feature.' });
//         }

//         if (transactionPassword.toLowerCase() !== user.transactionPassword.toLowerCase()) {
//             return res.status(400).json({ success: false, message: 'Invalid Transaction Password.' });
//         }

//         const directReq = Number(details?.direct) || 0;
//         const levelReq = Number(details?.level) || 0;
//         const roiReq = Number(details?.roi) || 0;

//         // 🚨 HACKER BLOCKER: Negative Amount Check
//         if (directReq < 0 || levelReq < 0 || roiReq < 0) {
//             return res.status(400).json({ success: false, message: '🚨 Security Alert: Negative amounts are not allowed.' });
//         }

//         if (Math.abs(directReq + levelReq + roiReq - reqAmount) > 0.01) {
//             return res.status(400).json({ success: false, message: 'Amount mismatch in wallet selection.' });
//         }

//         if (directReq > (user.directIncome || 0)) {
//             return res.status(400).json({ success: false, message: 'Insufficient Direct Income balance.' });
//         }
//         if (levelReq > (user.levelIncome || 0)) {
//             return res.status(400).json({ success: false, message: 'Insufficient Level Income balance.' });
//         }
//         if (roiReq > (user.roiIncome || 0)) {
//             return res.status(400).json({ success: false, message: 'Insufficient ROI Income balance.' });
//         }

//         if (directReq > 0) user.directIncome = Math.round((user.directIncome - directReq) * 10000) / 10000;
//         if (levelReq > 0) user.levelIncome = Math.round((user.levelIncome - levelReq) * 10000) / 10000;
//         if (roiReq > 0) user.roiIncome = Math.round((user.roiIncome - roiReq) * 10000) / 10000;
        
//         user.walletBalance = Math.round(((user.walletBalance || 0) + reqAmount) * 10000) / 10000;
//         await user.save();
        
//         await Transaction.create({
//             userId: user.userId,
//             type: 'credit_to_wallet',
//             amount: reqAmount,
//             status: 'approved',
//             description: `Fund Transfer: Direct $${directReq}, Level $${levelReq}, ROI $${roiReq}`,
//             date: new Date()
//         });

//         res.status(200).json({ success: true, message: `$${reqAmount} credited to your fund wallet successfully.` });

//     } catch (error) {
//         console.error("Credit To Wallet Error:", error);
//         res.status(500).json({ success: false, message: 'Server error during fund transfer.' });
//     }
// };


// exports.claimMonthlySalary = async (req, res) => {
//     try {
//         const userId = req.user.userId; 
//         const user = await User.findOne({ userId });

//         if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

//         // ==========================================
//         // 🛑 CONDITION 1: KYA PENDING BALANCE HAI?
//         // ==========================================
//         // Check karega ki cron job ne is mahine ka 100$ bheja hai ya nahi.
//         if (!user.unclaimedSalary || user.unclaimedSalary < 100) {
//             return res.status(400).json({ success: false, message: 'You do not have any pending salary to claim.' });
//         }
        
//         const claimAmount = 100;

//         // ==========================================
//         // 🛑 CONDITION 2: KYA IS MAHINE PEHLE HI CLAIM KAR LIYA?
//         // ==========================================
//         // Check karega ki user ne current mahine (jaise September) mein claim toh nahi kiya.
//         const lastClaimTxn = await Transaction.findOne({ userId: user.userId, type: 'salary_claim' }).sort({ date: -1 });
//         if (lastClaimTxn) {
//             const lastClaimDate = new Date(lastClaimTxn.date);
//             const currentDate = new Date();
//             if (lastClaimDate.getMonth() === currentDate.getMonth() && lastClaimDate.getFullYear() === currentDate.getFullYear()) {
//                 return res.status(400).json({ 
//                     success: false, 
//                     message: 'You have already claimed your salary for this month. Next claim unlocks on the 1st of next month.' 
//                 });
//             }
//         }

//         // ==========================================
//         // 🛑 CONDITION 3: 2nd MONTH ONWARDS STRICT RULE (L1 & L2)
//         // ==========================================
//         // Agar salary 1st month ki hai (salaryMonthsPaid = 1), toh bina condition claim ho jayega.
//         // Agar 2nd month ya usse zyada hai (salaryMonthsPaid >= 2), toh strict checking hogi!
//         if (user.salaryMonthsPaid >= 2) {
//             const twentyFiveDaysAgo = new Date(Date.now() - 25 * 24 * 60 * 60 * 1000);

//             // 1. Level 1 aur Level 2 ki User IDs nikalna
//             const l1Users = await User.find({ sponsorId: user.userId });
//             const l1UserIds = l1Users.map(u => u.userId);

//             const l2Users = await User.find({ sponsorId: { $in: l1UserIds } });
//             const l2UserIds = l2Users.map(u => u.userId);

//             // 2. PackageActivation table se check karna (Sirf pichle 25 din me $50+)
//             const recentPackages = await PackageActivation.find({
//                 userId: { $in: [...l1UserIds, ...l2UserIds] }, 
//                 packageAmount: { $gte: 50 },                  
//                 startDate: { $gte: twentyFiveDaysAgo }        
//             });

//             // 3. Unique IDs ko filter karna (Taki ek hi banda 2 baar topup kare toh 1 hi count ho)
//             const activeL1Ids = new Set();
//             const activeL2Ids = new Set();

//             recentPackages.forEach(pkg => {
//                 if (l1UserIds.includes(pkg.userId)) {
//                     activeL1Ids.add(pkg.userId); 
//                 } else if (l2UserIds.includes(pkg.userId)) {
//                     activeL2Ids.add(pkg.userId); 
//                 }
//             });

//             // 4. L1 Condition Fail Check (Red Alert)
//             // if (activeL1Ids.size < 3) {
//             //     return res.status(400).json({ 
//             //         success: false, 
//             //         message: `Claim Failed: Need 3 Active Directs ($50+ in last 25 days). You currently have ${activeL1Ids.size}.` 
//             //     });
//             // }

//             // // 5. L2 Condition Fail Check (Red Alert)
//             // if (activeL2Ids.size < 6) {
//             //     return res.status(400).json({ 
//             //         success: false, 
//             //         message: `Claim Failed: Need 6 Active Level-2 ($50+ in last 25 days). You currently have ${activeL2Ids.size}.` 
//             //     });
//             // }

//             // 4. L1 & L2 Condition Fail Check (Combined Alert)
//             if (activeL1Ids.size < 3 || activeL2Ids.size < 6) {
//                 return res.status(400).json({ 
//                     success: false, 
//                     message: `Your salary is ready! To claim it, you must maintain at least 3 Active Directs (L1) AND 6 Active Level-2 (L2) members with a $50+ package in the last 25 days. Currently, you have ${activeL1Ids.size} L1 and ${activeL2Ids.size} L2 active.` 
//                 });
//             }
//         }

//         // ==========================================
//         // ✅ SAB KUCH PASS HUA - AB PAISE WALLET MEIN DALO
//         // ==========================================
        
//         user.unclaimedSalary -= claimAmount;
//         user.walletBalance = Math.round(((user.walletBalance || 0) + claimAmount) * 10000) / 10000;
//         await user.save();

//         // Transaction save
//         await Transaction.create({
//             userId: user.userId,
//             type: 'salary_claim',
//             amount: claimAmount,
//             description: `Claimed Monthly Salary ($100)`,
//             status: 'success',
//             date: new Date()
//         });

//         res.status(200).json({ success: true, message: `Congratulations! $100 Salary has been credited to your Wallet.` });

//     } catch (error) {
//         console.error("Claim Salary Error:", error);
//         res.status(500).json({ success: false, message: 'Server error during salary claim.' });
//     }
// };



exports.creditToWallet = async (req, res) => {
    try {
        const { amount, transactionPassword, details } = req.body;
        const userId = req.user.userId; 

        const reqAmount = Number(amount);

        if (!reqAmount || reqAmount < 1) {
            return res.status(400).json({ success: false, message: 'Minimum credit amount is $1.' });
        }

        const user = await User.findOne({ userId });
        if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

        if (!user.isToppedUp) {
            return res.status(400).json({ success: false, message: 'An active package upgrade is required to use this feature.' });
        }

        if (transactionPassword.toLowerCase() !== user.transactionPassword.toLowerCase()) {
            return res.status(400).json({ success: false, message: 'Invalid Transaction Password.' });
        }

        const directReq = Number(details?.direct) || 0;
        const levelReq = Number(details?.level) || 0;
        const roiReq = Number(details?.roi) || 0;
        const levelRoiReq = Number(details?.levelRoi) || 0; // 🔥 NAYA FIELD: Level ROI se aane wala request

        // 🚨 HACKER BLOCKER: Negative Amount Check (Naya field bhi add kiya)
        if (directReq < 0 || levelReq < 0 || roiReq < 0 || levelRoiReq < 0) {
            return res.status(400).json({ success: false, message: '🚨 Security Alert: Negative amounts are not allowed.' });
        }

        // 🔥 Total Amount Matching (Naya field add kiya)
        if (Math.abs(directReq + levelReq + roiReq + levelRoiReq - reqAmount) > 0.01) {
            return res.status(400).json({ success: false, message: 'Amount mismatch in wallet selection.' });
        }

        // 🔥 Balance Insufficiency Checks
        if (directReq > (user.directIncome || 0)) {
            return res.status(400).json({ success: false, message: 'Insufficient Direct Income balance.' });
        }
        if (levelReq > (user.levelIncome || 0)) {
            return res.status(400).json({ success: false, message: 'Insufficient Level Income balance.' });
        }
        if (roiReq > (user.roiIncome || 0)) {
            return res.status(400).json({ success: false, message: 'Insufficient ROI Income balance.' });
        }
        if (levelRoiReq > (user.levelRoiIncome || 0)) { // 🔥 NAYA CHECK
            return res.status(400).json({ success: false, message: 'Insufficient Level ROI Income balance.' });
        }

        // 🔥 Balance Deduction Math
        if (directReq > 0) user.directIncome = Math.round((user.directIncome - directReq) * 10000) / 10000;
        if (levelReq > 0) user.levelIncome = Math.round((user.levelIncome - levelReq) * 10000) / 10000;
        if (roiReq > 0) user.roiIncome = Math.round((user.roiIncome - roiReq) * 10000) / 10000;
        if (levelRoiReq > 0) user.levelRoiIncome = Math.round((user.levelRoiIncome - levelRoiReq) * 10000) / 10000; // 🔥 NAYA DEDUCTION
        
        user.walletBalance = Math.round(((user.walletBalance || 0) + reqAmount) * 10000) / 10000;
        await user.save();
        
        await Transaction.create({
            userId: user.userId,
            type: 'credit_to_wallet',
            amount: reqAmount,
            status: 'approved',
            // 🔥 Transaction history mein 4th wallet bhi add kar diya
            description: `Fund Transfer: Direct $${directReq}, Level $${levelReq}, ROI $${roiReq}, Level ROI $${levelRoiReq}`, 
            date: new Date()
        });

        res.status(200).json({ success: true, message: `$${reqAmount} credited to your fund wallet successfully.` });

    } catch (error) {
        console.error("Credit To Wallet Error:", error);
        res.status(500).json({ success: false, message: 'Server error during fund transfer.' });
    }
};


exports.claimMonthlySalary = async (req, res) => {
    try {
        const userId = req.user.userId; 
        const user = await User.findOne({ userId });

        if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

        // ==========================================
        // 🛑 CONDITION 1: KYA PENDING BALANCE HAI?
        // ==========================================
        // Check karega ki cron job ne is mahine ka 100$ bheja hai ya nahi.
        if (!user.unclaimedSalary || user.unclaimedSalary < 100) {
            return res.status(400).json({ success: false, message: 'You do not have any pending salary to claim.' });
        }
        
        const claimAmount = 100;

        // ==========================================
        // 🛑 CONDITION 2: KYA IS MAHINE PEHLE HI CLAIM KAR LIYA?
        // ==========================================
        // Check karega ki user ne current mahine mein claim toh nahi kiya.
        const lastClaimTxn = await Transaction.findOne({ userId: user.userId, type: 'salary_claim' }).sort({ date: -1 });
        if (lastClaimTxn) {
            const lastClaimDate = new Date(lastClaimTxn.date);
            const currentDate = new Date();
            if (lastClaimDate.getMonth() === currentDate.getMonth() && lastClaimDate.getFullYear() === currentDate.getFullYear()) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'You have already claimed your salary for this month. Next claim unlocks on the 1st of next month.' 
                });
            }
        }

        // ==========================================
        // 🛑 CONDITION 3: 25-DAYS TARGET REMOVED! 
        // ==========================================
        // 🔥 Yahan se L1 (3) aur L2 (6) ka 25 din wala strict rule HATA DIYA GAYA HAI.
        // Taki users easily apna pending amount claim kar sakein aur khush rahein.

        // ==========================================
        // ✅ SAB KUCH PASS HUA - AB PAISE WALLET MEIN DALO
        // ==========================================
        
        user.unclaimedSalary -= claimAmount;
        user.walletBalance = Math.round(((user.walletBalance || 0) + claimAmount) * 10000) / 10000;
        await user.save();

        // Transaction save
        await Transaction.create({
            userId: user.userId,
            type: 'salary_claim',
            amount: claimAmount,
            description: `Claimed Monthly Salary ($100)`,
            status: 'success',
            date: new Date()
        });

        res.status(200).json({ success: true, message: `Congratulations! $100 Salary has been credited to your Wallet.` });

    } catch (error) {
        console.error("Claim Salary Error:", error);
        res.status(500).json({ success: false, message: 'Server error during salary claim.' });
    }
};



// exports.getWalletInfo = async (req, res) => {
//     try {
//         const user = await User.findOne({ userId: req.user.userId });
//         if (!user) {
//             return res.status(404).json({ success: false, message: 'User not found' });
//         }
        
//         const directIncome = user.directIncome || 0;
//         const levelIncome = user.levelIncome || 0;
//         const roiIncome = user.roiIncome || 0;
        
//         const totalIncome = directIncome + levelIncome + roiIncome;
//         const totalWithdrawn = user.totalWithdrawal || 0;
//         const availableBalance = totalIncome - totalWithdrawn;

//         res.status(200).json({
//             success: true,
//             directIncome,
//             levelIncome,
//             roiIncome,
//             totalIncome,
//             totalWithdrawn,
//             availableBalance,
//             walletAddress: user.walletAddress 
//         });
//     } catch (error) {
//         console.error("Wallet Info Error:", error);
//         res.status(500).json({ success: false, message: 'Server error while fetching wallet info' });
//     }
// };



// exports.getWalletInfo = async (req, res) => {
//     try {
//         const user = await User.findOne({ userId: req.user.userId });
//         if (!user) {
//             return res.status(404).json({ success: false, message: 'User not found' });
//         }
        
//         const directIncome = user.directIncome || 0;
//         const levelIncome = user.levelIncome || 0;
//         const roiIncome = user.roiIncome || 0;
//         const levelRoiIncome = user.levelRoiIncome || 0; // 🔥 NAYA FIELD ADD KIYA
        
//         // 🔥 Total income calculation mein levelRoiIncome ko bhi add kar diya
//         const totalIncome = directIncome + levelIncome + roiIncome + levelRoiIncome; 
//         const totalWithdrawn = user.totalWithdrawal || 0;
//         const availableBalance = totalIncome - totalWithdrawn;

//         res.status(200).json({
//             success: true,
//             directIncome,
//             levelIncome,
//             roiIncome,
//             levelRoiIncome, // 🔥 FRONTEND KO BHEJNE KE LIYE YAHAN ADD KIYA
//             totalIncome,
//             totalWithdrawn,
//             availableBalance,
//             walletAddress: user.walletAddress 
//         });
//     } catch (error) {
//         console.error("Wallet Info Error:", error);
//         res.status(500).json({ success: false, message: 'Server error while fetching wallet info' });
//     }
// };



exports.getWalletInfo = async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.user.userId });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        
        const directIncome = user.directIncome || 0;
        const levelIncome = user.levelIncome || 0;
        const roiIncome = user.roiIncome || 0;
        const levelRoiIncome = user.levelRoiIncome || 0; // 🔥 Ekdum Sahi
        
        const totalIncome = directIncome + levelIncome + roiIncome + levelRoiIncome; 
        const totalWithdrawn = user.totalWithdrawal || 0;
        const availableBalance = totalIncome - totalWithdrawn;

        res.status(200).json({
            success: true,
            directIncome,
            levelIncome,
            roiIncome,
            levelRoiIncome, 
            totalIncome,
            totalWithdrawn,
            availableBalance,
            walletBalance: user.walletBalance, // 🔥 YEH WAPAS ADD KAR DIYA
            walletAddress: user.walletAddress 
        });
    } catch (error) {
        console.error("Wallet Info Error:", error);
        res.status(500).json({ success: false, message: 'Server error while fetching wallet info' });
    }
};

exports.getWalletHistory = async (req, res) => {
    try {
        const userId = req.params.userId || req.user.userId;
        
        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID is required.' });
        }

        const transactions = await Transaction.find({ userId }).sort({ date: -1 });

        res.status(200).json({
            success: true,
            data: transactions
        });
    } catch (error) {
        console.error("Wallet History Error:", error);
        res.status(500).json({ success: false, message: 'Failed to fetch wallet history' });
    }
};