
// const User = require('../models/User'); 
// const PackageActivation = require('../models/PackageActivation'); 
// const Transaction = require('../models/Transaction'); 

// exports.activatePackage = async (req, res) => {
//     try {
//         const { userId, memberId, packageAmount, txnPassword } = req.body;
//         const amount = Number(packageAmount);

//         // 🔥 FIX: STRICT PACKAGE ARRAY VALIDATION (Hacker Blocker)
//         // Yahan par sirf wahi amounts likhein jo aapke real system mein hain!
//         const VALID_PACKAGES = [2, 5, 10, 20, 50, 100, 200, 500, 1000]; 

//         if (!amount || isNaN(amount) || amount <= 0) {
//             return res.status(400).json({ success: false, message: 'Invalid Package Amount.' });
//         }

//         // 🚨 HACKER BLOCKER LOGIC
//         if (!VALID_PACKAGES.includes(amount)) {
//             console.warn(`🚨 SECURITY ALERT: User ${userId} tried to activate fake package of $${amount}`);
//             return res.status(403).json({ success: false, message: 'Security System: Custom or Fake Package Amounts are blocked!' });
//         }

//         // 1. Current User (Jo buy kar raha hai)
//         const currentUser = await User.findOne({ userId: String(userId) });
//         if (!currentUser) {
//             return res.status(404).json({ success: false, message: "Current user not found" });
//         }

//         // 2. Target Member (Jiski ID active karni hai)
//         const targetUser = await User.findOne({ userId: String(memberId) });
//         if (!targetUser) {
//             return res.status(404).json({ success: false, message: "Member ID not found" });
//         }

//         // 🔥 NAYA LOGIC: 24 Ghante ki Limitation
//         const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
//         const recentPackage = await PackageActivation.findOne({
//             userId: targetUser.userId,
//             startDate: { $gte: twentyFourHoursAgo }
//         });

//         if (recentPackage) {
//             return res.status(400).json({ 
//                 success: false, 
//                 message: "This user has already activated a package in the last 24 hours. Please try again after 24 hours." 
//             });
//         }

//         // 3. 🔐 PLAIN TEXT Transaction Password Verify
//         if (!txnPassword) {
//             return res.status(400).json({ success: false, message: "Transaction password is required" });
//         }
        
//         // 🔥 CRASH FIX: Pehle check karo ki DB mein password hai ya nahi
//         if (!currentUser.transactionPassword || txnPassword.toLowerCase() !== currentUser.transactionPassword.toLowerCase()) {
//             return res.status(400).json({ success: false, message: "Invalid Transaction Password!" });
//         }

//         // 4. Fund Wallet Check
//         if ((currentUser.walletBalance || 0) < amount) {
//             return res.status(400).json({ success: false, message: "Insufficient Fund Amount ($)!" });
//         }

//         // 5. Balance Deduct karna
//         currentUser.walletBalance -= amount;
//         await currentUser.save();

//         // 6. 25 Days Expiry set karna & Package Record banana
//         const activeDays = 25; 
//         const startDate = new Date();
//         const endDate = new Date();
//         endDate.setDate(startDate.getDate() + activeDays);
//         const dailyRoi = amount * 0.05; // 5% daily in USD

//         const newPackage = await PackageActivation.create({
//             userId: targetUser.userId,         
//             memberId: targetUser.userId,       
//             purchasedBy: currentUser.userId,
//             packageAmount: amount,             
//             dailyRoi: dailyRoi,
//             totalDays: activeDays,
//             daysCompleted: 0,
//             startDate: startDate,
//             endDate: endDate,
//             status: 'active'
//         });

//         // 7. Target User Core Update (Marking ID as Active)
//         let isFirstTopup = !targetUser.isToppedUp;
//         if (!targetUser.packages) targetUser.packages = [];
//         targetUser.packages.push({ plan: "Investment Package", amount: amount, startDate: new Date(), withdrawn: 0 });
        
//         targetUser.topUpAmount = Math.max(targetUser.topUpAmount || 0, amount);
//         targetUser.updatedAt = new Date(); 
//         if (isFirstTopup) {
//             targetUser.isToppedUp = true;
//             targetUser.topUpDate = new Date();
//         }
//         await targetUser.save();

//         const createTransaction = async (data) => {
//             return Transaction.create({ ...data, date: new Date() });
//         };

//         // Self package activation transaction
//         await createTransaction({
//             userId: currentUser.userId, type: "package_activation", amount: amount,
//             fromUserId: currentUser.userId, toUserId: targetUser.userId,
//             description: `Activated $${amount} Package for ${targetUser.userId}`, status: 'success'
//         });

//         // 🔥 Frontend ko instant success response
//         res.status(200).json({ 
//             success: true, 
//             message: `Package of $${amount} activated successfully for ${targetUser.userId}!`,
//             data: newPackage
//         });

//         // =======================================================
//         // 🔹 8. BACKGROUND MLM ENGINE ($2 Minimum Logic & Level 2-12)
//         // =======================================================
//         (async () => {
//             try {
//                 // ✅ SPONSOR INCOME (10% at 1st Level) - REQUIRES MINIMUM $2 PACKAGE
//                 if (targetUser.sponsorId) {
//                     const sponsor = await User.findOne({ userId: targetUser.sponsorId });
                    
