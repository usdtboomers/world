 

// // // import React, { useEffect, useState } from "react";
// // // import api from "../../api/axios"; 
// // // import { useAuth } from "../../context/AuthContext";

// // // // Components Imports
// // // import ReferralLink from "../../components/dashboard/ReferralLink"; 
// // // import QuickActions from "../../components/dashboard/QuickActions"; 
// // // import SpinnerOverlay from "../../components/common/SpinnerOverlay";

// // // // 🔥 Packages component ko yahan import kar liya hai
// // // import Packages from "../../components/Packages"; 
// // // import UserPackages from "../../pages/user/UserPackages";
// // // // 🔥 props me { modalState, setModalState } add kar diya hai
// // // const Dashboard = ({ modalState, setModalState }) => {
// // //   const { user, token, setUser, logout } = useAuth();
// // //   const [loading, setLoading] = useState(false);

// // //   const fetchUserData = async () => {
// // //     if (!token || !user?.userId) return;
// // //     try {
// // //       const userRes = await api.get(`/user/${user.userId}`, { 
// // //         headers: { Authorization: `Bearer ${token}` } 
// // //       });
// // //       setUser(userRes.data.user); 
// // //     } catch (err) {
// // //       console.error("Failed to fetch user data:", err);
// // //       if (err?.response?.status === 401) logout();
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     if (token && user?.userId) {
// // //       fetchUserData();
// // //     }
// // //     // eslint-disable-next-line react-hooks/exhaustive-deps
// // //   }, [user?.userId, token]); 

// // //   if (!user || !token) return <SpinnerOverlay />;

// // //   const referralLink = `${window.location.origin}/register?ref=${user.userId}`;

// // //   return (
// // //     <div className="w-full relative animate-fadeIn pb-28 md:pb-8 pt-4">
// // //       {loading && <SpinnerOverlay />}

// // //       <div className="space-y-6 max-w-4xl mx-auto px-2 sm:px-0">
        
// // //         {/* 1. REFERRAL LINK BOX */}
// // //         <ReferralLink link={referralLink} />

// // //         {/* 2. QUICK ACTIONS MENU */}
// // //         <QuickActions 
// // //           onDepositClick={() => {
// // //             if (setModalState) {
// // //               setModalState(prev => ({ ...prev, showDeposit: true }));
// // //             }
// // //           }} 
// // //         />
       

// // //         {/* 3. PACKAGES SECTION 🔥 Yahan dashboard me packages render honge */}
// // //         <div className="mt-8">
// // //             <h2 className="text-2xl font-bold text-gray-800 mb-4 px-2">Investment Packages</h2>
// // //             <Packages />
// // //         </div>



// // //          <div className="mt-8 bg-[#070b14] rounded-2xl overflow-hidden">
// // //             {/* Naya component yahan call hoga */}
// // //             <UserPackages />
// // //         </div>

// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default Dashboard;


// // import React, { useEffect, useState } from "react";
// // import api from "../../api/axios"; 
// // import { useAuth } from "../../context/AuthContext";

// // // Components Imports
// // import ReferralLink from "../../components/dashboard/ReferralLink"; 
// // import QuickActions from "../../components/dashboard/QuickActions"; 
// // import SpinnerOverlay from "../../components/common/SpinnerOverlay";

// // // 🔥 Packages component ko yahan import kar liya hai
// // import Packages from "../../components/Packages"; 
// // import UserPackages from "../../pages/user/UserPackages";

// // // 🚀 Naya Import: TradingStatusPanel ko yahan add kiya
// // import TradingStatusPanel from "../../pages/user/TradingStatusPanel"; 

// // // 🔥 props me { modalState, setModalState } add kar diya hai
// // const Dashboard = ({ modalState, setModalState }) => {
// //   const { user, token, setUser, logout } = useAuth();
// //   const [loading, setLoading] = useState(false);

// //   const fetchUserData = async () => {
// //     if (!token || !user?.userId) return;
// //     try {
// //       const userRes = await api.get(`/user/${user.userId}`, { 
// //         headers: { Authorization: `Bearer ${token}` } 
// //       });
// //       setUser(userRes.data.user); 
// //     } catch (err) {
// //       console.error("Failed to fetch user data:", err);
// //       if (err?.response?.status === 401) logout();
// //     }
// //   };

// //   useEffect(() => {
// //     if (token && user?.userId) {
// //       fetchUserData();
// //     }
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [user?.userId, token]); 

// //   if (!user || !token) return <SpinnerOverlay />;

// //   const referralLink = `${window.location.origin}/register?ref=${user.userId}`;

// //   return (
// //     <div className="w-full relative animate-fadeIn pb-28 md:pb-8 pt-4">
// //       {loading && <SpinnerOverlay />}

// //       <div className="space-y-6 max-w-4xl mx-auto px-2 sm:px-0">
        
// //         {/* 1. REFERRAL LINK BOX */}
// //         <ReferralLink link={referralLink} />

// //         {/* 2. QUICK ACTIONS MENU */}
// //         <QuickActions 
// //           onDepositClick={() => {
// //             if (setModalState) {
// //               setModalState(prev => ({ ...prev, showDeposit: true }));
// //             }
// //           }} 
// //         />
       
// //         {/* 3. PACKAGES SECTION */}
// //         <div className="mt-8">
// //             <h2 className="text-2xl font-bold text-gray-800 mb-4 px-2">Investment Packages</h2>
// //             <Packages />
// //         </div>

// //         {/* 4. USER PACKAGES SECTION */}
// //          <div className="mt-8 bg-[#070b14] rounded-2xl overflow-hidden">
// //             <UserPackages />
// //         </div>

// //         {/* 5. LIVE TRADING FEED (SABSE NEECHE) 🚀 */}
// //         <div className="mt-8 rounded-2xl overflow-hidden">
// //             <TradingStatusPanel />
// //         </div>

// //       </div>
// //     </div>
// //   );
// // };

// // export default Dashboard;


// // import React, { useEffect, useState } from "react";
// // import api from "../../api/axios"; 
// // import { useAuth } from "../../context/AuthContext";
// // import { useNavigate } from "react-router-dom"; // 🚀 Naya Import click redirect ke liye

// // // Components Imports
// // import ReferralLink from "../../components/dashboard/ReferralLink"; 
// // import QuickActions from "../../components/dashboard/QuickActions"; 
// // import SpinnerOverlay from "../../components/common/SpinnerOverlay";

// // // Packages component
// // import Packages from "../../components/Packages"; 
// // import UserPackages from "../../pages/user/UserPackages";

// // // Live Trading Feed
// // import TradingStatusPanel from "../../pages/user/TradingStatusPanel"; 

