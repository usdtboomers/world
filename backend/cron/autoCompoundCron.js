// // const cron = require('node-cron');
// // const User = require('../models/User');
// // const AutoCompoundPackage = require('../models/AutoCompoundPackage'); // 🔥 Naya Model
// // const Transaction = require('../models/Transaction');

// // // 🔥 Sirf Instance '0' par chalega taaki double run na ho
// // if (process.env.NODE_APP_INSTANCE === '0' || process.env.NODE_APP_INSTANCE === undefined) {

// //     // 🕛 Run everyday at 12:30 AM (IST) - Normal ROI ke baad chalega
// //     cron.schedule('30 0 * * *', async () => {
// //         console.log('⏳ Running 6% AUTO COMPOUNDING Cron Job for World Finance...');
        
// //         try {
// //             // Sirf wo packages nikalenge jo Active hain aur 25 din se kam ke hain
// //             const activePackages = await AutoCompoundPackage.find({
// //                 status: 'active',
// //                 daysCompleted: { $lt: 25 }
// //             }).lean();

// //             const istDateString = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
// //             const startOfToday = new Date(istDateString);
// //             startOfToday.setHours(0, 0, 0, 0);

// //             const chunkSize = 50; 

// //             for (let i = 0; i < activePackages.length; i += chunkSize) {
// //                 const chunk = activePackages.slice(i, i + chunkSize);

// //                 await Promise.all(chunk.map(async (pkg) => {
// //                     try {
// //                         // 🛑 DOUBLE PAYOUT PREVENTION
// //                         const alreadyProcessed = await Transaction.findOne({
// //                             userId: pkg.userId,
// //                             type: { $in: ['compound_reinvest', 'compound_release'] },
// //                             description: { $regex: `Day ${pkg.daysCompleted + 1}/25` },
// //                             date: { $gte: startOfToday }
// //                         }).lean();

// //                         if (alreadyProcessed) return; 

// //                         const user = await User.findOne({ userId: pkg.userId }).lean();
// //                         if (!user) return; 

// //                         // 🔥 6% DAILY CALCULATION
// //                         const dailyAmount = Number((pkg.packageAmount * 0.06).toFixed(4)); 
// //                         const newDays = pkg.daysCompleted + 1;

// //                         // Check if Re-investment Phase is ON (today is before compoundingEndDate)
// //                         const packageCompoundingEndDate = new Date(pkg.compoundingEndDate);
// //                         packageCompoundingEndDate.setHours(23, 59, 59, 999);

// //                         if (startOfToday <= packageCompoundingEndDate) {
// //                             // ==========================================
// //                             // 🔄 PHASE 1: RE-INVESTMENT (CHILD CYCLE BANEGA)
// //                             // ==========================================
// //                             // Paise wallet me nahi jayenge, ek NAYA 25-din ka package banega
                            
// //                             const childEndDate = new Date(startOfToday);
// //                             childEndDate.setDate(childEndDate.getDate() + 25); // Naye package ki life 25 din

// //                             await AutoCompoundPackage.create({
// //                                 userId: pkg.userId,
// //                                 memberId: pkg.memberId,
// //                                 purchasedBy: "SYSTEM_AUTO_COMPOUND",
// //                                 packageAmount: dailyAmount, // 6% amount se naya package 
// //                                 dailyPercentage: 6,
// //                                 totalDays: 25,
// //                                 compoundingDuration: pkg.compoundingDuration,
// //                                 compoundingEndDate: pkg.compoundingEndDate, // Inherit master's end date
// //                                 daysCompleted: 0,
// //                                 startDate: new Date(),
// //                                 endDate: childEndDate,
// //                                 status: 'active',
// //                                 packageType: 'child',
// //                                 masterId: pkg.masterId || pkg._id
// //                             });

// //                             // Reinvest Transaction Log (Alag naam)
// //                             await Transaction.create({
// //                                 userId: user.userId,
// //                                 type: "compound_reinvest",
// //                                 source: "auto_compound",
// //                                 amount: dailyAmount,
// //                                 description: `Auto Compound Re-invested ($${dailyAmount}) - Day ${newDays}/25`,
// //                                 status: "success",
// //                                 date: new Date()
// //                             });

