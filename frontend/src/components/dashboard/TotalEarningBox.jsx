 

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
// //               // ========================================================
// //               // 🔥 NAYA LOGIC: 25 Days Cycle Check (Expired Topup Minus)
// //               // ========================================================
// //               const txDate = new Date(t.createdAt || t.date);
// //               const today = new Date();
              
// //               // Milliseconds ko Days me convert karna
// //               const diffTime = today.getTime() - txDate.getTime();
// //               const diffDays = diffTime / (1000 * 3600 * 24); 

// //               // Agar topup 25 din se kam purana hai, tabhi usko Active (My Topup) me add karo
// //               if (diffDays <= 25) {
// //                 const finalAmount = Math.abs(getSafeAmount(t.amount || t.grossAmount));
// //                 calculatedTotalAmount += finalAmount;
// //               }
// //             }
// //           });

// //           setMyTopupDisplay(calculatedTotalAmount.toFixed(2));
// //         }
// //       } catch (err) {
// //         console.error("Topup fetch error in TotalEarningBox:", err);
// //       }
// //     };

// //     fetchTotalTopup();
// //   }, [user?.userId]);

// //   return (
// //     <div className="grid grid-cols-2 gap-3 mb-6">
      
// //       {/* 🌑 DARK CARD 1: MY EARNING */}
// //       <div className="bg-[#1c2233] p-4 rounded-xl border border-slate-700 shadow-lg flex flex-col justify-center min-h-[95px] transition-transform hover:scale-[1.02]">
// //         <h3 className="text-emerald-400 font-extrabold text-[11px] sm:text-sm uppercase tracking-wider">
// //           My Earning
// //         </h3>
// //         <p className="text-2xl sm:text-3xl font-black text-white mt-1 drop-shadow-md">
// //           ${totalEarningDisplay}
// //         </p>
// //       </div>

// //       {/* 🌑 DARK CARD 2: MY TOPUP */}
// //       <div className="bg-[#1c2233] p-4 rounded-xl border border-slate-700 shadow-lg flex flex-col justify-center min-h-[95px] transition-transform hover:scale-[1.02]">
// //         <h3 className="text-yellow-500 font-extrabold text-[11px] sm:text-sm uppercase tracking-wider">
// //           My Topup
// //         </h3>
// //         <p className="text-2xl sm:text-3xl font-black text-white mt-1 drop-shadow-md">
// //           ${myTopupDisplay}
// //         </p>
// //       </div>

// //     </div>
// //   );
// // };

// // export default TotalEarningBox;


















// import React, { useState, useEffect } from "react";
// import api from "../../api/axios";
// import { X } from "lucide-react"; // Modal close icon ke liye

// const TotalEarningBox = ({ user }) => {
//   // Default fallback value agar API load na ho
//   const [myTopupDisplay, setMyTopupDisplay] = useState(Number(user?.topUpAmount || 0).toFixed(2));

//   // 🔥 PROMO ROLE LOGIC & STATES
//   const isPromo = user?.role === 'promo';
  
//   // Local storage se promo values uthayenge agar set hain toh
//   const [promoEarning, setPromoEarning] = useState(() => localStorage.getItem(`promo_earning_${user?.userId}`) || null);
//   const [promoTopup, setPromoTopup] = useState(() => localStorage.getItem(`promo_topup_${user?.userId}`) || null);

//   // Modal states
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editType, setEditType] = useState(""); // 'earning' or 'topup'
//   const [editValue, setEditValue] = useState("");

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
//               const txDate = new Date(t.createdAt || t.date);
//               const today = new Date();
//               const diffTime = today.getTime() - txDate.getTime();
//               const diffDays = diffTime / (1000 * 3600 * 24); 

//               if (diffDays <= 25) {
//                 const finalAmount = Math.abs(getSafeAmount(t.amount || t.grossAmount));
//                 calculatedTotalAmount += finalAmount;
//               }
//             }
//           });

//           setMyTopupDisplay(calculatedTotalAmount.toFixed(2));
//         }
//       } catch (err) {
//         console.error("Topup fetch error in TotalEarningBox:", err);
//       }
//     };

//     fetchTotalTopup();
//   }, [user?.userId]);


//   // 🔥 MODAL HANDLERS FOR PROMO USER
//   const handleDoubleClick = (type) => {
//     if (!isPromo) return; // Normal user ke liye kuch nahi hoga
//     setEditType(type);
//     if (type === 'earning') setEditValue(promoEarning || totalEarningDisplay);
//     if (type === 'topup') setEditValue(promoTopup || myTopupDisplay);
//     setIsModalOpen(true);
//   };

