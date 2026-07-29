const User = require('../models/User'); 
const PackageActivation = require('../models/PackageActivation'); 
const Transaction = require('../models/Transaction'); 

exports.activatePackage = async (req, res) => {
    try {
        const { userId, memberId, packageAmount, txnPassword } = req.body;
        const amount = Number(packageAmount);

        if (!amount || isNaN(amount) || amount <= 0) {
            return res.status(400).json({ success: false, message: 'Invalid Package Amount.' });
        }

        // 1. Current User (Jo buy kar raha hai)
        const currentUser = await User.findOne({ userId: String(userId) });
        if (!currentUser) {
            return res.status(404).json({ success: false, message: "Current user not found" });
        }

        // 2. Target Member (Jiski ID active karni hai)
        const targetUser = await User.findOne({ userId: String(memberId) });
        if (!targetUser) {
            return res.status(404).json({ success: false, message: "Member ID not found" });
        }

        // 3. 🔐 PLAIN TEXT Transaction Password Verify
        if (!txnPassword) {
            return res.status(400).json({ success: false, message: "Transaction password is required" });
        }
        
        if (txnPassword.toLowerCase() !== currentUser.transactionPassword.toLowerCase()) {
            return res.status(401).json({ success: false, message: "Invalid Transaction Password!" });
        }

        // 4. Fund Wallet Check
        if ((currentUser.walletBalance || 0) < amount) {
            return res.status(400).json({ success: false, message: "Insufficient Fund Amount ($)!" });
        }

        // 5. Balance Deduct karna
        currentUser.walletBalance -= amount;
        await currentUser.save();

        // 6. 25 Days Expiry set karna & Package Record banana
        const activeDays = 25; 
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + activeDays);
        const dailyRoi = amount * 0.05; // 5% daily in USD

        // 🔥 FIXED: Added both userId and memberId to satisfy Mongoose schema validation
        const newPackage = await PackageActivation.create({
            userId: targetUser.userId,         // Added userId to fix validation error
            memberId: targetUser.userId,       // Added memberId
            purchasedBy: currentUser.userId,
            packageAmount: amount,             // Package amount field
            dailyRoi: dailyRoi,
            totalDays: activeDays,
            daysCompleted: 0,
            startDate: startDate,
            endDate: endDate,
            status: 'active'
        });

        // 7. Target User Core Update (Marking ID as Active)
        let isFirstTopup = !targetUser.isToppedUp;
        if (!targetUser.packages) targetUser.packages = [];
        targetUser.packages.push({ plan: "Investment Package", amount: amount, startDate: new Date(), withdrawn: 0 });
        
        targetUser.topUpAmount = Math.max(targetUser.topUpAmount || 0, amount);
        targetUser.updatedAt = new Date(); 
        if (isFirstTopup) {
            targetUser.isToppedUp = true;
            targetUser.topUpDate = new Date();
        }
        await targetUser.save();

        const createTransaction = async (data) => {
            return Transaction.create({ ...data, date: new Date() });
        };

        // Self package activation transaction
        await createTransaction({
            userId: currentUser.userId, type: "package_activation", amount: amount,
            fromUserId: currentUser.userId, toUserId: targetUser.userId,
            description: `Activated $${amount} Package for ${targetUser.userId}`, status: 'success'
        });

        // 🔥 Frontend ko instant success response bhej diya
        res.status(200).json({ 
            success: true, 
            message: `Package of $${amount} activated successfully for ${targetUser.userId}!`,
            data: newPackage
        });

        // =======================================================
        // 🔹 8. BACKGROUND MLM ENGINE ($2 Minimum Logic & Level 2-11)
        // =======================================================
        (async () => {
            try {
                // ✅ SPONSOR INCOME (10%) - REQUIRES MINIMUM $2 PACKAGE
                if (targetUser.sponsorId) {
                    const sponsor = await User.findOne({ userId: targetUser.sponsorId });
                    
                    if (sponsor && sponsor.isToppedUp && (sponsor.topUpAmount >= 2)) {
                        sponsor.directCount = (sponsor.directCount || 0) + 1;
                        const DIRECT_PERCENT = 10; 
                        const directBonusAmount = (amount * DIRECT_PERCENT) / 100; 

                        sponsor.directIncome = (sponsor.directIncome || 0) + directBonusAmount;
                        sponsor.totalDirectIncome = (sponsor.totalDirectIncome || 0) + directBonusAmount;
                        
                        await createTransaction({
                            userId: sponsor.userId, type: "direct_income", source: "direct", amount: directBonusAmount, 
                            fromUserId: targetUser.userId, description: `Direct Bonus (10%) from ${targetUser.name}'s Package`, status: 'success'
                        });
                        await sponsor.save();
                    } else if (sponsor) {
                        console.log(`[FLUSHED] Direct Income stopped for Sponsor ${sponsor.userId} because package is less than $2 or inactive.`);
                    }
                }

                // 🌟 LEVEL ENGINE (Level 2 to 11 = 1%)
                const LEVEL_PERCENTAGES = [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]; 
                let currentUplineId = targetUser.sponsorId; 
                let currentLevel = 1; 

                while (currentUplineId && currentLevel <= 11) {
                    const upline = await User.findOne({ userId: currentUplineId }).select('userId isToppedUp topUpAmount sponsorId _id');
                    if (!upline) break;

                    // 🛑 RULE 1: INACTIVE OR < $2 BLOCKER (INCOME FLUSH)
                    if (!upline.isToppedUp || (upline.topUpAmount || 0) < 2) {
                        console.log(`[FLUSHED] Income stopped for Upline ${upline.userId} at Level ${currentLevel} because package is < $2 or inactive.`);
                        currentUplineId = upline.sponsorId;
                        currentLevel++;
                        continue; 
                    }

                    // 1. LEVEL INCOME LOGIC (Level 2 se 11 tak)
                    if (currentLevel >= 2 && currentLevel <= 11) {
                        const percentage = LEVEL_PERCENTAGES[currentLevel - 1]; 
                        const levelAmount = (amount * percentage) / 100;

                        if (levelAmount > 0) {
                            await User.updateOne({ _id: upline._id }, { $inc: { levelIncome: levelAmount, totalLevelIncome: levelAmount } });
                            await createTransaction({
                                userId: upline.userId, type: "level_income", source: "level", amount: levelAmount,
                                fromUserId: targetUser.userId, description: `Level ${currentLevel} Income (${percentage}%) from Package`, status: 'success'
                            });
                        }
                    }

                    currentUplineId = upline.sponsorId;
                    currentLevel++;
                }
            } catch (bgError) {
                console.error("Background MLM Engine Error (Package Activation):", bgError);
            }
        })();

    } catch (error) {
        console.error("Package Activation Error:", error);
        res.status(500).json({ success: false, message: "Server Error during activation" });
    }
};