// // const cron = require("node-cron");
// // const axios = require("axios");

// // const Transaction = require("../models/Transaction");
// // const SystemStat = require("../models/SystemStat");

// // const getFormattedDate = (d = new Date()) => {
// //     const istTimeStr = new Date(d).toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
// //     const istDate = new Date(istTimeStr);
// //     return istDate.getFullYear() + "-" +
// //            String(istDate.getMonth() + 1).padStart(2, '0') + "-" +
// //            String(istDate.getDate()).padStart(2, '0');
// // };

// // // ==========================================
// // // 🚀 TELEGRAM DAILY SUMMARY BOT
// // // ==========================================
// // // // Aapka Bot Token aur Channel ID yahan update kar diya gaya hai
// // // const TELEGRAM_BOT_TOKEN = "7876045763:AAFk0O4F0daXbAs7e3-dk8Pcr3FPQLlKySs"; 
// // // const TELEGRAM_CHANNEL_ID = "@worldfinance01"; 

// // // Abhi time 22:59 set hai. 
// // cron.schedule('59 23 * * *', async () => {
// //     console.log("⏳ Telegram Bot: Calculating Daily Summary...");
// //     try {
// //         const todayStr = getFormattedDate();
        
// //         // 1. Calculate REAL Investments
// //         const realTxns = await Transaction.find({
// //             type: 'package_activation', 
// //             status: { $regex: /^success$|^completed$/i } 
// //         });

// //         let totalRealAmount = 0;
// //         let todayRealAmount = 0;

// //         realTxns.forEach(tx => {
// //             const amt = Number(tx.amount) || 0;
// //             totalRealAmount += amt;
// //             const txDateStr = getFormattedDate(new Date(tx.createdAt || tx.date));
// //             if (txDateStr === todayStr) {
// //                 todayRealAmount += amt;
// //             }
// //         });

// //         // 2. Calculate FAKE BOT Investments
// //         const allFakeStats = await SystemStat.find();
// //         let totalBotAmount = 0;
// //         let todayBotAmount = 0;

// //         allFakeStats.forEach(stat => {
// //             totalBotAmount += (stat.todayFakeUsdtAmount || 0);
// //             if (stat.date) {
// //                 const statDateObj = new Date(stat.date);
// //                 const statDateStr = isNaN(statDateObj.getTime()) ? String(stat.date).substring(0, 10) : getFormattedDate(statDateObj);
// //                 if (statDateStr === todayStr) {
// //                     todayBotAmount += (stat.todayFakeUsdtAmount || 0);
// //                 }
// //             }
// //         });

// //         // 3. Grand Totals (Base 2000 initial value add kiya hai)
// //         const totalGrandInvestment = 2000 + totalRealAmount + totalBotAmount; 
// //         const todayTotalInvestment = todayRealAmount + todayBotAmount;

// //         // 4. Format Telegram Message
// //         const message = `
// // 📊 *World Finance Daily Report* 📊

// // 📅 *Date:* ${todayStr}

// // 📈 *Today's Investment:* $${todayTotalInvestment.toFixed(2)}
// // 💎 *Total Investment:* $${totalGrandInvestment.toFixed(2)}

// // 🚀 _System is growing fast! Keep pushing!_
// //         `;

// //         // 5. Send to Telegram
// //         await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
// //             chat_id: TELEGRAM_CHANNEL_ID,
// //             text: message,
// //             parse_mode: "Markdown"
// //         });

// //         console.log("✅ Telegram Bot: Daily Summary sent successfully to @testboomboo!");

// //     } catch (error) {
// //         console.error("❌ Telegram Bot Error:", error.message);
// //     }
// // }, {
// //     scheduled: true,
// //     timezone: "Asia/Kolkata" 
// // });

// // console.log("🚀 Telegram Daily Report Cron initialized (Scheduled at 22:59 IST)");





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
// const TELEGRAM_BOT_TOKEN = "7876045763:AAFk0O4F0daXbAs7e3-dk8Pcr3FPQLlKySs"; 
// const TELEGRAM_CHANNEL_ID = "@worldfinance01"; 


