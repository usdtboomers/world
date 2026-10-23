// // // // const cron = require('node-cron');
// // // // const User = require('../models/User');
// // // // const PackageActivation = require('../models/PackageActivation');
// // // // const Transaction = require('../models/Transaction');

// // // // // 🕛 Run everyday at 12:05 AM (Midnight)
// // // // cron.schedule('53 13 * * *', async () => {
// // // //     console.log('⏳ Running Daily ROI Cron Job for World Finance at', new Date());
    
// // // //     try {
// // // //         const activePackages = await PackageActivation.find({
// // // //             status: 'active',
// // // //             daysCompleted: { $lt: 25 }
// // // //         });

// // // //         const startOfToday = new Date();
// // // //         startOfToday.setHours(0, 0, 0, 0);

// // // //         for (let pkg of activePackages) {
// // // //             try {
// // // //                 // 🛑 DOUBLE PAYOUT PREVENTION
// // // //                 const alreadyPaid = await Transaction.findOne({
// // // //                     userId: pkg.userId,
// // // //                     type: 'daily_roi',
// // // //                     description: `Daily ROI (${pkg.daysCompleted + 1}/25) for $${pkg.packageAmount} Package`,
// // // //                     date: { $gte: startOfToday }
// // // //                 });

// // // //                 if (alreadyPaid) {
// // // //                     console.log(`⏩ Skipping: ROI already paid today for User ${pkg.userId}`);
// // // //                     continue; 
// // // //                 }

// // // //                 // 1. User find karo
// // // //                 const user = await User.findOne({ userId: pkg.userId });
// // // //                 if (!user) continue;

// // // //                 // 2. User ko ROI do
// // // //                 const roiAmount = pkg.dailyRoi; 
// // // //                 user.roiIncome = (user.roiIncome || 0) + roiAmount;
// // // //                 user.totalRoiIncome = (user.totalRoiIncome || 0) + roiAmount;
// // // //                 user.walletBalance = (user.walletBalance || 0) + roiAmount; 
// // // //                 await user.save();

// // // //                 // 3. Package days update
// // // //                 pkg.daysCompleted += 1;
// // // //                 if (pkg.daysCompleted >= pkg.totalDays) {
// // // //                     pkg.status = 'completed'; 
// // // //                 }
// // // //                 await pkg.save();

// // // //                 // 4. Transaction Log for ROI
// // // //                 await Transaction.create({
// // // //                     userId: user.userId,
// // // //                     type: "daily_roi",
// // // //                     source: "roi",
// // // //                     amount: roiAmount,
// // // //                     description: `Daily ROI (${pkg.daysCompleted}/25) for $${pkg.packageAmount} Package`,
// // // //                     status: "success",
// // // //                     date: new Date()
// // // //                 });

// // // //                 // =======================================================
// // // //                 // 🔹 5. DAILY LEVEL INCOME ENGINE (Har Level Ke Liye Utne Directs)
// // // //                 // =======================================================
// // // //                 const LEVEL_PERCENTAGES = [5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]; 
// // // //                 let currentUplineId = user.sponsorId;
// // // //                 let currentLevel = 1;

// // // //                 while (currentUplineId && currentLevel <= 12) {
// // // //                     const upline = await User.findOne({ userId: currentUplineId });
// // // //                     if (!upline) break;

// // // //                     const directsCount = upline.directCount || 0;

// // // //                     // 🛑 RULE 1: INACTIVE ID FLUSH
// // // //                     if (!upline.isToppedUp) {
// // // //                         console.log(`[FLUSHED] Daily Level Income flushed for ${upline.userId} at Level ${currentLevel} - ID is INACTIVE.`);
// // // //                     } 
// // // //                     // 🛑 RULE 2: STRICT DIRECTS CONDITION (Jis level par hain, kam se kam utne directs chahiye)
// // // //                     else if (directsCount < currentLevel) {
// // // //                         console.log(`[FLUSHED] Daily Level Income flushed for ${upline.userId} at Level ${currentLevel} - Needs minimum ${currentLevel} directs, but has only ${directsCount}.`);
// // // //                     } 
// // // //                     // ✅ SUCCESS: Give Income
// // // //                     else {
// // // //                         const percentage = LEVEL_PERCENTAGES[currentLevel - 1];
// // // //                         const dailyLevelBonus = (roiAmount * percentage) / 100; // Calculated on ROI Amount

// // // //                         if (dailyLevelBonus > 0) {
// // // //                             upline.levelIncome = (upline.levelIncome || 0) + dailyLevelBonus;
// // // //                             upline.totalLevelIncome = (upline.totalLevelIncome || 0) + dailyLevelBonus;
// // // //                             upline.walletBalance = (upline.walletBalance || 0) + dailyLevelBonus; 
// // // //                             await upline.save();

