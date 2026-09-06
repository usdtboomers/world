require('dotenv').config();
const mongoose = require('mongoose');
const readline = require('readline');
const fs = require('fs');

const User = require('./models/User'); 
const Transaction = require('./models/Transaction');
const PackageActivation = require('./models/PackageActivation');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function giveMissedRoi() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Database Connected Successfully!");

        // 🔥 TARGET DATES: 5 September and 6 September 2026 (IST) 🔥
        const startTime = new Date('2026-09-05T00:00:00+05:30');
        const endTime = new Date('2026-09-06T23:59:59+05:30');

        console.log(`\n🔍 Scanning missing ROI for packages activated between:`);
        console.log(`Start: ${startTime.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })}`);
        console.log(`End:   ${endTime.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })}`);

        // Sirf 5 aur 6 Sep ke active packages nikalna
        const targetPackages = await PackageActivation.find({
            status: 'active',
            daysCompleted: { $lt: 25 },
            startDate: { $gte: startTime, $lte: endTime }
        });

        if (targetPackages.length === 0) {
            console.log("\n🟢 In dates ke beech koi active package nahi mila.");
            process.exit(0);
        }

        // ==========================================
        // 🔹 PREVIEW BANANA
        // ==========================================
        let totalRoiToGive = 0;

        console.log(`\n======================================================`);
        console.log(` 📋 PREVIEW: PACKAGES TO RECEIVE MISSED ROI`);
        console.log(`======================================================`);

        for (let pkg of targetPackages) {
            console.log(`👤 User: ${pkg.userId} | 📦 Package: $${pkg.packageAmount} | 💸 Missing ROI: +$${pkg.dailyRoi} | ⏳ Days: ${pkg.daysCompleted}/25`);
            totalRoiToGive += pkg.dailyRoi;
        }

        console.log(`------------------------------------------------------`);
        console.log(`🚨 Total Packages Affected: ${targetPackages.length}`);
        console.log(`🚨 Total ROI to Distribute: +$${totalRoiToGive.toFixed(2)}`);
        console.log(`======================================================\n`);

        // ==========================================
        // 🔹 YES / NO CONFIRMATION
        // ==========================================
        rl.question('❓ Kya aap in sabhi packages ko unka missing ROI aur Level Income dena chahte hain? (yes/no): ', async (answer) => {
            if (answer.toLowerCase() === 'yes') {
                console.log('\n⏳ Distributing Missing ROI, Updating Days, and Saving Logs...\n');
                
                let count = 0;
                const logFileName = `missed_roi_distributed_${Date.now()}.txt`;
                let logData = `=== MISSED ROI DISTRIBUTED LOG: ${new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })} ===\n\n`;

                for (let pkg of targetPackages) {
                    const user = await User.findOne({ userId: pkg.userId });
                    if (!user) continue;

                    // 1. User ko ROI dena (Wallet Balance add NAHI hoga as per your cron logic)
                    const roiAmount = pkg.dailyRoi; 
                    user.roiIncome = (parseFloat(user.roiIncome) || 0) + roiAmount;
                    user.totalRoiIncome = (parseFloat(user.totalRoiIncome) || 0) + roiAmount;
                    await user.save();

                    // 2. Package ka din (daysCompleted) aage badhana
                    pkg.daysCompleted += 1;
                    if (pkg.daysCompleted >= pkg.totalDays) {
                        pkg.status = 'completed'; 
                    }
                    await pkg.save();

                    // 3. Transaction History create karna
                    const tx = await Transaction.create({
                        userId: user.userId,
                        type: "daily_roi",
                        source: "roi",
                        amount: roiAmount,
                        description: `Missed Daily ROI (${pkg.daysCompleted}/25) for $${pkg.packageAmount} Package`,
                        status: "success",
                        date: new Date()
                    });

                    console.log(`✅ ROI Given | User: ${pkg.userId} | Amount: +$${roiAmount} | Package: $${pkg.packageAmount}`);
                    logData += `User: ${pkg.userId} | Package: $${pkg.packageAmount} | ROI Given: +$${roiAmount} | Transaction ID: ${tx._id}\n`;
                    count++;

                    // =======================================================
                    // 🔹 4. DAILY LEVEL INCOME ENGINE (Same as Cron)
                    // =======================================================
                    const LEVEL_PERCENTAGES = [5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]; 
                    let currentUplineId = user.sponsorId;
                    let currentLevel = 1;

                    while (currentUplineId && currentLevel <= 12) {
                        const upline = await User.findOne({ userId: currentUplineId });
                        if (!upline) break;

                        const directsCount = upline.directCount || 0;

                        if (!upline.isToppedUp) {
                            // Inactive skip
                        } else if (directsCount < currentLevel) {
                            // Directs kam hain toh skip
                        } else {
                            const percentage = LEVEL_PERCENTAGES[currentLevel - 1];
                            const dailyLevelBonus = (roiAmount * percentage) / 100; 

                            if (dailyLevelBonus > 0) {
                                upline.levelIncome = (parseFloat(upline.levelIncome) || 0) + dailyLevelBonus;
                                upline.totalLevelIncome = (parseFloat(upline.totalLevelIncome) || 0) + dailyLevelBonus;
                                await upline.save();

                                await Transaction.create({
                                    userId: upline.userId,
                                    type: "daily_level_income",
                                    source: "level",
                                    amount: dailyLevelBonus,
                                    fromUserId: user.userId,
                                    description: `Missed Daily Level Income (${percentage}%) from ${user.userId}'s ROI (Level ${currentLevel})`,
                                    status: "success",
                                    date: new Date()
                                });
                            }
                        }
                        currentUplineId = upline.sponsorId;
                        currentLevel++;
                    }
                }

                logData += `\nSUMMARY: Successfully distributed missed ROI to ${count} packages. Total Amount: $${totalRoiToGive.toFixed(2)}\n`;
                fs.writeFileSync(logFileName, logData);

                console.log(`\n🎉 DONE! Successfully fixed ${count} stuck packages.`);
                console.log(`📄 Ek record file generate hui hai: ${logFileName}`);
            } else {
                console.log("\n❌ Operation Cancelled. Kisi ko ROI nahi diya gaya.");
            }
            process.exit(0);
        });

    } catch (err) {
        console.error("\n❌ Script Error: ", err);
        process.exit(1);
    }
}

giveMissedRoi();