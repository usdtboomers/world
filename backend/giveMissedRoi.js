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

        // 🔥 TARGET DATES: 5 Sep and 6 Sep 2026 (IST) 🔥
        const startTime = new Date('2026-09-05T00:00:00+05:30');
        const endTime = new Date('2026-09-06T23:59:59+05:30');

        console.log(`\n🔍 Scanning ALL active packages activated between 5th and 6th Sept...`);

        // 1. Saare 5 aur 6 Sep ke active packages nikalo
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
        // 🔹 FILTER: HAR PACKAGE KE DAYS CHECK KARNA
        // ==========================================
        console.log(`⏳ Checking missing days for EVERY single package...`);
        const actuallyMissingPackages = [];

        for (let pkg of targetPackages) {
            // IST mein package lagne ki date nikalo
            const pkgDateStr = new Date(pkg.startDate).toLocaleString("en-US", { timeZone: "Asia/Kolkata", year: 'numeric', month: '2-digit', day: '2-digit' });
            
            let expectedDays = 0;
            
            // 5 Sep walon ko aaj 7 Sep tak 2 baar ROI mil jana chahiye tha
            if (pkgDateStr.startsWith("09/05/2026")) {
                expectedDays = 2;
            } 
            // 6 Sep walon ko aaj 7 Sep tak 1 baar ROI mil jana chahiye tha
            else if (pkgDateStr.startsWith("09/06/2026")) {
                expectedDays = 1;
            }

            // Agar actual days completed, expected se kam hain, toh add karo
            const missingDays = expectedDays - pkg.daysCompleted;
            
            if (missingDays > 0) {
                actuallyMissingPackages.push({
                    pkg: pkg,
                    missingDays: missingDays
                });
            }
        }

        if (actuallyMissingPackages.length === 0) {
            console.log("\n🟢 Sabhi 5-6 Sep walo ka ROI aur daysCompleted ekdum updated hai. Koi missing nahi hai!");
            process.exit(0);
        }

        // ==========================================
        // 🔹 PREVIEW BANANA
        // ==========================================
        let totalRoiToGive = 0;

        console.log(`\n======================================================`);
        console.log(` 📋 PREVIEW: PACKAGES TO RECEIVE MISSED ROI`);
        console.log(`======================================================`);

        for (let item of actuallyMissingPackages) {
            const pkg = item.pkg;
            const missedTotal = pkg.dailyRoi * item.missingDays;
            console.log(`👤 User: ${pkg.userId} | 📦 Pkg: $${pkg.packageAmount} | ⏳ Current Days: ${pkg.daysCompleted} | ⚠️ Missing: ${item.missingDays} Days | 💸 Add: +$${missedTotal.toFixed(2)}`);
            totalRoiToGive += missedTotal;
        }

        console.log(`------------------------------------------------------`);
        console.log(`🚨 Packages Missing ROI: ${actuallyMissingPackages.length}`);
        console.log(`🚨 Total ROI to Distribute: +$${totalRoiToGive.toFixed(2)}`);
        console.log(`======================================================\n`);

        // ==========================================
        // 🔹 YES / NO CONFIRMATION
        // ==========================================
        rl.question('❓ Kya aap in packages ko inke missing days ka ROI aur Level Income dena chahte hain? (yes/no): ', async (answer) => {
            if (answer.toLowerCase() === 'yes') {
                console.log('\n⏳ Distributing Missing ROI, Updating Days, and Saving Logs...\n');
                
                let count = 0;
                const logFileName = `missed_roi_distributed_${Date.now()}.txt`;
                let logData = `=== MISSED ROI LOG: ${new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })} ===\n\n`;

                for (let item of actuallyMissingPackages) {
                    const pkg = item.pkg;
                    const loops = item.missingDays;

                    const user = await User.findOne({ userId: pkg.userId });
                    if (!user) continue;

                    // Jitne din miss hue hain, utni baar loop chalega taaki hisaab clear rahe
                    for (let i = 0; i < loops; i++) {
                        const roiAmount = pkg.dailyRoi; 
                        
                        // 1. User ko ROI dena (Wallet Balance update NAHI hoga)
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

                        console.log(`✅ ROI Given | User: ${pkg.userId} | Amount: +$${roiAmount} | Package: $${pkg.packageAmount} | Day: ${pkg.daysCompleted}/25`);
                        logData += `User: ${pkg.userId} | Package: $${pkg.packageAmount} | ROI Given: +$${roiAmount} | Day: ${pkg.daysCompleted} | TX: ${tx._id}\n`;
                        count++;

                        // =======================================================
                        // 🔹 4. DAILY LEVEL INCOME ENGINE 
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
                                    // (Wallet Balance update NAHI hoga, only level incomes)
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
                }

                logData += `\nSUMMARY: Successfully distributed missed ROI to ${actuallyMissingPackages.length} packages. Total ROI Issued: $${totalRoiToGive.toFixed(2)}\n`;
                fs.writeFileSync(logFileName, logData);

                console.log(`\n🎉 DONE! Successfully fixed ${actuallyMissingPackages.length} stuck packages.`);
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