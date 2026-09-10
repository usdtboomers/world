// const mongoose = require('mongoose');
// const readline = require('readline');
// const fs = require('fs'); // 🔥 NAYA: File system module backup ke liye
// const User = require('./models/User'); 
// const Transaction = require('./models/Transaction'); 
// require('dotenv').config();

// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// });

// async function recoverMissingFunds() {
//     try {
//         console.log("⏳ Connecting to Database...");
//         await mongoose.connect(process.env.MONGO_URI);
//         console.log("✅ DB Connected. Scanning 'daily_level_income' transactions...\n");

//         // 1. Sirf 'daily_level_income' ka data nikalo 
//         const actualTotals = await Transaction.aggregate([
//             { $match: { type: "daily_level_income", status: { $in: ["success", "completed"] } } },
//             {
//                 $group: {
//                     _id: "$userId",
//                     actualTotalLevel: { $sum: { $toDouble: "$amount" } }
//                 }
//             }
//         ]);

//         let usersToFix = [];
//         let totalMissingGlobal = 0;

//         console.log(`🔍 Total users with Level Income transactions: ${actualTotals.length}`);
//         console.log("⏳ Comparing with User Wallet Balances...\n");

//         // 2. Compare Actual vs Current
//         for (const data of actualTotals) {
//             const user = await User.findOne({ userId: data._id }).lean();
//             if (!user) continue;

//             const currentTotalLevel = user.totalLevelIncome || 0;
//             const missingLevel = Number((data.actualTotalLevel - currentTotalLevel).toFixed(4));

//             if (missingLevel > 0.01) {
//                 usersToFix.push({
//                     id: user._id,
//                     userId: user.userId,
//                     hasNow: currentTotalLevel,
//                     shouldHave: data.actualTotalLevel,
//                     missing: missingLevel,
//                     timestamp: new Date().toISOString()
//                 });
//                 totalMissingGlobal += missingLevel;
//             }
//         }

//         // 3. Agar sab theek hai
//         if (usersToFix.length === 0) {
//             console.log("🎉 All users have perfect Level Income balances! Nothing to fix.");
//             mongoose.connection.close();
//             process.exit(0);
//         }

//         // 4. Proper Table List Dikhao
//         console.log("===================================================================");
//         console.log("⚠️  USERS WITH MISSING LEVEL INCOME (RACE CONDITION) ⚠️");
//         console.log("===================================================================");
        
//         console.table(
//             usersToFix.map(u => ({
//                 "User ID": u.userId,
//                 "Current Balance": `$${u.hasNow.toFixed(4)}`,
//                 "Should Have": `$${u.shouldHave.toFixed(4)}`,
//                 "Missing (To Add)": `+$${u.missing.toFixed(4)}`
//             }))
//         );

//         console.log("===================================================================");
//         console.log(`🚨 Total Affected Users: ${usersToFix.length}`);
//         console.log(`💰 Total Missing Amount to Distribute: $${totalMissingGlobal.toFixed(4)}`);
//         console.log("===================================================================\n");

//         // 5. YES / NO Prompt for Confirmation
//         rl.question("❓ Do you want to add the missing amount to these users? (Y/N): ", async (answer) => {
//             if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
                
//                 // 🔥 BACKUP SYSTEM: Update karne se pehle data save karo
//                 const backupFileName = `recovery_backup_${Date.now()}.json`;
//                 fs.writeFileSync(backupFileName, JSON.stringify(usersToFix, null, 2));
//                 console.log(`\n💾 [BACKUP SAVED] Changes ki ek copy '${backupFileName}' me save kar li gayi hai!`);
//                 console.log("🚀 Starting Database Update...\n");
                
//                 let fixedCount = 0;
//                 for (const u of usersToFix) {
//                     await User.updateOne(
//                         { _id: u.id },
//                         { 
//                             $inc: { 
//                                 levelIncome: u.missing,
//                                 totalLevelIncome: u.missing
//                             }
//                         }
//                     );
//                     fixedCount++;
//                     console.log(`✅ Fixed ${u.userId} (+ $${u.missing})`);
//                 }
//                 console.log(`\n🎉 Recovery Complete! Successfully fixed ${fixedCount} users.`);
//             } else {
//                 console.log("\n❌ Operation Cancelled by Admin. No changes were made.");
//             }
            
