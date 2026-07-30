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

        if (reqAmount < 1) {
            return res.status(400).json({ success: false, message: 'Minimum transfer amount is $1.' });
        }

        const sender = await User.findOne({ userId: senderId });
        const receiver = await User.findOne({ userId: receiverId });

        if (!sender) return res.status(404).json({ success: false, message: 'Sender not found.' });
        if (!receiver) return res.status(404).json({ success: false, message: 'Receiver not found.' });

        // Strict Upgrade Check (Minimum $30 top-up required for sending funds)
        const senderPackage = sender.packageAmount || 0;
        if (!sender.isToppedUp || senderPackage < 30) {
            return res.status(400).json({ success: false, message: 'A minimum $30 package upgrade is required to transfer funds.' });
        }

        if (transactionPassword.toLowerCase() !== sender.transactionPassword.toLowerCase()) {
            return res.status(401).json({ success: false, message: 'Invalid Transaction Password.' });
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

// 2. Credit to Wallet (Income to Fund Wallet Conversion)
exports.creditToWallet = async (req, res) => {
    try {
        const { amount, transactionPassword } = req.body;
        const userId = req.user.userId;
        const reqAmount = Number(amount);

        if (!reqAmount || reqAmount < 1) {
            return res.status(400).json({ success: false, message: 'Minimum credit amount is $1.' });
        }

        const user = await User.findOne({ userId });
        if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

        // Strict Upgrade Check
        const userPackage = user.packageAmount || 0;
        if (!user.isToppedUp || userPackage < 30) {
            return res.status(400).json({ success: false, message: 'A minimum $30 package upgrade is required to credit funds.' });
        }

        if (transactionPassword.toLowerCase() !== user.transactionPassword.toLowerCase()) {
            return res.status(401).json({ success: false, message: 'Invalid Transaction Password.' });
        }

        if ((user.walletBalance || 0) < reqAmount) {
            return res.status(400).json({ success: false, message: 'Insufficient income wallet balance.' });
        }

        // Move balance from Income Wallet to Fund/Activation Wallet
        user.walletBalance -= reqAmount;
        user.fundWallet = (user.fundWallet || 0) + reqAmount; // Agar schema me naam alag hai, toh ise change karlena
        await user.save();

        await Transaction.create({
            userId: user.userId,
            type: 'credit_to_wallet',
            amount: reqAmount,
            status: 'completed',
            description: `Credited $${reqAmount} to Fund Wallet`,
            date: new Date()
        });

        res.status(200).json({ success: true, message: `Successfully credited $${reqAmount} to Fund Wallet.` });
    } catch (error) {
        console.error("Credit Wallet Error:", error);
        res.status(500).json({ success: false, message: 'Server error during credit.' });
    }
};