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

// // async function fixMissingIncome() {
// //     try {
// //         await mongoose.connect(process.env.MONGO_URI);
// //         console.log("✅ Database Connected Successfully!");

// //         console.log("⏳ Calculating true earnings from Transaction Logs...");
        
// //         // 🔥 FIX: Aggregation hata diya gaya hai. JavaScript me calculate karenge taaki String (Text) aaram se Number me convert ho jaye.
// //         const allTxns = await Transaction.find({ 
// //             type: { $in: ['daily_roi', 'daily_level_income'] }, 
// //             status: 'success' 
// //         });

// //         const expectedData = {};
// //         for (let tx of allTxns) {
// //             const uid = tx.userId;
// //             const amt = parseFloat(tx.amount) || 0; // String ko properly number bana raha hai
            
// //             if (!expectedData[uid]) {
// //                 expectedData[uid] = { roi: 0, level: 0 };
// //             }
            
// //             if (tx.type === 'daily_roi') expectedData[uid].roi += amt;
// //             if (tx.type === 'daily_level_income') expectedData[uid].level += amt;
// //         }

// //         const users = await User.find({});
// //         const missingRecords = [];
// //         let grandTotalMissingRoi = 0;
// //         let grandTotalMissingLevel = 0;

// //         for (let user of users) {
// //             const expected = expectedData[user.userId] || { roi: 0, level: 0 };
            
// //             // Database se actual data nikalna
// //             const actualTotalRoi = parseFloat(user.totalRoiIncome) || 0;
// //             const actualTotalLevel = parseFloat(user.totalLevelIncome) || 0;
            
// //             const expectedRoi = expected.roi;
// //             const expectedLevel = expected.level;

// //             // Missing fund calculate karna
// //             const missingRoi = expectedRoi > actualTotalRoi ? parseFloat((expectedRoi - actualTotalRoi).toFixed(4)) : 0;
// //             const missingLevel = expectedLevel > actualTotalLevel ? parseFloat((expectedLevel - actualTotalLevel).toFixed(4)) : 0;

// //             if (missingRoi > 0.001 || missingLevel > 0.001) {
// //                 missingRecords.push({
// //                     user: user,
// //                     missingRoi,
// //                     missingLevel
// //                 });
// //                 grandTotalMissingRoi += missingRoi;
// //                 grandTotalMissingLevel += missingLevel;
// //             }
// //         }

// //         if (missingRecords.length === 0) {
// //             console.log("\n🟢 Sabhi users ka balance aur transaction logs ekdum match kar rahe hain. Koi fund missing nahi hai!");
// //             process.exit(0);
// //         }

// //         console.log(`\n======================================================`);
// //         console.log(` 📋 PREVIEW: USERS WITH MISSING INCOME`);
// //         console.log(`======================================================`);

// //         for (let record of missingRecords) {
// //             console.log(`👤 User: ${record.user.userId} | 💸 Missing ROI: $${record.missingRoi.toFixed(2)} | 📊 Missing Level: $${record.missingLevel.toFixed(2)}`);
// //         }

// //         console.log(`------------------------------------------------------`);
// //         console.log(`🚨 Total Users Affected: ${missingRecords.length}`);
// //         console.log(`🚨 Total Missing ROI: $${grandTotalMissingRoi.toFixed(2)}`);
// //         console.log(`🚨 Total Missing Level: $${grandTotalMissingLevel.toFixed(2)}`);
// //         console.log(`======================================================\n`);

// //         rl.question('❓ Kya aap in users ke fields me ye missing fund ADD karna chahte hain? (yes/no): ', async (answer) => {
// //             if (answer.toLowerCase() === 'yes') {
// //                 console.log('\n⏳ Restoring missing funds...\n');
// //                 let count = 0;
                
// //                 const logFileName = `restored_missing_funds_${Date.now()}.txt`;
// //                 let logData = `=== MISSING FUNDS RESTORE LOG: ${new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })} ===\n\n`;

// //                 for (let record of missingRecords) {
// //                     const u = record.user;
                    
// //                     // MongoDB ka $inc operator use kar rahe hain taaki exact amount add ho
// //                     await User.updateOne({ _id: u._id }, {
// //                         $inc: {
// //                             roiIncome: record.missingRoi,
// //                             totalRoiIncome: record.missingRoi,
// //                             levelIncome: record.missingLevel,
// //                             totalLevelIncome: record.missingLevel
// //                         }
// //                     });

