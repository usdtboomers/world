// // // const cron = require('node-cron');
// // // const User = require('../models/User');
// // // const { sweepFunds } = require('../controllers/depositController');

// // // const startSweeper = () => {
// // //     // Har 2 minute me chalega
// // //     cron.schedule('*/5 * * * *', async () => {
// // //         console.log("🔍 Running automated deposit check...");
        
// // //         try {
// // //             const usersWithWallets = await User.find({ 
// // //                 depositAddress: { $exists: true, $ne: null } 
// // //             });

// // //             console.log(`Total Wallets to check: ${usersWithWallets.length}`);

// // //             // 🚀 BATCH PROCESSING: Ek sath 20 users check karenge taaki speed 20x ho jaye
// // //             const batchSize = 20; 
            
// // //             for (let i = 0; i < usersWithWallets.length; i += batchSize) {
// // //                 const batch = usersWithWallets.slice(i, i + batchSize);
                
// // //                 await Promise.all(batch.map(async (user) => {
// // //                     try {
// // //                         await sweepFunds(user._id);
// // //                     } catch (err) {
// // //                         // Silent catch taaki ek fail ho toh baki na ruke
// // //                     }
// // //                 }));
                
// // //                 // ⏱️ Delay of 500ms between batches to keep RPC safe
// // //                 await new Promise(resolve => setTimeout(resolve, 500));
// // //             }
            
// // //             console.log("✅ Automated check complete.");
// // //         } catch (error) {
// // //             console.error("❌ Error during automated sweep:", error);
// // //         }
// // //     });
// // // };

// // // module.exports = startSweeper;


// // const cron = require('node-cron');
// // const User = require('../models/User');
// // const { sweepFunds } = require('../controllers/depositController');

// // const startSweeper = () => {
// //     // 🔥 AB YE HAR 5 MINUTE NAHI, HAR 12 GHANTE MEIN CHALEGA (Backup Check)
// //     cron.schedule('0 */12 * * *', async () => {
// //         console.log("🔍 Running Backup Automated Deposit Check (Every 12 Hours)...");
        
// //         try {
// //             const usersWithWallets = await User.find({ 
// //                 depositAddress: { $exists: true, $ne: null } 
// //             });

// //             console.log(`Total Wallets to check in background: ${usersWithWallets.length}`);

// //             // BATCH PROCESSING: 20 users ek sath
// //             const batchSize = 20; 
            
// //             for (let i = 0; i < usersWithWallets.length; i += batchSize) {
// //                 const batch = usersWithWallets.slice(i, i + batchSize);
                
// //                 await Promise.all(batch.map(async (user) => {
// //                     try {
// //                         await sweepFunds(user._id);
// //                     } catch (err) {
// //                         // Silent catch taaki ek fail ho toh baki na ruke
// //                     }
// //                 }));
                
// //                 // ⏱️ Delay increased to 1500ms (1.5 sec) taaki Free RPC block na karein
// //                 await new Promise(resolve => setTimeout(resolve, 1500));
// //             }
            
// //             console.log("✅ Backup Automated check complete.");
// //         } catch (error) {
// //             console.error("❌ Error during backup automated sweep:", error);
// //         }
// //     });
// // };

// // module.exports = startSweeper;


// const cron = require('node-cron');
// const User = require('../models/User');
// const { sweepFunds } = require('../controllers/depositController');

// const startSweeper = () => {
//     // 🔥 AB YE STRICTLY HAR 30 MINUTE MEIN CHALEGA
//     cron.schedule('*/30 * * * *', async () => {
//         console.log("🔍 Running Automated Deposit Check (Every 30 Minutes)...");
        
//         try {
//             const usersWithWallets = await User.find({ 
//                 depositAddress: { $exists: true, $ne: null } 
//             });

//             console.log(`Total Wallets to check in background: ${usersWithWallets.length}`);

//             // BATCH PROCESSING: 20 users ek sath
//             const batchSize = 20; 
            
//             for (let i = 0; i < usersWithWallets.length; i += batchSize) {
//                 const batch = usersWithWallets.slice(i, i + batchSize);
                
//                 await Promise.all(batch.map(async (user) => {
//                     try {
//                         // 🔥 FIX: user._id ki jagah user.userId bheja ja raha hai taaki "walletBalance" update wala controller sahi id catch kare
//                         if(user.userId) {
//                             await sweepFunds(user.userId);
//                         }
//                     } catch (err) {
//                         // Silent catch taaki ek fail ho toh baki na ruke
//                     }
//                 }));
                
//                 // ⏱️ Delay 1500ms (1.5 sec) taaki Free RPC limit hit na ho
//                 await new Promise(resolve => setTimeout(resolve, 1500));
//             }
            
//             console.log("✅ 30-Minute Automated check complete.");
//         } catch (error) {
//             console.error("❌ Error during 30-min automated sweep:", error);
//         }
//     });
// };

// module.exports = startSweeper;


















const cron = require('node-cron');
const User = require('../models/User');
const { sweepFunds } = require('../controllers/depositController');

const startSweeper = () => {
    // 🔥 YAHAN UPDATE KIYA HAI: Sirf Instance '0' (Primary Core) par hi sweeper chalega
    if (process.env.NODE_APP_INSTANCE === '0' || process.env.NODE_APP_INSTANCE === undefined) {

        // 🔥 AB YE STRICTLY HAR 30 MINUTE MEIN CHALEGA
        cron.schedule('*/30 * * * *', async () => {
            console.log("🔍 Running Automated Deposit Check (Every 30 Minutes)...");
            
            try {
                const usersWithWallets = await User.find({ 
                    depositAddress: { $exists: true,$ne: null } 
                });

                console.log(`Total Wallets to check in background: ${usersWithWallets.length}`);

                // BATCH PROCESSING: 20 users ek sath
                const batchSize = 20; 
                
                for (let i = 0; i < usersWithWallets.length; i += batchSize) {
                    const batch = usersWithWallets.slice(i, i + batchSize);
                    
                    await Promise.all(batch.map(async (user) => {
                        try {
                            // 🔥 FIX: user._id ki jagah user.userId bheja ja raha hai taaki "walletBalance" update wala controller sahi id catch kare
                            if(user.userId) {
                                await sweepFunds(user.userId);
                            }
                        } catch (err) {
                            // Silent catch taaki ek fail ho toh baki na ruke
                        }
                    }));
                    
                    // ⏱️ Delay 1500ms (1.5 sec) taaki Free RPC limit hit na ho
                    await new Promise(resolve => setTimeout(resolve, 1500));
                }
                
                console.log("✅ 30-Minute Automated check complete.");
            } catch (error) {
                console.error("❌ Error during 30-min automated sweep:", error);
            }
        });

    } // 🔥 YAHAN UPDATE KIYA HAI: if condition yahan close ho rahi hai
};

module.exports = startSweeper;