// // const TELEGRAM_BOT_TOKEN = "8664179639:AAGLhMYdNVp91sPfg2MNUYZaRshaUZyZfQQ"; 
// // const TELEGRAM_CHANNEL_ID = "@testboomboo"; 

// // Abhi time 23:59 set hai. 
// cron.schedule('01 0 * * *', async () => {
//     console.log("⏳ Telegram Bot: Calculating Daily Summary...");
//     try {
//         const todayStr = getFormattedDate();
        
//         // 🔥 NAYA: Kal (Yesterday) ki exact IST Date nikalna
//         const istTimeStr = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
//         const istDate = new Date(istTimeStr);
//         istDate.setDate(istDate.getDate() - 1); // 1 din piche
//         const yesterdayStr = istDate.getFullYear() + "-" +
//                String(istDate.getMonth() + 1).padStart(2, '0') + "-" +
//                String(istDate.getDate()).padStart(2, '0');

//         // 1. Calculate REAL Investments
//         const realTxns = await Transaction.find({
//             type: 'package_activation', 
//             status: { $regex: /^success$|^completed$/i } 
//         });

//         let totalRealAmount = 0;
//         let yesterdayRealAmount = 0; // Aaj ke naam par kal ka data nikalenge

//         realTxns.forEach(tx => {
//             const amt = Number(tx.amount) || 0;
//             totalRealAmount += amt;
//             const txDateStr = getFormattedDate(new Date(tx.createdAt || tx.date));
            
//             // 🔥 Yahan hum 'todayStr' ki jagah 'yesterdayStr' se match kara rahe hain
//             if (txDateStr === yesterdayStr) {
//                 yesterdayRealAmount += amt;
//             }
//         });

//         // 2. Calculate FAKE BOT Investments
//         const allFakeStats = await SystemStat.find();
//         let totalBotAmount = 0;
//         let yesterdayBotAmount = 0; // Aaj ke naam par kal ka data

//         allFakeStats.forEach(stat => {
//             totalBotAmount += (stat.todayFakeUsdtAmount || 0);
//             if (stat.date) {
//                 const statDateObj = new Date(stat.date);
//                 const statDateStr = isNaN(statDateObj.getTime()) ? String(stat.date).substring(0, 10) : getFormattedDate(statDateObj);
                
//                 // 🔥 Yahan bhi 'yesterdayStr' se match kara rahe hain
//                 if (statDateStr === yesterdayStr) {
//                     yesterdayBotAmount += (stat.todayFakeUsdtAmount || 0);
//                 }
//             }
//         });

//         // 3. Grand Totals (Base 2000 initial value add kiya hai)
//         const totalGrandInvestment = 2000 + totalRealAmount + totalBotAmount; 
        
//         // 'todayTotalInvestment' variable me actually kal ka amount hai
//         const todayTotalInvestment = yesterdayRealAmount + yesterdayBotAmount;

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

//         console.log("✅ Telegram Bot: Daily Summary sent successfully to @worldfinance01!");

//     } catch (error) {
//         console.error("❌ Telegram Bot Error:", error.message);
//     }
// }, {
//     scheduled: true,
//     timezone: "Asia/Kolkata" 
// });

// console.log("🚀 Telegram Daily Report Cron initialized (Scheduled at 23:59 IST)");



// // ==========================================
// // 💸 TELEGRAM DAILY WITHDRAWAL BOT (12:30 PM)
// // ==========================================
// cron.schedule('30 12 * * *', async () => {
//     console.log("⏳ Telegram Bot: Calculating Daily Withdrawal Summary...");
//     try {
//         const todayStr = getFormattedDate();
        