//                     if (sponsor && sponsor.isToppedUp && (sponsor.topUpAmount >= 2)) {
//                         sponsor.directCount = (sponsor.directCount || 0) + 1;
//                         const DIRECT_PERCENT = 10; 
//                         const directBonusAmount = (amount * DIRECT_PERCENT) / 100; 

//                         sponsor.directIncome = (sponsor.directIncome || 0) + directBonusAmount;
//                         sponsor.totalDirectIncome = (sponsor.totalDirectIncome || 0) + directBonusAmount;
                        
//                         await createTransaction({
//                             userId: sponsor.userId, type: "direct_income", source: "direct", amount: directBonusAmount, 
//                             package: amount, 
//                             fromUserId: targetUser.userId, description: `Direct Bonus (10%) from ${targetUser.userId}'s Package`, status: 'success'
//                         });
//                         await sponsor.save();
//                     } else if (sponsor) {
//                         console.log(`[FLUSHED] Direct Income stopped for Sponsor ${sponsor.userId} because package is less than $2 or inactive.`);
//                     }
//                 }

//                 // 🌟 LEVEL ENGINE (Level 2 to 12 = 0.25%)
//                 const LEVEL_PERCENTAGES = [0, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25]; 
//                 let currentUplineId = targetUser.sponsorId; 
//                 let currentLevel = 1; 

//                 while (currentUplineId && currentLevel <= 12) {
//                     const upline = await User.findOne({ userId: currentUplineId }).select('userId isToppedUp topUpAmount sponsorId _id');
//                     if (!upline) break;

//                     // 🛑 RULE 1: INACTIVE OR < $2 BLOCKER (INCOME FLUSH)
//                     if (!upline.isToppedUp || (upline.topUpAmount || 0) < 2) {
//                         console.log(`[FLUSHED] Income stopped for Upline ${upline.userId} at Level ${currentLevel} because package is < $2 or inactive.`);
//                         currentUplineId = upline.sponsorId;
//                         currentLevel++;
//                         continue; 
//                     }

//                     // 1. LEVEL INCOME LOGIC (Level 2 se 12 tak)
//                     if (currentLevel >= 2 && currentLevel <= 12) {
//                         const percentage = LEVEL_PERCENTAGES[currentLevel - 1]; 
//                         const levelAmount = (amount * percentage) / 100;

//                         if (levelAmount > 0) {
//                             await User.updateOne({ _id: upline._id }, { $inc: { levelIncome: levelAmount, totalLevelIncome: levelAmount } });
                            
//                             await createTransaction({
//                                 userId: upline.userId, type: "level_income", source: "level", amount: levelAmount,
//                                 package: amount, 
//                                 fromUserId: targetUser.userId, description: `Level ${currentLevel} Income (${percentage}%) from Package`, status: 'success'
//                             });
//                         }
//                     }

//                     currentUplineId = upline.sponsorId;
//                     currentLevel++;
//                 }
//             } catch (bgError) {
//                 console.error("Background MLM Engine Error (Package Activation):", bgError);
//             }
//         })();

//     } catch (error) {
//         console.error("Package Activation Error:", error);
//         res.status(500).json({ success: false, message: "Server Error during activation" });
//     }
// };

// // =======================================================
// // 🔹 GET USER PACKAGES LOGIC 
// // =======================================================
// exports.getUserPackages = async (req, res) => {
//     try {
//         const { userId } = req.params;

//         const packages = await PackageActivation.find({ userId: String(userId) }).sort({ startDate: -1 });

//         res.status(200).json({
//             success: true,
//             data: packages
//         });

//     } catch (error) {
//         console.error("Error fetching user packages:", error);
//         res.status(500).json({ 
//             success: false, 
//             message: "Server Error while fetching packages" 
//         });
//     }
// };



const User = require('../models/User'); 
const PackageActivation = require('../models/PackageActivation'); 
const Transaction = require('../models/Transaction'); 
const AutoCompoundPackage = require('../models/AutoCompoundPackage');

// exports.activatePackage = async (req, res) => {
//     try {
//         const { userId, memberId, packageAmount, txnPassword } = req.body;
//         const amount = Number(packageAmount);

//         // 🔥 FIX: STRICT PACKAGE ARRAY VALIDATION (Hacker Blocker)
//         const VALID_PACKAGES = [2, 5, 10, 20, 50, 100, 200, 500, 1000]; 

//         if (!amount || isNaN(amount) || amount <= 0) {
//             return res.status(400).json({ success: false, message: 'Invalid Package Amount.' });
//         }

//         // 🚨 HACKER BLOCKER LOGIC
//         if (!VALID_PACKAGES.includes(amount)) {
//             console.warn(`🚨 SECURITY ALERT: User ${userId} tried to activate fake package of $${amount}`);
//             return res.status(403).json({ success: false, message: 'Security System: Custom or Fake Package Amounts are blocked!' });
//         }

//         // 1. Current User (Jo buy kar raha hai)
//         const currentUser = await User.findOne({ userId: String(userId) });
//         if (!currentUser) {
//             return res.status(404).json({ success: false, message: "Current user not found" });
//         }

//         // 2. Target Member (Jiski ID active karni hai)
//         const targetUser = await User.findOne({ userId: String(memberId) });
//         if (!targetUser) {
//             return res.status(404).json({ success: false, message: "Member ID not found" });
//         }

//         // // 🔥 24 Ghante ki Limitation
//         // const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
//         // const recentPackage = await PackageActivation.findOne({
//         //     userId: targetUser.userId,
//         //     startDate: { $gte: twentyFourHoursAgo }
//         // });