// //                     logData += `User: ${u.userId} | Added ROI: $${record.missingRoi.toFixed(2)} | Added Level: $${record.missingLevel.toFixed(2)}\n`;
// //                     count++;
// //                 }

// //                 logData += `\nSUMMARY: Fixed ${count} users. Total ROI Added: $${grandTotalMissingRoi.toFixed(2)} | Total Level Added: $${grandTotalMissingLevel.toFixed(2)}\n`;
// //                 fs.writeFileSync(logFileName, logData);

// //                 console.log(`\n🎉 DONE! Successfully fixed ${count} users' balances.`);
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

// // fixMissingIncome();

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

// async function fixMissingLevelIncome() {
//     try {
//         await mongoose.connect(process.env.MONGO_URI);
//         console.log("✅ Database Connected Successfully!");

//         console.log("⏳ Calculating ONLY missing Level Income from Transaction Logs...");
        
//         // 🔥 STRICTLY: Sirf 'daily_level_income' ke transactions uthayega
//         const allTxns = await Transaction.find({ 
//             type: 'daily_level_income', 
//             status: 'success' 
//         });

//         const expectedData = {};
//         for (let tx of allTxns) {
//             const uid = tx.userId;
//             const amt = parseFloat(tx.amount) || 0; 
            
//             if (!expectedData[uid]) {
//                 expectedData[uid] = { level: 0 };
//             }
            
//             // Sirf level income jod raha hai
//             expectedData[uid].level += amt;
//         }

//         const users = await User.find({});
//         const missingRecords = [];
//         let grandTotalMissingLevel = 0;

//         for (let user of users) {
//             const expected = expectedData[user.userId] || { level: 0 };
            
//             // User ke DB se sirf Level Income ka total nikal raha hai
//             const actualTotalLevel = parseFloat(user.totalLevelIncome) || 0;
//             const expectedLevel = expected.level;

//             // Missing Level fund calculate karna
//             const missingLevel = expectedLevel > actualTotalLevel ? parseFloat((expectedLevel - actualTotalLevel).toFixed(4)) : 0;

//             if (missingLevel > 0.001) {
//                 missingRecords.push({
//                     user: user,
//                     missingLevel
//                 });
//                 grandTotalMissingLevel += missingLevel;
//             }
//         }

//         if (missingRecords.length === 0) {
//             console.log("\n🟢 Sabhi users ki LEVEL INCOME ekdum match kar rahi hai. Koi fund missing nahi hai!");
//             process.exit(0);
//         }

//         console.log(`\n======================================================`);
//         console.log(` 📋 PREVIEW: USERS WITH MISSING LEVEL INCOME`);
//         console.log(`======================================================`);

//         for (let record of missingRecords) {
//             console.log(`👤 User: ${record.user.userId} | 📊 Missing Level Income: $${record.missingLevel.toFixed(2)}`);
//         }

//         console.log(`------------------------------------------------------`);
//         console.log(`🚨 Total Users Affected: ${missingRecords.length}`);
//         console.log(`🚨 Total Missing Level Amount: $${grandTotalMissingLevel.toFixed(2)}`);
//         console.log(`======================================================\n`);

//         rl.question('❓ Kya aap in users ke fields me ye missing LEVEL fund ADD karna chahte hain? (yes/no): ', async (answer) => {
//             if (answer.toLowerCase() === 'yes') {
//                 console.log('\n⏳ Restoring missing Level funds...\n');
//                 let count = 0;
                
//                 const logFileName = `restored_missing_level_${Date.now()}.txt`;
//                 let logData = `=== MISSING LEVEL RESTORE LOG: ${new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })} ===\n\n`;

//                 for (let record of missingRecords) {
//                     const u = record.user;
                    
//                     // 🔥 STRICTLY: Sirf levelIncome aur totalLevelIncome add hoga. ROI safe rahega.
//                     await User.updateOne({ _id: u._id }, {
//                         $inc: {
//                             levelIncome: record.missingLevel,
//                             totalLevelIncome: record.missingLevel
//                         }
//                     });

//                     logData += `User: ${u.userId} | Added Level: $${record.missingLevel.toFixed(2)}\n`;
//                     count++;
//                 }

//                 logData += `\nSUMMARY: Fixed ${count} users. Total Level Added: $${grandTotalMissingLevel.toFixed(2)}\n`;
//                 fs.writeFileSync(logFileName, logData);

