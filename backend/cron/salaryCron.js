// const cron = require('node-cron');
// const User = require('../models/User');
// const Transaction = require('../models/Transaction');

// // Har mahine ki 1 tareekh ko Midnight (00:00) pe chalega
// // cron.schedule('0 0 1 * *', async () => {
//   cron.schedule('21 0 1 * *', async () => {  
//     console.log("🔥 Running Monthly Salary Distribution Engine...");
    
//     try {
//         // Un users ko dhundo jo qualified hain aur jinki salary 6 mahine se kam aayi hai
//         const qualifiedUsers = await User.find({ 
//             isSalaryQualified: true, 
//             salaryMonthsPaid: { $lt: 6 } 
//         });

//         console.log(`Found ${qualifiedUsers.length} users qualified for Monthly Salary.`);

//         for (const user of qualifiedUsers) {
//             const salaryAmount = 100;

//             // User ke wallet me aur salary record me balance add karo
//             user.walletBalance += salaryAmount;
//             user.salaryTotalIncome += salaryAmount;
//             user.salaryMonthsPaid += 1;
            
//             // Unki Earning Total mein bhi add kardo (rewardIncome karke)
//             user.rewardIncome = (user.rewardIncome || 0) + salaryAmount;
//             user.totalRewardIncome = (user.totalRewardIncome || 0) + salaryAmount;

//             await user.save();

//             // Transaction log create karo
//             await Transaction.create({
//                 userId: user.userId,
//                 type: 'monthly_salary',
//                 source: 'reward',
//                 amount: salaryAmount,
//                 description: `Monthly Salary Reward (Month ${user.salaryMonthsPaid} of 6)`,
//                 status: 'success',
//                 date: new Date()
//             });

//             console.log(`✅ Paid $100 salary to ${user.userId}`);
//         }

//         console.log("🎉 Monthly Salary Distribution Completed!");
//     } catch (error) {
//         console.error("❌ Monthly Salary Cron Error:", error);
//     }
// }, {
//     scheduled: true,
//     timezone: "Asia/Kolkata" // India time ke hisaab se 1st tarik
// });

const cron = require('node-cron');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// 🔥 YAHAN UPDATE KIYA HAI: Sirf Instance '0' (Primary Core) par hi yeh cron chalega
if (process.env.NODE_APP_INSTANCE === '0' || process.env.NODE_APP_INSTANCE === undefined) {

  // Har mahine ki 1 tareekh ko Midnight (00:00) pe chalega
  cron.schedule('21 0 1 * *', async () => {  
      console.log("🔥 Running Monthly Salary Distribution Engine...");
      
      try {
          // Un users ko dhundo jo qualified hain aur jinki salary 6 mahine se kam aayi hai
          const qualifiedUsers = await User.find({ 
              isSalaryQualified: true, 
              salaryMonthsPaid: { $lt: 6 } 
          });

          console.log(`Found ${qualifiedUsers.length} users qualified for Monthly Salary.`);

          for (const user of qualifiedUsers) {
              const salaryAmount = 100;

              // User ke wallet me aur salary record me balance add karo
              user.walletBalance += salaryAmount;
              user.salaryTotalIncome += salaryAmount;
              user.salaryMonthsPaid += 1;
              
              // Unki Earning Total mein bhi add kardo (rewardIncome karke)
              user.rewardIncome = (user.rewardIncome || 0) + salaryAmount;
              user.totalRewardIncome = (user.totalRewardIncome || 0) + salaryAmount;

              await user.save();

              // Transaction log create karo
              await Transaction.create({
                  userId: user.userId,
                  type: 'monthly_salary',
                  source: 'reward',
                  amount: salaryAmount,
                  description: `Monthly Salary Reward (Month ${user.salaryMonthsPaid} of 6)`,
                  status: 'success',
                  date: new Date()
              });

              console.log(`✅ Paid $100 salary to ${user.userId}`);
          }

          console.log("🎉 Monthly Salary Distribution Completed!");
      } catch (error) {
          console.error("❌ Monthly Salary Cron Error:", error);
      }
  }, {
      scheduled: true,
      timezone: "Asia/Kolkata" // India time ke hisaab se 1st tarik
  });

} // 🔥 YAHAN UPDATE KIYA HAI: if condition yahan close ho rahi hai