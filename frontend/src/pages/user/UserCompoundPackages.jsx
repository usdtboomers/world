// import React, { useState, useEffect } from "react";
// import { CalendarDays, DollarSign, CheckCircle2, Activity, Loader2, Layers, Zap, ArrowDownToLine } from "lucide-react";
// import api from "../../api/axios";
// import { useAuth } from "../../context/AuthContext";

// // 🔹 Circular Progress Component
// const CircularProgress = ({ days, totalDays, status, isMaster }) => {
//   const percentage = Math.min((days / totalDays) * 100, 100);
//   const radius = 22;
//   const circumference = 2 * Math.PI * radius;
//   const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
//   // Master aur Child ke liye alag color ring
//   const ringColor = status === "completed" 
//     ? "text-emerald-500" 
//     : isMaster ? "text-[#d4af37]" : "text-[#00d2ff]";

//   return (
//     <div className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 shrink-0">
//       <svg viewBox="0 0 64 64" className="w-full h-full transform -rotate-90">
//         <circle cx="32" cy="32" r={radius} stroke="currentColor" strokeWidth="4.5" fill="transparent" className="text-gray-800" />
//         <circle
//           cx="32" cy="32" r={radius} stroke="currentColor" strokeWidth="4.5" fill="transparent"
//           strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round"
//           className={`${ringColor} transition-all duration-1000 ease-out`}
//         />
//       </svg>
//       <div className="absolute flex flex-col items-center justify-center text-center mt-0.5">
//         <span className="text-xs sm:text-sm font-black text-white leading-none">{days}</span>
//         <span className="text-[7px] sm:text-[8px] text-gray-400 uppercase font-bold tracking-widest mt-0.5">Day</span>
//       </div>
//     </div>
//   );
// };

// const UserCompoundPackages = () => {
//   const { user, token } = useAuth();
//   const [packages, setPackages] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // 🔥 FETCH LOGIC (Updated to match your backend route)
//   useEffect(() => {
//     const fetchCompoundPackages = async () => {
//       if (!user?.userId || !token) return;
      
//       try {
//         setLoading(true);
//         // Backend ke naye route ke hisaab se call: /package/auto-compound/:userId
//         const res = await api.get(`/package/auto-compound/${user.userId}`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
        
//         // Backend se res.data.packages aa raha hai
//         const packageData = res.data.packages || [];
        