// // const Dashboard = ({ modalState, setModalState }) => {
// //   const { user, token, setUser, logout } = useAuth();
// //   const [loading, setLoading] = useState(false);
// //   const navigate = useNavigate(); // 🚀 Navigation ke liye
  
// //   // 🚀 Naya State Stats store karne ke liye
// //   const [stats, setStats] = useState({
// //     totalGrandInvestment: 0,
// //     todayTotalInvestment: 0,
// //   });

// //   const fetchUserData = async () => {
// //     if (!token || !user?.userId) return;
// //     try {
// //       const userRes = await api.get(`/user/${user.userId}`, { 
// //         headers: { Authorization: `Bearer ${token}` } 
// //       });
// //       setUser(userRes.data.user); 
// //     } catch (err) {
// //       console.error("Failed to fetch user data:", err);
// //       if (err?.response?.status === 401) logout();
// //     }
// //   };

// //   // 🚀 Naya Function Stats fetch karne ke liye (Live feed api se)
// //   const fetchStats = async () => {
// //     if (!token) return;
// //     try {
// //       const res = await api.get("/transactions/deposits/live-feed", {
// //         headers: { Authorization: `Bearer ${token}` }
// //       });
// //       if (res.data.stats) {
// //         setStats({
// //           totalGrandInvestment: res.data.stats.totalGrandInvestment || 0,
// //           todayTotalInvestment: res.data.stats.todayTotalInvestment || 0
// //         });
// //       }
// //     } catch (err) {
// //       console.error("Error fetching live stats for dashboard", err);
// //     }
// //   };

// //   useEffect(() => {
// //     if (token && user?.userId) {
// //       fetchUserData();
// //       fetchStats(); // 🚀 Stats bhi load karo dashboard open hote hi
// //     }
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [user?.userId, token]); 

// //   if (!user || !token) return <SpinnerOverlay />;

// //   const referralLink = `${window.location.origin}/register?ref=${user.userId}`;

// //   return (
// //     <div className="w-full relative animate-fadeIn pb-28 md:pb-8 pt-4">
// //       {loading && <SpinnerOverlay />}

// //       <div className="space-y-6 max-w-4xl mx-auto px-2 sm:px-0">
        
// //         {/* 🚀 NEW: TOP STATS BOXES (Clickable) */}
// //         {/* Note: "/system-deposit-history" ko apne actual route name se match kar lena agar alag ho */}
// //        {/* 🚀 NEW: TOP STATS BOXES (Clickable) */}
// //      <div 
// //           className="grid grid-cols-2 gap-3 cursor-pointer hover:scale-[1.01] transition-transform duration-200"
// //           onClick={() => navigate("/system-live-feed")} 
// //         >
// //           {/* Yellow Box - Grand Total */}
// //           <div className="bg-[#d89814] p-4 rounded-xl border border-yellow-600 shadow-lg flex flex-col justify-center">
// //             <h3 className="text-black font-bold text-[10px] sm:text-xs uppercase tracking-wide">
// //               Grand Total Investment
// //             </h3>
// //             <p className="text-lg sm:text-2xl font-extrabold text-black mt-1">
// //               ${stats.totalGrandInvestment.toFixed(2)}
// //             </p>
// //           </div>

// //           {/* Dark Box - Today's Total */}
// //           <div className="bg-[#1c2233] p-4 rounded-xl border border-slate-700 shadow-lg flex flex-col justify-center">
// //             <h3 className="text-slate-400 font-bold text-[10px] sm:text-xs uppercase tracking-wide">
// //               Today's Total Investment
// //             </h3>
// //             <p className="text-lg sm:text-2xl font-bold text-white mt-1">
// //               ${stats.todayTotalInvestment.toFixed(2)}
// //             </p>
// //           </div>
// //         </div>

// //         {/* 1. REFERRAL LINK BOX */}
// //         <ReferralLink link={referralLink} />

// //         {/* 2. QUICK ACTIONS MENU */}
// //         <QuickActions 
// //           onDepositClick={() => {
// //             if (setModalState) {
// //               setModalState(prev => ({ ...prev, showDeposit: true }));
// //             }
// //           }} 
// //         />
       
// //         {/* 3. PACKAGES SECTION */}
// //         <div className="mt-8">
// //             <h2 className="text-2xl font-bold text-gray-800 mb-4 px-2">Investment Packages</h2>
// //             <Packages />
// //         </div>

// //         {/* 4. USER PACKAGES SECTION */}
// //          <div className="mt-8 bg-[#070b14] rounded-2xl overflow-hidden">
// //             <UserPackages />
// //         </div>

// //         {/* 5. LIVE TRADING FEED (SABSE NEECHE) 🚀 */}
// //         <div className="mt-8 rounded-2xl overflow-hidden">
// //             <TradingStatusPanel />
// //         </div>

// //       </div>
// //     </div>
// //   );
// // };

// // export default Dashboard;


// // import React, { useEffect, useState } from "react";
// // import api from "../../api/axios"; 
// // import { useAuth } from "../../context/AuthContext";
// // import { useNavigate } from "react-router-dom"; 

// // // Components Imports
// // import ReferralLink from "../../components/dashboard/ReferralLink"; 
// // import QuickActions from "../../components/dashboard/QuickActions"; 
// // import SpinnerOverlay from "../../components/common/SpinnerOverlay";

// // // Packages component
// // import Packages from "../../components/Packages"; 
// // import UserPackages from "../../pages/user/UserPackages";

// // // Live Trading Feed
// // import TradingStatusPanel from "../../pages/user/TradingStatusPanel"; 

// // // 🚀 NAYA IMPORT: System Deposit History
// // import SystemDepositHistory from "../../pages/user/SystemDepositHistory";

// // const Dashboard = ({ modalState, setModalState }) => {
// //   const { user, token, setUser, logout } = useAuth();
// //   const [loading, setLoading] = useState(false);
// //   const navigate = useNavigate(); 
  
// //   // 🚀 Naya State Stats store karne ke liye
// //   const [stats, setStats] = useState({
// //     totalGrandInvestment: 0,
// //     todayTotalInvestment: 0,
// //   });

// //   const fetchUserData = async () => {
// //     if (!token || !user?.userId) return;
// //     try {
// //       const userRes = await api.get(`/user/${user.userId}`, { 
// //         headers: { Authorization: `Bearer ${token}` } 
// //       });
// //       setUser(userRes.data.user); 
// //     } catch (err) {
// //       console.error("Failed to fetch user data:", err);
// //       if (err?.response?.status === 401) logout();
// //     }
// //   };

