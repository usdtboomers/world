// // // const cron = require('node-cron');
// // // const User = require('../models/User');
// // // const Transaction = require('../models/Transaction');

// // // // Har mahine ki 1 tareekh ko Midnight (00:00) pe chalega
// // // // cron.schedule('0 0 1 * *', async () => {
// // //   cron.schedule('21 0 1 * *', async () => {  
// // //     console.log("🔥 Running Monthly Salary Distribution Engine...");
    
// // //     try {
// // //         // Un users ko dhundo jo qualified hain aur jinki salary 6 mahine se kam aayi hai
// // //         const qualifiedUsers = await User.find({ 
// // //             isSalaryQualified: true, 
// // //             salaryMonthsPaid: { $lt: 6 } 
// // //         });

// // //         console.log(`Found ${qualifiedUsers.length} users qualified for Monthly Salary.`);

// // //         for (const user of qualifiedUsers) {
// // //             const salaryAmount = 100;

// // //             // User ke wallet me aur salary record me balance add karo
// // //             user.walletBalance += salaryAmount;
// // //             user.salaryTotalIncome += salaryAmount;
// // //             user.salaryMonthsPaid += 1;
            
// // //             // Unki Earning Total mein bhi add kardo (rewardIncome karke)
// // //             user.rewardIncome = (user.rewardIncome || 0) + salaryAmount;
// // //             user.totalRewardIncome = (user.totalRewardIncome || 0) + salaryAmount;

// // //             await user.save();

// // //             // Transaction log create karo
// // //             await Transaction.create({
// // //                 userId: user.userId,
// // //                 type: 'monthly_salary',
// // //                 source: 'reward',
// // //                 amount: salaryAmount,
// // //                 description: `Monthly Salary Reward (Month ${user.salaryMonthsPaid} of 6)`,
// // //                 status: 'success',
// // //                 date: new Date()
// // //             });

// // //             console.log(`✅ Paid $100 salary to ${user.userId}`);
// // //         }

// // //         console.log("🎉 Monthly Salary Distribution Completed!");
// // //     } catch (error) {
// // //         console.error("❌ Monthly Salary Cron Error:", error);
// // //     }
// // // }, {
// // //     scheduled: true,
// // //     timezone: "Asia/Kolkata" // India time ke hisaab se 1st tarik
// // // });




// // const cron = require('node-cron');
// // const User = require('../models/User');
// // const Transaction = require('../models/Transaction');

// // // 🔥 YAHAN UPDATE KIYA HAI: Sirf Instance '0' (Primary Core) par hi yeh cron chalega
// // if (process.env.NODE_APP_INSTANCE === '0' || process.env.NODE_APP_INSTANCE === undefined) {

// //   // Har mahine ki 1 tareekh ko Midnight (00:00) pe chalega
// //   cron.schedule('21 0 1 * *', async () => {  
// //       console.log("🔥 Running Monthly Salary Distribution Engine...");
      
// //       try {
// //           // Un users ko dhundo jo qualified hain aur jinki salary 6 mahine se kam aayi hai
// //           const qualifiedUsers = await User.find({ 
// //               isSalaryQualified: true, 
// //               salaryMonthsPaid: { $lt: 6 } 
// //           });

// //           console.log(`Found ${qualifiedUsers.length} users qualified for Monthly Salary.`);

// //           for (const user of qualifiedUsers) {
// //               const salaryAmount = 100;

// //               // User ke wallet me aur salary record me balance add karo
// //               user.walletBalance += salaryAmount;
// //               user.salaryTotalIncome += salaryAmount;
// //               user.salaryMonthsPaid += 1;
              
// //               // Unki Earning Total mein bhi add kardo (rewardIncome karke)
// //               user.rewardIncome = (user.rewardIncome || 0) + salaryAmount;
// //               user.totalRewardIncome = (user.totalRewardIncome || 0) + salaryAmount;

// //               await user.save();

// //               // Transaction log create karo
// //               await Transaction.create({
// //                   userId: user.userId,
// //                   type: 'monthly_salary',
// //                   source: 'reward',
// //                   amount: salaryAmount,
// //                   description: `Monthly Salary Reward (Month ${user.salaryMonthsPaid} of 6)`,
// //                   status: 'success',
// //                   date: new Date()
// //               });

// //               console.log(`✅ Paid $100 salary to ${user.userId}`);
// //           }

// //           console.log("🎉 Monthly Salary Distribution Completed!");
// //       } catch (error) {
// //           console.error("❌ Monthly Salary Cron Error:", error);
// //       }
// //   }, {
// //       scheduled: true,
// //       timezone: "Asia/Kolkata" // India time ke hisaab se 1st tarik
// //   });

// // } // 🔥 YAHAN UPDATE KIYA HAI: if condition yahan close ho rahi hai






// const cron = require('node-cron');
// const User = require('../models/User');
// const Transaction = require('../models/Transaction');

// // Sirf Instance '0' (Primary Core) par hi yeh cron chalega
// if (process.env.NODE_APP_INSTANCE === '0' || process.env.NODE_APP_INSTANCE === undefined) {

//   // Har mahine ki 1 tareekh ko Midnight (00:00) pe chalega
//   cron.schedule('05 0 1 * *', async () => {  
//       console.log("🔥 Running Monthly Salary Distribution Engine (Pending Mode)...");
      