//         // if (recentPackage) {
//         //     return res.status(400).json({ 
//         //         success: false, 
//         //         message: "This user has already activated a package in the last 24 hours. Please try again after 24 hours." 
//         //     });
//         // }

//         // 3. 🔐 PLAIN TEXT Transaction Password Verify
//         if (!txnPassword) {
//             return res.status(400).json({ success: false, message: "Transaction password is required" });
//         }
        
//         if (!currentUser.transactionPassword || txnPassword.toLowerCase() !== currentUser.transactionPassword.toLowerCase()) {
//             return res.status(400).json({ success: false, message: "Invalid Transaction Password!" });
//         }

//         // 4. Fund Wallet Check
//         if ((currentUser.walletBalance || 0) < amount) {
//             return res.status(400).json({ success: false, message: "Insufficient Fund Amount ($)!" });
//         }

//         // 5. Balance Deduct karna
//         currentUser.walletBalance -= amount;
//         await currentUser.save();

//         // 6. 25 Days Expiry set karna & Package Record banana
//         const activeDays = 25; 
//         const startDate = new Date();
//         const endDate = new Date();
//         endDate.setDate(startDate.getDate() + activeDays);
//         const dailyRoi = amount * 0.05; // 5% daily in USD

//         const newPackage = await PackageActivation.create({
//             userId: targetUser.userId,         
//             memberId: targetUser.userId,       
//             purchasedBy: currentUser.userId,
//             packageAmount: amount,             
//             dailyRoi: dailyRoi,
//             totalDays: activeDays,
//             daysCompleted: 0,
//             startDate: startDate,
//             endDate: endDate,
//             status: 'active'
//         });

//         // 7. Target User Core Update (Marking ID as Active)
//         let isFirstTopup = !targetUser.isToppedUp;
//         if (!targetUser.packages) targetUser.packages = [];
//         targetUser.packages.push({ plan: "Investment Package", amount: amount, startDate: new Date(), withdrawn: 0 });
        
//         targetUser.topUpAmount = Math.max(targetUser.topUpAmount || 0, amount);
//         targetUser.updatedAt = new Date(); 
//         if (isFirstTopup) {
//             targetUser.isToppedUp = true;
//             targetUser.topUpDate = new Date();
//         }
//         await targetUser.save();

//         const createTransaction = async (data) => {
//             return Transaction.create({ ...data, date: new Date() });
//         };

//         // Self package activation transaction
//         await createTransaction({
//             userId: currentUser.userId, type: "package_activation", amount: amount,
//             fromUserId: currentUser.userId, toUserId: targetUser.userId,
//             description: `Activated $${amount} Package for ${targetUser.userId}`, status: 'success'
//         });

//         // 🔥 Frontend ko instant success response
//         res.status(200).json({ 
//             success: true, 
//             message: `Package of $${amount} activated successfully for ${targetUser.userId}!`,
//             data: newPackage
//         });

//         // =======================================================
//         // 🔹 8. BACKGROUND MLM ENGINE (STRICT 25-DAY ACTIVE PACKAGE LOGIC)
//         // =======================================================
//        // =======================================================
//         // 🔹 8. BACKGROUND MLM ENGINE (STRICT 25-DAY ACTIVE PACKAGE LOGIC)
//         // =======================================================
//         (async () => {
//             try {
//                 // ✅ HELPER: Universal Active Check (Dono tables me check karega)
//                 const checkIsActive = async (userId) => {
//                     const hasNormalActive = await PackageActivation.exists({
//                         userId: userId,
//                         endDate: { $gt: new Date() },
//                         packageAmount: { $gte: 2 }
//                     });
                    
//                     const hasCompoundActive = await AutoCompoundPackage.exists({
//                         userId: userId,
//                         endDate: { $gt: new Date() }, 
//                         packageAmount: { $gte: 2 },
//                         status: 'active'
//                     });
                    
//                     return hasNormalActive || hasCompoundActive; 
//                 };

//                 // ✅ SPONSOR INCOME (10% at 1st Level)
//                 if (targetUser.sponsorId) {
//                     const sponsor = await User.findOne({ userId: targetUser.sponsorId });
                    
//                     if (sponsor) {
//                         // 🔥 NAYA LOGIC: Dono Tables me check karo
//                         const isActiveSponsor = await checkIsActive(sponsor.userId);

//                         if (isActiveSponsor) {
//                             sponsor.directCount = (sponsor.directCount || 0) + 1;
//                             const DIRECT_PERCENT = 10; 
//                             const directBonusAmount = (amount * DIRECT_PERCENT) / 100; 

//                             sponsor.directIncome = (sponsor.directIncome || 0) + directBonusAmount;
//                             sponsor.totalDirectIncome = (sponsor.totalDirectIncome || 0) + directBonusAmount;
                            
//                             await createTransaction({
//                                 userId: sponsor.userId, type: "direct_income", source: "direct", amount: directBonusAmount, 
//                                 package: amount, 
//                                 fromUserId: targetUser.userId, description: `Direct Bonus (10%) from ${targetUser.userId}'s Package`, status: 'success'
//                             });
//                             await sponsor.save();
//                         } else {
//                             console.log(`[FLUSHED] Direct Income stopped for Sponsor ${sponsor.userId}. Reason: Package Expired or < $2.`);
//                         }
//                     }
//                 }