// // // //                             await Transaction.create({
// // // //                                 userId: upline.userId,
// // // //                                 type: "daily_level_income",
// // // //                                 source: "level",
// // // //                                 amount: dailyLevelBonus,
// // // //                                 fromUserId: user.userId,
// // // //                                 description: `Daily Level Income (${percentage}%) from ${user.userId}'s ROI (Level ${currentLevel})`,
// // // //                                 status: "success",
// // // //                                 date: new Date()
// // // //                             });
// // // //                         }
// // // //                     }

// // // //                     // Move to next upline
// // // //                     currentUplineId = upline.sponsorId;
// // // //                     currentLevel++;
// // // //                 }

// // // //             } catch (pkgError) {
// // // //                 console.error(`❌ Error processing ROI/Level for package ${pkg._id}:`, pkgError);
// // // //             }
// // // //         }
// // // //         console.log('🎉 Daily ROI & Level Income Cron Job Finished Successfully!');
// // // //     } catch (error) {
// // // //         console.error('❌ Cron Job Fatal Error:', error);
// // // //     }
// // // // });

// // // const cron = require('node-cron');
// // // const User = require('../models/User');
// // // const PackageActivation = require('../models/PackageActivation');
// // // const Transaction = require('../models/Transaction');

// // // // 🕛 Run everyday at 12:15 AM (IST - Indian Standard Time)
// // // cron.schedule('40 0 * * *', async () => {
// // //                 console.log('⏳ Running Daily ROI Cron Job for World Finance at', new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    
// // //     try {
// // //         const activePackages = await PackageActivation.find({
// // //             status: 'active',
// // //             daysCompleted: { $lt: 25 }
// // //         });

// // //         const startOfToday = new Date();
// // //         startOfToday.setHours(0, 0, 0, 0);

// // //         for (let pkg of activePackages) {
// // //             try {
// // //                 // 🛑 DOUBLE PAYOUT PREVENTION
// // //                 const alreadyPaid = await Transaction.findOne({
// // //                     userId: pkg.userId,
// // //                     type: 'daily_roi',
// // //                     description: `Daily ROI (${pkg.daysCompleted + 1}/25) for $${pkg.packageAmount} Package`,
// // //                     date: { $gte: startOfToday }
// // //                 });

// // //                 if (alreadyPaid) {
// // //                     console.log(`⏩ Skipping: ROI already paid today for User ${pkg.userId}`);
// // //                     continue; 
// // //                 }

// // //                 // 1. User find karo
// // //                 const user = await User.findOne({ userId: pkg.userId });
// // //                 if (!user) continue;

// // //                 // 2. User ko ROI do
// // //                 const roiAmount = pkg.dailyRoi; 
// // //                 user.roiIncome = (user.roiIncome || 0) + roiAmount;
// // //                 user.totalRoiIncome = (user.totalRoiIncome || 0) + roiAmount;
// // //                  await user.save();

// // //                 // 3. Package days update
// // //                 pkg.daysCompleted += 1;
// // //                 if (pkg.daysCompleted >= pkg.totalDays) {
// // //                     pkg.status = 'completed'; 
// // //                 }
// // //                 await pkg.save();

// // //                 // 4. Transaction Log for ROI
// // //                 await Transaction.create({
// // //                     userId: user.userId,
// // //                     type: "daily_roi",
// // //                     source: "roi",
// // //                     amount: roiAmount,
// // //                     description: `Daily ROI (${pkg.daysCompleted}/25) for $${pkg.packageAmount} Package`,
// // //                     status: "success",
// // //                     date: new Date()
// // //                 });

// // //                 // =======================================================
// // //                 // 🔹 5. DAILY LEVEL INCOME ENGINE 
// // //                 // =======================================================
// // //                 const LEVEL_PERCENTAGES = [5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]; 
// // //                 let currentUplineId = user.sponsorId;
// // //                 let currentLevel = 1;

// // //                 while (currentUplineId && currentLevel <= 12) {
// // //                     const upline = await User.findOne({ userId: currentUplineId });
// // //                     if (!upline) break;

// // //                     const directsCount = upline.directCount || 0;

// // //                     // 🛑 RULE 1: INACTIVE ID FLUSH
// // //                     if (!upline.isToppedUp) {
// // //                         console.log(`[FLUSHED] Daily Level Income flushed for ${upline.userId} at Level ${currentLevel} - ID is INACTIVE.`);
// // //                     } 
// // //                     // 🛑 RULE 2: STRICT DIRECTS CONDITION
// // //                     else if (directsCount < currentLevel) {
// // //                         console.log(`[FLUSHED] Daily Level Income flushed for ${upline.userId} at Level ${currentLevel} - Needs minimum ${currentLevel} directs, but has only ${directsCount}.`);
// // //                     } 
// // //                     // ✅ SUCCESS: Give Income
// // //                     else {
// // //                         const percentage = LEVEL_PERCENTAGES[currentLevel - 1];
// // //                         const dailyLevelBonus = (roiAmount * percentage) / 100; 

