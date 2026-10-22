// // C:\Users\HP\Desktop\worldfinance24\backend\utils\sanitizeUser.js

// module.exports = function sanitizeUser(user) {
//   if (!user) return null;

//   return {
//     userId: user.userId,
//     name: user.name,
//     email: user.email,
//     mobile: user.mobile, 
//     role: user.role,
//     sponsorId: user.sponsorId,
//     createdAt: user.createdAt,
//     // 🛡️ WALLET & SECURITY
//     walletAddress: user.walletAddress || "", 
//     walletAddressChangeCount: user.walletAddressChangeCount || 0,
//     walletAddressChangeWindowStart: user.walletAddressChangeWindowStart,
//     walletAddressHistory: user.walletAddressHistory || [], 
//     pendingWithdrawals: user.pendingWithdrawals || 0,

//     // 💰 WALLET BALANCES
//     walletBalance: user.walletBalance || 0,
//     usdtBep20Balance: user.usdtBep20Balance || 0, 
//     directIncome: user.directIncome || 0,
//     levelIncome: user.levelIncome || 0,
//     totalLevelIncome: user.totalLevelIncome || 0, 
//     poolIncome: user.poolIncome || 0,
//     rewardIncome: user.rewardIncome || 0,
//     totalWithdrawn: user.totalWithdrawn || 0,

     

//     // 🚀 TOPUP & STATUS
//     isToppedUp: user.isToppedUp,
//     topUpAmount: user.topUpAmount,
//     topUpDate: user.topUpDate,
//     hasTopup: user.hasTopup,
//     levelStatus: user.levelStatus,
//     isTelegramJoined: user.isTelegramJoined,

//     // 👥 TEAM DATA
//     globalTeamCount: user.globalTeamCount || 0,
//     directCount: user.directCount || 0,

//     // 🌊 POOL DATA 
//     activePools: user.activePools || [] 
//   };
// };

module.exports = function sanitizeUser(user) {
  if (!user) return null;

  // 🔥 YEH NAYA LOGIC HAI: Sabhi 'total' incomes ko jod kar Total Earning nikalna
  const totalEarnings = (Number(user.totalDirectIncome) || 0) + 
                        (Number(user.totalLevelIncome) || 0) + 
                        (Number(user.totalRoiIncome) || 0) + 
                        (Number(user.totalRewardIncome) || 0) + 
                        (Number(user.totalFastTrackIncome) || 0) + // Isko wapas add kar diya
                        (Number(user.poolIncome) || 0);

  return {
    userId: user.userId,
    name: user.name,
    email: user.email,
    mobile: user.mobile, 
    role: user.role,
    sponsorId: user.sponsorId,
    createdAt: user.createdAt,
    
    // 🛡️ WALLET & SECURITY
    walletAddress: user.walletAddress || "", 
    walletAddressChangeCount: user.walletAddressChangeCount || 0,
    walletAddressChangeWindowStart: user.walletAddressChangeWindowStart,
    walletAddressHistory: user.walletAddressHistory || [], 
    pendingWithdrawals: user.pendingWithdrawals || 0,

    // 💰 WALLET BALANCES
    walletBalance: user.walletBalance || 0,
    usdtWallet: user.usdtWallet || 0, 

    // 💵 INDIVIDUAL INCOMES (Aapke DB ke hisaab se sabhi fields)
    directIncome: user.directIncome || 0,
    totalDirectIncome: user.totalDirectIncome || 0,
    
    levelIncome: user.levelIncome || 0,
    totalLevelIncome: user.totalLevelIncome || 0, 
    // 🔥 NAYE WALLETS YAHAN ADD KAR DIJIYE
    levelRoiIncome: user.levelRoiIncome || 0,
    totalLevelRoiIncome: user.totalLevelRoiIncome || 0,
    
    roiIncome: user.roiIncome || 0,
    totalRoiIncome: user.totalRoiIncome || 0,
    
    rewardIncome: user.rewardIncome || 0,
    totalRewardIncome: user.totalRewardIncome || 0,
    
    fastTrackIncome: user.fastTrackIncome || 0,
    totalFastTrackIncome: user.totalFastTrackIncome || 0,
    
    poolIncome: user.poolIncome || 0,

    // 🚀 🔥 TOTAL EARNING (Dashboard pe dikhane ke liye)
    totalEarnings: totalEarnings,
    
    totalWithdrawn: user.totalWithdrawn || 0,

    // 🚀 TOPUP & STATUS
    isToppedUp: user.isToppedUp,
    topUpAmount: user.topUpAmount,
    topUpDate: user.topUpDate,
    hasTopup: user.hasTopup,
    levelStatus: user.levelStatus,
    isTelegramJoined: user.isTelegramJoined,

    // 🔥 NAYA ADD KIYA HAI: Frontend pe My Topup calculate karne ke liye
    packages: user.packages || [], 

    // 👥 TEAM DATA
    globalTeamCount: user.globalTeamCount || 0,
    directCount: user.directCount || 0,

    // 🌊 POOL DATA 
    activePools: user.activePools || [] 
  };
};