//             mongoose.connection.close();
//             rl.close();
//             process.exit(0);
//         });

//     } catch (error) {
//         console.error("❌ Recovery Failed:", error);
//         process.exit(1);
//     }
// }

// recoverMissingFunds();

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

async function recoverTodayGenuineFunds() {
    try {
        console.log("⏳ Connecting to Database...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ DB Connected. Scanning ONLY TODAY'S Genuine Missing Funds...\n");

        // 🔥 1. Aaj raat 12 baje (IST) ka time nikalo
        const istDateString = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
        const startOfToday = new Date(istDateString);
        startOfToday.setHours(0, 0, 0, 0);

        // 🔥 2. SIRF AAJ ki transactions uthao
        const todaysTransactions = await Transaction.find({
            type: "daily_level_income",
            status: { $in: ["success", "completed"] },
            createdAt: { $gte: startOfToday } // Ye line fix karti hai ki sirf aaj ka data aaye
        }).sort({ createdAt: 1 }).lean();

        // 3. User-wise aaj ka data ikattha karo
        const userTodayHistory = {};

        for (const tx of todaysTransactions) {
            const uid = tx.userId;
            const amount = Number(tx.amount?.$numberDecimal || tx.amount) || 0;

            if (!userTodayHistory[uid]) userTodayHistory[uid] = [];
            userTodayHistory[uid].push(amount);
        }

        let usersToFix = [];
        let totalMissingToday = 0;

        // 4. Sirf Aaj ka missing amount calculate karo
        for (const userId in userTodayHistory) {
            const dailyAmounts = userTodayHistory[userId];
            
            // Agar aaj 1 se zyada baar income aayi, tabhi bug aaya hoga
            if (dailyAmounts.length > 1) {
                const totalExpectedForToday = dailyAmounts.reduce((a, b) => a + b, 0);
                // Purane code me sirf aakhri entry save hoti thi
                const actuallySavedInWallet = dailyAmounts[dailyAmounts.length - 1]; 
                
                const missingForToday = totalExpectedForToday - actuallySavedInWallet;
                
                if (missingForToday > 0.01) {
                    usersToFix.push({
                        userId: userId,
                        txnCountToday: dailyAmounts.length,
                        missingAmount: Number(missingForToday.toFixed(4))
                    });
                    totalMissingToday += missingForToday;
                }
            }
        }

        if (usersToFix.length === 0) {
            console.log("🎉 No Overwrite Bugs found for TODAY! Everything is perfect.");
            mongoose.connection.close();
            process.exit(0);
        }

        console.log("===================================================================");
        console.log("⚠️  USERS WITH MISSING LEVEL INCOME FOR TODAY ONLY ⚠️");
        console.log("===================================================================");
        
        console.table(
            usersToFix.map(u => ({
                "User ID": u.userId,
                "Today's Transactions": `${u.txnCountToday} entries`,
                "Missing Today (To Add)": `+$${u.missingAmount.toFixed(4)}`
            }))
        );

        console.log("===================================================================");
        console.log(`🚨 Total Affected Users Today: ${usersToFix.length}`);
        console.log(`💰 Total Missing Amount Today: $${totalMissingToday.toFixed(4)}`);
        console.log("===================================================================\n");

        rl.question("❓ Do you want to add TODAY'S missing amount? (Y/N): ", async (answer) => {
            if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
                
                // 🔥 BACKUP SYSTEM
                const backupFileName = `today_genuine_recovery_${Date.now()}.json`;
                fs.writeFileSync(backupFileName, JSON.stringify(usersToFix, null, 2));
                console.log(`\n💾 [BACKUP SAVED] Changes ki ek copy '${backupFileName}' me save kar li gayi hai!`);
                console.log("🚀 Starting Database Update...\n");
                
                let fixedCount = 0;
                for (const u of usersToFix) {
                    await User.updateOne(
                        { userId: u.userId },
                        { 
                            $inc: { 
                                levelIncome: u.missingAmount,
                                totalLevelIncome: u.missingAmount
                            }
                        }
                    );
                    fixedCount++;
                    console.log(`✅ Fixed ${u.userId} (+ $${u.missingAmount})`);
                }
                console.log(`\n🎉 Recovery Complete! Successfully fixed ${fixedCount} users for TODAY.`);
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

recoverTodayGenuineFunds();