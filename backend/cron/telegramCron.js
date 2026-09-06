// const cron = require("node-cron");
// const axios = require("axios");

// const Transaction = require("../models/Transaction");
// const SystemStat = require("../models/SystemStat");

// const getFormattedDate = (d = new Date()) => {
//     const istTimeStr = new Date(d).toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
//     const istDate = new Date(istTimeStr);
//     return istDate.getFullYear() + "-" +
//            String(istDate.getMonth() + 1).padStart(2, '0') + "-" +
//            String(istDate.getDate()).padStart(2, '0');
// };

// // ==========================================
// // 🚀 TELEGRAM DAILY SUMMARY BOT
// // ==========================================
// // // Aapka Bot Token aur Channel ID yahan update kar diya gaya hai
// // const TELEGRAM_BOT_TOKEN = "7876045763:AAFk0O4F0daXbAs7e3-dk8Pcr3FPQLlKySs"; 
// // const TELEGRAM_CHANNEL_ID = "@worldfinance01"; 

// // Abhi time 22:59 set hai. 
// cron.schedule('59 23 * * *', async () => {
//     console.log("⏳ Telegram Bot: Calculating Daily Summary...");
//     try {
//         const todayStr = getFormattedDate();
        
//         // 1. Calculate REAL Investments
//         const realTxns = await Transaction.find({
//             type: 'package_activation', 
//             status: { $regex: /^success$|^completed$/i } 
//         });

//         let totalRealAmount = 0;
//         let todayRealAmount = 0;

//         realTxns.forEach(tx => {
//             const amt = Number(tx.amount) || 0;
//             totalRealAmount += amt;
//             const txDateStr = getFormattedDate(new Date(tx.createdAt || tx.date));
//             if (txDateStr === todayStr) {
//                 todayRealAmount += amt;
//             }
//         });

//         // 2. Calculate FAKE BOT Investments
//         const allFakeStats = await SystemStat.find();
//         let totalBotAmount = 0;
//         let todayBotAmount = 0;

//         allFakeStats.forEach(stat => {
//             totalBotAmount += (stat.todayFakeUsdtAmount || 0);
//             if (stat.date) {
//                 const statDateObj = new Date(stat.date);
//                 const statDateStr = isNaN(statDateObj.getTime()) ? String(stat.date).substring(0, 10) : getFormattedDate(statDateObj);
//                 if (statDateStr === todayStr) {
//                     todayBotAmount += (stat.todayFakeUsdtAmount || 0);
//                 }
//             }
//         });

//         // 3. Grand Totals (Base 2000 initial value add kiya hai)
//         const totalGrandInvestment = 2000 + totalRealAmount + totalBotAmount; 
//         const todayTotalInvestment = todayRealAmount + todayBotAmount;

//         // 4. Format Telegram Message
//         const message = `
// 📊 *World Finance Daily Report* 📊

// 📅 *Date:* ${todayStr}

// 📈 *Today's Investment:* $${todayTotalInvestment.toFixed(2)}
// 💎 *Total Investment:* $${totalGrandInvestment.toFixed(2)}

// 🚀 _System is growing fast! Keep pushing!_
//         `;

//         // 5. Send to Telegram
//         await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
//             chat_id: TELEGRAM_CHANNEL_ID,
//             text: message,
//             parse_mode: "Markdown"
//         });

//         console.log("✅ Telegram Bot: Daily Summary sent successfully to @testboomboo!");

//     } catch (error) {
//         console.error("❌ Telegram Bot Error:", error.message);
//     }
// }, {
//     scheduled: true,
//     timezone: "Asia/Kolkata" 
// });

// console.log("🚀 Telegram Daily Report Cron initialized (Scheduled at 22:59 IST)");





const cron = require("node-cron");
const axios = require("axios");

const Transaction = require("../models/Transaction");
const SystemStat = require("../models/SystemStat");

