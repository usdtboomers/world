// // // // require('dotenv').config();
// // // // const mongoose = require('mongoose');
// // // // const readline = require('readline');
// // // // const fs = require('fs');

// // // // const User = require('./models/User'); 
// // // // const Transaction = require('./models/Transaction');

// // // // const rl = readline.createInterface({
// // // //     input: process.stdin,
// // // //     output: process.stdout
// // // // });

// // // // async function fixMissingIncome() {
// // // //     try {
// // // //         await mongoose.connect(process.env.MONGO_URI);
// // // //         console.log("✅ Database Connected Successfully!");

// // // //         console.log("⏳ Calculating true earnings from Transaction Logs...");
        
// // // //         // 🔥 FIX: Aggregation hata diya gaya hai. JavaScript me calculate karenge taaki String (Text) aaram se Number me convert ho jaye.
// // // //         const allTxns = await Transaction.find({ 
// // // //             type: { $in: ['daily_roi', 'daily_level_income'] }, 
// // // //             status: 'success' 
// // // //         });

// // // //         const expectedData = {};
// // // //         for (let tx of allTxns) {
// // // //             const uid = tx.userId;
// // // //             const amt = parseFloat(tx.amount) || 0; // String ko properly number bana raha hai
            
// // // //             if (!expectedData[uid]) {
// // // //                 expectedData[uid] = { roi: 0, level: 0 };
// // // //             }
            
// // // //             if (tx.type === 'daily_roi') expectedData[uid].roi += amt;
// // // //             if (tx.type === 'daily_level_income') expectedData[uid].level += amt;
// // // //         }

// // // //         const users = await User.find({});
// // // //         const missingRecords = [];
// // // //         let grandTotalMissingRoi = 0;
// // // //         let grandTotalMissingLevel = 0;

// // // //         for (let user of users) {
// // // //             const expected = expectedData[user.userId] || { roi: 0, level: 0 };
            
// // // //             // Database se actual data nikalna
// // // //             const actualTotalRoi = parseFloat(user.totalRoiIncome) || 0;
// // // //             const actualTotalLevel = parseFloat(user.totalLevelIncome) || 0;
            
// // // //             const expectedRoi = expected.roi;
// // // //             const expectedLevel = expected.level;

// // // //             // Missing fund calculate karna
// // // //             const missingRoi = expectedRoi > actualTotalRoi ? parseFloat((expectedRoi - actualTotalRoi).toFixed(4)) : 0;
// // // //             const missingLevel = expectedLevel > actualTotalLevel ? parseFloat((expectedLevel - actualTotalLevel).toFixed(4)) : 0;

// // // //             if (missingRoi > 0.001 || missingLevel > 0.001) {
// // // //                 missingRecords.push({
// // // //                     user: user,
// // // //                     missingRoi,
// // // //                     missingLevel
// // // //                 });
// // // //                 grandTotalMissingRoi += missingRoi;
// // // //                 grandTotalMissingLevel += missingLevel;
// // // //             }
// // // //         }

// // // //         if (missingRecords.length === 0) {
// // // //             console.log("\n🟢 Sabhi users ka balance aur transaction logs ekdum match kar rahe hain. Koi fund missing nahi hai!");
// // // //             process.exit(0);
// // // //         }

// // // //         console.log(`\n======================================================`);
// // // //         console.log(` 📋 PREVIEW: USERS WITH MISSING INCOME`);
// // // //         console.log(`======================================================`);

// // // //         for (let record of missingRecords) {
// // // //             console.log(`👤 User: ${record.user.userId} | 💸 Missing ROI: $${record.missingRoi.toFixed(2)} | 📊 Missing Level: $${record.missingLevel.toFixed(2)}`);
// // // //         }

// // // //         console.log(`------------------------------------------------------`);
// // // //         console.log(`🚨 Total Users Affected: ${missingRecords.length}`);
// // // //         console.log(`🚨 Total Missing ROI: $${grandTotalMissingRoi.toFixed(2)}`);
// // // //         console.log(`🚨 Total Missing Level: $${grandTotalMissingLevel.toFixed(2)}`);
// // // //         console.log(`======================================================\n`);

// // // //         rl.question('❓ Kya aap in users ke fields me ye missing fund ADD karna chahte hain? (yes/no): ', async (answer) => {
// // // //             if (answer.toLowerCase() === 'yes') {
// // // //                 console.log('\n⏳ Restoring missing funds...\n');
// // // //                 let count = 0;
                