// //   // 🚀 Naya Function Stats fetch karne ke liye (Live feed api se)
// //   const fetchStats = async () => {
// //     if (!token) return;
// //     try {
// //       const res = await api.get("/transactions/deposits/live-feed", {
// //         headers: { Authorization: `Bearer ${token}` }
// //       });
// //       if (res.data.stats) {
// //         setStats({
// //           totalGrandInvestment: res.data.stats.totalGrandInvestment || 0,
// //           todayTotalInvestment: res.data.stats.todayTotalInvestment || 0
// //         });
// //       }
// //     } catch (err) {
// //       console.error("Error fetching live stats for dashboard", err);
// //     }
// //   };

// //   useEffect(() => {
// //     if (token && user?.userId) {
// //       fetchUserData();
// //       fetchStats(); 
// //     }
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [user?.userId, token]); 

// //   if (!user || !token) return <SpinnerOverlay />;

// //   const referralLink = `${window.location.origin}/register?ref=${user.userId}`;

// //   return (
// //     <div className="w-full relative animate-fadeIn pb-28 md:pb-8 pt-4">
// //       {loading && <SpinnerOverlay />}

// //       <div className="space-y-6 max-w-4xl mx-auto px-2 sm:px-0">
        
// //         {/* 🚀 NEW: TOP STATS BOXES (Clickable) */}
// //         <div 
// //           className="grid grid-cols-2 gap-3 cursor-pointer hover:scale-[1.01] transition-transform duration-200"
// //           onClick={() => navigate("/system-live-feed")} 
// //         >
// //           {/* Yellow Box - Grand Total */}
// //           {/* <div className="bg-[#d89814] p-4 rounded-xl border border-yellow-600 shadow-lg flex flex-col justify-center">
// //             <h3 className="text-black font-bold text-[10px] sm:text-xs uppercase tracking-wide">
// //               Total Investment
// //             </h3>
// //             <p className="text-lg sm:text-2xl font-extrabold text-black mt-1">
// //               ${stats.totalGrandInvestment.toFixed(2)}
// //             </p>
// //           </div> */}

// //           <div className="bg-[#d89814] p-4 rounded-xl border border-yellow-600 shadow-lg flex flex-col justify-center">
// //     <h3 className="text-black font-bold text-[10px] sm:text-xs uppercase tracking-wide">
// //         Total Investment
// //     </h3>
// //     <p className="text-lg sm:text-2xl font-extrabold text-black mt-1">
// //         ${(2000 + (Number(stats.totalGrandInvestment) || 0)).toFixed(2)}
// //     </p>
// // </div>

// //           {/* Dark Box - Today's Total */}
// //           <div className="bg-[#1c2233] p-4 rounded-xl border border-slate-700 shadow-lg flex flex-col justify-center">
// //             <h3 className="text-slate-400 font-bold text-[10px] sm:text-xs uppercase tracking-wide">
// //               Today's Total Investment
// //             </h3>
// //             <p className="text-lg sm:text-2xl font-bold text-white mt-1">
// //               ${stats.todayTotalInvestment.toFixed(2)}
// //             </p>
// //           </div>
// //         </div>

// //         {/* 1. REFERRAL LINK BOX */}
// //         <ReferralLink link={referralLink} />

// //         {/* 2. QUICK ACTIONS MENU */}
// //         <QuickActions 
// //           onDepositClick={() => {
// //             if (setModalState) {
// //               setModalState(prev => ({ ...prev, showDeposit: true }));
// //             }
// //           }} 
// //         />
       
// //         {/* 3. PACKAGES SECTION */}
// //         <div className="mt-8">
// //             <h2 className="text-2xl font-bold text-gray-800 mb-4 px-2">Investment Packages</h2>
// //             <Packages />
// //         </div>

// //         {/* 4. USER PACKAGES SECTION */}
// //          <div className="mt-8 bg-[#070b14] rounded-2xl overflow-hidden">
// //             <UserPackages />
// //         </div>

// //         {/* 5. LIVE TRADING FEED */}
// //         <div className="mt-8 rounded-2xl overflow-hidden">
// //             <TradingStatusPanel />
// //         </div>

// //         {/* 6. SYSTEM DEPOSIT HISTORY (SABSE NEECHE ADD KIYA) 🚀 */}
// //         <div className="mt-8 rounded-2xl overflow-hidden">
// //             <SystemDepositHistory />
// //         </div>

// //       </div>
// //     </div>
// //   );
// // };

// // export default Dashboard;


































// // import React, { useEffect, useState } from "react";
// // import api from "../../api/axios"; 
// // import { useAuth } from "../../context/AuthContext";
// // import { useNavigate } from "react-router-dom"; 

// // // Components Imports
// // import ReferralLink from "../../components/dashboard/ReferralLink"; 
// // import QuickActions from "../../components/dashboard/QuickActions"; 
// // import SpinnerOverlay from "../../components/common/SpinnerOverlay";
// // // 🚀 NAYA IMPORT: Total Earning Box
// // import TotalEarningBox from "../../components/dashboard/TotalEarningBox"; 

// // // Packages component
// // import Packages from "../../components/Packages"; 
// // import UserPackages from "../../pages/user/UserPackages";

// // // Live Trading Feed
// // import TradingStatusPanel from "../../pages/user/TradingStatusPanel"; 

// // // System Deposit History
// // import SystemDepositHistory from "../../pages/user/SystemDepositHistory";

// // const Dashboard = ({ modalState, setModalState }) => {
// //   const { user, token, setUser, logout } = useAuth();
// //   const [loading, setLoading] = useState(false);
// //   const navigate = useNavigate(); 
  
// //   // 🚀 Naya State Stats store karne ke liye
// //   const [stats, setStats] = useState({
// //     totalGrandInvestment: 0,
// //     todayTotalInvestment: 0,
// //   });

// //   const fetchUserData = async () => {
// //     if (!token || !user?.userId) return;
// //     try {
// //       const userRes = await api.get(`/user/${user.userId}`, { 
// //         headers: { Authorization: `Bearer ${token}` } 
// //       });
// //       setUser(userRes.data.user); 
// //     } catch (err) {
// //       console.error("Failed to fetch user data:", err);
// //       if (err?.response?.status === 401) logout();
// //     }
// //   };

// //   // 🚀 Naya Function Stats fetch karne ke liye (Live feed api se)
// //   const fetchStats = async () => {
// //     if (!token) return;
// //     try {
// //       const res = await api.get("/transactions/deposits/live-feed", {
// //         headers: { Authorization: `Bearer ${token}` }
// //       });
// //       if (res.data.stats) {
// //         setStats({
// //           totalGrandInvestment: res.data.stats.totalGrandInvestment || 0,
// //           todayTotalInvestment: res.data.stats.todayTotalInvestment || 0
// //         });
// //       }
// //     } catch (err) {
// //       console.error("Error fetching live stats for dashboard", err);
// //     }
// //   };