// // //                         if (dailyLevelBonus > 0) {
// // //                             upline.levelIncome = (upline.levelIncome || 0) + dailyLevelBonus;
// // //                             upline.totalLevelIncome = (upline.totalLevelIncome || 0) + dailyLevelBonus;
// // //                              await upline.save();

// // //                             await Transaction.create({
// // //                                 userId: upline.userId,
// // //                                 type: "daily_level_income",
// // //                                 source: "level",
// // //                                 amount: dailyLevelBonus,
// // //                                 fromUserId: user.userId,
// // //                                 description: `Daily Level Income (${percentage}%) from ${user.userId}'s ROI (Level ${currentLevel})`,
// // //                                 status: "success",
// // //                                 date: new Date()
// // //                             });
// // //                         }
// // //                     }

// // //                     // Move to next upline
// // //                     currentUplineId = upline.sponsorId;
// // //                     currentLevel++;
// // //                 }

// // //             } catch (pkgError) {
// // //                 console.error(`❌ Error processing ROI/Level for package ${pkg._id}:`, pkgError);
// // //             }
// // //         }
// // //         console.log('🎉 Daily ROI & Level Income Cron Job Finished Successfully!');
// // //     } catch (error) {
// // //         console.error('❌ Cron Job Fatal Error:', error);
// // //     }
// // // }, {
// // //     // 🔥 YE DONO LINES IMPORTANT HAIN INDIA TIME KE LIYE
// // //     scheduled: true,
// // //     timezone: "Asia/Kolkata" 
// // // });



// // const cron = require('node-cron');
// // const User = require('../models/User');
// // const PackageActivation = require('../models/PackageActivation');
// // const Transaction = require('../models/Transaction');

// // // 🕛 TEST RUN: Aaj raat 9:10 PM (21:10) par chalega
// // cron.schedule('15 21 * * *', async () => {
// //     console.log('⏳ Running Daily ROI Cron Job for World Finance at', new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    
// //     try {
// //         // 🔥 IST Midnight Time nikalna
// //         const istDateString = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
// //         const startOfToday = new Date(istDateString);
// //         startOfToday.setHours(0, 0, 0, 0);

// //         // 🔥 FIX: Sirf purane active packages uthana (Aaj ke topups skip ho jayenge)
// //         const activePackages = await PackageActivation.find({
// //             status: 'active',
// //             daysCompleted: { $lt: 25 },
// //             createdAt: { $lt: startOfToday } // <-- YE LINE AAJ KE TOPUPS KO ROK DEGI
// //         });

// //         // 🔥 SUPER FAST CHUNKING
// //         const chunkSize = 100;
// //         for (let i = 0; i < activePackages.length; i += chunkSize) {
// //             const chunk = activePackages.slice(i, i + chunkSize);
            
// //             await Promise.all(chunk.map(async (pkg) => {
// //                 try {
// //                     // 🛑 BULLETPROOF DOUBLE PAYOUT PREVENTION
// //                     const alreadyPaid = await Transaction.findOne({
// //                         userId: pkg.userId,
// //                         type: 'daily_roi',
// //                         amount: pkg.dailyRoi,
// //                         date: { $gte: startOfToday }
// //                     });

// //                     if (alreadyPaid) {
// //                         console.log(`⏩ Skipping: ROI already paid TODAY for User ${pkg.userId}`);
// //                         return; 
// //                     }

// //                     // 1. User find karo
// //                     const user = await User.findOne({ userId: pkg.userId });
// //                     if (!user) return;

// //                     // 2. User ko ROI do aur Wallet Balance badhao
// //                     const roiAmount = pkg.dailyRoi; 
// //                     user.roiIncome = (user.roiIncome || 0) + roiAmount;
// //                     user.totalRoiIncome = (user.totalRoiIncome || 0) + roiAmount;
// //                     user.walletBalance = (user.walletBalance || 0) + roiAmount; 
// //                     await user.save();

// //                     // 3. Package days update
// //                     pkg.daysCompleted += 1;
// //                     if (pkg.daysCompleted >= pkg.totalDays) {
// //                         pkg.status = 'completed'; 
// //                     }
// //                     await pkg.save();

// //                     // 4. Transaction Log for ROI
// //                     await Transaction.create({
// //                         userId: user.userId,
// //                         type: "daily_roi",
// //                         source: "roi",
// //                         amount: roiAmount,
// //                         description: `Daily ROI (${pkg.daysCompleted}/25) for $${pkg.packageAmount} Package`,
// //                         status: "success",
// //                         date: new Date()
// //                     });

// //                     // =======================================================
// //                     // 🔹 DAILY LEVEL INCOME ENGINE 
// //                     // =======================================================
// //                     const LEVEL_PERCENTAGES = [5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]; 
// //                     let currentUplineId = user.sponsorId;
// //                     let currentLevel = 1;

// //                     while (currentUplineId && currentLevel <= 12) {
// //                         const upline = await User.findOne({ userId: currentUplineId });
// //                         if (!upline) break;

// //                         const directsCount = upline.directCount || 0;