const getFormattedDate = (d = new Date()) => {
    const istTimeStr = new Date(d).toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
    const istDate = new Date(istTimeStr);
    return istDate.getFullYear() + "-" +
           String(istDate.getMonth() + 1).padStart(2, '0') + "-" +
           String(istDate.getDate()).padStart(2, '0');
};

// ==========================================
// 🚀 TELEGRAM DAILY SUMMARY BOT
// ==========================================
const TELEGRAM_BOT_TOKEN = "7876045763:AAFk0O4F0daXbAs7e3-dk8Pcr3FPQLlKySs"; 
const TELEGRAM_CHANNEL_ID = "@worldfinance01"; 

// Abhi time 23:59 set hai. 
cron.schedule('01 0 * * *', async () => {
    console.log("⏳ Telegram Bot: Calculating Daily Summary...");
    try {
        const todayStr = getFormattedDate();
        
        // 🔥 NAYA: Kal (Yesterday) ki exact IST Date nikalna
        const istTimeStr = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
        const istDate = new Date(istTimeStr);
        istDate.setDate(istDate.getDate() - 1); // 1 din piche
        const yesterdayStr = istDate.getFullYear() + "-" +
               String(istDate.getMonth() + 1).padStart(2, '0') + "-" +
               String(istDate.getDate()).padStart(2, '0');

        // 1. Calculate REAL Investments
        const realTxns = await Transaction.find({
            type: 'package_activation', 
            status: { $regex: /^success$|^completed$/i } 
        });

        let totalRealAmount = 0;
        let yesterdayRealAmount = 0; // Aaj ke naam par kal ka data nikalenge

        realTxns.forEach(tx => {
            const amt = Number(tx.amount) || 0;
            totalRealAmount += amt;
            const txDateStr = getFormattedDate(new Date(tx.createdAt || tx.date));
            
            // 🔥 Yahan hum 'todayStr' ki jagah 'yesterdayStr' se match kara rahe hain
            if (txDateStr === yesterdayStr) {
                yesterdayRealAmount += amt;
            }
        });

        // 2. Calculate FAKE BOT Investments
        const allFakeStats = await SystemStat.find();
        let totalBotAmount = 0;
        let yesterdayBotAmount = 0; // Aaj ke naam par kal ka data

        allFakeStats.forEach(stat => {
            totalBotAmount += (stat.todayFakeUsdtAmount || 0);
            if (stat.date) {
                const statDateObj = new Date(stat.date);
                const statDateStr = isNaN(statDateObj.getTime()) ? String(stat.date).substring(0, 10) : getFormattedDate(statDateObj);
                
                // 🔥 Yahan bhi 'yesterdayStr' se match kara rahe hain
                if (statDateStr === yesterdayStr) {
                    yesterdayBotAmount += (stat.todayFakeUsdtAmount || 0);
                }
            }
        });

        // 3. Grand Totals (Base 2000 initial value add kiya hai)
        const totalGrandInvestment = 2000 + totalRealAmount + totalBotAmount; 
        
        // 'todayTotalInvestment' variable me actually kal ka amount hai
        const todayTotalInvestment = yesterdayRealAmount + yesterdayBotAmount;

        // 4. Format Telegram Message
        const message = `
📊 *World Finance Daily Report* 📊

📅 *Date:* ${todayStr}

📈 *Today's Investment:* $${todayTotalInvestment.toFixed(2)}
💎 *Total Investment:* $${totalGrandInvestment.toFixed(2)}

🚀 _System is growing fast! Keep pushing!_
        `;

        // 5. Send to Telegram
        await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            chat_id: TELEGRAM_CHANNEL_ID,
            text: message,
            parse_mode: "Markdown"
        });

        console.log("✅ Telegram Bot: Daily Summary sent successfully to @worldfinance01!");

    } catch (error) {
        console.error("❌ Telegram Bot Error:", error.message);
    }
}, {
    scheduled: true,
    timezone: "Asia/Kolkata" 
});

console.log("🚀 Telegram Daily Report Cron initialized (Scheduled at 23:59 IST)");