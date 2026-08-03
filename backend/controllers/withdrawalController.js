const User = require('../models/User');
const Transaction = require('../models/Transaction');
// 🔥 ADDED: Admin panel wala Withdrawal model
const Withdrawal = require('../models/Withdrawal'); 

// exports.withdrawFunds = async (req, res) => {
//     try {
//         const { amount, transactionPassword, details } = req.body;
//         const userId = req.user.userId; 

//         const reqAmount = Number(amount);

//         // 1. Minimum $2 Withdrawal Check
//         if (!reqAmount || reqAmount < 2 || reqAmount > 5000) {
//             return res.status(400).json({ success: false, message: 'Minimum withdrawal is $2 and maximum is $5000.' });
//         }

//         const user = await User.findOne({ userId });
//         if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

//         // 2. Upgrade Check (Minimum $30 TopUp required)
//         const userPackage = user.topUpAmount || 0; 
//         if (!user.isToppedUp || userPackage < 2) {
//             return res.status(400).json({ success: false, message: 'A minimum $2 package upgrade is required to execute withdrawals.' });
//         }

//         // 3. Wallet Address Check
//         if (!user.walletAddress || user.walletAddress.trim() === '') {
//             return res.status(400).json({ success: false, message: 'Please update your USDT BEP20 wallet address in your profile.' });
//         }

//         // 4. Password Verify
//         if (transactionPassword.toLowerCase() !== user.transactionPassword.toLowerCase()) {
//             return res.status(401).json({ success: false, message: 'Invalid Transaction Password.' });
//         }

//         // 5. INDIVIDUAL WALLET DEDUCTION LOGIC
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

//         // 6. Once a Day Check
//         const startOfToday = new Date();
//         startOfToday.setHours(0, 0, 0, 0);
        
//         const alreadyWithdrawn = await Transaction.findOne({
//             userId: user.userId,
//             type: 'withdrawal',
//             date: { $gte: startOfToday }
//         });

//         // Uncomment this line to enforce 1 withdrawal per day
//         if (alreadyWithdrawn) {
//             return res.status(400).json({ success: false, message: 'You can apply for withdrawal only once a day.' });
//         }

//         // 7. ACTUAL BALANCE DEDUCTION
//         if (directReq > 0) user.directIncome -= directReq;
//         if (levelReq > 0) user.levelIncome -= levelReq;
//         if (roiReq > 0) user.roiIncome -= roiReq;
        
//         user.totalWithdrawal = (user.totalWithdrawal || 0) + reqAmount;
//         await user.save();

//         // 8. 📝 Transaction Model ke liye (User History ke liye)
//         await Transaction.create({
//             userId: user.userId,
//             type: 'withdrawal', 
//             amount: reqAmount,
//             status: 'pending', 
//             description: `Withdrawal Req: Direct $${directReq}, Level $${levelReq}, ROI $${roiReq}`,
//             date: new Date()
//         });

//         // 9. 🚀 Withdrawal Model ke liye (Admin Panel ke liye)
//         // Ye pata lagayega ki kis-kis wallet se paisa aaya hai
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
//             fee: 0, // Agar baad mein admin fee add karni ho to yahan lagayenge
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


// 🔥 Credit To Wallet API (Income to Fund Transfer)