// //                         if (!upline.isToppedUp) {
// //                             // ID Inactive
// //                         } 
// //                         else if (directsCount < currentLevel) {
// //                             // Needs minimum directs
// //                         } 
// //                         else {
// //                             const percentage = LEVEL_PERCENTAGES[currentLevel - 1];
// //                             const dailyLevelBonus = (roiAmount * percentage) / 100; 

// //                             if (dailyLevelBonus > 0) {
// //                                 upline.levelIncome = (upline.levelIncome || 0) + dailyLevelBonus;
// //                                 upline.totalLevelIncome = (upline.totalLevelIncome || 0) + dailyLevelBonus;
// //                                 upline.walletBalance = (upline.walletBalance || 0) + dailyLevelBonus; 
// //                                 await upline.save();

// //                                 await Transaction.create({
// //                                     userId: upline.userId,
// //                                     type: "daily_level_income",
// //                                     source: "level",
// //                                     amount: dailyLevelBonus,
// //                                     fromUserId: user.userId,
// //                                     description: `Daily Level Income (${percentage}%) from ${user.userId}'s ROI (Level ${currentLevel})`,
// //                                     status: "success",
// //                                     date: new Date()
// //                                 });
// //                             }
// //                         }
// //                         currentUplineId = upline.sponsorId;
// //                         currentLevel++;
// //                     }

// //                 } catch (pkgError) {
// //                     console.error(`❌ Error processing ROI/Level for package ${pkg._id}:`, pkgError);
// //                 }
// //             }));
            
// //             console.log(`✅ Processed chunk ${Math.ceil((i + chunkSize) / chunkSize)} of ${Math.ceil(activePackages.length / chunkSize)}`);
// //         }
// //         console.log('🎉 Daily ROI & Level Income Cron Job Finished Successfully!');
// //     } catch (error) {
// //         console.error('❌ Cron Job Fatal Error:', error);
// //     }
// // }, {
// //     scheduled: true,
// //     timezone: "Asia/Kolkata" 
// // });





















// // const cron = require('node-cron');
// // const User = require('../models/User');
// // const PackageActivation = require('../models/PackageActivation');
// // const Transaction = require('../models/Transaction');

// // // 🕛 Run everyday at 12:40 AM (IST - Indian Standard Time)
// // cron.schedule('15 0 * * *', async () => {
// //     console.log('⏳ Running Daily ROI Cron Job for World Finance at', new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    
// //     try {
// //         const activePackages = await PackageActivation.find({
// //             status: 'active',
// //             daysCompleted: { $lt: 25 }
// //         });

// //         // const startOfToday = new Date();
// //         // startOfToday.setHours(0, 0, 0, 0);


// //         // 🔥 INDIA TIME (IST) KE HISAAB SE AAJ RAAT 12 BAJE KA EXACT TIME
// // const istDateString = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
// // const startOfToday = new Date(istDateString);
// // startOfToday.setHours(0, 0, 0, 0);

// //         // 🔥 SPEED OPTIMIZATION: 100 Packages ek sath process honge
// //         const chunkSize = 100;

// //         for (let i = 0; i < activePackages.length; i += chunkSize) {
// //             const chunk = activePackages.slice(i, i + chunkSize);

// //             // Promise.all se parallel (ek sath) processing hogi
// //             await Promise.all(chunk.map(async (pkg) => {
// //                 try {
// //                     // 🛑 DOUBLE PAYOUT PREVENTION (Aapka exact purana logic)
// //                     const alreadyPaid = await Transaction.findOne({
// //                         userId: pkg.userId,
// //                         type: 'daily_roi',
// //                         description: `Daily ROI (${pkg.daysCompleted + 1}/25) for $${pkg.packageAmount} Package`,
// //                         date: { $gte: startOfToday }
// //                     });

// //                     if (alreadyPaid) {
// //                         console.log(`⏩ Skipping: ROI already paid today for User ${pkg.userId}`);
// //                         return; // Map function mein 'continue' ki jagah 'return' lagta hai
// //                     }

// //                     // 1. User find karo
// //                     const user = await User.findOne({ userId: pkg.userId });
// //                     if (!user) return; 

// //                     // 2. User ko ROI do (Sirf roiIncome aur totalRoiIncome, NO walletBalance)
// //                     const roiAmount = pkg.dailyRoi; 
// //                     // user.roiIncome = (user.roiIncome || 0) + roiAmount;
// //                     // user.totalRoiIncome = (user.totalRoiIncome || 0) + roiAmount;
// //                     // await user.save();


// //                     // Naya Code lagayein:
// // await User.updateOne(
// //     { _id: user._id }, 
// //     { $inc: { roiIncome: roiAmount, totalRoiIncome: roiAmount } }
// // );
                    

// //                     // 3. Package days update
// //                     pkg.daysCompleted += 1;
// //                     if (pkg.daysCompleted >= pkg.totalDays) {
// //                         pkg.status = 'completed'; 
// //                     }
// //                     await pkg.save();

