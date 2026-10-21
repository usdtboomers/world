const cron = require('node-cron');
const User = require('../models/User');
const AutoCompoundPackage = require('../models/AutoCompoundPackage');
const PackageActivation = require('../models/PackageActivation'); 
const Transaction = require('../models/Transaction');

// 🔥 Sirf Instance '0' par chalega
if (process.env.NODE_APP_INSTANCE === '0' || process.env.NODE_APP_INSTANCE === undefined) {

    // 🕛 Run everyday at 12:45 AM (IST) - Time thoda alag rakha hai taaki server par load na aaye
    cron.schedule('56 21 * * *', async () => {
        console.log('⏳ Running NEW 1% AUTO COMPOUNDING (70 Days 2X) Cron Job for World Finance...');
        
        try {
            // Sirf 1% wale active packages nikalenge
            const activePackages = await AutoCompoundPackage.find({ 
                status: 'active',
                dailyPercentage: 1 // 🔥 Sirf 1% wale packages ko hi pakdega
            }).lean();

            const istDateString = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
            const startOfToday = new Date(istDateString);
            startOfToday.setHours(0, 0, 0, 0);

            const chunkSize = 50; 

            for (let i = 0; i < activePackages.length; i += chunkSize) {
                const chunk = activePackages.slice(i, i + chunkSize);

                await Promise.all(chunk.map(async (pkg) => {
                    try {
                        const targetDays = pkg.totalDays || 70; // 70 Din ka target
                        
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

                        // 🔥 1% DAILY VIRTUAL CALCULATION (For Level Income & Logs)
                        const dailyAmount = Number((pkg.packageAmount * 0.01).toFixed(4)); 
                        const newDays = pkg.daysCompleted + 1;
                        const pkgUpdate = { $inc: { daysCompleted: 1 } };

                        // ==========================================
                        // 🚀 CHECK: KYA 70 DIN PURE HO GAYE?
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

                            pkgUpdate.$set = { status: 'completed' };
                        } else {
                            // ⏳ 70 Din abhi pure nahi hue. Virtual Daily Growth Log.
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
                        // 🔹 DAILY LEVEL INCOME ENGINE (Upline ko roz paisa milega)
                        // =======================================================
                        const LEVEL_PERCENTAGES = [5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]; 
                        let currentUplineId = user.sponsorId;
                        let currentLevel = 1;

                        while (currentUplineId && currentLevel <= 12) {
                            const upline = await User.findOne({ userId: currentUplineId }).lean();
                            if (!upline) break;

                            const directsCount = upline.directCount || 0;

                            const hasNormalActive = await PackageActivation.exists({ userId: upline.userId, endDate: { $gt: new Date() } });
                            const hasCompoundActive = await AutoCompoundPackage.exists({ userId: upline.userId, endDate: { $gt: new Date() }, status: 'active' });
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