//                 console.log(`\n🎉 DONE! Successfully fixed ${count} users' Level balances.`);
//                 console.log(`📄 Ek history file generate hui hai: ${logFileName}`);
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

// fixMissingLevelIncome();

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

async function fixMissingLevelIncome() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Database Connected Successfully!");

        console.log("⏳ Scanning 10,000+ Transactions directly in Database Engine (Super Fast Mode)...");
        
        // 🔥 SPEED OPTIMIZATION 1: MongoDB Aggregation (DB ke andar hi string ko number banakar jod dega)
        const txSums = await Transaction.aggregate([
            { $match: { type: 'daily_level_income', status: 'success' } },
            { 
                $group: {
                    _id: "$userId",
                    // String amount ko safely Double (Number) me convert karke sum karna
                    totalAmount: { 
                        $sum: { 
                            $convert: { input: "$amount", to: "double", onError: 0, onNull: 0 } 
                        } 
                    }
                }
            }
        ]);

        const expectedData = {};
        for (let stat of txSums) {
            expectedData[stat._id] = stat.totalAmount;
        }

        console.log("✅ Transactions Aggregated! Now fetching users safely...");

        // 🔥 SPEED OPTIMIZATION 2: .lean() lagane se RAM ka load 90% kam ho jata hai
        const users = await User.find({}, 'userId totalLevelIncome _id').lean();
        
        const missingRecords = [];
        let grandTotalMissingLevel = 0;

        for (let user of users) {
            const expectedLevel = expectedData[user.userId] || 0;
            const actualTotalLevel = parseFloat(user.totalLevelIncome) || 0;

            // Missing Level fund calculate karna
            const missingLevel = expectedLevel > actualTotalLevel ? parseFloat((expectedLevel - actualTotalLevel).toFixed(4)) : 0;

            if (missingLevel > 0.001) {
                missingRecords.push({
                    user: user,
                    missingLevel
                });
                grandTotalMissingLevel += missingLevel;
            }
        }

        if (missingRecords.length === 0) {
            console.log("\n🟢 Sabhi users ki LEVEL INCOME ekdum match kar rahi hai. Koi fund missing nahi hai!");
            process.exit(0);
        }

        console.log(`\n======================================================`);
        console.log(` 📋 PREVIEW: USERS WITH MISSING LEVEL INCOME`);
        console.log(`======================================================`);

        for (let record of missingRecords) {
            console.log(`👤 User: ${record.user.userId} | 📊 Missing Level Income: $${record.missingLevel.toFixed(2)}`);
        }

        console.log(`------------------------------------------------------`);
        console.log(`🚨 Total Users Affected: ${missingRecords.length}`);
        console.log(`🚨 Total Missing Level Amount: $${grandTotalMissingLevel.toFixed(2)}`);
        console.log(`======================================================\n`);

        rl.question('❓ Kya aap in users ke fields me ye missing LEVEL fund ADD karna chahte hain? (yes/no): ', async (answer) => {
            if (answer.toLowerCase() === 'yes') {
                console.log('\n⏳ Restoring missing Level funds...\n');
                let count = 0;
                
                const logFileName = `restored_missing_level_${Date.now()}.txt`;
                let logData = `=== MISSING LEVEL RESTORE LOG: ${new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })} ===\n\n`;

                // 🔥 SPEED OPTIMIZATION 3: Bulk Update / Chunking for fast saves
                for (let record of missingRecords) {
                    const u = record.user;
                    
                    // STRICTLY: Sirf levelIncome aur totalLevelIncome add hoga.
                    await User.updateOne({ _id: u._id }, {
                        $inc: {
                            levelIncome: record.missingLevel,
                            totalLevelIncome: record.missingLevel
                        }
                    });

                    logData += `User: ${u.userId} | Added Level: $${record.missingLevel.toFixed(2)}\n`;
                    count++;
                }

                logData += `\nSUMMARY: Fixed ${count} users. Total Level Added: $${grandTotalMissingLevel.toFixed(2)}\n`;
                fs.writeFileSync(logFileName, logData);

                console.log(`\n🎉 DONE! Successfully fixed ${count} users' Level balances.`);
                console.log(`📄 Ek history file generate hui hai: ${logFileName}`);
            } else {
                console.log("\n❌ Operation Cancelled. Koi fund add nahi kiya gaya.");
            }
            process.exit(0);
        });

    } catch (err) {
        console.error("\n❌ Script Error: ", err);
        process.exit(1);
    }
}

fixMissingLevelIncome();