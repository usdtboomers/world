// C:\Users\HP\Desktop\worldfinance24\backend\controllers\userController.js
const User = require('../models/User');
const sanitizeUser = require('../utils/sanitizeUser');
const SystemStat = require('../models/SystemStat'); 

// 🔍 1. Get User By ID (Ye function frontend Dashboard se call hota hai)
exports.getUserById = async (req, res) => {
  try {
    // 🔥 FIX: Number() validation hata di hai kyunki ab ID String ("WF...") hai
    const targetUserId = req.params.userId || req.params.id; 

    // Agar ID bilkul na bheji ho tabhi block karenge
    if (!targetUserId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Seedha string id se search hoga
    const user = await User.findOne({ userId: targetUserId }).select("+usdtBep20Balance");
    
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // 🔥 Total Real Users ka count nikalna
    const totalRealUsers = await User.countDocuments({ isToppedUp: true });

    // 🔥 Total Fake Users (Cron wala) ka count nikalna
    const stat = await SystemStat.findOne();
    const globalFakeCount = stat ? stat.globalFakeCount : 0; 

    // Frontend ko user data, real count, aur fake count ek sath bhejo
    res.json({
      success: true,
      user: sanitizeUser(user),
      totalRealUsers: totalRealUsers, 
      globalFakeCount: globalFakeCount 
    });
  } catch (err) {
    console.error("Dashboard Fetch Error:", err);
    res.status(500).json({ message: 'Server error' });
  }
};

// 👤 2. Get Sponsor Name (Registration Verification ke liye)
exports.getSponsorName = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 🔥 FIX: parseInt() hata diya hai taaki string ID ko direct search kar sake
    const sponsor = await User.findOne({ userId: id });
    
    if (!sponsor) {
      return res.status(404).json({ message: 'Invalid Sponsor' });
    }
    
    res.json({ name: sponsor.name });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching sponsor' });
  }
};

// 🔒 3. Block user (Admin Access)
exports.blockUser = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { userId: req.params.id },
      { isBlocked: true },
      { returnDocument: 'after' }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User blocked successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// 🔓 4. Unblock user (Admin Access)
exports.unblockUser = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { userId: req.params.id },
      { isBlocked: false },
      { returnDocument: 'after' }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User unblocked successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// 📋 5. Get all users (Admin Access)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ userId: 1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};