// //                     // 4. Transaction Log for ROI
// //                     await Transaction.create({
// //                         userId: user.userId,
// //                         type: "daily_roi",
// //                         source: "roi",
// //                         amount: roiAmount,
// //                         description: `Daily ROI (${pkg.daysCompleted}/25) for $${pkg.packageAmount} Package`,
// //                         status: "success",
// //                         date: new Date()
// //                     });

// //                     // =======================================================
// //                     // 🔹 5. DAILY LEVEL INCOME ENGINE (Aapka exact purana logic)
// //                     // =======================================================
// //                     const LEVEL_PERCENTAGES = [5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]; 
// //                     let currentUplineId = user.sponsorId;
// //                     let currentLevel = 1;

// //                     while (currentUplineId && currentLevel <= 12) {
// //                         const upline = await User.findOne({ userId: currentUplineId });
// //                         if (!upline) break;

// //                         const directsCount = upline.directCount || 0;

// //                         // 🛑 RULE 1: INACTIVE ID FLUSH
// //                         if (!upline.isToppedUp) {
// //                             console.log(`[FLUSHED] Daily Level Income flushed for ${upline.userId} at Level ${currentLevel} - ID is INACTIVE.`);
// //                         } 
// //                         // 🛑 RULE 2: STRICT DIRECTS CONDITION
// //                         else if (directsCount < currentLevel) {
// //                             console.log(`[FLUSHED] Daily Level Income flushed for ${upline.userId} at Level ${currentLevel} - Needs minimum ${currentLevel} directs, but has only ${directsCount}.`);
// //                         } 
// //                         // ✅ SUCCESS: Give Income
// //                         else {
// //                             const percentage = LEVEL_PERCENTAGES[currentLevel - 1];
// //                             const dailyLevelBonus = (roiAmount * percentage) / 100; 

// //                             if (dailyLevelBonus > 0) {
// //                                 // upline.levelIncome = (upline.levelIncome || 0) + dailyLevelBonus;
// //                                 // upline.totalLevelIncome = (upline.totalLevelIncome || 0) + dailyLevelBonus;
// //                                 // await upline.save();

// //                                 await User.updateOne(
// //     { _id: upline._id }, 
// //     { $inc: { levelIncome: dailyLevelBonus, totalLevelIncome: dailyLevelBonus } }
// // );

// //                                 await Transaction.create({
// //                                     userId: upline.userId,
// //                                     type: "daily_level_income",
// //                                     source: "level",
// //                                     amount: dailyLevelBonus,
// //                                     fromUserId: user.userId,
// //                                     description: `Daily Level Income (${percentage}%) from ${user.userId}'s ROI (Level ${currentLevel})`,
// //                                     status: "success",
// //                                     date: new Date()
// //                                 });
// //                             }
// //                         }

// //                         // Move to next upline
// //                         currentUplineId = upline.sponsorId;
// //                         currentLevel++;
// //                     }

// //                 } catch (pkgError) {
// //                     console.error(`❌ Error processing ROI/Level for package ${pkg._id}:`, pkgError);
// //                 }
// //             }));
// //         }
// //         console.log('🎉 Daily ROI & Level Income Cron Job Finished Successfully!');
// //     } catch (error) {
// //         console.error('❌ Cron Job Fatal Error:', error);
// //     }
// // }, {
// //     // 🔥 YE DONO LINES IMPORTANT HAIN INDIA TIME KE LIYE
// //     scheduled: true,
// //     timezone: "Asia/Kolkata" 
// // });



// // const cron = require('node-cron');
// // const User = require('../models/User');
// // const PackageActivation = require('../models/PackageActivation');
// // const Transaction = require('../models/Transaction');

// // // 🕛 Run everyday at 12:15 AM (IST)
// // cron.schedule('15 0 * * *', async () => {
// //     console.log('⏳ Running Daily ROI Cron Job for World Finance...');
    
// //     try {
// //         // 🔥 FAST READ: .lean() se MongoDB 5x fast data deta hai
// //         const activePackages = await PackageActivation.find({
// //             status: 'active',
// //             daysCompleted: { $lt: 25 }
// //         }).lean();

// //         // 🔥 INDIA TIME (IST) Exact Midnight Calculation
// //         const istDateString = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
// //         const startOfToday = new Date(istDateString);
// //         startOfToday.setHours(0, 0, 0, 0);

// //         const chunkSize = 50; // 50 is best for avoiding DB locks

// //         for (let i = 0; i < activePackages.length; i += chunkSize) {
// //             const chunk = activePackages.slice(i, i + chunkSize);

// //             await Promise.all(chunk.map(async (pkg) => {
// //                 try {
// //                     // 🛑 DOUBLE PAYOUT PREVENTION
// //                     const alreadyPaid = await Transaction.findOne({
// //                         userId: pkg.userId,
// //                         type: 'daily_roi',
// //                         description: `Daily ROI (${pkg.daysCompleted + 1}/25) for $${pkg.packageAmount} Package`,
// //                         date: { $gte: startOfToday }
// //                     }).lean();