//                 // 🌟 LEVEL ENGINE (Level 2 to 12 = 0.25%)
//                 const LEVEL_PERCENTAGES = [0, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25]; 
//                 let currentUplineId = targetUser.sponsorId; 
//                 let currentLevel = 1; 

//                 while (currentUplineId && currentLevel <= 12) {
//                     const upline = await User.findOne({ userId: currentUplineId }).select('userId isToppedUp topUpAmount sponsorId _id');
//                     if (!upline) break;

//                     // 🔥 NAYA LOGIC: Dono Tables me check karo
//                     const isActiveUpline = await checkIsActive(upline.userId);

//                     // 🛑 RULE 1: INACTIVE OR EXPIRED BLOCKER (INCOME FLUSH)
//                     if (!isActiveUpline) {
//                         console.log(`[FLUSHED] Level Income stopped for Upline ${upline.userId} at Level ${currentLevel}. Reason: Package Expired (>25 days).`);
//                         currentUplineId = upline.sponsorId; 
//                         currentLevel++;
//                         continue; 
//                     }

//                     // 1. LEVEL INCOME LOGIC (Level 2 se 12 tak)
//                     if (currentLevel >= 2 && currentLevel <= 12) {
//                         const percentage = LEVEL_PERCENTAGES[currentLevel - 1]; 
//                         const levelAmount = (amount * percentage) / 100;

//                         if (levelAmount > 0) {
//                             await User.updateOne({ _id: upline._id }, { $inc: { levelIncome: levelAmount, totalLevelIncome: levelAmount } });
                            
//                             await createTransaction({
//                                 userId: upline.userId, type: "level_income", source: "level", amount: levelAmount,
//                                 package: amount, 
//                                 fromUserId: targetUser.userId, description: `Level ${currentLevel} Income (${percentage}%) from Package`, status: 'success'
//                             });
//                         }
//                     }

//                     currentUplineId = upline.sponsorId;
//                     currentLevel++;
//                 }
//             } catch (bgError) {
//                 console.error("Background MLM Engine Error (Package Activation):", bgError);
//             }
//         })();

//     } catch (error) {
//         console.error("Package Activation Error:", error);
//         res.status(500).json({ success: false, message: "Server Error during activation" });
//     }
// };


 
// exports.activateAutoCompoundPackage = async (req, res) => {
//     try {
//         const { userId, memberId, packageAmount, txnPassword } = req.body;
//         const amount = Number(packageAmount);
        
//         // 🔥 NAYA LOGIC: Strictly 70 Days Timer
//         const cycleDays = 70; 
//         const packageLife = 70; 

//         // 🔥 NAYA LOGIC: Valid packages list (Poster ke hisaab se)
//         const VALID_PACKAGES = [2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000]; 

//         if (!amount || isNaN(amount) || amount <= 0) {
//             return res.status(400).json({ success: false, message: 'Invalid Package Amount.' });
//         }

//         if (!VALID_PACKAGES.includes(amount)) {
//             console.warn(`🚨 SECURITY ALERT: User ${userId} tried fake Auto Compound package of $${amount}`);
//             return res.status(403).json({ success: false, message: 'Security System: Custom or Fake Package Amounts are blocked!' });
//         }

//         const currentUser = await User.findOne({ userId: String(userId) });
//         if (!currentUser) return res.status(404).json({ success: false, message: "Current user not found" });

//         const targetUser = await User.findOne({ userId: String(memberId) });
//         if (!targetUser) return res.status(404).json({ success: false, message: "Member ID not found" });

//         if (!txnPassword || !currentUser.transactionPassword || txnPassword.toLowerCase() !== currentUser.transactionPassword.toLowerCase()) {
//             return res.status(400).json({ success: false, message: "Invalid Transaction Password!" });
//         }

//         // Fund Wallet Check
//         if ((currentUser.walletBalance || 0) < amount) {
//             return res.status(400).json({ success: false, message: "Insufficient Fund Amount ($)!" });
//         }

//         currentUser.walletBalance -= amount;
//         await currentUser.save();

//         // =======================================================
//         // 🔥 DATES SETUP (70 Days)
//         // =======================================================
//         const startDate = new Date();
//         const endDate = new Date();
//         endDate.setDate(startDate.getDate() + packageLife); 

//         const compoundingEndDate = new Date();
//         compoundingEndDate.setDate(startDate.getDate() + cycleDays); 

//         const newCompoundPackage = await AutoCompoundPackage.create({
//             userId: targetUser.userId,         
//             memberId: targetUser.userId,       
//             purchasedBy: currentUser.userId,
//             packageAmount: amount,           
//             dailyPercentage: 1, // 🔥 NAYA LOGIC: 1% Daily ROI
//             totalDays: packageLife, // 70 Din
//             compoundingDuration: cycleDays, // 70 Din
//             compoundingEndDate: compoundingEndDate, 
//             daysCompleted: 0,
//             startDate: startDate,
//             endDate: endDate, 
//             status: 'active',
//             packageType: 'master', 
//             masterId: null 
//         });

//         // Target User ki basic info update
//         let isFirstTopup = !targetUser.isToppedUp;
//         if (!targetUser.packages) targetUser.packages = [];
//         targetUser.packages.push({ 
//             plan: "Auto Compound (1%)", 
//             amount: amount, 
//             duration: cycleDays, 
//             startDate: new Date() 
//         });
        
//         targetUser.topUpAmount = Math.max(targetUser.topUpAmount || 0, amount);
//         targetUser.updatedAt = new Date(); 
//         if (isFirstTopup) {
//             targetUser.isToppedUp = true;
//             targetUser.topUpDate = new Date();
//         }
//         await targetUser.save();