// //   useEffect(() => {
// //     if (token && user?.userId) {
// //       fetchUserData();
// //       fetchStats(); 
// //     }
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [user?.userId, token]); 

// //   if (!user || !token) return <SpinnerOverlay />;

// //   const referralLink = `${window.location.origin}/register?ref=${user.userId}`;

// //   return (
// //     <div className="w-full relative animate-fadeIn pb-28 md:pb-8 pt-4">
// //       {loading && <SpinnerOverlay />}

// //       <div className="space-y-6 max-w-4xl mx-auto px-2 sm:px-0">
        
// //         {/* 🚀 TOP STATS BOXES (Clickable) */}
// //         <div 
// //           className="grid grid-cols-2 gap-3 cursor-pointer hover:scale-[1.01] transition-transform duration-200"
// //           onClick={() => navigate("/system-live-feed")} 
// //         >
// //           {/* Yellow Box - Grand Total */}
// //           <div className="bg-[#d89814] p-4 rounded-xl border border-yellow-600 shadow-lg flex flex-col justify-center">
// //             <h3 className="text-black font-bold text-[10px] sm:text-xs uppercase tracking-wide">
// //                 Total Investment
// //             </h3>
// //             <p className="text-lg sm:text-2xl font-extrabold text-black mt-1">
// //                 ${(2000 + (Number(stats.totalGrandInvestment) || 0)).toFixed(2)}
// //             </p>
// //           </div>

// //           {/* Dark Box - Today's Total */}
// //           <div className="bg-[#1c2233] p-4 rounded-xl border border-slate-700 shadow-lg flex flex-col justify-center">
// //             <h3 className="text-slate-400 font-bold text-[10px] sm:text-xs uppercase tracking-wide">
// //               Today's Total Investment
// //             </h3>
// //             <p className="text-lg sm:text-2xl font-bold text-white mt-1">
// //               ${stats.todayTotalInvestment.toFixed(2)}
// //             </p>
// //           </div>
// //         </div>

// //         {/* 🚀 TOTAL EARNING & WALLET BALANCE BOX */}
// //         <TotalEarningBox user={user} />

// //         {/* 1. REFERRAL LINK BOX */}
// //         <ReferralLink link={referralLink} />

// //         {/* 2. QUICK ACTIONS MENU */}
// //         <QuickActions 
// //           onDepositClick={() => {
// //             if (setModalState) {
// //               setModalState(prev => ({ ...prev, showDeposit: true }));
// //             }
// //           }} 
// //         />
       
// //         {/* 3. PACKAGES SECTION */}
// //         <div className="mt-8">
// //             <h2 className="text-2xl font-bold text-gray-800 mb-4 px-2">Investment Packages</h2>
// //             <Packages />
// //         </div>

// //         {/* 4. USER PACKAGES SECTION */}
// //          <div className="mt-8 bg-[#070b14] rounded-2xl overflow-hidden">
// //             <UserPackages />
// //         </div>

// //         {/* 5. LIVE TRADING FEED */}
// //         <div className="mt-8 rounded-2xl overflow-hidden">
// //             <TradingStatusPanel />
// //         </div>

// //         {/* 6. SYSTEM DEPOSIT HISTORY (SABSE NEECHE ADD KIYA) */}
// //         <div className="mt-8 rounded-2xl overflow-hidden">
// //             <SystemDepositHistory />
// //         </div>

// //       </div>
// //     </div>
// //   );
// // };

// // export default Dashboard;

// // import React, { useEffect, useState } from "react";
// // import api from "../../api/axios"; 
// // import { useAuth } from "../../context/AuthContext";
// // import { useNavigate } from "react-router-dom"; 

// // // Components Imports
// // import ReferralLink from "../../components/dashboard/ReferralLink"; 
// // import QuickActions from "../../components/dashboard/QuickActions"; 
// // import SpinnerOverlay from "../../components/common/SpinnerOverlay";
// // // 🚀 NAYA IMPORT: Total Earning Box
// // import TotalEarningBox from "../../components/dashboard/TotalEarningBox"; 
// // // 🚀 NAYA IMPORT: Monthly Salary Card (Yahan import kiya hai)
// // import MonthlySalaryCard from "../../components/MonthlySalaryCard"; 

// // // Packages component
// // import Packages from "../../components/Packages"; 
// // import UserPackages from "../../pages/user/UserPackages";

// // // Live Trading Feed
// // import TradingStatusPanel from "../../pages/user/TradingStatusPanel"; 

// // // System Deposit History
// // import SystemDepositHistory from "../../pages/user/SystemDepositHistory";

// // const Dashboard = ({ modalState, setModalState }) => {
// //   const { user, token, setUser, logout } = useAuth();
// //   const [loading, setLoading] = useState(false);
// //   const navigate = useNavigate(); 
  
// //   // 🚀 Naya State Stats store karne ke liye
// //   const [stats, setStats] = useState({
// //     totalGrandInvestment: 0,
// //     todayTotalInvestment: 0,
// //   });

// //   const fetchUserData = async () => {
// //     if (!token || !user?.userId) return;
// //     try {
// //       const userRes = await api.get(`/user/${user.userId}`, { 
// //         headers: { Authorization: `Bearer ${token}` } 
// //       });
// //       setUser(userRes.data.user); 
// //     } catch (err) {
// //       console.error("Failed to fetch user data:", err);
// //       if (err?.response?.status === 401) logout();
// //     }
// //   };

// //   // 🚀 Naya Function Stats fetch karne ke liye (Live feed api se)
// //   const fetchStats = async () => {
// //     if (!token) return;
// //     try {
// //       const res = await api.get("/transactions/deposits/live-feed", {
// //         headers: { Authorization: `Bearer ${token}` }
// //       });
// //       if (res.data.stats) {
// //         setStats({
// //           totalGrandInvestment: res.data.stats.totalGrandInvestment || 0,
// //           todayTotalInvestment: res.data.stats.todayTotalInvestment || 0
// //         });
// //       }
// //     } catch (err) {
// //       console.error("Error fetching live stats for dashboard", err);
// //     }
// //   };

// //   useEffect(() => {
// //     if (token && user?.userId) {
// //       fetchUserData();
// //       fetchStats(); 
// //     }
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [user?.userId, token]); 

// //   if (!user || !token) return <SpinnerOverlay />;

// //   const referralLink = `${window.location.origin}/register?ref=${user.userId}`;

