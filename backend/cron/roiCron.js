const cron = require('node-cron');
const User = require('../models/User');
const PackageActivation = require('../models/PackageActivation');
const Transaction = require('../models/Transaction');

// 🕛 Run everyday at 12:05 AM (Midnight)
cron.schedule('30 19 * * *', async () => {
        console.log('⏳ Running Daily ROI Cron Job for World Finance at', new Date());
    
    try {
        // Sirf unhi packages ko find karenge jo 'active' hain aur jinke 25 din poore nahi hue hain
        const activePackages = await PackageActivation.find({
            status: 'active',
            daysCompleted: { $lt: 25 }
        });

        // Aaj ki shuruat ka time (00:00:00) nikal rahe hain double payout rokne ke liye
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        for (let pkg of activePackages) {
            try {
                // 🛑 DOUBLE PAYOUT PREVENTION: 
                // Check karte hain ki aaj ki date me is user ko is package ka ROI mila hai ya nahi
                const alreadyPaid = await Transaction.findOne({
                    userId: pkg.userId,
                    type: 'daily_roi',
                    description: `Daily ROI (${pkg.daysCompleted + 1}/25) for $${pkg.packageAmount} Package`,
                    date: { $gte: startOfToday }
                });

                if (alreadyPaid) {
                    console.log(`⏩ Skipping: ROI already paid today for User ${pkg.userId} (Package ${pkg._id})`);
                    continue; // Agar aaj ka mil chuka hai, toh skip karke next user par jao
                }

                // 1. User ko find karo
                const user = await User.findOne({ userId: pkg.userId });
                if (!user) continue;

                // 2. User ke wallet me Daily ROI (5%) add karo
                const roiAmount = pkg.dailyRoi; 
                user.roiIncome = (user.roiIncome || 0) + roiAmount;
                user.totalRoiIncome = (user.totalRoiIncome || 0) + roiAmount;
                
                // Jis wallet se withdrawal hoga usme bhi balance update karna zaroori hai
                user.walletBalance = (user.walletBalance || 0) + roiAmount; 
                await user.save();

                // 3. Package ke days completed badhao
                pkg.daysCompleted += 1;
                
                // 4. Agar 25 din poore ho gaye, toh status ko 'completed'/expire kar do
                if (pkg.daysCompleted >= pkg.totalDays) {
                    pkg.status = 'completed'; 
                }
                await pkg.save();

                // 5. Transaction History create karo (Backend Proof ke liye)
                await Transaction.create({
                    userId: user.userId,
                    type: "daily_roi",
                    source: "roi",
                    amount: roiAmount,
                    description: `Daily ROI (${pkg.daysCompleted}/25) for $${pkg.packageAmount} Package`,
                    status: "success",
                    date: new Date()
                });

                console.log(`✅ Paid ROI $${roiAmount} to User ${user.userId} | Day ${pkg.daysCompleted}/25`);

            } catch (pkgError) {
                console.error(`❌ Error processing ROI for package ${pkg._id}:`, pkgError);
            }
        }
        console.log('🎉 Daily ROI Cron Job Finished Successfully!');
    } catch (error) {
        console.error('❌ Cron Job Fatal Error:', error);
    }
});