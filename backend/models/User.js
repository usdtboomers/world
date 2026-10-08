const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // ==========================================
  // 🔹 IDENTITY
  // ==========================================
  userId: { type: String, unique: true, required: true }, // Updated to String for 'WF1234567' format
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true },
  country: { type: String },

  // ==========================================
  // 🔹 AUTHENTICATION
  // ==========================================
  password: { type: String, required: true },
  transactionPassword: { type: String, required: true }, // Auto-generated 6-digit
  resetToken: { type: String, default: null },
  resetTokenExpiry: { type: Date, default: null },
  passwordResetCount: { type: Number, default: 0 },
  lastPasswordResetDate: { type: Date },
  otpRequestCount: { type: Number, default: 0 },
  lastOtpRequestDate: { type: Date },

  // ==========================================
  // 🔹 REFERRAL & GLOBAL TEAM
  // ==========================================
  sponsorId: { type: String, default: null }, // Updated to String
  isSponsorDeactivated: { type: Boolean, default: false }, 
  directCount: { type: Number, default: 0 },
  globalTeamCount: { type: Number, default: 0 },
  todayGlobalTeamAdded: { type: Number, default: 0 },
  lastGlobalTeamAddDate: { type: String, default: "" },

  // ==========================================
  // 🔹 SECURITY & TRACKING
  // ==========================================
  deviceId: { type: String, default: null },
  telegramId: { type: String, default: null },
  isTelegramJoined: { type: Boolean, default: false },
  ipAddress: { type: String }, 

  // ==========================================
  // 🔹 WALLETS (DEPOSIT & ACTIVATION)
  // ==========================================
   walletBalance: { type: Number, default: 0 }, // Activation/Top-up wallet

   depositAddress: { type: String, default: null }, // User ka unique crypto address

   
  isToppedUp: { type: Boolean, default: false },
  topUpAmount: { type: Number, default: 0 }, // Upgrade check ke liye (e.g. 30 ka topup)
  topUpDate: { type: Date },

  topUps: [
    {
      plan: { type: String, default: "Basic Package" },
      amount: { type: Number, required: true },
      date: { type: Date, default: Date.now }
    }
  ],



 autoCompoundIncome: { type: Number, default: 0 },
totalAutoCompoundIncome: { type: Number, default: 0 },
  // ==========================================
  // 💰 INCOME WALLETS (WITHDRAWABLE)
  // ==========================================
  directIncome: { type: Number, default: 0 },
  totalDirectIncome: { type: Number, default: 0 }, 
  
  levelIncome: { type: Number, default: 0 },
  totalLevelIncome: { type: Number, default: 0 },
  
  roiIncome: { type: Number, default: 0 }, // 🔥 NAYA: Daily 25-day cycle ROI yahan aayega
  totalRoiIncome: { type: Number, default: 0 },
  
  rewardIncome: { type: Number, default: 0 },     
  totalRewardIncome: { type: Number, default: 0 },
  
  fastTrackIncome: { type: Number, default: 0 },
  totalFastTrackIncome: { type: Number, default: 0 },

  claimedRewards: { type: [Number], default: [] }, 

  // ==========================================
  // 🚀 NAYA: 25-DAYS ROI CYCLE & REINVESTMENT SYSTEM
  // ==========================================
  roiCycles: [{
      amount: { type: Number, required: true },       // Kitne ka package/investment hai
      dailyReturn: { type: Number, required: true },  // Daily kitna USDT/Tokens aayega
      totalDays: { type: Number, default: 25 },       // 🔥 25 Din ka fix cycle
      daysPaid: { type: Number, default: 0 },         // Kitne din mil chuka
      lastPaidDate: { type: String, default: "" },    // Format: YYYY-MM-DD
      isReinvested: { type: Boolean, default: false },// Cycle complete hone ke baad kya ye reinvest hua?
      status: { type: String, enum: ['ACTIVE', 'COMPLETED'], default: 'ACTIVE' }
  }],
  totalReinvestments: { type: Number, default: 0 }, // User ne kitni baar ID reinvest/retopup ki hai

  // ==========================================
  // 🔹 WITHDRAWAL TRACKING
  // ==========================================
  pendingWithdrawals: { type: Number, default: 0 }, 
  totalWithdrawn: { type: Number, default: 0 },     
  




  // ==========================================
  // 🏆 MONTHLY SALARY PLAN TRACKING
  // ==========================================
 

  isSalaryQualified: { type: Boolean, default: false }, // Kya user 10 din me qualify hua?
  salaryMonthsPaid: { type: Number, default: 0 },       // Kitne mahine (max 6) salary mil chuki?
  salaryTotalIncome: { type: Number, default: 0 },      // Total Salary Income ($600 max)
  unclaimedSalary: { type: Number, default: 0 },        // 🔥 NAYA: Cron job isme $100 daalega, user claim karke nikalega
  
  // ==========================================
  // 🔐 WALLET ADDRESS SECURITY
  // ==========================================
  walletAddress: { type: String, default: '' },
  walletAddressChangeCount: { type: Number, default: 0 },
  walletAddressChangeWindowStart: { type: Date, default: null },
  walletAddressUpdatedAt: { type: Date },
  walletAddressHistory: [
    {
      address: { type: String },
      addedAt: { type: Date, default: Date.now },
      changedAt: { type: Date, default: Date.now },
      updatedBy: { type: String, default: "User" } 
    }
  ],

  // ==========================================
  // 🔹 PROFILE EDIT SECURITY
  // ==========================================
  editProfileOtp: { type: String },
  editProfileOtpExpiry: { type: Date },
  profileEditAccessExpiry: { type: Date },

  // ==========================================
  // 🔹 ROLE & STATUS
  // ==========================================
  role: { type: String, enum: ['user', 'admin', 'promo', 'leader', 'superleader'], default: 'user' },
  isBlocked: { type: Boolean, default: false },

}, { timestamps: true });

// 🚀 Indexes for fast performance (Cron Jobs aur Search ke liye)
userSchema.index({ sponsorId: 1 });
userSchema.index({ ipAddress: 1 }); 
userSchema.index({ deviceId: 1 });  
userSchema.index({ createdAt: -1 }); 
userSchema.index({ "roiCycles.status": 1 }); // Cron job daily 25-days ROI queries ko superfast banayega

module.exports = mongoose.model('User', userSchema);