//         // 1. Kal (Yesterday) ki exact IST Date nikalna taaki kal ka total investment pata chale
//         const istTimeStr = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
//         const istDate = new Date(istTimeStr);
//         istDate.setDate(istDate.getDate() - 1); // 1 din piche
//         const yesterdayStr = istDate.getFullYear() + "-" +
//                String(istDate.getMonth() + 1).padStart(2, '0') + "-" +
//                String(istDate.getDate()).padStart(2, '0');

//         // 2. Calculate REAL Investments (for yesterday)
//         const realTxns = await Transaction.find({
//             type: 'package_activation', 
//             status: { $regex: /^success$|^completed$/i } 
//         });

//         let yesterdayRealAmount = 0;
//         realTxns.forEach(tx => {
//             const amt = Number(tx.amount) || 0;
//             const txDateStr = getFormattedDate(new Date(tx.createdAt || tx.date));
//             if (txDateStr === yesterdayStr) {
//                 yesterdayRealAmount += amt;
//             }
//         });

//         // 3. Calculate FAKE BOT Investments (for yesterday)
//         const allFakeStats = await SystemStat.find();
//         let yesterdayBotAmount = 0;

//         allFakeStats.forEach(stat => {
//             if (stat.date) {
//                 const statDateObj = new Date(stat.date);
//                 const statDateStr = isNaN(statDateObj.getTime()) ? String(stat.date).substring(0, 10) : getFormattedDate(statDateObj);
                
//                 if (statDateStr === yesterdayStr) {
//                     yesterdayBotAmount += (stat.todayFakeUsdtAmount || 0);
//                 }
//             }
//         });

//         // 4. Kal ka Total Investment = (Real + Fake)
//         const yesterdayTotalInvestment = yesterdayRealAmount + yesterdayBotAmount;

//         // 5. Withdrawal Logic: 20% se 30% ke beech random percentage nikalna
//         const randomPercent = Math.floor(Math.random() * (30 - 20 + 1)) + 20; // 20 se 30 ke beech ka number
//         const withdrawalAmount = (yesterdayTotalInvestment * randomPercent) / 100;

//         // 6. Format Telegram Message
//         const message = `
// 💸 *World Finance Withdrawal Report* 💸

// 📅 *Date:* ${todayStr}
// ✅ *Status:* All Withdrawals Processed Successfully!
// 💰 *Total Withdrawn Today:* $${withdrawalAmount.toFixed(2)}

// ⚡️ _Fast & Secure Transactions!_
//         `;

//         // 7. Send to Telegram
//         await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
//             chat_id: TELEGRAM_CHANNEL_ID,
//             text: message,
//             parse_mode: "Markdown"
//         });

//         console.log("✅ Telegram Bot: Daily Withdrawal sent successfully at 12:30 PM!");

//     } catch (error) {
//         console.error("❌ Telegram Withdrawal Bot Error:", error.message);
//     }
// }, {
//     scheduled: true,
//     timezone: "Asia/Kolkata" 
// });

// console.log("🚀 Telegram Withdrawal Report Cron initialized (Scheduled at 12:30 PM IST)");





















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
const TELEGRAM_CHANNEL_ID = "@worldtogether24"; 

