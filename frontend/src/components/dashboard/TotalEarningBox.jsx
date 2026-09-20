// // import React, { useState, useEffect } from "react";
// // import api from "../../api/axios";

// // const TotalEarningBox = ({ user }) => {
// //   // Default fallback value agar API load na ho
// //   const [myTopupDisplay, setMyTopupDisplay] = useState(Number(user?.topUpAmount || 0).toFixed(2));

// //   // 1. My Earning Calculation
// //   const calculatedTotal = (
// //     (Number(user?.totalDirectIncome) || 0) +
// //     (Number(user?.totalLevelIncome) || 0) +
// //     (Number(user?.totalRoiIncome) || 0) +
// //     (Number(user?.totalRewardIncome) || 0) +
// //     (Number(user?.totalFastTrackIncome) || 0) +
// //     (Number(user?.poolIncome) || 0)
// //   );

// //   const finalEarning = user?.totalEarnings ? Number(user.totalEarnings) : calculatedTotal;
// //   const totalEarningDisplay = finalEarning.toFixed(2);

// //   // 🔥 HELPER: Decimal128 ko number me convert karne ke liye
// //   const getSafeAmount = (val) => {
// //     if (!val) return 0;
// //     if (val.$numberDecimal) return parseFloat(val.$numberDecimal);
// //     return parseFloat(val) || 0;
// //   };

// //   // 2. 🔥 API SE TOPUP FETCH AUR TOTAL KARNE KA LOGIC 🔥
// //   useEffect(() => {
// //     const fetchTotalTopup = async () => {
// //       if (!user?.userId) return;

// //       try {
// //         const res = await api.get(`/wallet/topup-history/${user.userId}?t=${new Date().getTime()}`);
        
// //         if (Array.isArray(res.data)) {
// //           const userTopups = res.data.filter((t) => {
// //             const typeStr = (t.type || "").toLowerCase();
// //             const sourceStr = (t.source || "").toLowerCase();
// //             const descStr = (t.description || "").toUpperCase();
            
// //             const isTopupRelated = 
// //               typeStr.includes("topup") || 
// //               sourceStr.includes("topup") || 
// //               typeStr.includes("activation") || 
// //               typeStr.includes("package");
              
// //             const isNotPromo = !descStr.includes("PROMOTION");
            
// //             return isTopupRelated && isNotPromo;
// //           });

// //           const uniqueTopups = Array.from(
// //             new Map(userTopups.map((t) => [`${t._id}-${t.createdAt}`, t])).values()
// //           );

// //           let calculatedTotalAmount = 0;
// //           const currentUserId = String(user.userId);

// //           uniqueTopups.forEach((t) => {
// //             let receiverId = t.toUserId ? String(t.toUserId) : String(t.userId);
// //             const isDebitTransaction = (t.type || "").toLowerCase().includes("debit") || Number(getSafeAmount(t.amount)) < 0;

// //             if (isDebitTransaction && !t.toUserId) {
// //               const descMatch = t.description?.match(/(?:for|user|to|#|-)\s*([0-9]{4,10})/i);
// //               if (descMatch && descMatch[1]) {
// //                 receiverId = descMatch[1];
// //               } else {
// //                 receiverId = "Team Member";
// //               }
// //             }

// //             if (receiverId === currentUserId) {
// //               const finalAmount = Math.abs(getSafeAmount(t.amount || t.grossAmount));
// //               calculatedTotalAmount += finalAmount;
// //             }
// //           });

// //           if (calculatedTotalAmount > 0) {
// //             setMyTopupDisplay(calculatedTotalAmount.toFixed(2));
// //           }
// //         }
// //       } catch (err) {
// //         console.error("Topup fetch error in TotalEarningBox:", err);
// //       }
// //     };

// //     fetchTotalTopup();
// //   }, [user?.userId]);

// //   return (
// //     // 🔥 YAHAN UI UPDATE KIYA HAI: grid-cols-2 aur gap-3 lagaya hai upar wale box ke hisaab se
// //     <div className="grid grid-cols-2 gap-3 mb-6">
      
// //       {/* 🌑 DARK CARD 1: MY EARNING */}
// //       <div className="bg-[#1c2233] p-4 rounded-xl border border-slate-700 shadow-lg flex flex-col justify-center min-h-[85px] transition-transform hover:scale-[1.01]">
// //         <h3 className="text-slate-400 font-bold text-[10px] sm:text-xs uppercase tracking-wide">
// //           My Earning
// //         </h3>
// //         <p className="text-lg sm:text-2xl font-bold text-white mt-1">
// //           ${totalEarningDisplay}
// //         </p>
// //       </div>

// //       {/* 🌑 DARK CARD 2: MY TOPUP */}
// //       <div className="bg-[#1c2233] p-4 rounded-xl border border-slate-700 shadow-lg flex flex-col justify-center min-h-[85px] transition-transform hover:scale-[1.01]">
// //         <h3 className="text-slate-400 font-bold text-[10px] sm:text-xs uppercase tracking-wide">
// //           My Topup
// //         </h3>
// //         <p className="text-lg sm:text-2xl font-bold text-white mt-1">
// //           ${myTopupDisplay}
// //         </p>
// //       </div>