// // // //                 const logFileName = `restored_missing_funds_${Date.now()}.txt`;
// // // //                 let logData = `=== MISSING FUNDS RESTORE LOG: ${new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })} ===\n\n`;

// // // //                 for (let record of missingRecords) {
// // // //                     const u = record.user;
                    
// // // //                     // MongoDB ka $inc operator use kar rahe hain taaki exact amount add ho
// // // //                     await User.updateOne({ _id: u._id }, {
// // // //                         $inc: {
// // // //                             roiIncome: record.missingRoi,
// // // //                             totalRoiIncome: record.missingRoi,
// // // //                             levelIncome: record.missingLevel,
// // // //                             totalLevelIncome: record.missingLevel
// // // //                         }
// // // //                     });

// // // //                     logData += `User: ${u.userId} | Added ROI: $${record.missingRoi.toFixed(2)} | Added Level: $${record.missingLevel.toFixed(2)}\n`;
// // // //                     count++;
// // // //                 }

// // // //                 logData += `\nSUMMARY: Fixed ${count} users. Total ROI Added: $${grandTotalMissingRoi.toFixed(2)} | Total Level Added: $${grandTotalMissingLevel.toFixed(2)}\n`;
// // // //                 fs.writeFileSync(logFileName, logData);

// // // //                 console.log(`\n🎉 DONE! Successfully fixed ${count} users' balances.`);
// // // //                 console.log(`📄 Ek history file generate hui hai: ${logFileName}`);
// // // //             } else {
// // // //                 console.log("\n❌ Operation Cancelled. Koi fund add nahi kiya gaya.");
// // // //             }
// // // //             process.exit(0);
// // // //         });

// // // //     } catch (err) {
// // // //         console.error("\n❌ Script Error: ", err);
// // // //         process.exit(1);
// // // //     }
// // // // }

// // // // fixMissingIncome();

// // // require('dotenv').config();
// // // const mongoose = require('mongoose');
// // // const readline = require('readline');
// // // const fs = require('fs');

// // // const User = require('./models/User'); 
// // // const Transaction = require('./models/Transaction');

// // // const rl = readline.createInterface({
// // //     input: process.stdin,
// // //     output: process.stdout
// // // });

// // // async function fixMissingLevelIncome() {
// // //     try {
// // //         await mongoose.connect(process.env.MONGO_URI);
// // //         console.log("✅ Database Connected Successfully!");

// // //         console.log("⏳ Calculating ONLY missing Level Income from Transaction Logs...");
        
// // //         // 🔥 STRICTLY: Sirf 'daily_level_income' ke transactions uthayega
// // //         const allTxns = await Transaction.find({ 
// // //             type: 'daily_level_income', 
// // //             status: 'success' 
// // //         });

// // //         const expectedData = {};
// // //         for (let tx of allTxns) {
// // //             const uid = tx.userId;
// // //             const amt = parseFloat(tx.amount) || 0; 
            
// // //             if (!expectedData[uid]) {
// // //                 expectedData[uid] = { level: 0 };
// // //             }
            
// // //             // Sirf level income jod raha hai
// // //             expectedData[uid].level += amt;
// // //         }

// // //         const users = await User.find({});
// // //         const missingRecords = [];
// // //         let grandTotalMissingLevel = 0;

// // //         for (let user of users) {
// // //             const expected = expectedData[user.userId] || { level: 0 };
            
// // //             // User ke DB se sirf Level Income ka total nikal raha hai
// // //             const actualTotalLevel = parseFloat(user.totalLevelIncome) || 0;
// // //             const expectedLevel = expected.level;

// // //             // Missing Level fund calculate karna
// // //             const missingLevel = expectedLevel > actualTotalLevel ? parseFloat((expectedLevel - actualTotalLevel).toFixed(4)) : 0;

// // //             if (missingLevel > 0.001) {
// // //                 missingRecords.push({
// // //                     user: user,
// // //                     missingLevel
// // //                 });
// // //                 grandTotalMissingLevel += missingLevel;
// // //             }
// // //         }

// // //         if (missingRecords.length === 0) {
// // //             console.log("\n🟢 Sabhi users ki LEVEL INCOME ekdum match kar rahi hai. Koi fund missing nahi hai!");
// // //             process.exit(0);
// // //         }