//         const createTransaction = async (data) => {
//             return Transaction.create({ ...data, date: new Date() });
//         };

//         await createTransaction({
//             userId: currentUser.userId, type: "compound_activation", amount: amount,
//             fromUserId: currentUser.userId, toUserId: targetUser.userId,
//             description: `Activated $${amount} Auto Compound (70 Days Timer) for ${targetUser.userId}`, status: 'success'
//         });

//         res.status(200).json({ 
//             success: true, 
//             message: `Auto Compound Package of $${amount} (Timer: 70 Days) activated successfully for ${targetUser.userId}!`,
//             userId: targetUser.userId, 
//             memberId: targetUser.userId, 
//             data: newCompoundPackage
//         });

//         // =======================================================
//         // 🔹 BACKGROUND MLM ENGINE (INSTANT DIRECT & LEVEL)
//         // =======================================================
//         (async () => {
//             try {
//                 const checkIsActive = async (userId) => {
//                     const hasNormalActive = await PackageActivation.exists({
//                         userId: userId, endDate: { $gt: new Date() }, packageAmount: {$gte: 2 }
//                     });
//                     const hasCompoundActive = await AutoCompoundPackage.exists({
//                         userId: userId, endDate: { $gt: new Date() }, packageAmount: {$gte: 2 }, status: 'active'
//                     });
//                     return hasNormalActive || hasCompoundActive; 
//                 };

//                 // 1. DIRECT INCOME (5%)
//                 if (targetUser.sponsorId) {
//                     const sponsor = await User.findOne({ userId: targetUser.sponsorId });
//                     if (sponsor) {
//                         const isActiveSponsor = await checkIsActive(sponsor.userId); 
//                         if (isActiveSponsor) {
//                             sponsor.directCount = (sponsor.directCount || 0) + 1;
//                             const directBonusAmount = (amount * 5) / 100; 
//                             sponsor.directIncome = (sponsor.directIncome || 0) + directBonusAmount;
//                             sponsor.totalDirectIncome = (sponsor.totalDirectIncome || 0) + directBonusAmount;
                            
//                             await createTransaction({
//                                 userId: sponsor.userId, type: "direct_income", source: "direct", amount: directBonusAmount, 
//                                 package: amount, fromUserId: targetUser.userId, description: `Direct Bonus (5%) from ${targetUser.userId}'s Compound Package`, status: 'success'
//                             });
//                             await sponsor.save();
//                         }
//                     }
//                 }

//                 // 2. LEVEL INCOME (0.25% upto 12 Levels)
//                 const LEVEL_PERCENTAGES = [0, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25]; 
//                 let currentUplineId = targetUser.sponsorId; 
//                 let currentLevel = 1; 

//                 while (currentUplineId && currentLevel <= 12) {
//                     const upline = await User.findOne({ userId: currentUplineId }).select('userId isToppedUp topUpAmount sponsorId _id');
//                     if (!upline) break;

//                     const isActiveUpline = await checkIsActive(upline.userId);
//                     if (!isActiveUpline) {
//                         currentUplineId = upline.sponsorId; 
//                         currentLevel++;
//                         continue; 
//                     }

//                     if (currentLevel >= 2 && currentLevel <= 12) {
//                         const percentage = LEVEL_PERCENTAGES[currentLevel - 1]; 
//                         const levelAmount = (amount * percentage) / 100;

//                         if (levelAmount > 0) {
//                             await User.updateOne({ _id: upline._id }, { $inc: { levelIncome: levelAmount, totalLevelIncome: levelAmount } });
//                             await createTransaction({
//                                 userId: upline.userId, type: "level_income", source: "level", amount: levelAmount,
//                                 package: amount, fromUserId: targetUser.userId, description: `Level ${currentLevel} Income (${percentage}%) from Compound Package`, status: 'success'
//                             });
//                         }
//                     }
//                     currentUplineId = upline.sponsorId;
//                     currentLevel++;
//                 }
//             } catch (bgError) {
//                 console.error("Background MLM Engine Error (Compound Package):", bgError);
//             }
//         })();

//     } catch (error) {
//         console.error("Compound Package Activation Error:", error);
//         res.status(500).json({ success: false, message: "Server Error during activation" });
//     }
// };

// exports.activateAutoCompoundPackage = async (req, res) => {
//     try {
//         const { userId, memberId, packageAmount, txnPassword, duration } = req.body;
//         const amount = Number(packageAmount);
        
//         // cycleDays = 25, 50, ya 100 (Yeh Compounding Mode ka timer hai)
//         const cycleDays = Number(duration); 
        
//         // packageLife = 25 (Har package strictly 25 din hi zinda rahega)
//         const packageLife = 25; 

//         const VALID_PACKAGES = [2, 5, 10, 20, 50, 100, 200, 500, 1000]; 
//         const VALID_DURATIONS = [25, 50, 100]; 

//         if (!amount || isNaN(amount) || amount <= 0) {
//             return res.status(400).json({ success: false, message: 'Invalid Package Amount.' });
//         }

//         if (!VALID_DURATIONS.includes(cycleDays)) {
//             return res.status(400).json({ success: false, message: 'Invalid Duration. Choose 25, 50, or 100 days.' });
//         }

