// const cron = require('node-cron');
// const User = require('../models/User');
// const PackageActivation = require('../models/PackageActivation');
// const Transaction = require('../models/Transaction');

// // 🕛 Run everyday at 12:05 AM (Midnight)
// cron.schedule('53 13 * * *', async () => {
//     console.log('⏳ Running Daily ROI Cron Job for World Finance at', new Date());
    
//     try {
//         const activePackages = await PackageActivation.find({
//             status: 'active',
//             daysCompleted: { $lt: 25 }
//         });

//         const startOfToday = new Date();
//         startOfToday.setHours(0, 0, 0, 0);

//         for (let pkg of activePackages) {
//             try {
//                 // 🛑 DOUBLE PAYOUT PREVENTION
//                 const alreadyPaid = await Transaction.findOne({
//                     userId: pkg.userId,
//                     type: 'daily_roi',
//                     description: `Daily ROI (${pkg.daysCompleted + 1}/25) for $${pkg.packageAmount} Package`,
//                     date: { $gte: startOfToday }
//                 });

//                 if (alreadyPaid) {
//                     console.log(`⏩ Skipping: ROI already paid today for User ${pkg.userId}`);
//                     continue; 
//                 }

//                 // 1. User find karo
//                 const user = await User.findOne({ userId: pkg.userId });
//                 if (!user) continue;

//                 // 2. User ko ROI do
//                 const roiAmount = pkg.dailyRoi; 
//                 user.roiIncome = (user.roiIncome || 0) + roiAmount;
//                 user.totalRoiIncome = (user.totalRoiIncome || 0) + roiAmount;
//                 user.walletBalance = (user.walletBalance || 0) + roiAmount; 
//                 await user.save();

//                 // 3. Package days update
//                 pkg.daysCompleted += 1;
//                 if (pkg.daysCompleted >= pkg.totalDays) {
//                     pkg.status = 'completed'; 
//                 }
//                 await pkg.save();

//                 // 4. Transaction Log for ROI
//                 await Transaction.create({
//                     userId: user.userId,
//                     type: "daily_roi",
//                     source: "roi",
//                     amount: roiAmount,
//                     description: `Daily ROI (${pkg.daysCompleted}/25) for $${pkg.packageAmount} Package`,
//                     status: "success",
//                     date: new Date()
//                 });

//                 // =======================================================
//                 // 🔹 5. DAILY LEVEL INCOME ENGINE (Har Level Ke Liye Utne Directs)
//                 // =======================================================
//                 const LEVEL_PERCENTAGES = [5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]; 
//                 let currentUplineId = user.sponsorId;
//                 let currentLevel = 1;

//                 while (currentUplineId && currentLevel <= 12) {
//                     const upline = await User.findOne({ userId: currentUplineId });
//                     if (!upline) break;

//                     const directsCount = upline.directCount || 0;

//                     // 🛑 RULE 1: INACTIVE ID FLUSH
//                     if (!upline.isToppedUp) {
//                         console.log(`[FLUSHED] Daily Level Income flushed for ${upline.userId} at Level ${currentLevel} - ID is INACTIVE.`);
//                     } 
//                     // 🛑 RULE 2: STRICT DIRECTS CONDITION (Jis level par hain, kam se kam utne directs chahiye)
//                     else if (directsCount < currentLevel) {
//                         console.log(`[FLUSHED] Daily Level Income flushed for ${upline.userId} at Level ${currentLevel} - Needs minimum ${currentLevel} directs, but has only ${directsCount}.`);
//                     } 
//                     // ✅ SUCCESS: Give Income
//                     else {
//                         const percentage = LEVEL_PERCENTAGES[currentLevel - 1];
//                         const dailyLevelBonus = (roiAmount * percentage) / 100; // Calculated on ROI Amount

//                         if (dailyLevelBonus > 0) {
//                             upline.levelIncome = (upline.levelIncome || 0) + dailyLevelBonus;
//                             upline.totalLevelIncome = (upline.totalLevelIncome || 0) + dailyLevelBonus;
//                             upline.walletBalance = (upline.walletBalance || 0) + dailyLevelBonus; 
//                             await upline.save();

//                             await Transaction.create({
//                                 userId: upline.userId,
//                                 type: "daily_level_income",
//                                 source: "level",
//                                 amount: dailyLevelBonus,
//                                 fromUserId: user.userId,
//                                 description: `Daily Level Income (${percentage}%) from ${user.userId}'s ROI (Level ${currentLevel})`,
//                                 status: "success",
//                                 date: new Date()
//                             });
//                         }
//                     }