// //     </div>
// //   );
// // };

// // export default TotalEarningBox;

// import React, { useState, useEffect } from "react";
// import api from "../../api/axios";

// const TotalEarningBox = ({ user }) => {
//   // Default fallback value agar API load na ho
//   const [myTopupDisplay, setMyTopupDisplay] = useState(Number(user?.topUpAmount || 0).toFixed(2));

//   // 1. My Earning Calculation
//   const calculatedTotal = (
//     (Number(user?.totalDirectIncome) || 0) +
//     (Number(user?.totalLevelIncome) || 0) +
//     (Number(user?.totalRoiIncome) || 0) +
//     (Number(user?.totalRewardIncome) || 0) +
//     (Number(user?.totalFastTrackIncome) || 0) +
//     (Number(user?.poolIncome) || 0)
//   );

//   const finalEarning = user?.totalEarnings ? Number(user.totalEarnings) : calculatedTotal;
//   const totalEarningDisplay = finalEarning.toFixed(2);

//   // 🔥 HELPER: Decimal128 ko number me convert karne ke liye
//   const getSafeAmount = (val) => {
//     if (!val) return 0;
//     if (val.$numberDecimal) return parseFloat(val.$numberDecimal);
//     return parseFloat(val) || 0;
//   };

//   // 2. 🔥 API SE TOPUP FETCH AUR TOTAL KARNE KA LOGIC 🔥
//   useEffect(() => {
//     const fetchTotalTopup = async () => {
//       if (!user?.userId) return;

//       try {
//         const res = await api.get(`/wallet/topup-history/${user.userId}?t=${new Date().getTime()}`);
        
//         if (Array.isArray(res.data)) {
//           const userTopups = res.data.filter((t) => {
//             const typeStr = (t.type || "").toLowerCase();
//             const sourceStr = (t.source || "").toLowerCase();
//             const descStr = (t.description || "").toUpperCase();
            
//             const isTopupRelated = 
//               typeStr.includes("topup") || 
//               sourceStr.includes("topup") || 
//               typeStr.includes("activation") || 
//               typeStr.includes("package");
              
//             const isNotPromo = !descStr.includes("PROMOTION");
            
//             return isTopupRelated && isNotPromo;
//           });

//           const uniqueTopups = Array.from(
//             new Map(userTopups.map((t) => [`${t._id}-${t.createdAt}`, t])).values()
//           );

//           let calculatedTotalAmount = 0;
//           const currentUserId = String(user.userId);

//           uniqueTopups.forEach((t) => {
//             let receiverId = t.toUserId ? String(t.toUserId) : String(t.userId);
//             const isDebitTransaction = (t.type || "").toLowerCase().includes("debit") || Number(getSafeAmount(t.amount)) < 0;

//             if (isDebitTransaction && !t.toUserId) {
//               const descMatch = t.description?.match(/(?:for|user|to|#|-)\s*([0-9]{4,10})/i);
//               if (descMatch && descMatch[1]) {
//                 receiverId = descMatch[1];
//               } else {
//                 receiverId = "Team Member";
//               }
//             }

//             if (receiverId === currentUserId) {
//               const finalAmount = Math.abs(getSafeAmount(t.amount || t.grossAmount));
//               calculatedTotalAmount += finalAmount;
//             }
//           });

//           if (calculatedTotalAmount > 0) {
//             setMyTopupDisplay(calculatedTotalAmount.toFixed(2));
//           }
//         }
//       } catch (err) {
//         console.error("Topup fetch error in TotalEarningBox:", err);
//       }
//     };

//     fetchTotalTopup();
//   }, [user?.userId]);

//   return (
//     <div className="grid grid-cols-2 gap-3 mb-6">
      
//       {/* 🌑 DARK CARD 1: MY EARNING (Ab Background Dark Ho Gaya Hai) */}
//       <div className="bg-[#1c2233] p-4 rounded-xl border border-slate-700 shadow-lg flex flex-col justify-center min-h-[95px] transition-transform hover:scale-[1.02]">
//         {/* Iski heading ko Green hi rakha hai taaki pehchan aasan ho */}
//         <h3 className="text-emerald-400 font-extrabold text-[11px] sm:text-sm uppercase tracking-wider">
//           My Earning
//         </h3>
//         <p className="text-2xl sm:text-3xl font-black text-white mt-1 drop-shadow-md">
//           ${totalEarningDisplay}
//         </p>
//       </div>

//       {/* 🌑 DARK CARD 2: MY TOPUP (Ab Background Dark Ho Gaya Hai) */}
//       <div className="bg-[#1c2233] p-4 rounded-xl border border-slate-700 shadow-lg flex flex-col justify-center min-h-[95px] transition-transform hover:scale-[1.02]">
//         {/* Iski heading ko Yellow rakha hai taaki My Earning se alag dikhe */}
//         <h3 className="text-yellow-500 font-extrabold text-[11px] sm:text-sm uppercase tracking-wider">
//           My Topup
//         </h3>
//         <p className="text-2xl sm:text-3xl font-black text-white mt-1 drop-shadow-md">
//           ${myTopupDisplay}
//         </p>
//       </div>

