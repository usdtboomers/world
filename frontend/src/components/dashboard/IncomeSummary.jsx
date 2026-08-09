// import React, { useEffect, useState } from "react";
// import { 
//   TrendingUp, Users, Trophy, Layers, Zap // 🔥 1. Zap icon add kiya
// } from "lucide-react";

// // ✅ Updated Config: Required Directs hata diya hai
 

// const IncomeSummary = ({ income = {}, user = {} }) => {
//   const [globalGrowthIncome, setGlobalGrowthIncome] = useState(0); 

//   const directIncome = Number(income.totalDirectIncome) || Number(income.directIncome) || 0;
//   const levelIncome = Number(income.totalLevelIncome) || Number(income.levelIncome) || 0;
//   const rewardIncome = Number(income.totalRewardIncome) || Number(income.rewardIncome) || Number(user.rewardIncome) || 0;
  
  
//   // 🔥 2. Fast Track Income Extract Kiya
//   const fastTrackIncome = Number(income.totalFastTrackIncome) || Number(income.fastTrackIncome) || 0;

//   // 🔥 UPDATED CALCULATION: No Direct Check
//   useEffect(() => {
//     if (!user) return;
    
//     const realGlobalTeamCount = Number(user?.globalTeamCount) || 0;
//     let totalFrontendAchieved = 0;
//     let cumulative = 0;

//     globalPoolConfig.levels.forEach((lvl) => {
//       cumulative += lvl.globalTeam; // Cumulative Target (20, 60, 160...)
      
//       // ✅ Ab sirf Global Team Count check ho raha hai
//       if (realGlobalTeamCount >= cumulative) {
//         totalFrontendAchieved += lvl.earning;
//       }
//     });
    
//     setGlobalGrowthIncome(totalFrontendAchieved);
//   }, [user]);

//   const cardData = [
//     { label: "Community Earning", value: `$${globalGrowthIncome.toFixed(2)}`, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100", glow: "bg-emerald-400/20" },
//     { label: "Direct Earning", value: `$${directIncome.toFixed(2)}`, icon: Users, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100", glow: "bg-amber-400/20" },
//     { label: "Level Earning", value: `$${levelIncome.toFixed(2)}`, icon: Layers, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100", glow: "bg-blue-400/20" },
//     { label: "Team Reward", value: `$${rewardIncome.toFixed(2)}`, icon: Trophy, color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100", glow: "bg-indigo-400/20" },
//     // 🔥 3. 5th Box for Fast Track
//     { label: "Fast Track Bonus", value: `$${fastTrackIncome.toFixed(2)}`, icon: Zap, color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-100", glow: "bg-violet-400/20" } 
//   ];

//   return (
//     <div className="w-full">
//       <div className="grid grid-cols-2 gap-3 md:gap-4">
//         {cardData.map((item, index) => (
//           <div key={index} className="relative overflow-hidden p-4 rounded-xl border border-slate-200 bg-white hover:shadow-md transition-shadow duration-300 group shadow-sm">
//             <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full ${item.glow} blur-[20px] opacity-50`}></div>
//             <div className="relative z-10 flex flex-col h-full justify-between">
//               <div className="flex items-center justify-between mb-3">
//                 <div className={`p-2 rounded-lg ${item.bg} ${item.color} border ${item.border}`}>
//                   <item.icon className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2.5} />
//                 </div>
//               </div>
//               <div>
//                 <h3 className={`text-xl md:text-2xl font-black ${item.color} tracking-tight`}>
//                   {item.value}
//                 </h3>
//                 <p className="text-black text-[10px] md:text-xs font-bold uppercase tracking-wider mt-1">
//                   {item.label}
//                 </p>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default IncomeSummary;


import React, { useEffect, useState } from "react";
import api from "../../api/axios"; 
import { 
  TrendingUp, Users, Trophy, Layers, Zap, DollarSign
} from "lucide-react";

// Global pool config agar import nahi hai toh fallback ke liye
const globalPoolConfig = {
  levels: [
    { globalTeam: 20, earning: 10 },
    { globalTeam: 40, earning: 25 },
    { globalTeam: 100, earning: 50 },
    { globalTeam: 200, earning: 100 },
    { globalTeam: 500, earning: 250 },
    { globalTeam: 1000, earning: 500 },
    { globalTeam: 2000, earning: 1000 },
    { globalTeam: 5000, earning: 2500 }
  ]
};