// //   return (
// //     <div className="w-full relative animate-fadeIn pb-28 md:pb-8 pt-4">
// //       {loading && <SpinnerOverlay />}

// //       <div className="space-y-6 max-w-4xl mx-auto px-2 sm:px-0">
        
// //         {/* 🚀 TOP STATS BOXES (Clickable) */}
// //         <div 
// //           className="grid grid-cols-2 gap-3 cursor-pointer hover:scale-[1.01] transition-transform duration-200"
// //           onClick={() => navigate("/system-live-feed")} 
// //         >
// //           {/* Yellow Box - Grand Total */}
// //           <div className="bg-[#d89814] p-4 rounded-xl border border-yellow-600 shadow-lg flex flex-col justify-center">
// //             <h3 className="text-black font-bold text-[10px] sm:text-xs uppercase tracking-wide">
// //                 Total Investment
// //             </h3>
// //             <p className="text-lg sm:text-2xl font-extrabold text-black mt-1">
// //                 ${(2000 + (Number(stats.totalGrandInvestment) || 0)).toFixed(2)}
// //             </p>
// //           </div>

// //           {/* Dark Box - Today's Total */}
// //           <div className="bg-[#1c2233] p-4 rounded-xl border border-slate-700 shadow-lg flex flex-col justify-center">
// //             <h3 className="text-slate-400 font-bold text-[10px] sm:text-xs uppercase tracking-wide">
// //               Today's Total Investment
// //             </h3>
// //             <p className="text-lg sm:text-2xl font-bold text-white mt-1">
// //               ${stats.todayTotalInvestment.toFixed(2)}
// //             </p>
// //           </div>
// //         </div>

// //         {/* 🚀 TOTAL EARNING & WALLET BALANCE BOX */}
// //         <TotalEarningBox user={user} />

// //         {/* 🚀 NAYA: MONTHLY SALARY TRACKER BOX (High Visibility) */}
// //         {/* Ise upar rakha hai taaki user sabse pehle apna time left aur target dekhe */}
// //         <div className="mt-2 mb-4">
// //            <MonthlySalaryCard userId={user.userId} />
// //         </div>

// //         {/* 1. REFERRAL LINK BOX */}
// //         <ReferralLink link={referralLink} />

// //         {/* 2. QUICK ACTIONS MENU */}
// //         <QuickActions 
// //           onDepositClick={() => {
// //             if (setModalState) {
// //               setModalState(prev => ({ ...prev, showDeposit: true }));
// //             }
// //           }} 
// //         />
       
// //         {/* 3. PACKAGES SECTION */}
// //         <div className="mt-8">
// //             <h2 className="text-2xl font-bold text-gray-800 mb-4 px-2">Investment Packages</h2>
// //             <Packages />
// //         </div>

// //         {/* 4. USER PACKAGES SECTION */}
// //          <div className="mt-8 bg-[#070b14] rounded-2xl overflow-hidden">
// //             <UserPackages />
// //         </div>

// //         {/* 5. LIVE TRADING FEED */}
// //         <div className="mt-8 rounded-2xl overflow-hidden">
// //             <TradingStatusPanel />
// //         </div>

// //         {/* 6. SYSTEM DEPOSIT HISTORY */}
// //         <div className="mt-8 rounded-2xl overflow-hidden">
// //             <SystemDepositHistory />
// //         </div>

// //       </div>
// //     </div>
// //   );
// // };

// // export default Dashboard;



// // import React, { useEffect, useState } from "react";
// // import api from "../../api/axios"; 
// // import { useAuth } from "../../context/AuthContext";
// // import { useNavigate } from "react-router-dom"; 

// // // Components Imports
// // import ReferralLink from "../../components/dashboard/ReferralLink"; 
// // import QuickActions from "../../components/dashboard/QuickActions"; 
// // import SpinnerOverlay from "../../components/common/SpinnerOverlay";
// // // 🚀 NAYA IMPORT: Total Earning Box
// // import TotalEarningBox from "../../components/dashboard/TotalEarningBox"; 
// // // 🚀 NAYA IMPORT: Monthly Salary Card (Yahan import kiya hai)
// // import MonthlySalaryCard from "../../components/MonthlySalaryCard"; 
// // import UserInfoBoxes from "../../components/dashboard/UserInfoBoxes";
// // // Packages component
// // import Packages from "../../components/Packages"; 
// // import UserPackages from "../../pages/user/UserPackages";

// // // Live Trading Feed
// // import TradingStatusPanel from "../../pages/user/TradingStatusPanel"; 

// // // System Deposit History
// // import SystemDepositHistory from "../../pages/user/SystemDepositHistory";

// // const Dashboard = ({ modalState, setModalState }) => {
// //   const { user, token, setUser, logout } = useAuth();
// //   // Data fetch ho jaane ke baad loading hata denge
// //   const [initialLoad, setInitialLoad] = useState(true);
// //   const navigate = useNavigate(); 
  
// //   // 🚀 Naya State Stats store karne ke liye
// //   const [stats, setStats] = useState({
// //     totalGrandInvestment: 0,
// //     todayTotalInvestment: 0,
// //   });

// //   const fetchUserData = async () => {
// //     if (!token || !user?.userId) return;
// //     try {
// //       const userRes = await api.get(`/user/${user.userId}`, { 
// //         headers: { Authorization: `Bearer ${token}` } 
// //       });
// //       setUser(userRes.data.user); 
// //     } catch (err) {
// //       console.error("Failed to fetch user data:", err);
// //       if (err?.response?.status === 401) logout();
// //     }
// //   };

// //   // 🚀 Naya Function Stats fetch karne ke liye (Live feed api se)
// //   const fetchStats = async () => {
// //     if (!token) return;
// //     try {
// //       const res = await api.get("/transactions/deposits/live-feed", {
// //         headers: { Authorization: `Bearer ${token}` }
// //       });
// //       if (res.data.stats) {
// //         setStats({
// //           totalGrandInvestment: res.data.stats.totalGrandInvestment || 0,
// //           todayTotalInvestment: res.data.stats.todayTotalInvestment || 0
// //         });
// //       }
// //     } catch (err) {
// //       console.error("Error fetching live stats for dashboard", err);
// //     }
// //   };

// //   useEffect(() => {
// //     const loadAllData = async () => {
// //       if (token && user?.userId) {
// //         await Promise.all([fetchUserData(), fetchStats()]);
// //         setInitialLoad(false); // Sirf pehli baar load rokne ke liye
// //       }
// //     };
// //     loadAllData();
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [user?.userId, token]); 

// //   // Agar token hi nahi hai toh seedha spinner dikhao
// //   if (!user || !token) return <SpinnerOverlay />;

// //   const referralLink = `${window.location.origin}/register?ref=${user.userId}`;

