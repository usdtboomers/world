 

// import React, { useEffect, useState } from "react";
// import api from "../../api/axios"; 
// import { useAuth } from "../../context/AuthContext";

// // Components Imports
// import ReferralLink from "../../components/dashboard/ReferralLink"; 
// import QuickActions from "../../components/dashboard/QuickActions"; 
// import SpinnerOverlay from "../../components/common/SpinnerOverlay";

// // 🔥 Packages component ko yahan import kar liya hai
// import Packages from "../../components/Packages"; 
// import UserPackages from "../../pages/user/UserPackages";
// // 🔥 props me { modalState, setModalState } add kar diya hai
// const Dashboard = ({ modalState, setModalState }) => {
//   const { user, token, setUser, logout } = useAuth();
//   const [loading, setLoading] = useState(false);

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

//   useEffect(() => {
//     if (token && user?.userId) {
//       fetchUserData();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [user?.userId, token]); 

//   if (!user || !token) return <SpinnerOverlay />;

//   const referralLink = `${window.location.origin}/register?ref=${user.userId}`;

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
       

//         {/* 3. PACKAGES SECTION 🔥 Yahan dashboard me packages render honge */}
//         <div className="mt-8">
//             <h2 className="text-2xl font-bold text-gray-800 mb-4 px-2">Investment Packages</h2>
//             <Packages />
//         </div>



//          <div className="mt-8 bg-[#070b14] rounded-2xl overflow-hidden">
//             {/* Naya component yahan call hoga */}
//             <UserPackages />
//         </div>

//       </div>
//     </div>
//   );
// };

// export default Dashboard;


import React, { useEffect, useState } from "react";
import api from "../../api/axios"; 
import { useAuth } from "../../context/AuthContext";

// Components Imports
import ReferralLink from "../../components/dashboard/ReferralLink"; 
import QuickActions from "../../components/dashboard/QuickActions"; 
import SpinnerOverlay from "../../components/common/SpinnerOverlay";

// 🔥 Packages component ko yahan import kar liya hai
import Packages from "../../components/Packages"; 
import UserPackages from "../../pages/user/UserPackages";

// 🚀 Naya Import: TradingStatusPanel ko yahan add kiya
import TradingStatusPanel from "../../pages/user/TradingStatusPanel"; 

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
       
        {/* 3. PACKAGES SECTION */}
        <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 px-2">Investment Packages</h2>
            <Packages />
        </div>

        {/* 4. USER PACKAGES SECTION */}
         <div className="mt-8 bg-[#070b14] rounded-2xl overflow-hidden">
            <UserPackages />
        </div>

        {/* 5. LIVE TRADING FEED (SABSE NEECHE) 🚀 */}
        {/* <div className="mt-8 rounded-2xl overflow-hidden">
            <TradingStatusPanel />
        </div> */}

      </div>
    </div>
  );
};

export default Dashboard;