// // //         console.log(`\n======================================================`);
// // //         console.log(` 📋 PREVIEW: USERS WITH MISSING LEVEL INCOME`);
// // //         console.log(`======================================================`);

// // //         for (let record of missingRecords) {
// // //             console.log(`👤 User: ${record.user.userId} | 📊 Missing Level Income: $${record.missingLevel.toFixed(2)}`);
// // //         }

// // //         console.log(`------------------------------------------------------`);
// // //         console.log(`🚨 Total Users Affected: ${missingRecords.length}`);
// // //         console.log(`🚨 Total Missing Level Amount: $${grandTotalMissingLevel.toFixed(2)}`);
// // //         console.log(`======================================================\n`);

// // //         rl.question('❓ Kya aap in users ke fields me ye missing LEVEL fund ADD karna chahte hain? (yes/no): ', async (answer) => {
// // //             if (answer.toLowerCase() === 'yes') {
// // //                 console.log('\n⏳ Restoring missing Level funds...\n');
// // //                 let count = 0;
                
// // //                 const logFileName = `restored_missing_level_${Date.now()}.txt`;
// // //                 let logData = `=== MISSING LEVEL RESTORE LOG: ${new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })} ===\n\n`;

// // //                 for (let record of missingRecords) {
// // //                     const u = record.user;
                    
// // //                     // 🔥 STRICTLY: Sirf levelIncome aur totalLevelIncome add hoga. ROI safe rahega.
// // //                     await User.updateOne({ _id: u._id }, {
// // //                         $inc: {
// // //                             levelIncome: record.missingLevel,
// // //                             totalLevelIncome: record.missingLevel
// // //                         }
// // //                     });

// // //                     logData += `User: ${u.userId} | Added Level: $${record.missingLevel.toFixed(2)}\n`;
// // //                     count++;
// // //                 }

// // //                 logData += `\nSUMMARY: Fixed ${count} users. Total Level Added: $${grandTotalMissingLevel.toFixed(2)}\n`;
// // //                 fs.writeFileSync(logFileName, logData);

// // //                 console.log(`\n🎉 DONE! Successfully fixed ${count} users' Level balances.`);
// // //                 console.log(`📄 Ek history file generate hui hai: ${logFileName}`);
// // //             } else {
// // //                 console.log("\n❌ Operation Cancelled. Koi fund add nahi kiya gaya.");
// // //             }
// // //             process.exit(0);
// // //         });

// // //     } catch (err) {
// // //         console.error("\n❌ Script Error: ", err);
// // //         process.exit(1);
// // //     }
// // // }

// // // fixMissingLevelIncome();

// // require('dotenv').config();
// // const mongoose = require('mongoose');
// // const readline = require('readline');
// // const fs = require('fs');

// // const User = require('./models/User'); 
// // const Transaction = require('./models/Transaction');

// // const rl = readline.createInterface({
// //     input: process.stdin,
// //     output: process.stdout
// // });

// // async function fixMissingLevelIncome() {
// //     try {
// //         await mongoose.connect(process.env.MONGO_URI);
// //         console.log("✅ Database Connected Successfully!");

// //         console.log("⏳ Scanning 10,000+ Transactions directly in Database Engine (Super Fast Mode)...");
        
// //         // 🔥 SPEED OPTIMIZATION 1: MongoDB Aggregation (DB ke andar hi string ko number banakar jod dega)
// //         const txSums = await Transaction.aggregate([
// //             { $match: { type: 'daily_level_income', status: 'success' } },
// //             { 
// //                 $group: {
// //                     _id: "$userId",
// //                     // String amount ko safely Double (Number) me convert karke sum karna
// //                     totalAmount: { 
// //                         $sum: { 
// //                             $convert: { input: "$amount", to: "double", onError: 0, onNull: 0 } 
// //                         } 
// //                     }
// //                 }
// //             }
// //         ]);

// //         const expectedData = {};
// //         for (let stat of txSums) {
// //             expectedData[stat._id] = stat.totalAmount;
// //         }

// //         console.log("✅ Transactions Aggregated! Now fetching users safely...");

// //         // 🔥 SPEED OPTIMIZATION 2: .lean() lagane se RAM ka load 90% kam ho jata hai
// //         const users = await User.find({}, 'userId totalLevelIncome _id').lean();
        