// //   return (
// //     <div className="w-full relative animate-fadeIn pb-28 md:pb-8 pt-4">
// //       {/* Agar background me load ho raha ho toh spinner dikhaye */}
// //       {initialLoad && <SpinnerOverlay />}

// //       {/* Main container with standard gap */}
// //       <div className="space-y-4 max-w-4xl mx-auto px-2 sm:px-0">
        

// //         {/* 👇 YAHAN LAGA DIYA NAYA COMPONENT 👇 */}
// //       <UserInfoBoxes />
      
// //         {/* 🚀 TOP STATS BOXES (Clickable) */}
// //         <div 
// //           className="grid grid-cols-2 gap-3 cursor-pointer hover:scale-[1.01] transition-transform duration-200"
// //           onClick={() => navigate("/system-live-feed")} 
// //         >

// //           {/* Yellow Box - Grand Total */}
// //           <div className="bg-[#d89814] p-4 rounded-xl border border-yellow-600 shadow-lg flex flex-col justify-center min-h-[95px]">
// //             <h3 className="text-black font-bold text-[10px] sm:text-xs uppercase tracking-wide">
// //                 Total Investment
// //             </h3>
// //             <p className="text-lg sm:text-2xl font-extrabold text-black mt-1 drop-shadow-md">
// //                 ${(2000 + (Number(stats.totalGrandInvestment) || 0)).toFixed(2)}
// //             </p>
// //           </div>

// //           {/* Dark Box - Today's Total */}
// //           <div className="bg-[#1c2233] p-4 rounded-xl border border-slate-700 shadow-lg flex flex-col justify-center min-h-[95px]">
// //             <h3 className="text-slate-400 font-bold text-[10px] sm:text-xs uppercase tracking-wide">
// //               Today's Total Investment
// //             </h3>
// //             <p className="text-lg sm:text-2xl font-bold text-white mt-1 drop-shadow-md">
// //               ${stats.todayTotalInvestment.toFixed(2)}
// //             </p>
// //           </div>
// //         </div>

// //         {/* 🚀 TOTAL EARNING & WALLET BALANCE BOX */}
// //         {/* Isme component ke andar se bottom margin hataya hai taaki main layout me hi margin adjust ho */}
// //         <TotalEarningBox user={user} />

// //         {/* 🚀 NAYA: MONTHLY SALARY TRACKER BOX (High Visibility) */}
// //         <MonthlySalaryCard userId={user.userId} />

// //         {/* 1. REFERRAL LINK BOX */}
// //         <ReferralLink link={referralLink} />

// //         {/* 2. QUICK ACTIONS MENU */}
// //         <QuickActions 
// //           onDepositClick={() => {
// //             if (setModalState) {
// //               setModalState(prev => ({ ...prev, showDeposit: true }));
// //             }
// //           }} 
// //         />
       
// //         {/* 3. PACKAGES SECTION */}
// //         <div className="mt-8">
// //             <h2 className="text-2xl font-bold text-gray-800 mb-4 px-2">Investment Packages</h2>
// //             <Packages />
// //         </div>

// //         {/* 4. USER PACKAGES SECTION */}
// //          <div className="mt-8 bg-[#070b14] rounded-2xl overflow-hidden shadow-lg">
// //             <UserPackages />
// //         </div>

// //         {/* 5. LIVE TRADING FEED */}
// //         <div className="mt-8 rounded-2xl overflow-hidden shadow-lg">
// //             <TradingStatusPanel />
// //         </div>

// //         {/* 6. SYSTEM DEPOSIT HISTORY */}
// //         <div className="mt-8 rounded-2xl overflow-hidden shadow-lg">
// //             <SystemDepositHistory />
// //         </div>

// //       </div>
// //     </div>
// //   );
// // };

// // export default Dashboard;





















// import React, { useEffect, useState } from "react";
// import api from "../../api/axios"; 
// import { useAuth } from "../../context/AuthContext";
// import { useNavigate } from "react-router-dom"; 

// // Components Imports
// import ReferralLink from "../../components/dashboard/ReferralLink"; 
// import QuickActions from "../../components/dashboard/QuickActions"; 
// import SpinnerOverlay from "../../components/common/SpinnerOverlay";
// import TotalEarningBox from "../../components/dashboard/TotalEarningBox"; 
// import MonthlySalaryCard from "../../components/MonthlySalaryCard"; 
// import UserInfoBoxes from "../../components/dashboard/UserInfoBoxes";
// import Packages from "../../components/Packages"; 
// import UserPackages from "../../pages/user/UserPackages";
// import TradingStatusPanel from "../../pages/user/TradingStatusPanel"; 
// import SystemDepositHistory from "../../pages/user/SystemDepositHistory";

// // 🚀 NAYA IMPORT: Telegram Button (Jisme Popup aur Floating dono hain)
// import TelegramButton from "../../components/TelegramButton"; 

// const Dashboard = ({ modalState, setModalState }) => {
//   const { user, token, setUser, logout } = useAuth();
//   const [initialLoad, setInitialLoad] = useState(true);
//   const navigate = useNavigate(); 
  
//   const [stats, setStats] = useState({
//     totalGrandInvestment: 0,
//     todayTotalInvestment: 0,
//   });

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

//   const fetchStats = async () => {
//     if (!token) return;
//     try {
//       const res = await api.get("/transactions/deposits/live-feed", {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       if (res.data.stats) {
//         setStats({
//           totalGrandInvestment: res.data.stats.totalGrandInvestment || 0,
//           todayTotalInvestment: res.data.stats.todayTotalInvestment || 0
//         });
//       }
//     } catch (err) {
//       console.error("Error fetching live stats for dashboard", err);
//     }
//   };

//   useEffect(() => {
//     const loadAllData = async () => {
//       if (token && user?.userId) {
//         await Promise.all([fetchUserData(), fetchStats()]);
//         setInitialLoad(false); 
//       }
//     };
//     loadAllData();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [user?.userId, token]); 

//   if (!user || !token) return <SpinnerOverlay />;

//   const referralLink = `${window.location.origin}/register?ref=${user.userId}`;

//   return (
//     <div className="w-full relative animate-fadeIn pb-28 md:pb-8 pt-4">
//       {initialLoad && <SpinnerOverlay />}

//       <div className="space-y-4 max-w-4xl mx-auto px-2 sm:px-0">
        
//         <UserInfoBoxes />
      