// //                     if (alreadyPaid) return; 

// //                     // 1. User find karo (Fast read)
// //                     const user = await User.findOne({ userId: pkg.userId }).lean();
// //                     if (!user) return; 

// //                     const roiAmount = pkg.dailyRoi; 

// //                     // 2. Give ROI to User
// //                     await User.updateOne(
// //                         { _id: user._id }, 
// //                         { $inc: { roiIncome: roiAmount, totalRoiIncome: roiAmount } }
// //                     );

// //                     // 3. Update Package (Fast update without save())
// //                     const newDays = pkg.daysCompleted + 1;
// //                     const pkgUpdate = { $inc: { daysCompleted: 1 } };
// //                     if (newDays >= pkg.totalDays) {
// //                         pkgUpdate.$set = { status: 'completed' };
// //                     }
// //                     await PackageActivation.updateOne({ _id: pkg._id }, pkgUpdate);

// //                     // 4. Transaction Log
// //                     await Transaction.create({
// //                         userId: user.userId,
// //                         type: "daily_roi",
// //                         source: "roi",
// //                         amount: roiAmount,
// //                         description: `Daily ROI (${newDays}/25) for $${pkg.packageAmount} Package`,
// //                         status: "success",
// //                         date: new Date()
// //                     });

// //                     // =======================================================
// //                     // 🔹 5. DAILY LEVEL INCOME ENGINE (Super Fast)
// //                     // =======================================================
// //                     const LEVEL_PERCENTAGES = [5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]; 
// //                     let currentUplineId = user.sponsorId;
// //                     let currentLevel = 1;

// //                     while (currentUplineId && currentLevel <= 12) {
// //                         const upline = await User.findOne({ userId: currentUplineId }).lean();
// //                         if (!upline) break;

// //                         const directsCount = upline.directCount || 0;

// //                         if (!upline.isToppedUp || directsCount < currentLevel) {
// //                             // Flushed - No action needed
// //                         } else {
// //                             // ✅ SUCCESS: Give Income
// //                             const percentage = LEVEL_PERCENTAGES[currentLevel - 1];
// //                             const dailyLevelBonus = (roiAmount * percentage) / 100; 

// //                             if (dailyLevelBonus > 0) {
// //                                 // 🔥 RACE CONDITION FIX: $inc use kiya hai
// //                                 await User.updateOne(
// //                                     { _id: upline._id }, 
// //                                     { $inc: { levelIncome: dailyLevelBonus, totalLevelIncome: dailyLevelBonus } }
// //                                 );

// //                                 await Transaction.create({
// //                                     userId: upline.userId,
// //                                     type: "daily_level_income",
// //                                     source: "level",
// //                                     amount: dailyLevelBonus,
// //                                     fromUserId: user.userId,
// //                                     description: `Daily Level Income (${percentage}%) from ${user.userId}'s ROI (Level ${currentLevel})`,
// //                                     status: "success",
// //                                     date: new Date()
// //                                 });
// //                             }
// //                         }

// //                         // Move to next upline
// //                         currentUplineId = upline.sponsorId;
// //                         currentLevel++;
// //                     }

// //                 } catch (pkgError) {
// //                     console.error(`❌ Error processing ROI/Level for package ${pkg._id}:`, pkgError);
// //                 }
// //             }));
// //         }
// //         console.log('🎉 Daily ROI & Level Income Cron Job Finished Successfully!');
// //     } catch (error) {
// //         console.error('❌ Cron Job Fatal Error:', error);
// //     }
// // }, {
// //     scheduled: true,
// //     timezone: "Asia/Kolkata" 
// // });




















// const cron = require('node-cron');
// const User = require('../models/User');
// const PackageActivation = require('../models/PackageActivation');
// const Transaction = require('../models/Transaction');

// // 🔥 YAHAN UPDATE KIYA HAI: Sirf Instance '0' (Primary Core) par hi yeh cron chalega
// if (process.env.NODE_APP_INSTANCE === '0' || process.env.NODE_APP_INSTANCE === undefined) {

//     // 🕛 Run everyday at 12:15 AM (IST)
//     cron.schedule('15 0 * * *', async () => {
//         console.log('⏳ Running Daily ROI Cron Job for World Finance...');
        
//         try {
//             // 🔥 FAST READ: .lean() se MongoDB 5x fast data deta hai
//             const activePackages = await PackageActivation.find({
//                 status: 'active',
//                 daysCompleted: { $lt: 25 }
//             }).lean();

//             // 🔥 INDIA TIME (IST) Exact Midnight Calculation
//             const istDateString = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
//             const startOfToday = new Date(istDateString);
//             startOfToday.setHours(0, 0, 0, 0);

//             const chunkSize = 50; // 50 is best for avoiding DB locks

