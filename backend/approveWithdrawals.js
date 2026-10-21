require('dotenv').config(); // .env se MONGO_URI uthane ke liye
const mongoose = require('mongoose');
const readline = require('readline');

// Models import kar rahe hain (Agar path alag ho toh theek kar lena)
const User = require('./models/User'); 
const Withdrawal = require('./models/Withdrawal');
const Transaction = require('./models/Transaction');

// Terminal mein Yes/No poochne ke liye interface setup
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const startScanner = async () => {
    try {
        console.log("⏳ Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB Connected Successfully!\n");

        console.log("🔍 Scanning for Pending Withdrawals...");
        
        // Saare pending withdrawals uthao
        const pendingWithdrawals = await Withdrawal.find({ status: 'pending' }).lean();

        if (pendingWithdrawals.length === 0) {
            console.log("👍 No pending withdrawals found. System is clear.");
            process.exit(0);
        }

        console.log(`\n📋 FOUND ${pendingWithdrawals.length} PENDING WITHDRAWALS:\n`);
        console.log("----------------------------------------------------------------------------------");
        console.log(String("Sr.").padEnd(5) + String("User ID").padEnd(15) + String("Name").padEnd(20) + String("Req. Amount").padEnd(15) + String("Current Wallet"));
        console.log("----------------------------------------------------------------------------------");

        let totalAmountToApprove = 0;
        let validWithdrawals = [];

        // Har withdrawal ka user dhundh kar data format kar rahe hain
        for (let i = 0; i < pendingWithdrawals.length; i++) {
            const w = pendingWithdrawals[i];
            const user = await User.findOne({ userId: w.userId }).lean();

            if (user) {
                totalAmountToApprove += Number(w.netAmount || w.grossAmount || 0);
                validWithdrawals.push({ withdrawal: w, user: user });

                const currentBal = user.walletBalance ? user.walletBalance.toFixed(2) : "0.00";
                const reqAmt = Number(w.netAmount || w.grossAmount || 0).toFixed(2);
                
                console.log(
                    String(i + 1 + ".").padEnd(5) + 
                    String(w.userId).padEnd(15) + 
                    String(w.name || user.name || "N/A").padEnd(20) + 
                    String("$" + reqAmt).padEnd(15) + 
                    String("$" + currentBal)
                );
            }
        }

        console.log("----------------------------------------------------------------------------------");
        console.log(`💰 Total Amount to be added to Wallets: $${totalAmountToApprove.toFixed(2)}\n`);

        // User se confirmation maangna
        rl.question('⚠️ Do you want to APPROVE all these and ADD the amount to their walletBalance? (type "yes" or "no"): ', async (answer) => {
            
            if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
                console.log("\n🚀 Processing Approvals...");

                for (let data of validWithdrawals) {
                    const reqAmt = Number(data.withdrawal.netAmount || data.withdrawal.grossAmount || 0);

                    // 1. Withdrawal status update
                    await Withdrawal.updateOne(
                        { _id: data.withdrawal._id },
                        { $set: { status: 'approved', updatedAt: new Date() } }
                    );

                    // 2. Transaction status update (Agar exist karta hai)
                    await Transaction.updateMany(
                        { 
                            userId: data.withdrawal.userId, 
                            type: { $in: ['withdrawal', 'withdraw', 'Withdrawal'] }, 
                            status: 'pending' 
                        },
                        { $set: { status: 'success' } }
                    );

                    // 3. User ke Wallet Balance me Amount ADD karna
                    await User.updateOne(
                        { _id: data.user._id },
                        { $inc: { walletBalance: reqAmt } }
                    );

                    console.log(`✅ Approved for ${data.user.userId} -> Added $${reqAmt} to Wallet`);
                }

                console.log("\n🎉 All Pending Withdrawals Approved & Wallets Updated Successfully!");
            } else {
                console.log("\n❌ Action Cancelled. No changes were made to the database.");
            }

            rl.close();
            process.exit(0);
        });

    } catch (error) {
        console.error("🔥 Fatal Error:", error);
        process.exit(1);
    }
};

startScanner();