// 🔥 YAHAN UPDATE KIYA HAI: Dono telegram bots sirf Instance '0' par chalenge taaki spam na ho
if (process.env.NODE_APP_INSTANCE === '0' || process.env.NODE_APP_INSTANCE === undefined) {

    // Abhi time 23:59 (00:01) set hai. 
    cron.schedule('43 0 * * *', async () => {
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
                status: { $regex: /^success$\vert{}^completed$/i } 
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

            // 3. Grand Totals (Base 200000 initial value add kiya hai)
            const totalGrandInvestment = 200000 + totalRealAmount + totalBotAmount; 
            
            // 'todayTotalInvestment' variable me actually kal ka amount hai
            const todayTotalInvestment = yesterdayRealAmount + yesterdayBotAmount;

            // 4. Format Telegram Message
            const message = `
📊 *World Together Daily Report* 📊

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

    console.log("🚀 Telegram Daily Report Cron initialized (Scheduled at 00:01 IST)");

    // ==========================================
    // 💸 TELEGRAM DAILY WITHDRAWAL BOT (12:30 PM)
    // ==========================================
//     cron.schedule('01 14 * * *', async () => {
//         console.log("⏳ Telegram Bot: Calculating Daily Withdrawal Summary...");
//         try {
//             const todayStr = getFormattedDate();
            
//             // 1. Kal (Yesterday) ki exact IST Date nikalna taaki kal ka total investment pata chale
//             const istTimeStr = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
//             const istDate = new Date(istTimeStr);
//             istDate.setDate(istDate.getDate() - 1); // 1 din piche
//             const yesterdayStr = istDate.getFullYear() + "-" +
//                    String(istDate.getMonth() + 1).padStart(2, '0') + "-" +
//                    String(istDate.getDate()).padStart(2, '0');

//             // 2. Calculate REAL Investments (for yesterday)
//             const realTxns = await Transaction.find({
//                 type: 'package_activation', 
//                 status: { $regex: /^success$\vert{}^completed$/i } 
//             });

//             let yesterdayRealAmount = 0;
//             realTxns.forEach(tx => {
//                 const amt = Number(tx.amount) || 0;
//                 const txDateStr = getFormattedDate(new Date(tx.createdAt || tx.date));
//                 if (txDateStr === yesterdayStr) {
//                     yesterdayRealAmount += amt;
//                 }
//             });

//             // 3. Calculate FAKE BOT Investments (for yesterday)
//             const allFakeStats = await SystemStat.find();
//             let yesterdayBotAmount = 0;

//             allFakeStats.forEach(stat => {
//                 if (stat.date) {
//                     const statDateObj = new Date(stat.date);
//                     const statDateStr = isNaN(statDateObj.getTime()) ? String(stat.date).substring(0, 10) : getFormattedDate(statDateObj);
                    
//                     if (statDateStr === yesterdayStr) {
//                         yesterdayBotAmount += (stat.todayFakeUsdtAmount || 0);
//                     }
//                 }
//             });

//             // 4. Kal ka Total Investment = (Real + Fake)
//             const yesterdayTotalInvestment = yesterdayRealAmount + yesterdayBotAmount;

//             // 5. Withdrawal Logic: 20% se 30% ke beech random percentage nikalna
//             // const randomPercent = Math.floor(Math.random() * (30 - 20 + 1)) + 20; // 20 se 30 ke beech ka number
//             // const withdrawalAmount = (yesterdayTotalInvestment * randomPercent) / 100;

//             const randomPercent = Math.floor(Math.random() * (45 - 35 + 1)) + 35; // 35 se 45 ke beech ka number
// const withdrawalAmount = (yesterdayTotalInvestment * randomPercent) / 100;
//             // 6. Format Telegram Message
//             const message = `
// 💸 *World Finance Withdrawal Report* 💸

// 📅 *Date:* ${todayStr}
// ✅ *Status:* All Withdrawals Processed Successfully!
// 💰 *Total Withdrawn Today:* $${withdrawalAmount.toFixed(2)}

// ⚡️ _Fast & Secure Transactions!_
//             `;

//             // 7. Send to Telegram
//             await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
//                 chat_id: TELEGRAM_CHANNEL_ID,
//                 text: message,
//                 parse_mode: "Markdown"
//             });

//             console.log("✅ Telegram Bot: Daily Withdrawal sent successfully at 12:30 PM!");

//         } catch (error) {
//             console.error("❌ Telegram Withdrawal Bot Error:", error.message);
//         }
//     }, {
//         scheduled: true,
//         timezone: "Asia/Kolkata" 
//     });

//     console.log("🚀 Telegram Withdrawal Report Cron initialized (Scheduled at 12:30 PM IST)");

} // 🔥 YAHAN UPDATE KIYA HAI: if condition yahan close ho rahi hai