//     </div>
//   );
// };

// export default TotalEarningBox;


import React, { useState, useEffect } from "react";
import api from "../../api/axios";

const TotalEarningBox = ({ user }) => {
  // Default fallback value agar API load na ho
  const [myTopupDisplay, setMyTopupDisplay] = useState(Number(user?.topUpAmount || 0).toFixed(2));

  // 1. My Earning Calculation
  const calculatedTotal = (
    (Number(user?.totalDirectIncome) || 0) +
    (Number(user?.totalLevelIncome) || 0) +
    (Number(user?.totalRoiIncome) || 0) +
    (Number(user?.totalRewardIncome) || 0) +
    (Number(user?.totalFastTrackIncome) || 0) +
    (Number(user?.poolIncome) || 0)
  );

  const finalEarning = user?.totalEarnings ? Number(user.totalEarnings) : calculatedTotal;
  const totalEarningDisplay = finalEarning.toFixed(2);

  // 🔥 HELPER: Decimal128 ko number me convert karne ke liye
  const getSafeAmount = (val) => {
    if (!val) return 0;
    if (val.$numberDecimal) return parseFloat(val.$numberDecimal);
    return parseFloat(val) || 0;
  };

  // 2. 🔥 API SE TOPUP FETCH AUR TOTAL KARNE KA LOGIC 🔥
  useEffect(() => {
    const fetchTotalTopup = async () => {
      if (!user?.userId) return;

      try {
        const res = await api.get(`/wallet/topup-history/${user.userId}?t=${new Date().getTime()}`);
        
        if (Array.isArray(res.data)) {
          const userTopups = res.data.filter((t) => {
            const typeStr = (t.type || "").toLowerCase();
            const sourceStr = (t.source || "").toLowerCase();
            const descStr = (t.description || "").toUpperCase();
            
            const isTopupRelated = 
              typeStr.includes("topup") || 
              sourceStr.includes("topup") || 
              typeStr.includes("activation") || 
              typeStr.includes("package");
              
            const isNotPromo = !descStr.includes("PROMOTION");
            
            return isTopupRelated && isNotPromo;
          });

          const uniqueTopups = Array.from(
            new Map(userTopups.map((t) => [`${t._id}-${t.createdAt}`, t])).values()
          );

          let calculatedTotalAmount = 0;
          const currentUserId = String(user.userId);

          uniqueTopups.forEach((t) => {
            let receiverId = t.toUserId ? String(t.toUserId) : String(t.userId);
            const isDebitTransaction = (t.type || "").toLowerCase().includes("debit") || Number(getSafeAmount(t.amount)) < 0;

            if (isDebitTransaction && !t.toUserId) {
              const descMatch = t.description?.match(/(?:for|user|to|#|-)\s*([0-9]{4,10})/i);
              if (descMatch && descMatch[1]) {
                receiverId = descMatch[1];
              } else {
                receiverId = "Team Member";
              }
            }

            if (receiverId === currentUserId) {
              // ========================================================
              // 🔥 NAYA LOGIC: 25 Days Cycle Check (Expired Topup Minus)
              // ========================================================
              const txDate = new Date(t.createdAt || t.date);
              const today = new Date();
              
              // Milliseconds ko Days me convert karna
              const diffTime = today.getTime() - txDate.getTime();
              const diffDays = diffTime / (1000 * 3600 * 24); 

              // Agar topup 25 din se kam purana hai, tabhi usko Active (My Topup) me add karo
              if (diffDays <= 25) {
                const finalAmount = Math.abs(getSafeAmount(t.amount || t.grossAmount));
                calculatedTotalAmount += finalAmount;
              }
            }
          });

          setMyTopupDisplay(calculatedTotalAmount.toFixed(2));
        }
      } catch (err) {
        console.error("Topup fetch error in TotalEarningBox:", err);
      }
    };

    fetchTotalTopup();
  }, [user?.userId]);

  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      
      {/* 🌑 DARK CARD 1: MY EARNING */}
      <div className="bg-[#1c2233] p-4 rounded-xl border border-slate-700 shadow-lg flex flex-col justify-center min-h-[95px] transition-transform hover:scale-[1.02]">
        <h3 className="text-emerald-400 font-extrabold text-[11px] sm:text-sm uppercase tracking-wider">
          My Earning
        </h3>
        <p className="text-2xl sm:text-3xl font-black text-white mt-1 drop-shadow-md">
          ${totalEarningDisplay}
        </p>
      </div>

      {/* 🌑 DARK CARD 2: MY TOPUP */}
      <div className="bg-[#1c2233] p-4 rounded-xl border border-slate-700 shadow-lg flex flex-col justify-center min-h-[95px] transition-transform hover:scale-[1.02]">
        <h3 className="text-yellow-500 font-extrabold text-[11px] sm:text-sm uppercase tracking-wider">
          My Topup
        </h3>
        <p className="text-2xl sm:text-3xl font-black text-white mt-1 drop-shadow-md">
          ${myTopupDisplay}
        </p>
      </div>

    </div>
  );
};

export default TotalEarningBox;