const IncomeSummary = ({ income = {}, user = {} }) => {
  const [globalGrowthIncome, setGlobalGrowthIncome] = useState(0); 

  const directIncome = Number(income.totalDirectIncome) || Number(income.directIncome) || 0;
  const levelIncome = Number(income.totalLevelIncome) || Number(income.levelIncome) || 0;
  const rewardIncome = Number(income.totalRewardIncome) || Number(income.rewardIncome) || Number(user.rewardIncome) || 0;
  const fastTrackIncome = Number(income.totalFastTrackIncome) || Number(income.fastTrackIncome) || 0;
  const roiIncome = Number(income.totalRoiIncome) || Number(income.roiIncome) || 0; // Agar ROI bhi jodna ho

  // Global Growth Calculation
  useEffect(() => {
    if (!user) return;
    
    const realGlobalTeamCount = Number(user?.globalTeamCount) || 0;
    let totalFrontendAchieved = 0;
    let cumulative = 0;

    globalPoolConfig.levels.forEach((lvl) => {
      cumulative += lvl.globalTeam; 
      
      if (realGlobalTeamCount >= cumulative) {
        totalFrontendAchieved += lvl.earning;
      }
    });
    
    setGlobalGrowthIncome(totalFrontendAchieved);
  }, [user]);

  // 🔥 Total Earning Calculation (Sabhi incomes ka sum)
  const totalEarning = globalGrowthIncome + directIncome + levelIncome + rewardIncome + fastTrackIncome + roiIncome;

  const cardData = [
    { label: "Community Earning", value: `$${globalGrowthIncome.toFixed(2)}`, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100", glow: "bg-emerald-400/20" },
    { label: "Direct Earning", value: `$${directIncome.toFixed(2)}`, icon: Users, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100", glow: "bg-amber-400/20" },
    { label: "Level Earning", value: `$${levelIncome.toFixed(2)}`, icon: Layers, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100", glow: "bg-blue-400/20" },
    { label: "Team Reward", value: `$${rewardIncome.toFixed(2)}`, icon: Trophy, color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100", glow: "bg-indigo-400/20" },
    { label: "Fast Track Bonus", value: `$${fastTrackIncome.toFixed(2)}`, icon: Zap, color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-100", glow: "bg-violet-400/20" } 
  ];

  return (
    <div className="w-full space-y-4">
      
      {/* 🔥 TOP BIG BOX: TOTAL EARNING (Jaise image me Total Investment ka box hai) */}
      <div className="relative overflow-hidden p-5 rounded-2xl bg-gradient-to-r from-[#d4af37] to-[#e4c568] shadow-lg border border-[#f3e29b] flex items-center justify-between text-black">
        <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/20 blur-[30px]"></div>
        <div className="relative z-10">
          <p className="text-black/80 text-xs md:text-sm font-extrabold uppercase tracking-wider">
            Total Earning
          </p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mt-1 text-black font-mono">
            ${totalEarning.toFixed(2)}
          </h2>
        </div>
        <div className="relative z-10 p-3 bg-black/10 rounded-xl border border-black/10">
          <DollarSign className="w-7 h-7 text-black" strokeWidth={2.5} />
        </div>
      </div>

      {/* GRID FOR OTHER EARNINGS */}
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        {cardData.map((item, index) => (
          <div key={index} className="relative overflow-hidden p-4 rounded-xl border border-slate-200 bg-white hover:shadow-md transition-shadow duration-300 group shadow-sm">
            <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full ${item.glow} blur-[20px] opacity-50`}></div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${item.bg} ${item.color} border ${item.border}`}>
                  <item.icon className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2.5} />
                </div>
              </div>
              <div>
                <h3 className={`text-xl md:text-2xl font-black ${item.color} tracking-tight font-mono`}>
                  {item.value}
                </h3>
                <p className="text-black text-[10px] md:text-xs font-bold uppercase tracking-wider mt-1">
                  {item.label}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default IncomeSummary;