//         <div 
//           className="grid grid-cols-2 gap-3 cursor-pointer hover:scale-[1.01] transition-transform duration-200"
//           onClick={() => navigate("/system-live-feed")} 
//         >
//           <div className="bg-[#d89814] p-4 rounded-xl border border-yellow-600 shadow-lg flex flex-col justify-center min-h-[95px]">
//             <h3 className="text-black font-bold text-[10px] sm:text-xs uppercase tracking-wide">
//                 Total Investment
//             </h3>
//             <p className="text-lg sm:text-2xl font-extrabold text-black mt-1 drop-shadow-md">
//                 ${(2000 + (Number(stats.totalGrandInvestment) || 0)).toFixed(2)}
//             </p>
//           </div>

//           <div className="bg-[#1c2233] p-4 rounded-xl border border-slate-700 shadow-lg flex flex-col justify-center min-h-[95px]">
//             <h3 className="text-slate-400 font-bold text-[10px] sm:text-xs uppercase tracking-wide">
//               Today's Total Investment
//             </h3>
//             <p className="text-lg sm:text-2xl font-bold text-white mt-1 drop-shadow-md">
//               ${stats.todayTotalInvestment.toFixed(2)}
//             </p>
//           </div>
//         </div>

//         <TotalEarningBox user={user} />
//         <MonthlySalaryCard userId={user.userId} />
//         <ReferralLink link={referralLink} />

//         <QuickActions 
//           onDepositClick={() => {
//             if (setModalState) {
//               setModalState(prev => ({ ...prev, showDeposit: true }));
//             }
//           }} 
//         />
       
//         <div className="mt-8">
//             <h2 className="text-2xl font-bold text-gray-800 mb-4 px-2">Investment Packages</h2>
//             <Packages />
//         </div>

//          <div className="mt-8 bg-[#070b14] rounded-2xl overflow-hidden shadow-lg">
//             <UserPackages />
//         </div>

//         <div className="mt-8 rounded-2xl overflow-hidden shadow-lg">
//             <TradingStatusPanel />
//         </div>

//         <div className="mt-8 rounded-2xl overflow-hidden shadow-lg">
//             <SystemDepositHistory />
//         </div>

//       </div>

//       {/* 🚀 TELEGRAM POPUP AUR FLOATING BUTTON YAHAN ADD KIYA HAI */}
//       <TelegramButton />
      
//     </div>
//   );
// };

// export default Dashboard;




// import React, { useEffect, useState } from "react";
// import api from "../../api/axios"; 
// import { useAuth } from "../../context/AuthContext";
// import { useNavigate } from "react-router-dom"; 

// // Components Imports
// import ReferralLink from "../../components/dashboard/ReferralLink"; 
// import QuickActions from "../../components/dashboard/QuickActions"; 
// import SpinnerOverlay from "../../components/common/SpinnerOverlay";
// import TotalEarningBox from "../../components/dashboard/TotalEarningBox"; 
// import MonthlySalaryCard from "../../components/MonthlySalaryCard"; 
// import UserInfoBoxes from "../../components/dashboard/UserInfoBoxes";
// import Packages from "../../components/Packages"; 
// import UserPackages from "../../pages/user/UserPackages";
// import TradingStatusPanel from "../../pages/user/TradingStatusPanel"; 
// import SystemDepositHistory from "../../pages/user/SystemDepositHistory";

// // 🚀 Salary Achievers component import kiya hai
// import SalaryAchievers from "../../pages/user/SalaryAchievers"; 

// // 🚀 Telegram Button Import
// import TelegramButton from "../../components/TelegramButton"; 

// const Dashboard = ({ modalState, setModalState }) => {
//   const { user, token, setUser, logout } = useAuth();
//   const [initialLoad, setInitialLoad] = useState(true);
//   const navigate = useNavigate(); 
  
//   const [stats, setStats] = useState({
//     totalGrandInvestment: 0,
//     todayTotalInvestment: 0,
//   });

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

//   const fetchStats = async () => {
//     if (!token) return;
//     try {
//       const res = await api.get("/transactions/deposits/live-feed", {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       if (res.data.stats) {
//         setStats({
//           totalGrandInvestment: res.data.stats.totalGrandInvestment || 0,
//           todayTotalInvestment: res.data.stats.todayTotalInvestment || 0
//         });
//       }
//     } catch (err) {
//       console.error("Error fetching live stats for dashboard", err);
//     }
//   };

//   useEffect(() => {
//     const loadAllData = async () => {
//       if (token && user?.userId) {
//         await Promise.all([fetchUserData(), fetchStats()]);
//         setInitialLoad(false); 
//       }
//     };
//     loadAllData();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [user?.userId, token]); 

//   if (!user || !token) return <SpinnerOverlay />;

//   const referralLink = `${window.location.origin}/register?ref=${user.userId}`;

//   return (
//     <div className="w-full relative animate-fadeIn pb-28 md:pb-8 pt-4">
//       {initialLoad && <SpinnerOverlay />}

//       <div className="space-y-4 max-w-4xl mx-auto px-2 sm:px-0">
        
//         <UserInfoBoxes />
      
//         <div 
//           className="grid grid-cols-2 gap-3 cursor-pointer hover:scale-[1.01] transition-transform duration-200"
//           onClick={() => navigate("/system-live-feed")} 
//         >
//           <div className="bg-[#d89814] p-4 rounded-xl border border-yellow-600 shadow-lg flex flex-col justify-center min-h-[95px]">
//             <h3 className="text-black font-bold text-[10px] sm:text-xs uppercase tracking-wide">
//                 Total Investment
//             </h3>
//             <p className="text-lg sm:text-2xl font-extrabold text-black mt-1 drop-shadow-md">
//                 ${(2000 + (Number(stats.totalGrandInvestment) || 0)).toFixed(2)}
//             </p>
//           </div>

//           <div className="bg-[#1c2233] p-4 rounded-xl border border-slate-700 shadow-lg flex flex-col justify-center min-h-[95px]">
//             <h3 className="text-slate-400 font-bold text-[10px] sm:text-xs uppercase tracking-wide">
//               Today's Total Investment
//             </h3>
//             <p className="text-lg sm:text-2xl font-bold text-white mt-1 drop-shadow-md">
//               ${stats.todayTotalInvestment.toFixed(2)}
//             </p>
//           </div>
//         </div>

//         <TotalEarningBox user={user} />
//         <MonthlySalaryCard userId={user.userId} />
//         <ReferralLink link={referralLink} />

//         <QuickActions 
//           onDepositClick={() => {
//             if (setModalState) {
//               setModalState(prev => ({ ...prev, showDeposit: true }));
//             }
//           }} 
//         />
       
//         <div className="mt-8">
//             <h2 className="text-2xl font-bold text-gray-800 mb-4 px-2">Investment Packages</h2>
//             <Packages />
//         </div>

