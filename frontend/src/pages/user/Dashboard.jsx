 

import React, { useEffect, useState } from "react";
import api from "../../api/axios"; 
import { useAuth } from "../../context/AuthContext";

// Components Imports
import ReferralLink from "../../components/dashboard/ReferralLink"; 
import QuickActions from "../../components/dashboard/QuickActions"; 
import SpinnerOverlay from "../../components/common/SpinnerOverlay";

// 🔥 Packages component ko yahan import kar liya hai
import Packages from "../../components/Packages"; 

// 🔥 props me { modalState, setModalState } add kar diya hai
const Dashboard = ({ modalState, setModalState }) => {
  const { user, token, setUser, logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const fetchUserData = async () => {
    if (!token || !user?.userId) return;
    try {
      const userRes = await api.get(`/user/${user.userId}`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      setUser(userRes.data.user); 
    } catch (err) {
      console.error("Failed to fetch user data:", err);
      if (err?.response?.status === 401) logout();
    }
  };

  useEffect(() => {
    if (token && user?.userId) {
      fetchUserData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.userId, token]); 

  if (!user || !token) return <SpinnerOverlay />;

  const referralLink = `${window.location.origin}/register?ref=${user.userId}`;

  return (
    <div className="w-full relative animate-fadeIn pb-28 md:pb-8 pt-4">
      {loading && <SpinnerOverlay />}

      <div className="space-y-6 max-w-4xl mx-auto px-2 sm:px-0">
        
        {/* 1. REFERRAL LINK BOX */}
        <ReferralLink link={referralLink} />

        {/* 2. QUICK ACTIONS MENU */}
        <QuickActions 
          onDepositClick={() => {
            if (setModalState) {
              setModalState(prev => ({ ...prev, showDeposit: true }));
            }
          }} 
        />

        {/* 3. PACKAGES SECTION 🔥 Yahan dashboard me packages render honge */}
        <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 px-2">Investment Packages</h2>
            <Packages />
        </div>

      </div>
    </div>
  );
};

export default Dashboard;



// import React, { useEffect, useState } from "react";
// import api from "../../api/axios"; 
// import { useAuth } from "../../context/AuthContext";
// import { LogOut, Rocket } from "lucide-react"; 

// // Components Imports
// import ReferralLink from "../../components/dashboard/ReferralLink"; 
// import QuickActions from "../../components/dashboard/QuickActions"; 
// import SpinnerOverlay from "../../components/common/SpinnerOverlay";
// import Packages from "../../components/Packages"; 

// const Dashboard = ({ modalState, setModalState }) => {
//   const { user, token, setUser, logout } = useAuth();
//   const [loading, setLoading] = useState(false);
  
//   // 🔥 Countdown Timer States
//   const [isLaunched, setIsLaunched] = useState(false);
//   const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

//   const fetchUserData = async () => {
//     if (!token || !user?.userId) return;
//     try {
//       const userRes = await api.get(`/user/${user.userId}`, { 
//         headers: { Authorization: `Bearer ${token}` } 
//       });
//       setUser(userRes.data.user); 
//     } catch (err) {
//       console.error("Failed to fetch user data:", err);
//       if (err?.response?.status === 401) logout();
//     }
//   };

//   // 🔥 Timer Logic Effect
//   useEffect(() => {
//     // Target Date Set to 1st August 2026
//     const targetDate = new Date("August 1, 2026 00:00:00").getTime();

//     const updateTimer = () => {
//       const now = new Date().getTime();
//       const distance = targetDate - now;

//       if (distance <= 0) {
//         setIsLaunched(true);
//       } else {
//         setTimeLeft({
//           days: Math.floor(distance / (1000 * 60 * 60 * 24)),
//           hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
//           minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
//           seconds: Math.floor((distance % (1000 * 60)) / 1000)
//         });
//       }
//     };

//     const timerInterval = setInterval(updateTimer, 1000);
//     updateTimer(); // Initial call to avoid 1-second delay

//     return () => clearInterval(timerInterval);
//   }, []);

//   useEffect(() => {
//     if (token && user?.userId) {
//       fetchUserData();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [user?.userId, token]); 

//   if (!user || !token) return <SpinnerOverlay />;

//   // 🔥 Referral Link pehle generate kar liya taaki dono jagah use ho sake
//   const referralLink = `${window.location.origin}/register?ref=${user.userId}`;

//   // ==========================================
//   // 🔥 FULL SCREEN GRAND LAUNCH TIMER BLOCKER
//   // ==========================================
//   if (!isLaunched) {
//     return (
//       <div 
//         className="flex flex-col items-center justify-center p-4 overflow-hidden selection:bg-[#e4c568]/30"
//         style={{ 
//           position: 'fixed', 
//           top: 0, 
//           left: 0, 
//           right: 0, 
//           bottom: 0, 
//           width: '100vw', 
//           height: '100vh', 
//           backgroundColor: '#0b101e', 
//           zIndex: 2147483647, 
//           margin: 0, 
//           padding: 0,
//           overflowY: 'auto' // Agar choti screen ho toh scroll ho sake
//         }} 
//       >
//         {/* Glow Effects */}
//         <div className="absolute top-[10%] left-[10%] w-[50vw] h-[50vw] bg-[#e4c568]/10 blur-[120px] rounded-full pointer-events-none fixed"></div>
//         <div className="absolute bottom-[10%] right-[10%] w-[40vw] h-[40vw] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none fixed"></div>

//         <div className="relative z-10 flex flex-col items-center w-full max-w-4xl mx-auto mt-16 sm:mt-10 pb-10">
          
//           <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#131927] border border-[#e4c568]/30 rounded-full flex items-center justify-center mb-4 sm:mb-6 shadow-[0_0_20px_rgba(228,197,104,0.3)]">
//              <Rocket className="text-[#e4c568] w-8 h-8 sm:w-10 sm:h-10 animate-bounce" />
//           </div>

//           <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-center text-white mb-2 tracking-tight">
//             GRAND <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e4c568] to-[#d4af37]">LAUNCH</span>
//           </h1>
//           <p className="text-gray-400 text-base sm:text-lg md:text-2xl font-bold tracking-[0.2em] uppercase mb-8 text-center">
//             1st August 2026
//           </p>

//           {/* Countdown Boxes */}
//           <div className="flex justify-center gap-3 sm:gap-6 mb-8 w-full px-2">
            
//             {/* Days */}
//             <div className="flex flex-col items-center bg-[#131927] border border-[#2d3748] rounded-xl w-20 sm:w-28 py-4 sm:py-6 shadow-xl relative overflow-hidden">
//               <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-[#e4c568] to-[#d4af37]"></div>
//               <span className="text-3xl sm:text-5xl font-black text-white">{timeLeft.days.toString().padStart(2, '0')}</span>
//               <span className="text-[#e4c568] text-[10px] sm:text-sm font-bold uppercase tracking-wider mt-2">Days</span>
//             </div>

//             {/* Hours */}
//             <div className="flex flex-col items-center bg-[#131927] border border-[#2d3748] rounded-xl w-20 sm:w-28 py-4 sm:py-6 shadow-xl relative overflow-hidden">
//               <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-[#e4c568] to-[#d4af37]"></div>
//               <span className="text-3xl sm:text-5xl font-black text-white">{timeLeft.hours.toString().padStart(2, '0')}</span>
//               <span className="text-[#e4c568] text-[10px] sm:text-sm font-bold uppercase tracking-wider mt-2">Hours</span>
//             </div>

//             {/* Minutes */}
//             <div className="flex flex-col items-center bg-[#131927] border border-[#2d3748] rounded-xl w-20 sm:w-28 py-4 sm:py-6 shadow-xl relative overflow-hidden">
//               <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-[#e4c568] to-[#d4af37]"></div>
//               <span className="text-3xl sm:text-5xl font-black text-white">{timeLeft.minutes.toString().padStart(2, '0')}</span>
//               <span className="text-[#e4c568] text-[10px] sm:text-sm font-bold uppercase tracking-wider mt-2">Mins</span>
//             </div>

//             {/* Seconds */}
//             <div className="flex flex-col items-center bg-[#131927] border border-[#2d3748] rounded-xl w-20 sm:w-28 py-4 sm:py-6 shadow-xl relative overflow-hidden">
//               <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-[#e4c568] to-[#d4af37]"></div>
//               <span className="text-3xl sm:text-5xl font-black text-[#00ff88]">{timeLeft.seconds.toString().padStart(2, '0')}</span>
//               <span className="text-gray-400 text-[10px] sm:text-sm font-bold uppercase tracking-wider mt-2">Secs</span>
//             </div>

//           </div>

//           {/* 👇 YAHAN ADD KIYA HAI REFERRAL LINK: Taaki user abhi se team bana sake */}
//           <div className="w-full max-w-lg mb-8 px-4">
//             <div className="text-center mb-3">
//               <span className="inline-block px-3 py-1 bg-[#00ff88]/10 text-[#00ff88] text-xs font-bold rounded-full border border-[#00ff88]/30">
//                 Registration is LIVE! Start building your team.
//               </span>
//             </div>
//             <ReferralLink link={referralLink} />
//           </div>

//           <div className="text-center bg-[#1e2536] border border-[#2d3748] p-4 sm:p-6 rounded-xl max-w-lg w-full mb-8 shadow-lg mx-4">
//             <h3 className="text-white font-bold text-sm sm:text-lg mb-2">Platform is undergoing final updates!</h3>
//             <p className="text-gray-400 text-xs sm:text-sm">Please wait until the countdown finishes to access your member dashboard, deposit funds, and activate your packages.</p>
//           </div>

//           {/* Logout Button */}
//           <button 
//             onClick={logout} 
//             className="flex items-center justify-center gap-2 px-8 py-3.5 bg-[#ef4444]/10 hover:bg-[#ef4444] border border-[#ef4444]/50 hover:border-[#ef4444] text-[#ef4444] hover:text-white rounded-lg font-bold transition-all shadow-[0_0_15px_rgba(239,68,68,0.2)] w-[80%] sm:w-auto"
//           >
//             <LogOut size={20} /> Secure Logout
//           </button>

//         </div>
//       </div>
//     );
//   }

//   // ==========================================
//   // NORMAL DASHBOARD CONTENT (Post-Launch)
//   // ==========================================
//   return (
//     <div className="w-full relative animate-fadeIn pb-28 md:pb-8 pt-4">
//       {loading && <SpinnerOverlay />}

//       <div className="space-y-6 max-w-4xl mx-auto px-2 sm:px-0">
        
//         {/* 1. REFERRAL LINK BOX */}
//         <ReferralLink link={referralLink} />

//         {/* 2. QUICK ACTIONS MENU */}
//         <QuickActions 
//           onDepositClick={() => {
//             if (setModalState) {
//               setModalState(prev => ({ ...prev, showDeposit: true }));
//             }
//           }} 
//         />

//         {/* 3. PACKAGES SECTION */}
//         <div className="mt-8">
//             <h2 className="text-2xl font-bold text-gray-800 mb-4 px-2">Investment Packages</h2>
//             <Packages />
//         </div>

//       </div>
//     </div>
//   );
// };

// export default Dashboard;