// //                         } else {
// //                             // ==========================================
// //                             // 💸 PHASE 2: RELEASE TO WALLET (WITHDRAWAL START)
// //                             // ==========================================
// //                             // Timer (50/100 days) khatam, ab seedha nayi wallet me paisa jayega
                            
// //                             await User.updateOne(
// //                                 { _id: user._id }, 
// //                                 // 🔥 Normal 'roiIncome' ki jagah nayi field 'autoCompoundIncome' use ki hai taaki mix na ho
// //                                 { $inc: { autoCompoundIncome: dailyAmount, totalAutoCompoundIncome: dailyAmount } }
// //                             );

// //                             // Release Transaction Log
// //                             await Transaction.create({
// //                                 userId: user.userId,
// //                                 type: "compound_release",
// //                                 source: "auto_compound",
// //                                 amount: dailyAmount,
// //                                 description: `Auto Compound Wallet Release ($${dailyAmount}) - Day ${newDays}/25`,
// //                                 status: "success",
// //                                 date: new Date()
// //                             });
// //                         }

// //                         // ==========================================
// //                         // 🕒 PACKAGE EXPIRY UPDATE
// //                         // ==========================================
// //                         const pkgUpdate = { $inc: { daysCompleted: 1 } };
// //                         // Agar package ke 25 din pure ho gaye toh usko complete (expire) mark kar do
// //                         if (newDays >= pkg.totalDays) {
// //                             pkgUpdate.$set = { status: 'completed' };
// //                         }
// //                         await AutoCompoundPackage.updateOne({ _id: pkg._id }, pkgUpdate);

// //                     } catch (pkgError) {
// //                         console.error(`❌ Error processing Auto Compound for package ${pkg._id}:`, pkgError);
// //                     }
// //                 }));
// //             }
// //             console.log('🎉 6% Auto Compounding Cron Job Finished Successfully!');
// //         } catch (error) {
// //             console.error('❌ Auto Compound Cron Job Fatal Error:', error);
// //         }
// //     }, {
// //         scheduled: true,
// //         timezone: "Asia/Kolkata" 
// //     });
// // }



// const cron = require('node-cron');
// const User = require('../models/User');
// const AutoCompoundPackage = require('../models/AutoCompoundPackage');
// const PackageActivation = require('../models/PackageActivation'); // 🔥 Normal package check karne ke liye import kiya
// const Transaction = require('../models/Transaction');

// // 🔥 Sirf Instance '0' par chalega taaki double run na ho
// if (process.env.NODE_APP_INSTANCE === '0' || process.env.NODE_APP_INSTANCE === undefined) {

//     // 🕛 Run everyday at 12:30 AM (IST) - Normal ROI ke baad chalega
//     cron.schedule('30 0 * * *', async () => {
//         console.log('⏳ Running 6% AUTO COMPOUNDING Cron Job for World Finance...');
        
//         try {
//             // Sirf wo packages nikalenge jo Active hain aur 25 din se kam ke hain
//             const activePackages = await AutoCompoundPackage.find({
//                 status: 'active',
//                 daysCompleted: { $lt: 25 }
//                 dailyPercentage: 6 
//             }).lean();

//             const istDateString = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
//             const startOfToday = new Date(istDateString);
//             startOfToday.setHours(0, 0, 0, 0);

//             const chunkSize = 50; 

//             for (let i = 0; i < activePackages.length; i += chunkSize) {
//                 const chunk = activePackages.slice(i, i + chunkSize);

//                 await Promise.all(chunk.map(async (pkg) => {
//                     try {
//                         // 🛑 DOUBLE PAYOUT PREVENTION
//                         const alreadyProcessed = await Transaction.findOne({
//                             userId: pkg.userId,
//                             type: { $in: ['compound_reinvest', 'compound_release'] },
//                             description: { $regex: `Day ${pkg.daysCompleted + 1}/25` },
//                             date: { $gte: startOfToday }
//                         }).lean();