// //         const missingRecords = [];
// //         let grandTotalMissingLevel = 0;

// //         for (let user of users) {
// //             const expectedLevel = expectedData[user.userId] || 0;
// //             const actualTotalLevel = parseFloat(user.totalLevelIncome) || 0;

// //             // Missing Level fund calculate karna
// //             const missingLevel = expectedLevel > actualTotalLevel ? parseFloat((expectedLevel - actualTotalLevel).toFixed(4)) : 0;

// //             if (missingLevel > 0.001) {
// //                 missingRecords.push({
// //                     user: user,
// //                     missingLevel
// //                 });
// //                 grandTotalMissingLevel += missingLevel;
// //             }
// //         }

// //         if (missingRecords.length === 0) {
// //             console.log("\n🟢 Sabhi users ki LEVEL INCOME ekdum match kar rahi hai. Koi fund missing nahi hai!");
// //             process.exit(0);
// //         }

// //         console.log(`\n======================================================`);
// //         console.log(` 📋 PREVIEW: USERS WITH MISSING LEVEL INCOME`);
// //         console.log(`======================================================`);

// //         for (let record of missingRecords) {
// //             console.log(`👤 User: ${record.user.userId} | 📊 Missing Level Income: $${record.missingLevel.toFixed(2)}`);
// //         }

// //         console.log(`------------------------------------------------------`);
// //         console.log(`🚨 Total Users Affected: ${missingRecords.length}`);
// //         console.log(`🚨 Total Missing Level Amount: $${grandTotalMissingLevel.toFixed(2)}`);
// //         console.log(`======================================================\n`);

// //         rl.question('❓ Kya aap in users ke fields me ye missing LEVEL fund ADD karna chahte hain? (yes/no): ', async (answer) => {
// //             if (answer.toLowerCase() === 'yes') {
// //                 console.log('\n⏳ Restoring missing Level funds...\n');
// //                 let count = 0;
                
// //                 const logFileName = `restored_missing_level_${Date.now()}.txt`;
// //                 let logData = `=== MISSING LEVEL RESTORE LOG: ${new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })} ===\n\n`;

// //                 // 🔥 SPEED OPTIMIZATION 3: Bulk Update / Chunking for fast saves
// //                 for (let record of missingRecords) {
// //                     const u = record.user;
                    
// //                     // STRICTLY: Sirf levelIncome aur totalLevelIncome add hoga.
// //                     await User.updateOne({ _id: u._id }, {
// //                         $inc: {
// //                             levelIncome: record.missingLevel,
// //                             totalLevelIncome: record.missingLevel
// //                         }
// //                     });

// //                     logData += `User: ${u.userId} | Added Level: $${record.missingLevel.toFixed(2)}\n`;
// //                     count++;
// //                 }

// //                 logData += `\nSUMMARY: Fixed ${count} users. Total Level Added: $${grandTotalMissingLevel.toFixed(2)}\n`;
// //                 fs.writeFileSync(logFileName, logData);

// //                 console.log(`\n🎉 DONE! Successfully fixed ${count} users' Level balances.`);
// //                 console.log(`📄 Ek history file generate hui hai: ${logFileName}`);
// //             } else {
// //                 console.log("\n❌ Operation Cancelled. Koi fund add nahi kiya gaya.");
// //             }
// //             process.exit(0);
// //         });

// //     } catch (err) {
// //         console.error("\n❌ Script Error: ", err);
// //         process.exit(1);
// //     }
// // }

// // fixMissingLevelIncome();

// require('dotenv').config();
// const mongoose = require('mongoose');
// const readline = require('readline');
// const fs = require('fs');

// const User = require('./models/User'); 
// const Transaction = require('./models/Transaction');

// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// });

// async function fixCompletelyMissedLevelIncome() {
//     try {
//         await mongoose.connect(process.env.MONGO_URI);
//         console.log("✅ Database Connected Successfully!");

//         // 🔥 TARGET DATES: Kal (6 Sept) aur Aaj (7 Sept) ke saare payouts scan karenge
//         const startScanDate = new Date('2026-09-07T00:00:00+05:30');
//         const endScanDate = new Date('2026-09-07T23:59:59+05:30');

//         console.log(`\n⏳ Scanning all ROI payouts to find COMPLETELY MISSED Level Incomes...`);
//         console.log(`Checking ROIs distributed between 6th Sept and 7th Sept...\n`);

