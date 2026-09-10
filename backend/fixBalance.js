const mongoose = require('mongoose');
const readline = require('readline');
const fs = require('fs');
const User = require('./models/User'); 
const Transaction = require('./models/Transaction'); 
require('dotenv').config();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function recoverTodayFunds() {
    try {
        console.log("⏳ Connecting to Database...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ DB Connected. Scanning ONLY TODAY'S 'daily_level_income'...\n");

        // 🔥 INDIA TIME (IST) Exact Midnight Calculation
        const istDateString = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
        const startOfToday = new Date(istDateString);
        startOfToday.setHours(0, 0, 0, 0);

        // Sirf Aaj ki transactions uthao
        const todaysTransactions = await Transaction.find({
            type: "daily_level_income",
            createdAt: { $gte: startOfToday },
            status: { $in: ["success", "completed"] }
        }).sort({ createdAt: 1 }).lean();

        // Har user ki aaj ki transactions ko ek list me dalo
        const userMap = {};
        for (const tx of todaysTransactions) {
            if (!userMap[tx.userId]) userMap[tx.userId] = [];
            userMap[tx.userId].push(Number(tx.amount));
        }

        let usersToFix = [];
        let totalMissingGlobal = 0;

        // Race condition wahi hoti hai jahan 1 se zyada transaction ek sath aayein
        for (const [userId, amounts] of Object.entries(userMap)) {
            if (amounts.length > 1) {
                const totalSum = amounts.reduce((a, b) => a + b, 0);
                // Race condition me aam-taur par aakhri transaction hi save hoti hai
                const survivedAmount = amounts[amounts.length - 1]; 
                const missing = Number((totalSum - survivedAmount).toFixed(4));

                if (missing > 0.01) {
                    usersToFix.push({
                        userId: userId,
                        txnCount: amounts.length,
                        todayTotalShouldBe: totalSum,
                        estimatedMissing: missing
                    });
                    totalMissingGlobal += missing;
                }
            }
        }

        if (usersToFix.length === 0) {
            console.log("🎉 No missing funds detected for TODAY! Everything is perfect.");
            mongoose.connection.close();
            process.exit(0);
        }

        console.log("===================================================================");
        console.log("⚠️  USERS AFFECTED BY TODAY'S RACE CONDITION BUG ⚠️");
        console.log("===================================================================");
        
        console.table(
            usersToFix.map(u => ({
                "User ID": u.userId,
                "Today's Txn Count": u.txnCount,
                "Should Have Earned Today": `$${u.todayTotalShouldBe.toFixed(4)}`,
                "Missing Amount (To Add)": `+$${u.estimatedMissing.toFixed(4)}`
            }))
        );

        console.log("===================================================================");
        console.log(`🚨 Total Affected Users Today: ${usersToFix.length}`);
        console.log(`💰 Total Missing Amount to Distribute: $${totalMissingGlobal.toFixed(4)}`);
        console.log("===================================================================\n");

        rl.question("❓ Do you want to add this missing amount to these users? (Y/N): ", async (answer) => {
            if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
                
                const backupFileName = `today_recovery_backup_${Date.now()}.json`;
                fs.writeFileSync(backupFileName, JSON.stringify(usersToFix, null, 2));
                console.log(`\n💾 [BACKUP SAVED] Changes saved to '${backupFileName}'!`);
                console.log("🚀 Starting Database Update...\n");
                
                let fixedCount = 0;
                for (const u of usersToFix) {
                    await User.updateOne(
                        { userId: u.userId }, // ID ki jagah userId use kiya for safety
                        { 
                            $inc: { 
                                levelIncome: u.estimatedMissing,
                                totalLevelIncome: u.estimatedMissing
                            }
                        }
                    );
                    fixedCount++;
                    console.log(`✅ Fixed ${u.userId} (+ $${u.estimatedMissing})`);
                }
                console.log(`\n🎉 Recovery Complete! Successfully fixed ${fixedCount} users.`);
            } else {
                console.log("\n❌ Operation Cancelled by Admin. No changes were made.");
            }
            
            mongoose.connection.close();
            rl.close();
            process.exit(0);
        });

    } catch (error) {
        console.error("❌ Recovery Failed:", error);
        process.exit(1);
    }
}

recoverTodayFunds();