//                         if (alreadyProcessed) return; 

//                         const user = await User.findOne({ userId: pkg.userId }).lean();
//                         if (!user) return; 

//                         // 🔥 6% DAILY CALCULATION
//                         const dailyAmount = Number((pkg.packageAmount * 0.06).toFixed(4)); 
//                         const newDays = pkg.daysCompleted + 1;

//                         // Check if Re-investment Phase is ON
//                         const packageCompoundingEndDate = new Date(pkg.compoundingEndDate);
//                         packageCompoundingEndDate.setHours(23, 59, 59, 999);

//                         if (startOfToday <= packageCompoundingEndDate) {
//                             // ==========================================
//                             // 🔄 PHASE 1: RE-INVESTMENT (CHILD CYCLE)
//                             // ==========================================
//                             const childEndDate = new Date(startOfToday);
//                             childEndDate.setDate(childEndDate.getDate() + 25); 

//                             await AutoCompoundPackage.create({
//                                 userId: pkg.userId,
//                                 memberId: pkg.memberId,
//                                 purchasedBy: "SYSTEM_AUTO_COMPOUND",
//                                 packageAmount: dailyAmount, 
//                                 dailyPercentage: 6,
//                                 totalDays: 25,
//                                 compoundingDuration: pkg.compoundingDuration,
//                                 compoundingEndDate: pkg.compoundingEndDate, 
//                                 daysCompleted: 0,
//                                 startDate: new Date(),
//                                 endDate: childEndDate,
//                                 status: 'active',
//                                 packageType: 'child',
//                                 masterId: pkg.masterId || pkg._id
//                             });

//                             await Transaction.create({
//                                 userId: user.userId,
//                                 type: "compound_reinvest",
//                                 source: "auto_compound",
//                                 amount: dailyAmount,
//                                 description: `Auto Compound Re-invested ($${dailyAmount}) - Day ${newDays}/25`,
//                                 status: "success",
//                                 date: new Date()
//                             });

//                         } else {
//                             // ==========================================
//                             // 💸 PHASE 2: RELEASE TO WALLET
//                             // ==========================================
//                             await User.updateOne(
//                                 { _id: user._id }, 
//                                 { $inc: { autoCompoundIncome: dailyAmount, totalAutoCompoundIncome: dailyAmount } }
//                             );

//                             await Transaction.create({
//                                 userId: user.userId,
//                                 type: "compound_release",
//                                 source: "auto_compound",
//                                 amount: dailyAmount,
//                                 description: `Auto Compound Wallet Release ($${dailyAmount}) - Day ${newDays}/25`,
//                                 status: "success",
//                                 date: new Date()
//                             });
//                         }

//                         // =======================================================
//                         // 🔹 DAILY LEVEL INCOME ENGINE (Same as Normal Cron)
//                         // =======================================================
//                         // Yeh 6% dailyAmount ke upar level income batega!
//                         const LEVEL_PERCENTAGES = [5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]; 
//                         let currentUplineId = user.sponsorId;
//                         let currentLevel = 1;

//                         while (currentUplineId && currentLevel <= 12) {
//                             const upline = await User.findOne({ userId: currentUplineId }).lean();
//                             if (!upline) break;

//                             const directsCount = upline.directCount || 0;

//                             // 🔥 UNIVERSAL ACTIVE CHECK (Upline ka koi bhi package active hona chahiye)
//                             const hasNormalActive = await PackageActivation.exists({
//                                 userId: upline.userId,
//                                 endDate: { $gt: new Date() }
//                             });
//                             const hasCompoundActive = await AutoCompoundPackage.exists({
//                                 userId: upline.userId,
//                                 endDate: { $gt: new Date() },
//                                 status: 'active'
//                             });
                            
//                             const isActiveUpline = hasNormalActive || hasCompoundActive;