//         // 1. Saare ROIs uthao jo in 2 dino me diye gaye hain
//         const roiTxns = await Transaction.find({
//             type: 'daily_roi',
//             status: 'success',
//             date: { $gte: startScanDate, $lte: endScanDate }
//         });

//         console.log(`✅ Found ${roiTxns.length} ROI transactions. Now scanning up to 12 levels for each...`);

//         const LEVEL_PERCENTAGES = [5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
//         const missingLevelPayouts = [];
//         const userSummary = {};
//         let grandTotalMissing = 0;

//         // 2. Har ek ROI ke liye uske 12 uplines ko check karo
//         for (let tx of roiTxns) {
//             const childUser = await User.findOne({ userId: tx.userId });
//             if (!childUser) continue;

//             const roiAmount = parseFloat(tx.amount) || 0;
//             const txDateStart = new Date(tx.date);
//             txDateStart.setHours(0,0,0,0);
//             const txDateEnd = new Date(txDateStart);
//             txDateEnd.setHours(23,59,59,999);

//             let currentUplineId = childUser.sponsorId;
//             let currentLevel = 1;

//             while (currentUplineId && currentLevel <= 12) {
//                 const upline = await User.findOne({ userId: currentUplineId });
//                 if (!upline) break;

//                 const directsCount = upline.directCount || 0;

//                 // 🛑 Rules Check
//                 if (upline.isToppedUp && directsCount >= currentLevel) {
//                     const percentage = LEVEL_PERCENTAGES[currentLevel - 1];
//                     const expectedLevelBonus = parseFloat(((roiAmount * percentage) / 100).toFixed(4));

//                     if (expectedLevelBonus > 0) {
//                         // 🔍 Check if this specific level income was already given for this specific ROI on the same day
//                         const alreadyPaid = await Transaction.findOne({
//                             userId: upline.userId,
//                             type: 'daily_level_income',
//                             fromUserId: childUser.userId,
//                             amount: expectedLevelBonus,
//                             date: { $gte: txDateStart, $lte: txDateEnd }
//                         });

//                         // Agar transaction nahi mila, matlab cron job ye baantna bhool gaya tha!
//                         if (!alreadyPaid) {
//                             missingLevelPayouts.push({
//                                 upline: upline,
//                                 childId: childUser.userId,
//                                 amount: expectedLevelBonus,
//                                 level: currentLevel,
//                                 percentage: percentage
//                             });

//                             if (!userSummary[upline.userId]) userSummary[upline.userId] = 0;
//                             userSummary[upline.userId] += expectedLevelBonus;
//                             grandTotalMissing += expectedLevelBonus;
//                         }
//                     }
//                 }

//                 currentUplineId = upline.sponsorId;
//                 currentLevel++;
//             }
//         }

//         if (missingLevelPayouts.length === 0) {
//             console.log("\n🟢 No missing Level Income found! Everyone got their level income based on ROIs.");
//             process.exit(0);
//         }

//         // ==========================================
//         // 🔹 PREVIEW BANANA
//         // ==========================================
//         console.log(`\n======================================================`);
//         console.log(` 📋 PREVIEW: USERS WHOSE LEVEL INCOME WAS SKIPPED BY CRON`);
//         console.log(`======================================================`);

//         for (let userId in userSummary) {
//             console.log(`👤 Upline User: ${userId} | 📊 Completely Missed Level Income: $${userSummary[userId].toFixed(4)}`);
//         }

//         console.log(`------------------------------------------------------`);
//         console.log(`🚨 Total Uplines Affected: ${Object.keys(userSummary).length}`);
//         console.log(`🚨 Total Transactions to Create: ${missingLevelPayouts.length}`);
//         console.log(`🚨 Grand Total Amount to Distribute: $${grandTotalMissing.toFixed(4)}`);
//         console.log(`======================================================\n`);

//         rl.question('❓ Kya aap in users ko inka रुका हुआ Level Income dena chahte hain? (yes/no): ', async (answer) => {
//             if (answer.toLowerCase() === 'yes') {
//                 console.log('\n⏳ Distributing completely missed Level Income...\n');
                
//                 const logFileName = `distributed_missed_level_${Date.now()}.txt`;
//                 let logData = `=== COMPLETELY MISSED LEVEL INCOME LOG: ${new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })} ===\n\n`;
//                 let count = 0;