//             for (let i = 0; i < activePackages.length; i += chunkSize) {
//                 const chunk = activePackages.slice(i, i + chunkSize);

//                 await Promise.all(chunk.map(async (pkg) => {
//                     try {
//                         // 🛑 DOUBLE PAYOUT PREVENTION
//                         const alreadyPaid = await Transaction.findOne({
//                             userId: pkg.userId,
//                             type: 'daily_roi',
//                             description: `Daily ROI (${pkg.daysCompleted + 1}/25) for $${pkg.packageAmount} Package`,
//                             date: { $gte: startOfToday }
//                         }).lean();

//                         if (alreadyPaid) return; 

//                         // 1. User find karo (Fast read)
//                         const user = await User.findOne({ userId: pkg.userId }).lean();
//                         if (!user) return; 

//                         const roiAmount = pkg.dailyRoi; 

//                         // 2. Give ROI to User
//                         await User.updateOne(
//                             { _id: user._id }, 
//                             { $inc: { roiIncome: roiAmount, totalRoiIncome: roiAmount } }
//                         );

//                         // 3. Update Package (Fast update without save())
//                         const newDays = pkg.daysCompleted + 1;
//                         const pkgUpdate = { $inc: { daysCompleted: 1 } };
//                         if (newDays >= pkg.totalDays) {
//                             pkgUpdate.$set = { status: 'completed' };
//                         }
//                         await PackageActivation.updateOne({ _id: pkg._id }, pkgUpdate);

//                         // 4. Transaction Log
//                         await Transaction.create({
//                             userId: user.userId,
//                             type: "daily_roi",
//                             source: "roi",
//                             amount: roiAmount,
//                             description: `Daily ROI (${newDays}/25) for $${pkg.packageAmount} Package`,
//                             status: "success",
//                             date: new Date()
//                         });

//                         // =======================================================
//                         // 🔹 5. DAILY LEVEL INCOME ENGINE (Super Fast)
//                         // =======================================================
//                         const LEVEL_PERCENTAGES = [5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]; 
//                         let currentUplineId = user.sponsorId;
//                         let currentLevel = 1;

//                         while (currentUplineId && currentLevel <= 12) {
//                             const upline = await User.findOne({ userId: currentUplineId }).lean();
//                             if (!upline) break;

//                             const directsCount = upline.directCount || 0;

//                             if (!upline.isToppedUp || directsCount < currentLevel) {
//                                 // Flushed - No action needed
//                             } else {
//                                 // ✅ SUCCESS: Give Income
//                                 const percentage = LEVEL_PERCENTAGES[currentLevel - 1];
//                                 const dailyLevelBonus = (roiAmount * percentage) / 100; 

//                                 if (dailyLevelBonus > 0) {
//                                     // 🔥 RACE CONDITION FIX: $inc use kiya hai
//                                     await User.updateOne(
//                                         { _id: upline._id }, 
//                                         { $inc: { levelIncome: dailyLevelBonus, totalLevelIncome: dailyLevelBonus } }
//                                     );

//                                     await Transaction.create({
//                                         userId: upline.userId,
//                                         type: "daily_level_income",
//                                         source: "level",
//                                         amount: dailyLevelBonus,
//                                         fromUserId: user.userId,
//                                         description: `Daily Level Income (${percentage}%) from ${user.userId}'s ROI (Level ${currentLevel})`,
//                                         status: "success",
//                                         date: new Date()
//                                     });
//                                 }
//                             }

//                             // Move to next upline
//                             currentUplineId = upline.sponsorId;
//                             currentLevel++;
//                         }

//                     } catch (pkgError) {
//                         console.error(`❌ Error processing ROI/Level for package ${pkg._id}:`, pkgError);
//                     }
//                 }));
//             }
//             console.log('🎉 Daily ROI & Level Income Cron Job Finished Successfully!');
//         } catch (error) {
//             console.error('❌ Cron Job Fatal Error:', error);
//         }
//     }, {
//         scheduled: true,
//         timezone: "Asia/Kolkata" 
//     });

// } 

// 🔥 YAHAN UPDATE KIYA HAI: if condition yahan close ho rahi hai















const cron = require('node-cron');
const User = require('../models/User');
const PackageActivation = require('../models/PackageActivation');
const Transaction = require('../models/Transaction');

