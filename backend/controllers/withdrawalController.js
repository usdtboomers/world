const User = require('../models/User');
const Transaction = require('../models/Transaction');

exports.withdrawFunds = async (req, res) => {
    try {
        const { amount, transactionPassword } = req.body;
        const userId = req.user.userId; 

        const reqAmount = Number(amount);

        // Rule 1: Amount Check (Min $2, Max $5000)
        if (!reqAmount || reqAmount < 2 || reqAmount > 5000) {
            return res.status(400).json({ success: false, message: 'Minimum withdrawal is $2 and maximum is $5000.' });
        }

        // Rule 2: Time Check (Strictly 10 AM to 12 PM IST)
        const currentISTHour = parseInt(
            new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata", hour12: false, hour: "numeric" }), 
            10
        );
        
        // Agar time 10 se kam (subah) ya 12 ya usse zyada (dopahar/raat) hai, toh reject kar do
        if (currentISTHour < 10 || currentISTHour >= 12) {
            return res.status(400).json({ success: false, message: 'You can place withdrawals only from 10:00 AM to 12:00 PM (IST).' });
        }

        const user = await User.findOne({ userId });
        if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

        // Rule 3: Strict Upgrade Check (Minimum $30 top-up required)
        // Ye ensure karega ki basic pool wale without upgrade withdraw na kar sakein
        const userPackage = user.packageAmount || 0;
        if (!user.isToppedUp || userPackage < 30) {
            return res.status(400).json({ success: false, message: 'A minimum $30 package upgrade is required to execute withdrawals.' });
        }

        // Rule 4: Wallet Address Check
        if (!user.walletAddress || user.walletAddress.trim() === '') {
            return res.status(400).json({ success: false, message: 'Please update your USDT BEP20 wallet address in your profile.' });
        }

        // Rule 5: Password Verify
        if (transactionPassword.toLowerCase() !== user.transactionPassword.toLowerCase()) {
            return res.status(401).json({ success: false, message: 'Invalid Transaction Password.' });
        }

        // Rule 6: Balance Check
        if ((user.walletBalance || 0) < reqAmount) {
            return res.status(400).json({ success: false, message: 'Insufficient wallet balance.' });
        }

        // Rule 7: Once a Day Check
        const startOfTodayIST = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
        startOfTodayIST.setHours(0, 0, 0, 0);
        
        const alreadyWithdrawn = await Transaction.findOne({
            userId: user.userId,
            type: 'withdrawal',
            date: { $gte: startOfTodayIST }
        });

        if (alreadyWithdrawn) {
            return res.status(400).json({ success: false, message: 'You can apply for withdrawal only once a day.' });
        }

        // Rule 8: Deduct Balance (0% Fee)
        user.walletBalance -= reqAmount;
        user.totalWithdrawal = (user.totalWithdrawal || 0) + reqAmount;
        await user.save();

        // Rule 9: Create Transaction Record
        await Transaction.create({
            userId: user.userId,
            type: 'withdrawal',
            amount: reqAmount,
            status: 'pending', 
            description: `Withdrawal request of $${reqAmount} to BEP20 Wallet`,
            date: new Date()
        });

        res.status(200).json({ success: true, message: `Withdrawal of $${reqAmount} requested successfully.` });

    } catch (error) {
        console.error("Withdrawal Error:", error);
        res.status(500).json({ success: false, message: 'Server error during withdrawal.' });
    }
};

// Wallet info fetch karne ka naya function
exports.getWalletInfo = async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.user.userId });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        
        res.status(200).json({
            success: true,
            walletBalance: user.walletBalance || 0,
            totalWithdrawal: user.totalWithdrawal || 0
        });
    } catch (error) {
        console.error("Wallet Info Error:", error);
        res.status(500).json({ success: false, message: 'Server error while fetching wallet info' });
    }
};