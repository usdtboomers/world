// C:\Users\HP\Desktop\WorldFinance24\backend\controllers\transferController.js
const User = require('../models/User');
const Transaction = require('../models/Transaction');
// 1. Wallet to Wallet Transfer (User to User)
exports.walletTransfer = async (req, res) => {
    try {
        const { receiverId, amount, transactionPassword } = req.body;
        const senderId = req.user.userId;
        const reqAmount = Number(amount);

        if (!receiverId || !reqAmount || !transactionPassword) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }

        // 🔥 FIX 1: Khud ko paise bhejte time error throw karo
        // String aur toLowerCase use kiya taaki wf123 aur WF123 dono match ho jayein
        if (String(senderId).toLowerCase() === String(receiverId).toLowerCase()) {
            return res.status(400).json({ 
                success: false, 
                message: 'You cannot transfer funds to your own wallet.' 
            });
        }

        if (reqAmount < 1) {
            return res.status(400).json({ success: false, message: 'Minimum transfer amount is $1.' });
        }

        const sender = await User.findOne({ userId: senderId });
        const receiver = await User.findOne({ userId: receiverId });

        if (!sender) return res.status(404).json({ success: false, message: 'Sender not found.' });
        if (!receiver) return res.status(404).json({ success: false, message: 'Receiver not found.' });

        // 🔥 CRASH/LOGOUT FIX: 400 kar diya taaki user login page par na feka jaye
        if (!sender.transactionPassword || transactionPassword.toLowerCase() !== sender.transactionPassword.toLowerCase()) {
            return res.status(400).json({ success: false, message: 'Invalid Transaction Password.' });
        }

        if ((sender.walletBalance || 0) < reqAmount) {
            return res.status(400).json({ success: false, message: 'Insufficient wallet balance.' });
        }

        // Deduct from Sender
        sender.walletBalance -= reqAmount;
        await sender.save();

        // Add to Receiver
        receiver.walletBalance = (receiver.walletBalance || 0) + reqAmount;
        await receiver.save();

        // Create Transaction Records
        await Transaction.create([
            {
                userId: sender.userId,
                type: 'fund_transfer_sent',
                amount: reqAmount,
                status: 'completed',
                description: `Sent $${reqAmount} to ${receiver.userId}`,
                date: new Date()
            },
            {
                userId: receiver.userId,
                type: 'fund_transfer_received',
                amount: reqAmount,
                status: 'completed',
                description: `Received $${reqAmount} from ${sender.userId}`,
                date: new Date()
            }
        ]);

        res.status(200).json({ success: true, message: `Successfully transferred $${reqAmount} to ${receiver.userId}.` });
    } catch (error) {
        console.error("Transfer Error:", error);
        res.status(500).json({ success: false, message: 'Server error during transfer.' });
    }
};

// C:\Users\HP\Desktop\WorldFinance24\backend\controllers\walletController.js
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
            walletBalance: user.walletBalance || 0, // 🔥 YE LINE ADD KI HAI (Isi se 0 fix hoga)
            walletAddress: user.walletAddress 
        });
    } catch (error) {
        console.error("Wallet Info Error:", error);
        res.status(500).json({ success: false, message: 'Server error while fetching wallet info' });
    }
};