require('dotenv').config();
const mongoose = require('mongoose');
const readline = require('readline');
const fs = require('fs');

const User = require('./models/User'); 

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function restoreWallet() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Database Connected Successfully!");

        // Yahan aapse .txt file ka naam poocha jayega
        rl.question('\n📁 Kripya us .txt file ka naam likhein (jaise reverted_history_17xxxx.txt) jisme record save hua tha: ', async (fileName) => {
            fileName = fileName.trim();

            if (!fs.existsSync(fileName)) {
                console.log(`\n❌ Error: '${fileName}' naam ki koi file nahi mili. Naam check karein.`);
                process.exit(1);
            }

            const fileContent = fs.readFileSync(fileName, 'utf-8');
            const lines = fileContent.split('\n');

            const refundData = {};
            let totalRefundAmount = 0;

            for (let line of lines) {
                // 🛑 Sirf 'daily_roi' wali lines dhoondhna hai
                if (line.includes('Type: daily_roi')) {
                    
                    // Regex se ID aur Amount extract karna
                    const userIdMatch = line.match(/\(([^)]+)\)\s*\|\s*Type/);
                    const amountMatch = line.match(/Amount:\s*-\$([\d.]+)/);

                    if (userIdMatch && amountMatch) {
                        const userId = userIdMatch[1];
                        const amount = parseFloat(amountMatch[1]);

                        if (!refundData[userId]) {
                            refundData[userId] = 0;
                        }
                        refundData[userId] += amount;
                        totalRefundAmount += amount;
                    }
                }
            }

            const userIds = Object.keys(refundData);

            if (userIds.length === 0) {
                console.log("\n🟢 Is file mein koi daily_roi ka deduction data nahi mila.");
                process.exit(0);
            }

            // ==========================================
            // 🔹 PREVIEW: KISKO KITNA WALLET WAPAS JAYEGA
            // ==========================================
            console.log(`\n======================================================`);
            console.log(` 📋 PREVIEW: USERS WALLET BALANCE TO RESTORE`);
            console.log(`======================================================`);

            for (let userId of userIds) {
                console.log(`👤 User: ${userId} | 💰 Wallet me add hoga: +$${refundData[userId].toFixed(2)}`);
            }

            console.log(`------------------------------------------------------`);
            console.log(`🚨 Total Users: ${userIds.length}`);
            console.log(`🚨 Total Wallet Fund to Restore: +$${totalRefundAmount.toFixed(2)}`);
            console.log(`======================================================\n`);

            // ==========================================
            // 🔹 YES / NO CONFIRMATION
            // ==========================================
            rl.question('❓ Kya aap in sabhi users ke wallet mein ye amount wapas ADD karna chahte hain? (yes/no): ', async (answer) => {
                if (answer.toLowerCase() === 'yes') {
                    console.log('\n⏳ Restoring Wallet Balances...\n');
                    let count = 0;

                    for (let userId of userIds) {
                        const user = await User.findOne({ userId: userId });
                        if (user) {
                            const addAmount = refundData[userId];
                            
                            // 🔥 YAHAN SIRF WALLET BALANCE WAPAS ADD HOGA 🔥
                            user.walletBalance = (parseFloat(user.walletBalance) || 0) + addAmount;
                            await user.save();

                            console.log(`✅ Restored | User ID: ${userId} | Added: +$${addAmount}`);
                            count++;
                        } else {
                            console.log(`⚠️ User Not Found in DB: ${userId}`);
                        }
                    }
                    
                    console.log(`\n🎉 DONE! Successfully restored wallet balance for ${count} users.`);
                } else {
                    console.log("\n❌ Operation Cancelled. Wallet me koi amount add nahi hua.");
                }
                process.exit(0);
            });
        });

    } catch (err) {
        console.error("\n❌ Script Error: ", err);
        process.exit(1);
    }
}

restoreWallet();