exports.withdrawFunds = async (req, res) => {
    try {
        const { amount, transactionPassword, details } = req.body;
        const userId = req.user.userId; 

        const reqAmount = Number(amount);

        // 1. Withdrawal Time Check (10:00 AM to 12:00 PM IST)
        const now = new Date();
        // Server time ko IST me convert karna (taaki server kahin bhi ho, India time check ho)
        const currentUtc = now.getTime() + (now.getTimezoneOffset() * 60000);
        const istTime = new Date(currentUtc + (330 * 60000)); // 330 mins = 5.5 hours IST offset
        const currentHour = istTime.getHours();

        // Agar time 10 baje se chota hai (< 10) ya 12 baje se bada/barabar hai (>= 12)
        if (currentHour < 10 || currentHour >= 12) {
            return res.status(400).json({ success: false, message: 'Withdrawal time is only between 10:00 AM and 12:00 PM IST.' });
        }

        // 2. Minimum Withdrawal Check
        if (!reqAmount || reqAmount < 2 || reqAmount > 5000) {
            return res.status(400).json({ success: false, message: 'Minimum withdrawal is $2 and maximum is $5000.' });
        }

        const user = await User.findOne({ userId });
        if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

        // 3. Upgrade Check (Strict $30 TopUp required)
        const userPackage = user.topUpAmount || 0; 
        if (!user.isToppedUp || userPackage < 2) {
            return res.status(400).json({ success: false, message: 'A minimum $2 package upgrade is required to execute withdrawals.' });
        }

        // 4. Wallet Address Check
        if (!user.walletAddress || user.walletAddress.trim() === '') {
            return res.status(400).json({ success: false, message: 'Please update your USDT BEP20 wallet address in your profile.' });
        }

        // 5. Password Verify (Safe Check - ab server crash nahi hoga)
       // 5. Password Verify (Safe Check + 400 Status jisse user logout na ho)
        if (
            !transactionPassword || 
            !user.transactionPassword || 
            String(transactionPassword).toLowerCase() !== String(user.transactionPassword).toLowerCase()
        ) {
            // 🔥 Yahan 401 ki jagah 400 kar diya hai taaki app bahar na feke
            return res.status(400).json({ success: false, message: 'Invalid Transaction Password.' });
        }

        // 6. INDIVIDUAL WALLET DEDUCTION LOGIC
        const directReq = Number(details?.direct) || 0;
        const levelReq = Number(details?.level) || 0;
        const roiReq = Number(details?.roi) || 0;

        if (directReq + levelReq + roiReq !== reqAmount) {
            return res.status(400).json({ success: false, message: 'Amount mismatch in wallet selection.' });
        }

        if (directReq > (user.directIncome || 0)) {
            return res.status(400).json({ success: false, message: 'Insufficient Direct Income balance.' });
        }
        if (levelReq > (user.levelIncome || 0)) {
            return res.status(400).json({ success: false, message: 'Insufficient Level Income balance.' });
        }
        if (roiReq > (user.roiIncome || 0)) {
            return res.status(400).json({ success: false, message: 'Insufficient ROI Income balance.' });
        }

        // 7. Once a Day Check
        const startOfToday = new Date(istTime);
        startOfToday.setHours(0, 0, 0, 0); // Aaj ki shuruwat (IST ke hisaab se)
        
        const alreadyWithdrawn = await Transaction.findOne({
            userId: user.userId,
            type: 'withdrawal',
            date: { $gte: startOfToday }
        });

        if (alreadyWithdrawn) {
            return res.status(400).json({ success: false, message: 'You can apply for withdrawal only once a day.' });
        }

        // 8. ACTUAL BALANCE DEDUCTION
       // 8. ACTUAL BALANCE DEDUCTION (🔥 FIX: Rounding applied to prevent e-16 bug)
        if (directReq > 0) user.directIncome = Math.round((user.directIncome - directReq) * 10000) / 10000;
        if (levelReq > 0) user.levelIncome = Math.round((user.levelIncome - levelReq) * 10000) / 10000;
        if (roiReq > 0) user.roiIncome = Math.round((user.roiIncome - roiReq) * 10000) / 10000;
        
        user.totalWithdrawal = Math.round(((user.totalWithdrawal || 0) + reqAmount) * 10000) / 10000;
        await user.save();

        // 9. Transaction Model ke liye (User History ke liye)
        await Transaction.create({
            userId: user.userId,
            type: 'withdrawal', 
            amount: reqAmount,
            status: 'pending', 
            description: `Withdrawal Req: Direct $${directReq}, Level $${levelReq}, ROI $${roiReq}`,
            date: new Date()
        });

        // 10. Withdrawal Model ke liye (Admin Panel ke liye)
        let sourceArray = [];
        if (directReq > 0) sourceArray.push('Direct');
        if (levelReq > 0) sourceArray.push('Level');
        if (roiReq > 0) sourceArray.push('ROI');
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

        res.status(200).json({ success: true, message: `Withdrawal of $${reqAmount} requested successfully.` });

    } catch (error) {
        console.error("Withdrawal Error:", error);
        res.status(500).json({ success: false, message: 'Server error during withdrawal.' });
    }
};