//         if (!VALID_PACKAGES.includes(amount)) {
//             console.warn(`🚨 SECURITY ALERT: User ${userId} tried fake Auto Compound package of $${amount}`);
//             return res.status(403).json({ success: false, message: 'Security System: Custom or Fake Package Amounts are blocked!' });
//         }

//         const currentUser = await User.findOne({ userId: String(userId) });
//         if (!currentUser) return res.status(404).json({ success: false, message: "Current user not found" });

//         const targetUser = await User.findOne({ userId: String(memberId) });
//         if (!targetUser) return res.status(404).json({ success: false, message: "Member ID not found" });

//         if (!txnPassword || !currentUser.transactionPassword || txnPassword.toLowerCase() !== currentUser.transactionPassword.toLowerCase()) {
//             return res.status(400).json({ success: false, message: "Invalid Transaction Password!" });
//         }

//         // Fund Wallet Check
//         if ((currentUser.walletBalance || 0) < amount) {
//             return res.status(400).json({ success: false, message: "Insufficient Fund Amount ($)!" });
//         }

//         currentUser.walletBalance -= amount;
//         await currentUser.save();

//         // =======================================================
//         // 🔥 NAYA MASTER LOGIC: DATES SEPARATION 🔥
//         // =======================================================
//         const startDate = new Date();
        
//         // 1. Package ki asli Maut (Expiry Date) - Har package 25 din baad expire hoga
//         const endDate = new Date();
//         endDate.setDate(startDate.getDate() + packageLife); 

//         // 2. Compounding Phase ka End Date - Reinvestment kab tak chalega (25, 50, 100)
//         const compoundingEndDate = new Date();
//         compoundingEndDate.setDate(startDate.getDate() + cycleDays); 

//         const newCompoundPackage = await AutoCompoundPackage.create({
//             userId: targetUser.userId,         
//             memberId: targetUser.userId,       
//             purchasedBy: currentUser.userId,
//             packageAmount: amount,           
//             dailyPercentage: 6, // 6% Daily ROI
//             totalDays: packageLife, // 25 din ki package life
//             compoundingDuration: cycleDays, // User ne 50 ya 100 select kiya
//             compoundingEndDate: compoundingEndDate, // Is date tak daily naya package banega
//             daysCompleted: 0,
//             startDate: startDate,
//             endDate: endDate, // 25 din baad Master Package expire
//             status: 'active',
//             packageType: 'master', 
//             masterId: null 
//         });

//         // Target User ki basic info update
//         let isFirstTopup = !targetUser.isToppedUp;
//         if (!targetUser.packages) targetUser.packages = [];
//         targetUser.packages.push({ 
//             plan: "Auto Compound (6%)", 
//             amount: amount, 
//             duration: cycleDays, 
//             startDate: new Date() 
//         });
        
//         targetUser.topUpAmount = Math.max(targetUser.topUpAmount || 0, amount);
//         targetUser.updatedAt = new Date(); 
//         if (isFirstTopup) {
//             targetUser.isToppedUp = true;
//             targetUser.topUpDate = new Date();
//         }
//         await targetUser.save();

//         const createTransaction = async (data) => {
//             return Transaction.create({ ...data, date: new Date() });
//         };

//         await createTransaction({
//             userId: currentUser.userId, type: "compound_activation", amount: amount,
//             fromUserId: currentUser.userId, toUserId: targetUser.userId,
//             description: `Activated $${amount} Auto Compound (${cycleDays} Days Timer) for ${targetUser.userId}`, status: 'success'
//         });

//         // res.status(200).json({ 
//         //     success: true, 
//         //     message: `Auto Compound Package of $${amount} (Timer: ${cycleDays} Days) activated successfully!`,
//         //     data: newCompoundPackage
//         // });

//         res.status(200).json({ 
//             success: true, 
//             message: `Auto Compound Package of $${amount} (Timer: ${cycleDays} Days) activated successfully for ${targetUser.userId}!`,
//             userId: targetUser.userId, // 🔥 Yeh raha naya userId
//             memberId: targetUser.userId, // 🔥 MemberId bhi add kar diya
//             data: newCompoundPackage
//         });

//         // =======================================================
//         // 🔹 BACKGROUND MLM ENGINE (DIRECT & LEVEL INSTANT DE RAHE HAIN)
//         // =======================================================
//         // =======================================================
//         // 🔹 BACKGROUND MLM ENGINE (DIRECT & LEVEL INSTANT DE RAHE HAIN)
//         // =======================================================
//         (async () => {
//             try {
//                 // ✅ HELPER: Universal Active Check (Dono tables me check karega)
//                 const checkIsActive = async (userId) => {
//                     const hasNormalActive = await PackageActivation.exists({
//                         userId: userId,
//                         endDate: { $gt: new Date() },
//                         packageAmount: { $gte: 2 }
//                     });
                    
//                     const hasCompoundActive = await AutoCompoundPackage.exists({
//                         userId: userId,
//                         endDate: { $gt: new Date() }, 
//                         packageAmount: { $gte: 2 },
//                         status: 'active'
//                     });
                    
//                     return hasNormalActive || hasCompoundActive; 
//                 };

//                 // 1. DIRECT INCOME (10%)
//                 if (targetUser.sponsorId) {
//                     const sponsor = await User.findOne({ userId: targetUser.sponsorId });
                    
//                     if (sponsor) {
//                         // 🔥 NAYA LOGIC: Universal Check
//                         const isActiveSponsor = await checkIsActive(sponsor.userId); 