//       try {
//           // Un users ko dhundo jo qualified hain aur jinki salary 6 mahine se kam aayi hai
//           const qualifiedUsers = await User.find({ 
//               isSalaryQualified: true, 
//               salaryMonthsPaid: { $lt: 6 } 
//           });

//           console.log(`Found ${qualifiedUsers.length} users qualified for Monthly Salary.`);

//           for (const user of qualifiedUsers) {
//               const salaryAmount = 100;

//               // 🔴 UPDATE 1: Wallet me add mat karo, 'unclaimedSalary' me daalo
//               user.unclaimedSalary = (user.unclaimedSalary || 0) + salaryAmount;
              
//               // Baaki counting aur records same rahenge
//               user.salaryTotalIncome += salaryAmount;
//               user.salaryMonthsPaid += 1;
//               user.rewardIncome = (user.rewardIncome || 0) + salaryAmount;
//               user.totalRewardIncome = (user.totalRewardIncome || 0) + salaryAmount;

//               await user.save();

//               // 🔴 UPDATE 2: Transaction status 'pending' aur type change kar diya
//               await Transaction.create({
//                   userId: user.userId,
//                   type: 'monthly_salary_generated', 
//                   source: 'reward',
//                   amount: salaryAmount,
//                   description: `Monthly Salary Generated (Month ${user.salaryMonthsPaid} of 6) - Waiting for Claim`,
//                   status: 'pending', 
//                   date: new Date()
//               });

//               console.log(`✅ Generated $100 salary for ${user.userId} (Pending Claim)`);
//           }

//           console.log("🎉 Monthly Salary Distribution Completed!");
//       } catch (error) {
//           console.error("❌ Monthly Salary Cron Error:", error);
//       }
//   }, {
//       scheduled: true,
//       timezone: "Asia/Kolkata" 
//   });
// }




const cron = require('node-cron');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// Sirf Instance '0' (Primary Core) par hi yeh cron chalega
if (process.env.NODE_APP_INSTANCE === '0' || process.env.NODE_APP_INSTANCE === undefined) {

  // 🔴 UPDATE 1: Ab yeh cron HAR ROZ (Daily) Raat 12:05 AM pe chalega
  cron.schedule('05 0 * * *', async () => {  
      console.log("🔥 Running DAILY Monthly Salary Distribution Engine...");
      
      try {
          // Un users ko dhundo jo qualified hain aur jinki salary 6 mahine se kam aayi hai
          const qualifiedUsers = await User.find({ 
              isSalaryQualified: true, 
              salaryMonthsPaid: { $lt: 6 } 
          });

          console.log(`Found ${qualifiedUsers.length} users qualified for Salary Check.`);

          for (const user of qualifiedUsers) {
              let shouldGiveSalary = false;

              // 🔴 UPDATE 2: Logic check for Instant 1st Salary vs Next Month Salary
              if (user.salaryMonthsPaid === 0) {
                  // Case 1: Naya Achiever (Pehli salary ekdum instant / agle din mil jayegi)
                  shouldGiveSalary = true;
              } else {
                  // Case 2: Purana Achiever (Check karenge ki aakhri salary kab mili thi)
                  const lastSalaryTxn = await Transaction.findOne({
                      userId: user.userId,
                      type: 'monthly_salary_generated'
                  }).sort({ date: -1 });

                  if (lastSalaryTxn) {
                      const lastDate = new Date(lastSalaryTxn.date);
                      
                      // Usme theek 1 mahina (1 Month) add kar do
                      const nextEligibleDate = new Date(lastDate);
                      nextEligibleDate.setMonth(nextEligibleDate.getMonth() + 1);

                      // Aaj ki date lo (Time ko zero kar do taaki exact date match ho)
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      nextEligibleDate.setHours(0, 0, 0, 0);

                      // Agar aaj ki date us '1 mahine wali date' ke barabar ya usse aage hai
                      if (today.getTime() >= nextEligibleDate.getTime()) {
                          shouldGiveSalary = true;
                      }
                  } else {
                      // Failsafe: Agar galti se transaction delete ho gaya toh de do
                      shouldGiveSalary = true; 
                  }
              }

              // Agar user eligible hai (Instant ya 1 Mahine ka gap poora ho gaya hai)
              if (shouldGiveSalary) {
                  const salaryAmount = 100;

                  user.unclaimedSalary = (user.unclaimedSalary || 0) + salaryAmount;
                  user.salaryTotalIncome += salaryAmount;
                  user.salaryMonthsPaid += 1;
                  user.rewardIncome = (user.rewardIncome || 0) + salaryAmount;
                  user.totalRewardIncome = (user.totalRewardIncome || 0) + salaryAmount;

                  await user.save();

                  // Pending Transaction Record Banega
                  await Transaction.create({
                      userId: user.userId,
                      type: 'monthly_salary_generated', 
                      source: 'reward',
                      amount: salaryAmount,
                      description: `Monthly Salary Generated (Month ${user.salaryMonthsPaid} of 6) - Waiting for Claim`,
                      status: 'pending', 
                      date: new Date()
                  });

                  console.log(`✅ Generated $100 salary for ${user.userId} (Month ${user.salaryMonthsPaid})`);
              }
          }

          console.log("🎉 Daily Salary Distribution Engine Completed!");
      } catch (error) {
          console.error("❌ Daily Salary Cron Error:", error);
      }
  }, {
      scheduled: true,
      timezone: "Asia/Kolkata" 
  });
}