//                     // Move to next upline
//                     currentUplineId = upline.sponsorId;
//                     currentLevel++;
//                 }

//             } catch (pkgError) {
//                 console.error(`❌ Error processing ROI/Level for package ${pkg._id}:`, pkgError);
//             }
//         }
//         console.log('🎉 Daily ROI & Level Income Cron Job Finished Successfully!');
//     } catch (error) {
//         console.error('❌ Cron Job Fatal Error:', error);
//     }
// });

const cron = require('node-cron');
const User = require('../models/User');
const PackageActivation = require('../models/PackageActivation');
const Transaction = require('../models/Transaction');

// 🕛 Run everyday at 12:15 AM (IST - Indian Standard Time)
cron.schedule('01 1 * * *', async () => {
    console.log('⏳ Running Daily ROI Cron Job for World Finance at', new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    
    try {
        const activePackages = await PackageActivation.find({
            status: 'active',
            daysCompleted: { $lt: 25 }
        });

        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        for (let pkg of activePackages) {
            try {
                // 🛑 DOUBLE PAYOUT PREVENTION
                const alreadyPaid = await Transaction.findOne({
                    userId: pkg.userId,
                    type: 'daily_roi',
                    description: `Daily ROI (${pkg.daysCompleted + 1}/25) for $${pkg.packageAmount} Package`,
                    date: { $gte: startOfToday }
                });

                if (alreadyPaid) {
                    console.log(`⏩ Skipping: ROI already paid today for User ${pkg.userId}`);
                    continue; 
                }

                // 1. User find karo
                const user = await User.findOne({ userId: pkg.userId });
                if (!user) continue;

                // 2. User ko ROI do
                const roiAmount = pkg.dailyRoi; 
                user.roiIncome = (user.roiIncome || 0) + roiAmount;
                user.totalRoiIncome = (user.totalRoiIncome || 0) + roiAmount;
                 await user.save();

                // 3. Package days update
                pkg.daysCompleted += 1;
                if (pkg.daysCompleted >= pkg.totalDays) {
                    pkg.status = 'completed'; 
                }
                await pkg.save();

                // 4. Transaction Log for ROI
                await Transaction.create({
                    userId: user.userId,
                    type: "daily_roi",
                    source: "roi",
                    amount: roiAmount,
                    description: `Daily ROI (${pkg.daysCompleted}/25) for $${pkg.packageAmount} Package`,
                    status: "success",
                    date: new Date()
                });

                // =======================================================
                // 🔹 5. DAILY LEVEL INCOME ENGINE 
                // =======================================================
                const LEVEL_PERCENTAGES = [5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]; 
                let currentUplineId = user.sponsorId;
                let currentLevel = 1;

                while (currentUplineId && currentLevel <= 12) {
                    const upline = await User.findOne({ userId: currentUplineId });
                    if (!upline) break;

                    const directsCount = upline.directCount || 0;

                    // 🛑 RULE 1: INACTIVE ID FLUSH
                    if (!upline.isToppedUp) {
                        console.log(`[FLUSHED] Daily Level Income flushed for ${upline.userId} at Level ${currentLevel} - ID is INACTIVE.`);
                    } 
                    // 🛑 RULE 2: STRICT DIRECTS CONDITION
                    else if (directsCount < currentLevel) {
                        console.log(`[FLUSHED] Daily Level Income flushed for ${upline.userId} at Level ${currentLevel} - Needs minimum ${currentLevel} directs, but has only ${directsCount}.`);
                    } 
                    // ✅ SUCCESS: Give Income
                    else {
                        const percentage = LEVEL_PERCENTAGES[currentLevel - 1];
                        const dailyLevelBonus = (roiAmount * percentage) / 100; 

                        if (dailyLevelBonus > 0) {
                            upline.levelIncome = (upline.levelIncome || 0) + dailyLevelBonus;
                            upline.totalLevelIncome = (upline.totalLevelIncome || 0) + dailyLevelBonus;
                             await upline.save();

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
        }
        console.log('🎉 Daily ROI & Level Income Cron Job Finished Successfully!');
    } catch (error) {
        console.error('❌ Cron Job Fatal Error:', error);
    }
}, {
    // 🔥 YE DONO LINES IMPORTANT HAIN INDIA TIME KE LIYE
    scheduled: true,
    timezone: "Asia/Kolkata" 
});