//         // Data ko sort kar rahe hain taaki naye (Cron wale) sabse upar dikhein
//         const sortedPackages = packageData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//         setPackages(sortedPackages);
//       } catch (error) {
//         console.error("Failed to fetch compound packages:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCompoundPackages();
//   }, [user?.userId, token]);

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     return new Date(dateString).toLocaleDateString("en-GB", {
//       day: "2-digit", month: "short", year: "numeric"
//     });
//   };

//   return (
//     <div className="w-full max-w-3xl mx-auto p-3 sm:p-5 bg-[#070b14] rounded-2xl">
      
//       {/* Header */}
//       <div className="mb-3 flex items-center justify-between border-b border-gray-800 pb-2">
//         <div>
//           <h2 className="text-lg sm:text-xl font-black text-white tracking-wide uppercase flex items-center gap-2">
//             <Layers className="text-[#d4af37]" size={20} /> My Auto Compound
//           </h2>
//           <p className="text-[9px] sm:text-[10px] text-gray-400 font-medium tracking-widest mt-1 uppercase flex items-center gap-1">
//             <Zap size={10} className="text-[#22c55e]" /> 6% Daily Reinvestment System
//           </p>
//         </div>
//       </div>

//       {/* Main Content Area */}
//       {loading ? (
//         <div className="flex flex-col items-center justify-center py-8">
//           <Loader2 className="animate-spin text-[#d4af37] mb-3" size={28} />
//           <span className="text-xs text-gray-400 font-bold tracking-widest uppercase">Loading Packages...</span>
//         </div>
//       ) : (
//         <div className="flex flex-col gap-3">
//           {packages.length > 0 ? (
//             packages.map((pkg, index) => {
//               const amount = Number(pkg.packageAmount) || 0;
//               const daysDone = Number(pkg.daysCompleted) || 0;
//               const isMaster = pkg.packageType === 'master';
              
//               // Child package hamesha 25 din ka hota hai, Master apni cycle ka
//               const totalCycleDays = isMaster 
//                 ? (Number(pkg.compoundingDuration) || Number(pkg.totalDays) || 25)
//                 : 25; 
              
//               const dailyRoi = (amount * 6) / 100;
//               const earnedRoi = dailyRoi * daysDone; 
//               const totalExpected = dailyRoi * totalCycleDays; 

//               return (
//                 <div key={pkg._id || index} 
//                   className={`bg-[#111827] border ${isMaster ? 'border-[#d4af37]/40 shadow-[#d4af37]/10' : 'border-[#00d2ff]/30 shadow-[#00d2ff]/5'} rounded-xl p-3 flex flex-row items-center gap-3 shadow-lg relative overflow-hidden transition-all hover:border-gray-500`}
//                 >
//                   {/* Glow effect based on Master or Child */}
//                   {pkg.status === "active" && (
//                     <div className={`absolute top-0 right-0 w-32 h-32 blur-[40px] pointer-events-none ${isMaster ? 'bg-[#d4af37]/5' : 'bg-[#00d2ff]/5'}`}></div>
//                   )}

//                   {/* Circle Chart */}
//                   <CircularProgress days={daysDone} totalDays={totalCycleDays} status={pkg.status} isMaster={isMaster} />

//                   {/* Details Area */}
//                   <div className="flex-1 min-w-0 z-10">
//                     <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1.5 mb-1.5">
                      
//                       <div className="flex items-center gap-2 truncate">
//                         <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-1">
//                           <DollarSign size={14} className={isMaster ? "text-[#d4af37]" : "text-[#00d2ff]"} />
//                           ${amount.toFixed(2)}
//                         </h3>
//                         {/* 🔥 MASTER vs CHILD BADGE */}
//                         {isMaster ? (
//                           <span className="text-[8px] bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30 px-1.5 py-0.5 rounded uppercase font-black tracking-wider flex items-center gap-1">
//                             ★ Master Plan
//                           </span>
//                         ) : (
//                           <span className="text-[8px] bg-[#00d2ff]/20 text-[#00d2ff] border border-[#00d2ff]/30 px-1.5 py-0.5 rounded uppercase font-black tracking-wider flex items-center gap-1">
//                             <ArrowDownToLine size={8} /> Re-invested
//                           </span>
//                         )}
//                       </div>
                      
//                       <span className={`w-fit text-[8px] sm:text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border flex items-center gap-1 ${
//                         pkg.status === "completed" 
//                           ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" 
//                           : "text-[#22c55e] bg-[#22c55e]/10 border-[#22c55e]/20"
//                       }`}>
//                         {pkg.status === "completed" ? <CheckCircle2 size={10} /> : <Activity size={10} />}
//                         {pkg.status}
//                       </span>
//                     </div>

//                     {/* Data Grid */}
//                     <div className="grid grid-cols-2 gap-1.5 mt-1.5 bg-[#0b1221] p-2 sm:p-2.5 rounded-lg border border-gray-800">
//                       <div className="flex flex-col">
//                         <span className="text-[7.5px] sm:text-[8px] text-gray-500 uppercase tracking-widest font-bold">Earned So Far</span>
//                         <span className="text-xs font-black text-[#22c55e]">${earnedRoi.toFixed(2)}</span>
//                       </div>
//                       <div className="flex flex-col">
//                         <span className="text-[7.5px] sm:text-[8px] text-gray-500 uppercase tracking-widest font-bold">Total Expected ({totalCycleDays}D)</span>
//                         <span className="text-xs font-black text-white">${totalExpected.toFixed(2)}</span>
//                       </div>
//                       <div className="flex flex-col col-span-2 pt-1 border-t border-gray-800/50 mt-1">
//                         <span className="text-[7.5px] sm:text-[8px] text-gray-500 uppercase tracking-widest font-bold flex items-center gap-1">
//                           <CalendarDays size={9} /> Activated On
//                         </span>
//                         <span className="text-[9px] sm:text-[10px] font-bold text-gray-300 mt-0.5">{formatDate(pkg.startDate)}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })
//           ) : (
//             <div className="text-center py-6 sm:py-8 border border-dashed border-gray-700 rounded-xl bg-[#0b1221]/50">
//               <span className="text-gray-400 text-xs font-bold tracking-widest uppercase">No Active Compound Packages Found</span>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserCompoundPackages;


import React, { useState, useEffect } from "react";
import { CalendarDays, DollarSign, CheckCircle2, Activity, Loader2, Layers, Zap, ArrowDownToLine, Flame } from "lucide-react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

// 🔹 Circular Progress Component
const CircularProgress = ({ days, totalDays, status, isMaster, isOnePercent }) => {
  const percentage = Math.min((days / totalDays) * 100, 100);
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  // 1% ke liye Red/Gold, 6% Master ke liye Gold, 6% Child ke liye Blue
  let ringColor = "text-[#00d2ff]"; // Default Child Blue
  if (status === "completed") ringColor = "text-emerald-500";
  else if (isOnePercent) ringColor = "text-[#dc2626]"; // 1% 2X Plan Color
  else if (isMaster) ringColor = "text-[#d4af37]"; // 6% Master Color

  return (
    <div className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 shrink-0">
      <svg viewBox="0 0 64 64" className="w-full h-full transform -rotate-90">
        <circle cx="32" cy="32" r={radius} stroke="currentColor" strokeWidth="4.5" fill="transparent" className="text-gray-800" />
        <circle
          cx="32" cy="32" r={radius} stroke="currentColor" strokeWidth="4.5" fill="transparent"
          strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round"
          className={`${ringColor} transition-all duration-1000 ease-out`}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center mt-0.5">
        <span className="text-xs sm:text-sm font-black text-white leading-none">{days}</span>
        <span className="text-[7px] sm:text-[8px] text-gray-400 uppercase font-bold tracking-widest mt-0.5">Day</span>
      </div>
    </div>
  );
};

const UserCompoundPackages = () => {
  const { user, token } = useAuth();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 FETCH LOGIC
  useEffect(() => {
    const fetchCompoundPackages = async () => {
      if (!user?.userId || !token) return;
      
      try {
        setLoading(true);
        const res = await api.get(`/package/auto-compound/${user.userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const packageData = res.data.packages || [];
        
        // Sort newest first
        const sortedPackages = packageData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPackages(sortedPackages);
      } catch (error) {
        console.error("Failed to fetch compound packages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompoundPackages();
  }, [user?.userId, token]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit", month: "short", year: "numeric"
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-3 sm:p-5 bg-[#070b14] rounded-2xl">
      
      {/* Header */}
      <div className="mb-3 flex items-center justify-between border-b border-gray-800 pb-2">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-white tracking-wide uppercase flex items-center gap-2">
            <Layers className="text-[#d4af37]" size={20} /> My Active Plans
          </h2>
          <p className="text-[9px] sm:text-[10px] text-gray-400 font-medium tracking-widest mt-1 uppercase flex items-center gap-1">
            <Zap size={10} className="text-[#22c55e]" /> Auto Compound & 2X Plans
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="animate-spin text-[#d4af37] mb-3" size={28} />
          <span className="text-xs text-gray-400 font-bold tracking-widest uppercase">Loading Packages...</span>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {packages.length > 0 ? (
            packages.map((pkg, index) => {
              const amount = Number(pkg.packageAmount) || 0;
              const daysDone = Number(pkg.daysCompleted) || 0;
              const isMaster = pkg.packageType === 'master';
              
              // 🔥 DYNAMIC LOGIC: Pata karo 6% wala hai ya 1% wala
              const dailyPercent = Number(pkg.dailyPercentage) || 6; // Agar purana hai jisme percentage save nahi tha, toh 6 manega
              const isOnePercentPlan = dailyPercent === 1;

              // 🔥 CYCLE DAYS CALCULATION
              let totalCycleDays = 25;
              if (isOnePercentPlan) {
                  totalCycleDays = Number(pkg.totalDays) || 70; // 1% wala hamesha 70 days
              } else {
                  totalCycleDays = isMaster ? (Number(pkg.compoundingDuration) || Number(pkg.totalDays) || 25) : 25; // 6% wala logic
              }
              
              // 🔥 EARNING & EXPECTED CALCULATION
              const dailyRoiAmount = (amount * dailyPercent) / 100;
              const earnedRoi = dailyRoiAmount * daysDone; // Earned so far
              
              // 1% plan double deta hai (Amount * 2). 6% plan apni cycle ke hisaab se deta hai.
              const totalExpected = isOnePercentPlan ? (amount * 2) : (dailyRoiAmount * totalCycleDays); 

              return (
                <div key={pkg._id || index} 
                  className={`bg-[#111827] border ${isOnePercentPlan ? 'border-[#dc2626]/40 shadow-[#dc2626]/10' : isMaster ? 'border-[#d4af37]/40 shadow-[#d4af37]/10' : 'border-[#00d2ff]/30 shadow-[#00d2ff]/5'} rounded-xl p-3 flex flex-row items-center gap-3 shadow-lg relative overflow-hidden transition-all hover:border-gray-500`}
                >
                  {/* Glow effect */}
                  {pkg.status === "active" && (
                    <div className={`absolute top-0 right-0 w-32 h-32 blur-[40px] pointer-events-none ${isOnePercentPlan ? 'bg-[#dc2626]/10' : isMaster ? 'bg-[#d4af37]/5' : 'bg-[#00d2ff]/5'}`}></div>
                  )}

                  {/* Circle Chart */}
                  <CircularProgress days={daysDone} totalDays={totalCycleDays} status={pkg.status} isMaster={isMaster} isOnePercent={isOnePercentPlan} />

                  {/* Details Area */}
                  <div className="flex-1 min-w-0 z-10">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1.5 mb-1.5">
                      
                      <div className="flex items-center gap-2 truncate">
                        <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-1">
                          <DollarSign size={14} className={isOnePercentPlan ? "text-[#dc2626]" : isMaster ? "text-[#d4af37]" : "text-[#00d2ff]"} />
                          ${amount.toFixed(2)}
                        </h3>
                        
                        {/* 🔥 DYNAMIC BADGES */}
                        {isOnePercentPlan ? (
                          <span className="text-[8px] bg-gradient-to-r from-[#dc2626]/20 to-[#ef4444]/20 text-[#ef4444] border border-[#dc2626]/30 px-1.5 py-0.5 rounded uppercase font-black tracking-wider flex items-center gap-1">
                            <Flame size={8} /> 2X PLAN (1%)
                          </span>
                        ) : isMaster ? (
                          <span className="text-[8px] bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30 px-1.5 py-0.5 rounded uppercase font-black tracking-wider flex items-center gap-1">
                            ★ MASTER (6%)
                          </span>
                        ) : (
                          <span className="text-[8px] bg-[#00d2ff]/20 text-[#00d2ff] border border-[#00d2ff]/30 px-1.5 py-0.5 rounded uppercase font-black tracking-wider flex items-center gap-1">
                            <ArrowDownToLine size={8} /> RE-INVESTED (6%)
                          </span>
                        )}
                      </div>
                      
                      <span className={`w-fit text-[8px] sm:text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                        pkg.status === "completed" 
                          ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" 
                          : "text-[#22c55e] bg-[#22c55e]/10 border-[#22c55e]/20"
                      }`}>
                        {pkg.status === "completed" ? <CheckCircle2 size={10} /> : <Activity size={10} />}
                        {pkg.status}
                      </span>
                    </div>

                    {/* Data Grid */}
                    <div className="grid grid-cols-2 gap-1.5 mt-1.5 bg-[#0b1221] p-2 sm:p-2.5 rounded-lg border border-gray-800">
                      <div className="flex flex-col">
                        <span className="text-[7.5px] sm:text-[8px] text-gray-500 uppercase tracking-widest font-bold">
                           {isOnePercentPlan ? "Virtual Growth" : "Earned So Far"}
                        </span>
                        <span className="text-xs font-black text-[#22c55e]">${earnedRoi.toFixed(2)}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[7.5px] sm:text-[8px] text-gray-500 uppercase tracking-widest font-bold">
                           Expected ({totalCycleDays}D)
                        </span>
                        <span className="text-xs font-black text-white">${totalExpected.toFixed(2)}</span>
                      </div>
                      <div className="flex flex-col col-span-2 pt-1 border-t border-gray-800/50 mt-1">
                        <span className="text-[7.5px] sm:text-[8px] text-gray-500 uppercase tracking-widest font-bold flex items-center gap-1">
                          <CalendarDays size={9} /> Activated On
                        </span>
                        <span className="text-[9px] sm:text-[10px] font-bold text-gray-300 mt-0.5">{formatDate(pkg.startDate)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-6 sm:py-8 border border-dashed border-gray-700 rounded-xl bg-[#0b1221]/50">
              <span className="text-gray-400 text-xs font-bold tracking-widest uppercase">No Active Compound Packages Found</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserCompoundPackages;