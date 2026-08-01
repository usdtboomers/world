require('dotenv').config(); 
const mongoose = require('mongoose');
const readline = require('readline/promises');
const { stdin: input, stdout: output } = require('process');

// ⚠️ APNE MODELS KA PATH SAHI SE DAAL LENA
const User = require('./models/User'); 
const Transaction = require('./models/Transaction');

const MONGO_URI = process.env.MONGO_URI || process.env.MONGO_URL;

if (!MONGO_URI) {
    console.log("❌ Error: .env file me MONGO_URI nahi mila.");
    process.exit(1);
}

async function runManualRevert() {
    const rl = readline.createInterface({ input, output });

    try {
        console.log("🔄 MongoDB se connect ho raha hai...");
        await mongoose.connect(MONGO_URI);
        console.log("✅ Database Connected Successfully!\n");

        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const wrongTransactions = await Transaction.find({
            type: { $in: ['daily_roi', 'daily_level_income'] },
            date: { $gte: startOfToday }
        });

        if (wrongTransactions.length === 0) {
            console.log("🎉 Aaj ka koi 'daily_roi' ya 'daily_level_income' transaction nahi mila.");
            process.exit(0);
        }

        const userDeductions = {};
        let totalAmountToRevert = 0; // Total calculate karne ke liye

        for (let txn of wrongTransactions) {
            if (!userDeductions[txn.userId]) {
                userDeductions[txn.userId] = 0;
            }
            const amt = Number(txn.amount) || 0;
            userDeductions[txn.userId] += amt; 
            totalAmountToRevert += amt; // Grand total me add karte jao
        }

        const userCount = Object.keys(userDeductions).length;
        
        console.log("======================================================");
        console.log(`⚠️ Total Affected Users: ${userCount}`);
        console.log(`💰 Total Amount Jo Minus Hoga: $${totalAmountToRevert.toFixed(4)}`);
        console.log("======================================================\n");

        // 🔥 SIRF EK BAAR PUCHEGA BULK ACTION KE LIYE
        const answer = await rl.question(`👉 Kya in SABHI ${userCount} users ka wallet balance EK SATH revert (minus) karna hai? (yes/no): `);

        if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
            console.log("\n🔄 Sabhi users ka Revert process shuru ho gaya hai...\n");

            let successCount = 0;
            for (let userId in userDeductions) {
                const rawAmount = userDeductions[userId];
                const amountToRevert = Number(rawAmount.toFixed(4)); 
                
                const user = await User.findOne({ userId: userId });

                if (!user) {
                    console.log(`⚠️ User [${userId}] nahi mila. Skip kar raha hu.`);
                    continue;
                }

                // Balance minus kiya
                user.walletBalance = Number(user.walletBalance || 0) - amountToRevert;
                
                if (user.walletBalance < 0) user.walletBalance = 0; 
                
                await user.save();
                console.log(`✅ DONE: [${userId}] se $${amountToRevert} minus kiya. Naya Balance: $${user.walletBalance.toFixed(4)}`);
                successCount++;
            }
            
            console.log(`\n🎉 SUCCESSFULLY COMPLETED! Total ${successCount} users ka balance theek kar diya gaya.`);
        } else {
            console.log(`\n⏩ OPERATION CANCELED: Kisi ka bhi balance minus nahi kiya gaya.`);
        }

        console.log("======================================================");

    } catch (error) {
        console.error("❌ Error aagaya bhai:", error);
    } finally {
        rl.close();
        mongoose.connection.close(); 
    }
}

runManualRevert();