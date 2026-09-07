require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Transaction = require('./models/Transaction');

async function auditUser() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Database Connected\n");

        // 👇 Yahan aap kisi bhi user ki ID daal kar check kar sakte hain
        const TARGET_USER = 'WF3263669'; 
        const user = await User.findOne({ userId: TARGET_USER });

        if (!user) {
            console.log(`❌ User ${TARGET_USER} nahi mila!`);
            process.exit(1);
        }

        console.log(`=========================================`);
        console.log(`👤 AUDIT REPORT FOR: ${TARGET_USER}`);
        console.log(`Status: ${user.isToppedUp ? 'Active ✅' : 'Inactive ❌'} | Directs Active: ${user.directCount || 0}`);
        console.log(`=========================================\n`);
        
        // Aaj ka time nikalna (Sept 7 - IST)
        const startOfToday = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
        startOfToday.setHours(0, 0, 0, 0);

        const LEVEL_PERCENTAGES = [5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
        
        let expectedIncomeToday = 0;
        let currentLevelUsers = [TARGET_USER];
        let levelDetails = [];

        console.log(`⏳ Scanning downline tree up to 12 levels... Please wait...\n`);

        for (let level = 1; level <= 12; level++) {
            if (currentLevelUsers.length === 0) break;

            const downlines = await User.find({ sponsorId: { $in: currentLevelUsers } });
            const downlineIds = downlines.map(u => u.userId);
            
            let levelExpected = 0;
            let activeRoiTxs = 0;

            // Check karo ki in downlines mein se kis-kis ko AAJ ROI mila hai
            if (downlineIds.length > 0) {
                const roiTxns = await Transaction.find({
                    userId: { $in: downlineIds },
                    type: 'daily_roi',
                    date: { $gte: startOfToday }
                });

                for (let tx of roiTxns) {
                    activeRoiTxs++;
                    const percentage = LEVEL_PERCENTAGES[level - 1];
                    const bonus = (tx.amount * percentage) / 100;
                    levelExpected += bonus;
                }
            }

            // Check karo ki kya hamara TARGET_USER is level ka paisa lene ke layak hai? (Rules check)
            let qualified = true;
            let reason = "Qualified ✅";
            if (!user.isToppedUp) {
                qualified = false;
                reason = "ID Inactive ❌";
            } else if ((user.directCount || 0) < level) {
                qualified = false;
                reason = `Needs ${level} directs, has ${user.directCount} ❌`;
            }

            if (qualified) {
                expectedIncomeToday += levelExpected;
            }

            levelDetails.push({
                Level: level,
                "Team Size": downlineIds.length,
                "Users Got ROI Today": activeRoiTxs,
                "Income Ban-ni Chahiye": `$${levelExpected.toFixed(2)}`,
                "Condition Pass?": reason
            });

            currentLevelUsers = downlineIds;
        }

        // System ne aaj kitna Transaction generate kiya wo dekho
        const actualTxns = await Transaction.find({
            userId: TARGET_USER,
            type: 'daily_level_income',
            date: { $gte: startOfToday }
        });

        let actualIncomeToday = 0;
        actualTxns.forEach(tx => actualIncomeToday += tx.amount);

        console.log(`📊 LEVEL-BY-LEVEL BREAKDOWN FOR TODAY:`);
        console.table(levelDetails);

        console.log(`\n💰 SUMMARY FOR TODAY (Sept 7):`);
        console.log(`✅ Expected Level Income (Jitna banta tha):   $${expectedIncomeToday.toFixed(4)}`);
        console.log(`📝 Actual Transaction Generated (Jitna gaya): $${actualIncomeToday.toFixed(4)}`);
        
        const diff = expectedIncomeToday - actualIncomeToday;
        
        if (diff > 0.001) {
            console.log(`\n🚨 ALERT: Cron job ne $${diff.toFixed(4)} ka Transaction generate hi nahi kiya!`);
            console.log(`(Ye dikhata hai ki Cron Job ka logic bich me skip hua hai)`);
        } else {
            console.log(`\n🟢 MATCHED: System ne ekdum perfect Transactions generate kiye hain!`);
            console.log(`Agar DB mein (Dashboard par) balance kam dikh raha hai, toh wo sirf overwriting (Race Condition) thi jo fixMissingIncome script theek karegi.`);
        }

        process.exit(0);

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

auditUser();