exports.creditToWallet = async (req, res) => {
    try {
        const { amount, transactionPassword, details } = req.body;
        const userId = req.user.userId; 

        const reqAmount = Number(amount);

        // 1. Minimum $1 Credit Check
        if (!reqAmount || reqAmount < 1) {
            return res.status(400).json({ success: false, message: 'Minimum credit amount is $1.' });
        }

        const user = await User.findOne({ userId });
        if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

        // 2. Active Package Check
        if (!user.isToppedUp) {
            return res.status(400).json({ success: false, message: 'An active package upgrade is required to use this feature.' });
        }

      // 3. Password Verify
  if (transactionPassword.toLowerCase() !== user.transactionPassword.toLowerCase()) {
      // 401 ki jagah 400 use karo
      return res.status(400).json({ success: false, message: 'Invalid Transaction Password.' });
  }

        // 4. INDIVIDUAL WALLET DEDUCTION LOGIC (Same as Withdrawal)
        const directReq = Number(details?.direct) || 0;
        const levelReq = Number(details?.level) || 0;
        const roiReq = Number(details?.roi) || 0;

        if (directReq + levelReq + roiReq !== reqAmount) {
            return res.status(400).json({ success: false, message: 'Amount mismatch in wallet selection.' });
        }

        if (directReq > (user.directIncome || 0)) {
            return res.status(400).json({ success: false, message: 'Insufficient Direct Income balance.' });
        }
        if (levelReq > (user.levelIncome || 0)) {
            return res.status(400).json({ success: false, message: 'Insufficient Level Income balance.' });
        }
        if (roiReq > (user.roiIncome || 0)) {
            return res.status(400).json({ success: false, message: 'Insufficient ROI Income balance.' });
        }

        // 5. ACTUAL BALANCE DEDUCTION & WALLET CREDIT
        if (directReq > 0) user.directIncome = Math.round((user.directIncome - directReq) * 10000) / 10000;
        if (levelReq > 0) user.levelIncome = Math.round((user.levelIncome - levelReq) * 10000) / 10000;
        if (roiReq > 0) user.roiIncome = Math.round((user.roiIncome - roiReq) * 10000) / 10000;
        
        user.walletBalance = Math.round(((user.walletBalance || 0) + reqAmount) * 10000) / 10000;
        await user.save();
        // 6. Transaction Record
        await Transaction.create({
            userId: user.userId,
            type: 'credit_to_wallet', // Ye type history page pe dikhane ke kaam aayega
            amount: reqAmount,
            status: 'approved', // Internal transfer hai toh direct approve
            description: `Fund Transfer: Direct $${directReq}, Level $${levelReq}, ROI $${roiReq}`,
            date: new Date()
        });

        res.status(200).json({ success: true, message: `$${reqAmount} credited to your fund wallet successfully.` });

    } catch (error) {
        console.error("Credit To Wallet Error:", error);
        res.status(500).json({ success: false, message: 'Server error during fund transfer.' });
    }
};


exports.getWalletInfo = async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.user.userId });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        
        const directIncome = user.directIncome || 0;
        const levelIncome = user.levelIncome || 0;
        const roiIncome = user.roiIncome || 0;
        
        const totalIncome = directIncome + levelIncome + roiIncome;
        const totalWithdrawn = user.totalWithdrawal || 0;
        const availableBalance = totalIncome - totalWithdrawn;

        res.status(200).json({
            success: true,
            directIncome,
            levelIncome,
            roiIncome,
            totalIncome,
            totalWithdrawn,
            availableBalance,
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