const User = require('../models/User');
const Deposit = require('../models/Deposit');
const Withdrawal = require('../models/Withdrawal'); // ✅ Also needed

// ✅ Deposit Controller
exports.depositAmount = async (req, res) => {
  const { userId, amount } = req.body;

  if (!userId || !amount)
    return res.status(400).json({ message: 'User ID and amount are required' });

  try {
    const user = await User.findOne({ userId: Number(userId) });
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.walletBalance += Number(amount);
    await user.save();

    const deposit = new Deposit({
      userId,
      amount,
      status: 'approved',
      createdAt: new Date()
    });

    await deposit.save(); // ✅ Save the deposit

    console.log(`Deposit successful for UserID ${userId}: $${amount}`);
    res.status(200).json({ message: 'Deposit successful', deposit, newBalance: user.walletBalance });
  } catch (err) {
    console.error('Deposit error:', err);
    res.status(500).json({ message: 'Deposit failed' });
  }
};

// ✅ Top-Up Controller
exports.topUpWallet = async (req, res) => {
  // Add top-up logic here if needed
  res.json({ message: "Top-up endpoint placeholder" });
};

// ✅ Wallet History Controller
exports.getWalletHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const withdrawals = await Withdrawal.find({ userId: Number(userId) }).sort({ date: -1 });
    res.json({ withdrawals });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch history' });
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