//                             // 🛑 FLUSH RULE (Active package ho aur utne directs hone chahiye)
//                             if (isActiveUpline && directsCount >= currentLevel) {
//                                 const percentage = LEVEL_PERCENTAGES[currentLevel - 1];
//                                 const dailyLevelBonus = Number(((dailyAmount * percentage) / 100).toFixed(4)); 

//                                 if (dailyLevelBonus > 0) {
//                                     // 🔥 Upline ke same 'levelIncome' wallet mein paisa jayega
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
//                                         description: `Daily Level Income (${percentage}%) from ${user.userId}'s Auto Compound (Level ${currentLevel})`,
//                                         status: "success",
//                                         date: new Date()
//                                     });
//                                 }
//                             }

//                             // Next upline par jane ke liye
//                             currentUplineId = upline.sponsorId;
//                             currentLevel++;
//                         }

//                         // ==========================================
//                         // 🕒 PACKAGE EXPIRY UPDATE
//                         // ==========================================
//                         const pkgUpdate = { $inc: { daysCompleted: 1 } };
//                         if (newDays >= pkg.totalDays) {
//                             pkgUpdate.$set = { status: 'completed' };
//                         }
//                         await AutoCompoundPackage.updateOne({ _id: pkg._id }, pkgUpdate);

//                     } catch (pkgError) {
//                         console.error(`❌ Error processing Auto Compound for package ${pkg._id}:`, pkgError);
//                     }
//                 }));
//             }
//             console.log('🎉 6% Auto Compounding & Level Income Cron Job Finished Successfully!');
//         } catch (error) {
//             console.error('❌ Auto Compound Cron Job Fatal Error:', error);
//         }
//     }, {
//         scheduled: true,
//         timezone: "Asia/Kolkata" 
//     });
// }
























const cron = require('node-cron');
const User = require('../models/User');
const AutoCompoundPackage = require('../models/AutoCompoundPackage');
const PackageActivation = require('../models/PackageActivation'); 
const Transaction = require('../models/Transaction');