//   const handleSavePromo = () => {
//     if (editType === 'earning') {
//       setPromoEarning(editValue);
//       localStorage.setItem(`promo_earning_${user?.userId}`, editValue);
//     } else if (editType === 'topup') {
//       setPromoTopup(editValue);
//       localStorage.setItem(`promo_topup_${user?.userId}`, editValue);
//     }
//     setIsModalOpen(false);
//   };

//   const handleResetPromo = () => {
//     if (editType === 'earning') {
//       setPromoEarning(null);
//       localStorage.removeItem(`promo_earning_${user?.userId}`);
//     } else if (editType === 'topup') {
//       setPromoTopup(null);
//       localStorage.removeItem(`promo_topup_${user?.userId}`);
//     }
//     setIsModalOpen(false);
//   };

//   // Final display values tayyar karna
//   const displayEarning = promoEarning !== null ? Number(promoEarning).toFixed(2) : totalEarningDisplay;
//   const displayTopup = promoTopup !== null ? Number(promoTopup).toFixed(2) : myTopupDisplay;

//   return (
//     <>
//       <div className="grid grid-cols-2 gap-3 mb-6">
        
//         {/* 🌑 DARK CARD 1: MY EARNING */}
//         <div 
//           onDoubleClick={() => handleDoubleClick('earning')}
//           className={`bg-[#1c2233] p-4 rounded-xl border border-slate-700 shadow-lg flex flex-col justify-center min-h-[95px] transition-transform hover:scale-[1.02] ${isPromo ? 'cursor-pointer' : ''}`}
//         >
//           <h3 className="text-emerald-400 font-extrabold text-[11px] sm:text-sm uppercase tracking-wider">
//             My Earning
//           </h3>
//           <p className="text-2xl sm:text-3xl font-black text-white mt-1 drop-shadow-md">
//             ${displayEarning}
//           </p>
//         </div>

//         {/* 🌑 DARK CARD 2: MY TOPUP */}
//         <div 
//           onDoubleClick={() => handleDoubleClick('topup')}
//           className={`bg-[#1c2233] p-4 rounded-xl border border-slate-700 shadow-lg flex flex-col justify-center min-h-[95px] transition-transform hover:scale-[1.02] ${isPromo ? 'cursor-pointer' : ''}`}
//         >
//           <h3 className="text-yellow-500 font-extrabold text-[11px] sm:text-sm uppercase tracking-wider">
//             My Topup
//           </h3>
//           <p className="text-2xl sm:text-3xl font-black text-white mt-1 drop-shadow-md">
//             ${displayTopup}
//           </p>
//         </div>

//       </div>

//       {/* 🔥 PROMO EDIT MODAL 🔥 */}
//       {isModalOpen && isPromo && (
//         <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[99999] flex justify-center items-center p-4">
//           <div className="bg-[#0b101e] w-full max-w-sm rounded-xl border border-[#d4af37]/30 p-5 shadow-[0_0_20px_rgba(212,175,55,0.15)]">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-[#d4af37] font-bold text-lg">
//                  {editType === 'earning' ? 'My Earning' : 'My Topup'} 
//               </h2>
//               <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
//                 <X size={20} />
//               </button>
//             </div>
            
//             <input 
//               type="number"
//               value={editValue}
//               onChange={(e) => setEditValue(e.target.value)}
//               className="w-full bg-[#131927] border border-[#2d3748] text-white px-4 py-3 rounded-lg outline-none focus:border-[#e4c568] mb-4"
//               placeholder="Enter custom amount..."
//             />
            
//             <div className="flex gap-3">
//               <button 
//                 onClick={handleResetPromo}
//                 className="flex-1 bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500/20 font-bold py-2.5 rounded-lg transition-colors"
//               >
//                 Reset to Original
//               </button>
//               <button 
//                 onClick={handleSavePromo}
//                 className="flex-1 bg-gradient-to-r from-[#d4af37] to-[#e4c568] text-black font-extrabold py-2.5 rounded-lg hover:brightness-110 transition-all"
//               >
//                 Save Changes
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default TotalEarningBox;































import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { X } from "lucide-react"; 

