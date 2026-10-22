require('dotenv').config();
const mongoose = require('mongoose');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

const User = require('./models/User');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const startTransfer = async () => {
    try {
        console.log("⏳ Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB Connected Successfully!\n");

        console.log("🔍 Scanning users with pending Direct or Level Income...\n");

        const users = await User.find({
            $or: [
                { directIncome: { $gt: 0 } },
                { levelIncome: { $gt: 0 } }
            ]
        }).lean();

        if (users.length === 0) {
            console.log("👍 No users found with pending Direct or Level income. System is clear.");
            process.exit(0);
        }

        console.log(`📋 FOUND ${users.length} USERS:\n`);
        console.log("--------------------------------------------------------------------------------------------------");
        console.log(String("User ID").padEnd(15) + String("Name").padEnd(15) + String("Direct").padEnd(12) + String("Level").padEnd(12) + String("Old Wallet").padEnd(15) + String("New Wallet"));
        console.log("--------------------------------------------------------------------------------------------------");

        let totalAmountToTransfer = 0;
        let backupData = []; // Backup array

        for (let user of users) {
            const direct = user.directIncome || 0;
            const level = user.levelIncome || 0;
            const totalToAdd = direct + level;
            
            const oldWallet = user.walletBalance || 0;
            const newWallet = oldWallet + totalToAdd;

            totalAmountToTransfer += totalToAdd;

            // Backup ke liye purana data save kar rahe hain
            backupData.push({
                _id: user._id,
                userId: user.userId,
                oldWalletBalance: oldWallet,
                oldDirectIncome: direct,
                oldLevelIncome: level
            });

            console.log(
                String(user.userId).padEnd(15) + 
                String(user.name || "N/A").slice(0, 14).padEnd(15) + 
                String("$" + direct.toFixed(2)).padEnd(12) + 
                String("$" + level.toFixed(2)).padEnd(12) + 
                String("$" + oldWallet.toFixed(2)).padEnd(15) + 
                String("$" + newWallet.toFixed(2))
            );
        }

        console.log("--------------------------------------------------------------------------------------------------");
        console.log(`💰 Total Income to be transferred system-wide: $${totalAmountToTransfer.toFixed(2)}\n`);

        rl.question('⚠️ Do you want to TRANSFER all these incomes to their walletBalance? (yes/no): ', async (answer) => {
            
            if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
                
                // 🔥 TRANSFER SE PEHLE BACKUP FILE BANANA
                const backupFileName = `backup_incomes_${Date.now()}.json`;
                const backupFilePath = path.join(__dirname, backupFileName);
                fs.writeFileSync(backupFilePath, JSON.stringify(backupData, null, 2));
                console.log(`\n💾 BACKUP CREATED: ${backupFileName} (Keep this file safe to UNDO later!)`);

                console.log("🚀 Processing Transfers...\n");

                for (let user of users) {
                    const direct = user.directIncome || 0;
                    const level = user.levelIncome || 0;
                    const totalToAdd = direct + level;

                    await User.updateOne(
                        { _id: user._id },
                        { 
                            $inc: { walletBalance: totalToAdd },
                            $set: { directIncome: 0, levelIncome: 0 }
                        }
                    );
                    console.log(`✅ Updated ${user.userId} -> Added $${totalToAdd.toFixed(2)} to Wallet Balance`);
                }

                console.log("\n🎉 All Incomes Transferred to Wallet Balance Successfully!");
            } else {
                console.log("\n❌ Action Cancelled. No changes were made.");
            }

            rl.close();
            process.exit(0);
        });

    } catch (error) {
        console.error("🔥 Fatal Error:", error);
        process.exit(1);
    }
};

startTransfer();