// 🔥 Sirf Instance '0' par chalega taaki double run na ho
if (process.env.NODE_APP_INSTANCE === '0' || process.env.NODE_APP_INSTANCE === undefined) {

    // 🕛 Run everyday at 12:30 AM (IST)
    cron.schedule('30 0 * * *', async () => {
        console.log('⏳ Running 1% AUTO COMPOUNDING (70 Days 2X) Cron Job for World Finance...');
        
        try {
            // 🔥 UPDATE 1: Sirf active aur 1% wale packages nikalenge
            const activePackages = await AutoCompoundPackage.find({
                status: 'active',
                dailyPercentage: 1 // Sirf naye 1% wale packages
            }).lean();

            const istDateString = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
            const startOfToday = new Date(istDateString);
            startOfToday.setHours(0, 0, 0, 0);

            const chunkSize = 50; 

            for (let i = 0; i < activePackages.length; i += chunkSize) {
                const chunk = activePackages.slice(i, i + chunkSize);

                await Promise.all(chunk.map(async (pkg) => {
                    try {
                        const targetDays = pkg.totalDays || 70; // 70 Din ka naya target
                        
                        if (pkg.daysCompleted >= targetDays) return;

                        // 🛑 DOUBLE PAYOUT PREVENTION
                        const alreadyProcessed = await Transaction.findOne({
                            userId: pkg.userId,
                            type: { $in: ['compound_daily_growth', 'compound_maturity'] },
                            description: { $regex: `Day ${pkg.daysCompleted + 1}/${targetDays}` },
                            date: { $gte: startOfToday }
                        }).lean();

                        if (alreadyProcessed) return; 

                        const user = await User.findOne({ userId: pkg.userId }).lean();
                        if (!user) return; 

                        // 🔥 UPDATE 2: 1% DAILY VIRTUAL CALCULATION
                        const dailyAmount = Number((pkg.packageAmount * 0.01).toFixed(4)); 
                        const newDays = pkg.daysCompleted + 1;
                        const pkgUpdate = { $inc: { daysCompleted: 1 } };

                        // ==========================================
                        // 🚀 UPDATE 3: KYA 70 DIN PURE HO GAYE? (2X LOGIC)
                        // ==========================================
                        if (newDays >= targetDays) {
                            // 🎉 70 Din Pure! Release 2X Amount (Double)
                            const doubleAmount = pkg.packageAmount * 2;

                            await User.updateOne(
                                { _id: user._id }, 
                                { $inc: { autoCompoundIncome: doubleAmount, totalAutoCompoundIncome: doubleAmount } }
                            );

                            await Transaction.create({
                                userId: user.userId,
                                type: "compound_maturity",
                                source: "auto_compound",
                                amount: doubleAmount,
                                description: `🎉 Auto Compound Maturity (2X)! Package $${pkg.packageAmount} -> Received $${doubleAmount} (Day ${newDays}/${targetDays})`,
                                status: "success",
                                date: new Date()
                            });

                            // Package ko complete mark kar do
                            pkgUpdate.$set = { status: 'completed' };
                        } else {
                            // ⏳ 70 Din abhi pure nahi hue. Virtual Daily Growth Log (Wallet me add nahi hoga)
                            await Transaction.create({
                                userId: user.userId,
                                type: "compound_daily_growth",
                                source: "auto_compound",
                                amount: dailyAmount,
                                description: `Auto Compounding Active - Day ${newDays}/${targetDays} (Virtual 1% Growth)`,
                                status: "success",
                                date: new Date()
                            });
                        }

                        // =======================================================
                        // 🔹 UPDATE 4: DAILY LEVEL INCOME ENGINE
                        // =======================================================
                        // Upline ko dailyAmount (1%) ka percentage har roz milega
                        const LEVEL_PERCENTAGES = [5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]; 
                        let currentUplineId = user.sponsorId;
                        let currentLevel = 1;

                        while (currentUplineId && currentLevel <= 12) {
                            const upline = await User.findOne({ userId: currentUplineId }).lean();
                            if (!upline) break;

                            const directsCount = upline.directCount || 0;

                            const hasNormalActive = await PackageActivation.exists({
                                userId: upline.userId,
                                endDate: { $gt: new Date() }
                            });
                            const hasCompoundActive = await AutoCompoundPackage.exists({
                                userId: upline.userId,
                                endDate: { $gt: new Date() },
                                status: 'active'
                            });
                            
                            const isActiveUpline = hasNormalActive || hasCompoundActive;

                            if (isActiveUpline && directsCount >= currentLevel) {
                                const percentage = LEVEL_PERCENTAGES[currentLevel - 1];
                                const dailyLevelBonus = Number(((dailyAmount * percentage) / 100).toFixed(4)); 

                                if (dailyLevelBonus > 0) {
                                    await User.updateOne(
                                        { _id: upline._id }, 
                                        { $inc: { levelIncome: dailyLevelBonus, totalLevelIncome: dailyLevelBonus } }
                                    );

                                    await Transaction.create({
                                        userId: upline.userId,
                                        type: "daily_level_income",
                                        source: "level",
                                        amount: dailyLevelBonus,
                                        fromUserId: user.userId,
                                        description: `Daily Level Income (${percentage}%) from ${user.userId}'s Auto Compound (Level ${currentLevel})`,
                                        status: "success",
                                        date: new Date()
                                    });
                                }
                            }

                            currentUplineId = upline.sponsorId;
                            currentLevel++;
                        }

                        // 🕒 UPDATE PACKAGE DAYS
                        await AutoCompoundPackage.updateOne({ _id: pkg._id }, pkgUpdate);

                    } catch (pkgError) {
                        console.error(`❌ Error processing Auto Compound for package ${pkg._id}:`, pkgError);
                    }
                }));
            }
            console.log('🎉 1% Auto Compounding (2X) & Level Income Cron Job Finished Successfully!');
        } catch (error) {
            console.error('❌ Auto Compound Cron Job Fatal Error:', error);
        }
    }, {
        scheduled: true,
        timezone: "Asia/Kolkata" 
    });
}