const TotalEarningBox = ({ user }) => {
  // Default fallback value agar API load na ho
  const [myTopupDisplay, setMyTopupDisplay] = useState(Number(user?.topUpAmount || 0).toFixed(2));

  // 🔥 PROMO ROLE LOGIC & STATES
  const isPromo = user?.role === 'promo';
  
  // Local storage se promo values uthayenge agar set hain toh
  const [promoEarning, setPromoEarning] = useState(() => localStorage.getItem(`promo_earning_${user?.userId}`) || null);
  const [promoTopup, setPromoTopup] = useState(() => localStorage.getItem(`promo_topup_${user?.userId}`) || null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editType, setEditType] = useState(""); // 'earning' or 'topup'
  const [editValue, setEditValue] = useState("");

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

  const getSafeAmount = (val) => {
    if (!val) return 0;
    if (val.$numberDecimal) return parseFloat(val.$numberDecimal);
    return parseFloat(val) || 0;
  };

  // 2. 🔥 API SE TOPUP FETCH (SIRF NORMAL, AUTO COMPOUND NAHI) 🔥
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
            
            // 🔥 NAYA FILTER: Auto Compound ko hatane ke liye
            const isNotCompound = !typeStr.includes("compound") && !descStr.includes("COMPOUND");
            
            return isTopupRelated && isNotPromo && isNotCompound;
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
              const txDate = new Date(t.createdAt || t.date);
              const today = new Date();
              const diffTime = today.getTime() - txDate.getTime();
              const diffDays = diffTime / (1000 * 3600 * 24); 

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


  // 🔥 MODAL HANDLERS FOR PROMO USER
  const handleDoubleClick = (type) => {
    if (!isPromo) return; 
    setEditType(type);
    if (type === 'earning') setEditValue(promoEarning || totalEarningDisplay);
    if (type === 'topup') setEditValue(promoTopup || myTopupDisplay);
    setIsModalOpen(true);
  };

  const handleSavePromo = () => {
    if (editType === 'earning') {
      setPromoEarning(editValue);
      localStorage.setItem(`promo_earning_${user?.userId}`, editValue);
    } else if (editType === 'topup') {
      setPromoTopup(editValue);
      localStorage.setItem(`promo_topup_${user?.userId}`, editValue);
    }
    setIsModalOpen(false);
  };

  const handleResetPromo = () => {
    if (editType === 'earning') {
      setPromoEarning(null);
      localStorage.removeItem(`promo_earning_${user?.userId}`);
    } else if (editType === 'topup') {
      setPromoTopup(null);
      localStorage.removeItem(`promo_topup_${user?.userId}`);
    }
    setIsModalOpen(false);
  };

  const displayEarning = promoEarning !== null ? Number(promoEarning).toFixed(2) : totalEarningDisplay;
  const displayTopup = promoTopup !== null ? Number(promoTopup).toFixed(2) : myTopupDisplay;

  return (
    <>
      <div className="grid grid-cols-2 gap-3 mb-6">
        
        {/* 🌑 DARK CARD 1: MY EARNING */}
        <div 
          onDoubleClick={() => handleDoubleClick('earning')}
          className={`bg-[#1c2233] p-4 rounded-xl border border-slate-700 shadow-lg flex flex-col justify-center min-h-[95px] transition-transform hover:scale-[1.02] ${isPromo ? 'cursor-pointer' : ''}`}
        >
          <h3 className="text-emerald-400 font-extrabold text-[11px] sm:text-sm uppercase tracking-wider">
            My Earning
          </h3>
          <p className="text-2xl sm:text-3xl font-black text-white mt-1 drop-shadow-md">
            ${displayEarning}
          </p>
        </div>

        {/* 🌑 DARK CARD 2: MY TOPUP */}
        <div 
          onDoubleClick={() => handleDoubleClick('topup')}
          className={`bg-[#1c2233] p-4 rounded-xl border border-slate-700 shadow-lg flex flex-col justify-center min-h-[95px] transition-transform hover:scale-[1.02] ${isPromo ? 'cursor-pointer' : ''}`}
        >
          <h3 className="text-yellow-500 font-extrabold text-[11px] sm:text-sm uppercase tracking-wider">
            My Topup
          </h3>
          <p className="text-2xl sm:text-3xl font-black text-white mt-1 drop-shadow-md">
            ${displayTopup}
          </p>
        </div>

      </div>

      {/* 🔥 PROMO EDIT MODAL 🔥 */}
      {isModalOpen && isPromo && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[99999] flex justify-center items-center p-4">
          <div className="bg-[#0b101e] w-full max-w-sm rounded-xl border border-[#d4af37]/30 p-5 shadow-[0_0_20px_rgba(212,175,55,0.15)]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[#d4af37] font-bold text-lg">
                 {editType === 'earning' ? 'My Earning' : 'My Topup'} 
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <input 
              type="number"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full bg-[#131927] border border-[#2d3748] text-white px-4 py-3 rounded-lg outline-none focus:border-[#e4c568] mb-4"
              placeholder="Enter custom amount..."
            />
            
            <div className="flex gap-3">
              <button 
                onClick={handleResetPromo}
                className="flex-1 bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500/20 font-bold py-2.5 rounded-lg transition-colors"
              >
                Reset to Original
              </button>
              <button 
                onClick={handleSavePromo}
                className="flex-1 bg-gradient-to-r from-[#d4af37] to-[#e4c568] text-black font-extrabold py-2.5 rounded-lg hover:brightness-110 transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TotalEarningBox;