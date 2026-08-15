const User = require('../models/User');

exports.getSalaryProgress = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findOne({ userId: String(userId) });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // 1. Time Calculation (10 days from TopUp)
        let timeLeftMs = 0;
        let isExpired = false;
        let isNeverToppedUp = false; // 🔥 NAYA LOGIC: Check for zero topup
        const tenDaysMs = 10 * 24 * 60 * 60 * 1000;

        if (user.topUpDate) {
            const deadline = new Date(user.topUpDate.getTime() + tenDaysMs);
            timeLeftMs = deadline.getTime() - Date.now();
            if (timeLeftMs < 0) isExpired = true;
        } else {
            isExpired = true; 
            isNeverToppedUp = true; // 🔥 Agar topup hi nahi kiya toh isko true karo
        }

        // 2. Self Package Check
        const hasSelf50 = (user.topUpAmount || 0) >= 50;

        // 3. Level 1 & Level 2 Calculation
        // L1 Users nikalo
        const l1Users = await User.find({ sponsorId: user.userId });
        const qualifiedL1Count = l1Users.filter(u => (u.topUpAmount || 0) >= 50).length;
        
        // L2 Users nikalo
        const l1UserIds = l1Users.map(u => u.userId);
        const l2Users = await User.find({ sponsorId: { $in: l1UserIds } });
        const qualifiedL2Count = l2Users.filter(u => (u.topUpAmount || 0) >= 50).length;

        // 4. Qualification Logic
        let status = "pending";
        if (user.isSalaryQualified) {
            status = "qualified";
        } else if (hasSelf50 && qualifiedL1Count >= 3 && qualifiedL2Count >= 6 && !isExpired) {
            // Target Achieved within time! Mark as Qualified.
            user.isSalaryQualified = true;
            await user.save();
            status = "qualified";
        } else if (isExpired) {
            status = "failed"; // Time nikal gaya ya kabhi topup nahi kiya
        }

        res.status(200).json({
            success: true,
            data: {
                hasSelf50,
                l1Count: qualifiedL1Count,
                l2Count: qualifiedL2Count,
                status: status, // "pending", "qualified", ya "failed"
                timeLeftMs: timeLeftMs > 0 ? timeLeftMs : 0,
                salaryMonthsPaid: user.salaryMonthsPaid,
                salaryTotalIncome: user.salaryTotalIncome,
                isNeverToppedUp: isNeverToppedUp // 🔥 NAYA LOGIC: Frontend ko batane ke liye
            }
        });

    } catch (error) {
        console.error("Salary Progress Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};