//                         if (isActiveSponsor) {
//                             sponsor.directCount = (sponsor.directCount || 0) + 1;
//                             const directBonusAmount = (amount * 10) / 100; 

//                             sponsor.directIncome = (sponsor.directIncome || 0) + directBonusAmount;
//                             sponsor.totalDirectIncome = (sponsor.totalDirectIncome || 0) + directBonusAmount;
                            
//                             await createTransaction({
//                                 userId: sponsor.userId, type: "direct_income", source: "direct", amount: directBonusAmount, 
//                                 package: amount, 
//                                 fromUserId: targetUser.userId, description: `Direct Bonus (10%) from ${targetUser.userId}'s Compound Package`, status: 'success'
//                             });
//                             await sponsor.save();
//                         }
//                     }
//                 }

//                 // 2. LEVEL INCOME (0.25% upto 12 Levels)
//                 const LEVEL_PERCENTAGES = [0, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25]; 
//                 let currentUplineId = targetUser.sponsorId; 
//                 let currentLevel = 1; 

//                 while (currentUplineId && currentLevel <= 12) {
//                     const upline = await User.findOne({ userId: currentUplineId }).select('userId isToppedUp topUpAmount sponsorId _id');
//                     if (!upline) break;

//                     // 🔥 NAYA LOGIC: Universal Check
//                     const isActiveUpline = await checkIsActive(upline.userId);

//                     if (!isActiveUpline) {
//                         currentUplineId = upline.sponsorId; 
//                         currentLevel++;
//                         continue; 
//                     }

//                     if (currentLevel >= 2 && currentLevel <= 12) {
//                         const percentage = LEVEL_PERCENTAGES[currentLevel - 1]; 
//                         const levelAmount = (amount * percentage) / 100;

//                         if (levelAmount > 0) {
//                             await User.updateOne({ _id: upline._id }, { $inc: { levelIncome: levelAmount, totalLevelIncome: levelAmount } });
                            
//                             await createTransaction({
//                                 userId: upline.userId, type: "level_income", source: "level", amount: levelAmount,
//                                 package: amount, 
//                                 fromUserId: targetUser.userId, description: `Level ${currentLevel} Income (${percentage}%) from Compound Package`, status: 'success'
//                             });
//                         }
//                     }

//                     currentUplineId = upline.sponsorId;
//                     currentLevel++;
//                 }
//             } catch (bgError) {
//                 console.error("Background MLM Engine Error (Compound Package):", bgError);
//             }
//         })();

//     } catch (error) {
//         console.error("Compound Package Activation Error:", error);
//         res.status(500).json({ success: false, message: "Server Error during activation" });
//     }
// };

// =======================================================
// 🔹 GET USER PACKAGES LOGIC 
// =======================================================