//                 for (let payout of missingLevelPayouts) {
//                     const upline = payout.upline;

//                     // 1. Balance update karo (Safely using $inc)
//                     await User.updateOne({ _id: upline._id }, {
//                         $inc: {
//                             levelIncome: payout.amount,
//                             totalLevelIncome: payout.amount
//                         }
//                     });

//                     // 2. Transaction create karo taaki unhe statement me dikhe
//                     const newTx = await Transaction.create({
//                         userId: upline.userId,
//                         type: "daily_level_income",
//                         source: "level",
//                         amount: payout.amount,
//                         fromUserId: payout.childId,
//                         description: `Recovered Daily Level Income (${payout.percentage}%) from ${payout.childId}'s ROI (Level ${payout.level})`,
//                         status: "success",
//                         date: new Date()
//                     });

//                     logData += `Upline: ${upline.userId} | From: ${payout.childId} | Level: ${payout.level} | Amount: $${payout.amount} | TX ID: ${newTx._id}\n`;
//                     count++;
//                 }

//                 logData += `\nSUMMARY: Created ${count} new level income transactions. Total Distributed: $${grandTotalMissing.toFixed(4)}\n`;
//                 fs.writeFileSync(logFileName, logData);

//                 console.log(`\n🎉 DONE! Successfully created and distributed ${count} missing Level transactions.`);
//                 console.log(`📄 Ek record file generate hui hai: ${logFileName}`);
//             } else {
//                 console.log("\n❌ Operation Cancelled. Koi fund add nahi kiya gaya.");
//             }
//             process.exit(0);
//         });

//     } catch (err) {
//         console.error("\n❌ Script Error: ", err);
//         process.exit(1);
//     }
// }

// fixCompletelyMissedLevelIncome();

require('dotenv').config();
const mongoose = require('mongoose');
const readline = require('readline');
const fs = require('fs');