//          <div className="mt-8 bg-[#070b14] rounded-2xl overflow-hidden shadow-lg">
//             <UserPackages />
//         </div>

//         <div className="mt-8 rounded-2xl overflow-hidden shadow-lg">
//             <TradingStatusPanel />
//         </div>

//         {/* 1. SystemDepositHistory apni jagah bilkul safe hai */}
//         <div className="mt-8 rounded-2xl overflow-hidden shadow-lg">
//             <SystemDepositHistory />
//         </div>

//         {/* 2. Uske theek neechye Salary Achievers add kar diya hai */}
//         <div className="mt-8 rounded-2xl overflow-hidden shadow-lg">
//             <SalaryAchievers />
//         </div>

//       </div>

//       {/* Telegram Button */}
//       <TelegramButton />
      
//     </div>
//   );
// };

// export default Dashboard;

import React, { useEffect, useState } from "react";
import api from "../../api/axios"; 
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom"; 

// Components Imports
import ReferralLink from "../../components/dashboard/ReferralLink"; 
import QuickActions from "../../components/dashboard/QuickActions"; 
import SpinnerOverlay from "../../components/common/SpinnerOverlay";
import TotalEarningBox from "../../components/dashboard/TotalEarningBox"; 
import MonthlySalaryCard from "../../components/MonthlySalaryCard"; 
import UserInfoBoxes from "../../components/dashboard/UserInfoBoxes";
import Packages from "../../components/Packages"; 
import UserPackages from "../../pages/user/UserPackages";
import TradingStatusPanel from "../../pages/user/TradingStatusPanel"; 
import SystemDepositHistory from "../../pages/user/SystemDepositHistory";
import SalaryAchievers from "../../pages/user/SalaryAchievers"; 
//import TelegramButton from "../../components/TelegramButton"; 

const Dashboard = ({ modalState, setModalState }) => {
  const { user, token, setUser, logout } = useAuth();
  const [initialLoad, setInitialLoad] = useState(true);
  const navigate = useNavigate(); 
  
  const [stats, setStats] = useState({
    totalGrandInvestment: 0,
    todayTotalInvestment: 0,
  });

  // 🚀 FETCH DATA & SAVE TO CACHE
  const fetchUserData = async () => {
    if (!token || !user?.userId) return;
    try {
      const userRes = await api.get(`/user/${user.userId}`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      const fetchedUser = userRes.data.user;
      setUser(fetchedUser); 
      // Save to Cache
      sessionStorage.setItem(`dash_user_${user.userId}`, JSON.stringify(fetchedUser));
    } catch (err) {
      console.error("Failed to fetch user data:", err);
      if (err?.response?.status === 401) logout();
    }
  };

  const fetchStats = async () => {
    if (!token) return;
    try {
      const res = await api.get("/transactions/deposits/live-feed", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.stats) {
        const newStats = {
          totalGrandInvestment: res.data.stats.totalGrandInvestment || 0,
          todayTotalInvestment: res.data.stats.todayTotalInvestment || 0
        };
        setStats(newStats);
        // Save to Cache
        sessionStorage.setItem('dash_stats', JSON.stringify(newStats));
      }
    } catch (err) {
      console.error("Error fetching live stats for dashboard", err);
    }
  };

  // 🚀 FAST CACHE LOAD LOGIC
  useEffect(() => {
    if (token && user?.userId) {
      const cachedUser = sessionStorage.getItem(`dash_user_${user.userId}`);
      const cachedStats = sessionStorage.getItem('dash_stats');
      
      // Agar cache me data hai, toh turant bina ghoome dikha do
      if (cachedUser && cachedStats) {
        setUser(JSON.parse(cachedUser));
        setStats(JSON.parse(cachedStats));
        setInitialLoad(false); 
      }

      // Background me chup-chap naya data le aao (Silent Update)
      Promise.all([fetchUserData(), fetchStats()]).finally(() => {
        setInitialLoad(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.userId, token]); 

  // Agar user nahi hai tabhi spinner dikhega
  if (!user || !token) return <SpinnerOverlay />;

  const referralLink = `${window.location.origin}/register?ref=${user.userId}`;

  return (
    <div className="w-full relative animate-fadeIn pb-28 md:pb-8 pt-4">
      {/* Ab ye spinner sirf tab aayega jab pehli baar bina cache ke load hoga */}
      {initialLoad && <SpinnerOverlay />}

      <div className="space-y-4 max-w-4xl mx-auto px-2 sm:px-0">
        
        <UserInfoBoxes />
      
        <div 
          className="grid grid-cols-2 gap-3 cursor-pointer hover:scale-[1.01] transition-transform duration-200"
          onClick={() => navigate("/system-live-feed")} 
        >
          <div className="bg-[#d89814] p-4 rounded-xl border border-yellow-600 shadow-lg flex flex-col justify-center min-h-[95px]">
            <h3 className="text-black font-bold text-[10px] sm:text-xs uppercase tracking-wide">
                Total Investment
            </h3>
            <p className="text-lg sm:text-2xl font-extrabold text-black mt-1 drop-shadow-md">
                ${(2000 + (Number(stats.totalGrandInvestment) || 0)).toFixed(2)}
            </p>
          </div>

          <div className="bg-[#1c2233] p-4 rounded-xl border border-slate-700 shadow-lg flex flex-col justify-center min-h-[95px]">
            <h3 className="text-slate-400 font-bold text-[10px] sm:text-xs uppercase tracking-wide">
              Today's Total Investment
            </h3>
            <p className="text-lg sm:text-2xl font-bold text-white mt-1 drop-shadow-md">
              ${stats.todayTotalInvestment.toFixed(2)}
            </p>
          </div>
        </div>

        <TotalEarningBox user={user} />
        <MonthlySalaryCard userId={user.userId} />
        <ReferralLink link={referralLink} />

        <QuickActions 
          onDepositClick={() => {
            if (setModalState) {
              setModalState(prev => ({ ...prev, showDeposit: true }));
            }
          }} 
        />
       
        <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 px-2">Investment Packages</h2>
            <Packages />
        </div>

         <div className="mt-8 bg-[#070b14] rounded-2xl overflow-hidden shadow-lg">
            <UserPackages />
        </div>

        <div className="mt-8 rounded-2xl overflow-hidden shadow-lg">
            <TradingStatusPanel />
        </div>

        <div className="mt-8 rounded-2xl overflow-hidden shadow-lg">
            <SystemDepositHistory />
        </div>

        <div className="mt-8 rounded-2xl overflow-hidden shadow-lg">
            <SalaryAchievers />
        </div>

      </div>

      {/* <TelegramButton /> */}
      
    </div>
  );
};

export default Dashboard;