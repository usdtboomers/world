require('dotenv').config();
const mongoose = require('mongoose');
const readline = require('readline');
const fs = require('fs'); // 🔥 NAYA: File system module log save karne ke liye

const User = require('./models/User'); 
const Transaction = require('./models/Transaction');
const PackageActivation = require('./models/PackageActivation');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function revertWrongPayouts() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Database Connected Successfully!");

        // Aaj ki tarikh nikalna properly MM/DD/YYYY format me IST ke hisab se
        const dateString = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata", year: 'numeric', month: '2-digit', day: '2-digit' });
        const [month, day, year] = dateString.split('/');

        const startTime = new Date(`${year}-${month}-${day}T20:00:00+05:30`);
        const endTime = new Date(`${year}-${month}-${day}T23:59:59+05:30`);

        console.log(`\n🔍 Searching transactions strictly on Indian Time:`);
        console.log(`🇮🇳 Start (IST): ${startTime.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })}`);
        console.log(`🇮🇳 End (IST):   ${endTime.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })}`);

        const wrongTransactions = await Transaction.find({
            type: { $in: ['daily_roi', 'daily_level_income'] },
            date: { $gte: startTime, $lte: endTime }
        });

        if (wrongTransactions.length === 0) {
            console.log("\n🟢 Koi bhi galat transaction nahi mili is time range mein.");
            process.exit(0);
        }

        const uniqueUserIds = [...new Set(wrongTransactions.map(tx => tx.userId))];
        const usersList = await User.find({ userId: { $in: uniqueUserIds } }, 'userId name');
        
        const userNamesMap = {};
        usersList.forEach(u => {
            userNamesMap[u.userId] = u.name;
        });

        const userSummary = {};
        for (let tx of wrongTransactions) {
            if (!userSummary[tx.userId]) {
                userSummary[tx.userId] = { 
                    name: userNamesMap[tx.userId] || 'Unknown', 
                    roi: 0, 
                    level: 0, 
                    txCount: 0 
                };
            }
            
            const txAmount = parseFloat(tx.amount) || 0;

            if (tx.type === 'daily_roi') userSummary[tx.userId].roi += txAmount;
            if (tx.type === 'daily_level_income') userSummary[tx.userId].level += txAmount;
            userSummary[tx.userId].txCount += 1;
        }

        console.log(`\n======================================================`);
        console.log(` 📋 PREVIEW: USERS AFFECTED BETWEEN 9 PM - 11:59 PM (IST)`);
        console.log(`======================================================`);
        
        let totalRoiToDeduct = 0;
        let totalLevelToDeduct = 0;

        for (let userId in userSummary) {
            const data = userSummary[userId];
            console.log(`👤 Name: ${data.name} (${userId}) | 💸 ROI: $${data.roi.toFixed(2)} | 📊 Level: $${data.level.toFixed(2)} | 🧾 Txs: ${data.txCount}`);
            totalRoiToDeduct += data.roi;
            totalLevelToDeduct += data.level;
        }

        console.log(`------------------------------------------------------`);
        console.log(`🚨 Total Users Affected: ${Object.keys(userSummary).length}`);
        console.log(`🚨 Total Transactions to Delete: ${wrongTransactions.length}`);
        console.log(`🚨 Total ROI to Remove: $${totalRoiToDeduct.toFixed(2)}`);
        console.log(`🚨 Total Level to Remove: $${totalLevelToDeduct.toFixed(2)}`);
        console.log(`======================================================\n`);
        
        rl.question('❓ Kya aap in sabhi transactions ko delete karke user ke wallet aur income fields se fund minus karna chahte hain? (yes/no): ', async (answer) => {
            if (answer.toLowerCase() === 'yes') {
                console.log('\n⏳ Reverting funds, deleting transactions, and saving logs...\n');
                let count = 0;
                
                // 🔥 NAYA: Log file create karna
                const logFileName = `reverted_history_${Date.now()}.txt`;
                let logData = `=== REVERT LOG: ${new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })} ===\n\n`;

                for (let tx of wrongTransactions) {
                    const user = await User.findOne({ userId: tx.userId });
                    const userName = userNamesMap[tx.userId] || 'Unknown';

                    if (user) {
                        const deductAmount = parseFloat(tx.amount) || 0;

                        if (tx.type === 'daily_roi') {
                            user.roiIncome = (parseFloat(user.roiIncome) || 0) - deductAmount;
                            user.totalRoiIncome = (parseFloat(user.totalRoiIncome) || 0) - deductAmount;
                            user.walletBalance = (parseFloat(user.walletBalance) || 0) - deductAmount;
                             
                            const pkg = await PackageActivation.findOne({ userId: user.userId }).sort({ createdAt: -1 });
                            if (pkg && pkg.daysCompleted > 0) {
                                pkg.daysCompleted -= 1;
                                if(pkg.status === 'completed') pkg.status = 'active';
                                await pkg.save();
                            }
                        } 
                        else if (tx.type === 'daily_level_income') {
                            user.levelIncome = (parseFloat(user.levelIncome) || 0) - deductAmount;
                            user.totalLevelIncome = (parseFloat(user.totalLevelIncome) || 0) - deductAmount;
                         }
                        
                        await user.save();
                        await Transaction.findByIdAndDelete(tx._id);
                        
                        // Terminal me dikhana
                        console.log(`✅ Reverted | Type: ${tx.type} | Amount: -$${deductAmount} | User: ${userName} (${tx.userId})`);
                        
                        // 🔥 NAYA: File me likhne ke liye data jorna
                        logData += `User: ${userName} (${tx.userId}) | Type: ${tx.type} | Amount: -$${deductAmount} | Transaction ID: ${tx._id}\n`;
                        
                        count++;
                    }
                }
                
                // 🔥 NAYA: Pura data file me save karna
                logData += `\nSUMMARY: Removed ${count} transactions | Total ROI Deducted: $${totalRoiToDeduct.toFixed(2)} | Total Level Deducted: $${totalLevelToDeduct.toFixed(2)}\n`;
                fs.writeFileSync(logFileName, logData);
                
                console.log(`\n🎉 DONE! Successfully removed ${count} transactions.`);
                console.log(`📄 Ek history file generate hui hai: ${logFileName}`);
            } else {
                console.log("\n❌ Operation Cancelled. Koi data ya paisa minus nahi hua.");
            }
            process.exit(0);
        });

    } catch (err) {
        console.error("\n❌ Script Error: ", err);
        process.exit(1);
    }
}

revertWrongPayouts();