const User = require('./models/User'); 
const Transaction = require('./models/Transaction');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function fixCompletelyMissedLevelIncome() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Database Connected Successfully!");

        const startScanDate = new Date('2026-09-07T00:00:00+05:30');
        const endScanDate = new Date('2026-09-07T23:59:59+05:30');

        console.log(`\n⏳ Fetching data into RAM for ULTRA-FAST processing...`);

        // 1. Saare Users ko ek hi baar me memory me le aao
        const allUsers = await User.find({}).lean();
        const userMap = {};
        allUsers.forEach(u => userMap[u.userId] = u);
        console.log(`✅ Loaded ${allUsers.length} Users into memory.`);

        // 2. Saare ROIs uthao
        const roiTxns = await Transaction.find({
            type: 'daily_roi',
            status: 'success',
            date: { $gte: startScanDate, $lte: endScanDate }
        }).lean();
        console.log(`✅ Loaded ${roiTxns.length} ROI Transactions.`);

        // 3. Aaj ke saare Level Incomes uthao aur ek fast memory Map banao
        const levelTxns = await Transaction.find({
            type: 'daily_level_income',
            status: 'success',
            date: { $gte: startScanDate, $lte: endScanDate }
        }).lean();
        
        const paidLevelMap = {};
        for(let t of levelTxns) {
            const amt = parseFloat(t.amount).toFixed(4);
            const key = `${t.userId}_${t.fromUserId}_${amt}`;
            if(!paidLevelMap[key]) paidLevelMap[key] = 0;
            paidLevelMap[key]++; // Agar multiple packages hain toh counter badhayega
        }
        console.log(`✅ Loaded ${levelTxns.length} Level Transactions into memory.\n`);

        console.log(`🚀 Starting In-Memory Ultra Fast Scan (Ye 1 second me ho jayega)...`);

        const LEVEL_PERCENTAGES = [5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
        const missingLevelPayouts = [];
        const userSummary = {};
        let grandTotalMissing = 0;

        for (let tx of roiTxns) {
            const childUser = userMap[tx.userId];
            if (!childUser) continue;

            const roiAmount = parseFloat(tx.amount) || 0;
            let currentUplineId = childUser.sponsorId;
            let currentLevel = 1;

            while (currentUplineId && currentLevel <= 12) {
                const upline = userMap[currentUplineId];
                if (!upline) break;

                const directsCount = upline.directCount || 0;

                // 🛑 Rules Check
                if (upline.isToppedUp && directsCount >= currentLevel) {
                    const percentage = LEVEL_PERCENTAGES[currentLevel - 1];
                    const expectedLevelBonus = parseFloat(((roiAmount * percentage) / 100).toFixed(4));

                    if (expectedLevelBonus > 0) {
                        const amtStr = expectedLevelBonus.toFixed(4);
                        // Memory Lookup Key banayi: Upline_Child_Amount
                        const checkKey = `${upline.userId}_${childUser.userId}_${amtStr}`;

                        // Database check karne ki jagah seedha RAM map me check kar liya (0.0001 ms)
                        if (paidLevelMap[checkKey] > 0) {
                            paidLevelMap[checkKey]--; // Mark as verified/used (For multiple packages)
                        } else {
                            // Record nahi mila, cron pakka bhool gaya hai
                            missingLevelPayouts.push({
                                upline: upline,
                                childId: childUser.userId,
                                amount: expectedLevelBonus,
                                level: currentLevel,
                                percentage: percentage
                            });

                            if (!userSummary[upline.userId]) userSummary[upline.userId] = 0;
                            userSummary[upline.userId] += expectedLevelBonus;
                            grandTotalMissing += expectedLevelBonus;
                        }
                    }
                }

                currentUplineId = upline.sponsorId;
                currentLevel++;
            }
        }

        if (missingLevelPayouts.length === 0) {
            console.log("\n🟢 No missing Level Income found! Everyone got their level income based on ROIs.");
            process.exit(0);
        }

        console.log(`\n======================================================`);
        console.log(` 📋 PREVIEW: USERS WHOSE LEVEL INCOME WAS SKIPPED`);
        console.log(`======================================================`);

        for (let userId in userSummary) {
            console.log(`👤 Upline User: ${userId} | 📊 Missed Level Income: $${userSummary[userId].toFixed(4)}`);
        }

        console.log(`------------------------------------------------------`);
        console.log(`🚨 Total Uplines Affected: ${Object.keys(userSummary).length}`);
        console.log(`🚨 Total Transactions to Create: ${missingLevelPayouts.length}`);
        console.log(`🚨 Grand Total Amount: $${grandTotalMissing.toFixed(4)}`);
        console.log(`======================================================\n`);

        rl.question('❓ Kya aap in users ko inka Level Income dena chahte hain? (yes/no): ', async (answer) => {
            if (answer.toLowerCase() === 'yes') {
                console.log('\n⏳ Distributing completely missed Level Income...\n');
                
                const logFileName = `distributed_missed_level_${Date.now()}.txt`;
                let logData = `=== COMPLETELY MISSED LEVEL INCOME LOG: ${new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })} ===\n\n`;
                let count = 0;

                for (let payout of missingLevelPayouts) {
                    const upline = payout.upline;

                    // Safely balance update in DB
                    await User.updateOne({ _id: upline._id }, {
                        $inc: {
                            levelIncome: payout.amount,
                            totalLevelIncome: payout.amount
                        }
                    });

                    // Missing transaction create karo
                    const newTx = await Transaction.create({
                        userId: upline.userId,
                        type: "daily_level_income",
                        source: "level",
                        amount: payout.amount,
                        fromUserId: payout.childId,
                        description: `Recovered Daily Level Income (${payout.percentage}%) from ${payout.childId}'s ROI (Level ${payout.level})`,
                        status: "success",
                        date: new Date()
                    });

                    logData += `Upline: ${upline.userId} | From: ${payout.childId} | Level: ${payout.level} | Amount: $${payout.amount} | TX ID: ${newTx._id}\n`;
                    count++;
                }

                logData += `\nSUMMARY: Created ${count} new level income transactions. Total Distributed: $${grandTotalMissing.toFixed(4)}\n`;
                fs.writeFileSync(logFileName, logData);

                console.log(`\n🎉 DONE! Successfully created and distributed ${count} missing Level transactions.`);
                console.log(`📄 Ek record file generate hui hai: ${logFileName}`);
            } else {
                console.log("\n❌ Operation Cancelled.");
            }
            process.exit(0);
        });

    } catch (err) {
        console.error("\n❌ Script Error: ", err);
        process.exit(1);
    }
}

fixCompletelyMissedLevelIncome();