exports.activateAutoCompoundPackage = async (req, res) => {
    try {
        // ==========================================================
        // 🔥 TOP-UP TIME RESTRICTION (Starts strictly after Tonight 12:00 AM IST)
        // ==========================================================
        // Aaj raat 12 baje (23 Oct 2026, 00:00:00 IST) ka exact time lock
        const goLiveTime = new Date("2026-10-23T00:00:00+05:30").getTime();
        
        if (Date.now() < goLiveTime) {
             return res.status(400).json({ 
                 success: false, 
                 message: 'Topup will start tonight after 12:00 AM.' 
             });
        }

        // ==========================================================
        // NORMAL LOGIC STARTS HERE
        // ==========================================================
        const { userId, memberId, packageAmount, txnPassword } = req.body;
        const amount = Number(packageAmount);
        
        // 🔥 NAYA LOGIC: Strictly 70 Days Timer
        const cycleDays = 70; 
        const packageLife = 70; 

        // 🔥 NAYA LOGIC: Valid packages list (Poster ke hisaab se)
        const VALID_PACKAGES = [2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000]; 

        if (!amount || isNaN(amount) || amount <= 0) {
            return res.status(400).json({ success: false, message: 'Invalid Package Amount.' });
        }

        if (!VALID_PACKAGES.includes(amount)) {
            console.warn(`🚨 SECURITY ALERT: User ${userId} tried fake Auto Compound package of $${amount}`);
            return res.status(403).json({ success: false, message: 'Security System: Custom or Fake Package Amounts are blocked!' });
        }

        const currentUser = await User.findOne({ userId: String(userId) });
        if (!currentUser) return res.status(404).json({ success: false, message: "Current user not found" });

        const targetUser = await User.findOne({ userId: String(memberId) });
        if (!targetUser) return res.status(404).json({ success: false, message: "Member ID not found" });

        if (!txnPassword || !currentUser.transactionPassword || txnPassword.toLowerCase() !== currentUser.transactionPassword.toLowerCase()) {
            return res.status(400).json({ success: false, message: "Invalid Transaction Password!" });
        }

        // Fund Wallet Check
        if ((currentUser.walletBalance || 0) < amount) {
            return res.status(400).json({ success: false, message: "Insufficient Fund Amount ($)!" });
        }

        currentUser.walletBalance -= amount;
        await currentUser.save();

        // =======================================================
        // 🔥 DATES SETUP (70 Days)
        // =======================================================
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + packageLife); 

        const compoundingEndDate = new Date();
        compoundingEndDate.setDate(startDate.getDate() + cycleDays); 

        const newCompoundPackage = await AutoCompoundPackage.create({
            userId: targetUser.userId,         
            memberId: targetUser.userId,       
            purchasedBy: currentUser.userId,
            packageAmount: amount,           
            dailyPercentage: 1, // 🔥 NAYA LOGIC: 1% Daily ROI
            totalDays: packageLife, // 70 Din
            compoundingDuration: cycleDays, // 70 Din
            compoundingEndDate: compoundingEndDate, 
            daysCompleted: 0,
            startDate: startDate,
            endDate: endDate, 
            status: 'active',
            packageType: 'master', 
            masterId: null 
        });

        // Target User ki basic info update
        let isFirstTopup = !targetUser.isToppedUp;
        if (!targetUser.packages) targetUser.packages = [];
        targetUser.packages.push({ 
            plan: "Auto Compound (1%)", 
            amount: amount, 
            duration: cycleDays, 
            startDate: new Date() 
        });
        
        targetUser.topUpAmount = Math.max(targetUser.topUpAmount || 0, amount);
        targetUser.updatedAt = new Date(); 
        if (isFirstTopup) {
            targetUser.isToppedUp = true;
            targetUser.topUpDate = new Date();
        }
        await targetUser.save();

        const createTransaction = async (data) => {
            return Transaction.create({ ...data, date: new Date() });
        };

        await createTransaction({
            userId: currentUser.userId, type: "compound_activation", amount: amount,
            fromUserId: currentUser.userId, toUserId: targetUser.userId,
            description: `Activated $${amount} Auto Compound (70 Days Timer) for ${targetUser.userId}`, status: 'success'
        });

        res.status(200).json({ 
            success: true, 
            message: `Auto Compound Package of $${amount} (Timer: 70 Days) activated successfully for ${targetUser.userId}!`,
            userId: targetUser.userId, 
            memberId: targetUser.userId, 
            data: newCompoundPackage
        });

        // =======================================================
        // 🔹 BACKGROUND MLM ENGINE (INSTANT DIRECT & LEVEL)
        // =======================================================
        (async () => {
            try {
                const checkIsActive = async (userId) => {
                    const hasNormalActive = await PackageActivation.exists({
                        userId: userId, endDate: { $gt: new Date() }, packageAmount: {$gte: 2 }
                    });
                    const hasCompoundActive = await AutoCompoundPackage.exists({
                        userId: userId, endDate: { $gt: new Date() }, packageAmount: {$gte: 2 }, status: 'active'
                    });
                    return hasNormalActive || hasCompoundActive; 
                };

                // 1. DIRECT INCOME (5%)
                if (targetUser.sponsorId) {
                    const sponsor = await User.findOne({ userId: targetUser.sponsorId });
                    if (sponsor) {
                        const isActiveSponsor = await checkIsActive(sponsor.userId); 
                        if (isActiveSponsor) {
                            sponsor.directCount = (sponsor.directCount || 0) + 1;
                            const directBonusAmount = (amount * 5) / 100; 
                            sponsor.directIncome = (sponsor.directIncome || 0) + directBonusAmount;
                            sponsor.totalDirectIncome = (sponsor.totalDirectIncome || 0) + directBonusAmount;
                            
                            await createTransaction({
                                userId: sponsor.userId, type: "direct_income", source: "direct", amount: directBonusAmount, 
                                package: amount, fromUserId: targetUser.userId, description: `Direct Bonus (5%) from ${targetUser.userId}'s Compound Package`, status: 'success'
                            });
                            await sponsor.save();
                        }
                    }
                }

                // 2. LEVEL INCOME (0.25% upto 12 Levels)
                const LEVEL_PERCENTAGES = [0, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25]; 
                let currentUplineId = targetUser.sponsorId; 
                let currentLevel = 1; 

                while (currentUplineId && currentLevel <= 12) {
                    const upline = await User.findOne({ userId: currentUplineId }).select('userId isToppedUp topUpAmount sponsorId _id');
                    if (!upline) break;

                    const isActiveUpline = await checkIsActive(upline.userId);
                    if (!isActiveUpline) {
                        currentUplineId = upline.sponsorId; 
                        currentLevel++;
                        continue; 
                    }

                    if (currentLevel >= 2 && currentLevel <= 12) {
                        const percentage = LEVEL_PERCENTAGES[currentLevel - 1]; 
                        const levelAmount = (amount * percentage) / 100;

                        if (levelAmount > 0) {
                            await User.updateOne({ _id: upline._id }, { $inc: { levelIncome: levelAmount, totalLevelIncome: levelAmount } });
                            await createTransaction({
                                userId: upline.userId, type: "level_income", source: "level", amount: levelAmount,
                                package: amount, fromUserId: targetUser.userId, description: `Level ${currentLevel} Income (${percentage}%) from Compound Package`, status: 'success'
                            });
                        }
                    }
                    currentUplineId = upline.sponsorId;
                    currentLevel++;
                }
            } catch (bgError) {
                console.error("Background MLM Engine Error (Compound Package):", bgError);
            }
        })();

    } catch (error) {
        console.error("Compound Package Activation Error:", error);
        res.status(500).json({ success: false, message: "Server Error during activation" });
    }
};

exports.getUserPackages = async (req, res) => {
    try {
        const { userId } = req.params;

        const packages = await PackageActivation.find({ userId: String(userId) }).sort({ startDate: -1 });

        res.status(200).json({
            success: true,
            data: packages
        });

    } catch (error) {
        console.error("Error fetching user packages:", error);
        res.status(500).json({ 
            success: false, 
            message: "Server Error while fetching packages" 
        });
    }
};