// 🔥 Sirf Instance '0' (Primary Core) par hi yeh cron chalega
if (process.env.NODE_APP_INSTANCE === '0' || process.env.NODE_APP_INSTANCE === undefined) {

    // 🕛 Run everyday at 12:15 AM (IST)
    cron.schedule('30 0 * * *', async () => {
        console.log('⏳ Running Daily ROI Cron Job for World Finance...');
        
        try {
            // 🔥 FAST READ: .lean() se MongoDB 5x fast data deta hai
            const activePackages = await PackageActivation.find({
                status: 'active',
                daysCompleted: { $lt: 25 }
            }).lean();

            // 🔥 INDIA TIME (IST) Exact Midnight Calculation
            const istDateString = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
            const startOfToday = new Date(istDateString);
            startOfToday.setHours(0, 0, 0, 0);

            const chunkSize = 50; // 50 is best for avoiding DB locks

            for (let i = 0; i < activePackages.length; i += chunkSize) {
                const chunk = activePackages.slice(i, i + chunkSize);

                await Promise.all(chunk.map(async (pkg) => {
                    try {
                        // 🛑 DOUBLE PAYOUT PREVENTION
                        const alreadyPaid = await Transaction.findOne({
                            userId: pkg.userId,
                            type: 'daily_roi',
                            description: `Daily ROI (${pkg.daysCompleted + 1}/25) for $${pkg.packageAmount} Package`,
                            date: { $gte: startOfToday }
                        }).lean();

                        if (alreadyPaid) return; 

                        // 1. User find karo (Fast read)
                        const user = await User.findOne({ userId: pkg.userId }).lean();
                        if (!user) return; 

                        const roiAmount = pkg.dailyRoi; 

                        // 2. Give ROI to User
                        await User.updateOne(
                            { _id: user._id }, 
                            { $inc: { roiIncome: roiAmount, totalRoiIncome: roiAmount } }
                        );

                        // 3. Update Package (Fast update without save())
                        const newDays = pkg.daysCompleted + 1;
                        const pkgUpdate = { $inc: { daysCompleted: 1 } };
                        if (newDays >= pkg.totalDays) {
                            pkgUpdate.$set = { status: 'completed' };
                        }
                        await PackageActivation.updateOne({ _id: pkg._id }, pkgUpdate);

                        // 4. Transaction Log
                        await Transaction.create({
                            userId: user.userId,
                            type: "daily_roi",
                            source: "roi",
                            amount: roiAmount,
                            description: `Daily ROI (${newDays}/25) for $${pkg.packageAmount} Package`,
                            status: "success",
                            date: new Date()
                        });

                        // =======================================================
                        // 🔹 5. DAILY LEVEL INCOME ENGINE (Super Fast)
                        // =======================================================
                        const LEVEL_PERCENTAGES = [5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]; 
                        let currentUplineId = user.sponsorId;
                        let currentLevel = 1;

                        while (currentUplineId && currentLevel <= 12) {
                            const upline = await User.findOne({ userId: currentUplineId }).lean();
                            if (!upline) break;

                            const directsCount = upline.directCount || 0;

                            // 🔥 NAYA LOGIC: Check karo ki Upline ka Package Active hai ya nahi (Last 25 Days)
                            const isActiveUpline = await PackageActivation.exists({
                                userId: upline.userId,
                                endDate: { $gt: new Date() } // Expiry date aaj se aage honi chahiye
                            });

                            // 🛑 FLUSH RULE: Agar package active nahi hai, ya direct condition poori nahi hai toh Flush!
                            if (!isActiveUpline || directsCount < currentLevel) {
                                // Flushed - No action needed
                                // console.log(`[FLUSHED] Daily Level Income stopped for Upline ${upline.userId}. Reason: Package Expired or Directs < Level.`);
                            } else {
                                // ✅ SUCCESS: Give Income
                                const percentage = LEVEL_PERCENTAGES[currentLevel - 1];
                                const dailyLevelBonus = (roiAmount * percentage) / 100; 

                                // if (dailyLevelBonus > 0) {
                                    // 🔥 RACE CONDITION FIX: $inc use kiya hai
                                    // await User.updateOne(
                                    //     { _id: upline._id }, 
                                    //     { $inc: { levelIncome: dailyLevelBonus, totalLevelIncome: dailyLevelBonus } }
                                    // );


                                    if (dailyLevelBonus > 0) {
                                         await User.updateOne(
                                          { _id: upline._id }, 
        // 🔥 CHANGE: Ab paisa 'levelIncome' ki jagah naye 'levelRoiIncome' wallet mein jayega
                                  { $inc: { levelRoiIncome: dailyLevelBonus, totalLevelRoiIncome: dailyLevelBonus } }
                                                     );

                                    await Transaction.create({
                                        userId: upline.userId,
                                        type: "daily_level_income",
                                        source: "level",
                                        amount: dailyLevelBonus,
                                        fromUserId: user.userId,
                                        description: `Daily Level Income (${percentage}%) from ${user.userId}'s ROI (Level ${currentLevel})`,
                                        status: "success",
                                        date: new Date()
                                    });
                                }
                            }

                            // Move to next upline
                            currentUplineId = upline.sponsorId;
                            currentLevel++;
                        }

                    } catch (pkgError) {
                        console.error(`❌ Error processing ROI/Level for package ${pkg._id}:`, pkgError);
                    }
                }));
            }
            console.log('🎉 Daily ROI & Level Income Cron Job Finished Successfully!');
        } catch (error) {
            console.error('❌ Cron Job Fatal Error:', error);
        }
    }, {
        scheduled: true,
        timezone: "Asia/Kolkata" 
    });

}