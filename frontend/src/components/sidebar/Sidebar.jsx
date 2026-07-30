// import React, { useState, useEffect } from "react";
// import api from "../../api/axios";
// import { useNavigate, useLocation, Link } from "react-router-dom"; 
// import { Home, Wallet, Banknote, History, Users, UserCircle2, HelpCircle, BadgeDollarSign, BarChart, Zap, Coins } from "lucide-react";
// import { useAuth } from "../../context/AuthContext";

// const SidebarItem = ({ label, icon: Icon, active, onClick, badge, path }) => {
//   const content = (
//     <>
//       <Icon size={20} className={active ? "text-[#d4af37]" : "text-gray-400"} />
//       <span className="font-semibold tracking-wide whitespace-nowrap">{label}</span>
//       {badge > 0 && (
//         <span className="absolute top-1/2 -translate-y-1/2 right-3 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full shadow-md font-bold">
//           {badge}
//         </span>
//       )}
//     </>
//   );

//   // 🔥 UPDATE: Dark Theme styling with Gold Accents
//   const className = `relative flex items-center gap-3 px-4 py-3.5 cursor-pointer font-medium text-sm transition-all duration-300 border-l-4 ${
//     active 
//       ? "bg-white/10 border-[#d4af37] text-[#d4af37] shadow-sm" 
//       : "border-transparent text-gray-300 hover:text-[#d4af37] hover:bg-white/5"
//   }`;

//   if (path && path !== "#") {
//     return <Link to={path} onClick={onClick} className={className}>{content}</Link>;
//   }
//   return <div onClick={onClick} className={className}>{content}</div>;
// };

// const Sidebar = ({ user, isOpen, setIsOpen }) => { 
//   const location = useLocation();
//   const [notifCount, setNotifCount] = useState(0);
//   const { logout } = useAuth();

//   useEffect(() => {
//     const fetchNotifCount = async () => {
//       if (!user?.userId) return;
//       try {
//         const res = await api.get(`/admin/notifications/count/${user.userId}?t=${new Date().getTime()}`);
//         setNotifCount(res.data.count || 0);
//       } catch (err) {
//         console.log("Notification error", err);
//       }
//     };
//     fetchNotifCount();
//     const interval = setInterval(fetchNotifCount, 15000);
//     return () => clearInterval(interval);
//   }, [user?.userId]);

//   useEffect(() => {
//     if (window.innerWidth < 1024) {
//       document.body.style.overflow = isOpen ? "hidden" : "auto";
//     }
//   }, [isOpen]);

//   // 🔥 UPDATE: Menu Items according to WORLD FINANCE PDF
//   const menuItems = [
//     { label: "Dashboard", icon: Home, path: "/dashboard" },
//     { label: "My Profile", icon: UserCircle2, path: "/profile" },
//     { label: "Deposit / Top-Up", icon: Zap, path: "/topup" },
//     { label: "Deposit History", icon: History, path: "/deposit-history" },
//     { label: "Direct Team", icon: Users, path: "/direct-team" },
//     { label: "Level Team (2-12)", icon: Users, path: "/level-team" },
    
//     // Incomes from PDF
//     { label: "Daily ROI Income", icon: BarChart, path: "/roi-income" },
//     { label: "Direct Income", icon: BadgeDollarSign, path: "/direct-income" },
//     { label: "Daily Level Income", icon: Coins, path: "/level-income" },
//     { label: "Monthly Salary", icon: Wallet, path: "/salary-income" },
    
//     { label: "Withdrawals", icon: Banknote, path: "/withdrawals" },
//     { label: "Help & Support", icon: HelpCircle, path: "/support" },
//   ];

//   return (
//     <>
//       {/* Background Overlay */}
//       {isOpen && (
//         <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] lg:hidden" />
//       )}

//       {/* 🔥 UPDATE: Right side slide animation & Dark background */}
//       <aside className={`fixed top-16 md:top-16 right-0 h-[calc(100vh-4rem)] z-[60] bg-[#0a0f1c] border-l border-[#1f2937] overflow-hidden transition-transform duration-300 ease-in-out shadow-2xl ${
//         isOpen ? "translate-x-0 w-64" : "translate-x-full w-0 lg:w-64 lg:translate-x-0"
//       }`}>
        
//         <div className="w-64 h-full overflow-y-auto custom-scroll pb-24 pt-2">
//           <nav className="space-y-1">
//             <style>{`
//               .custom-scroll::-webkit-scrollbar { width: 4px; }
//               .custom-scroll::-webkit-scrollbar-thumb { background: #374151; border-radius: 10px; }
//               .custom-scroll::-webkit-scrollbar-thumb:hover { background: #d4af37; }
//             `}</style>
            
//             {menuItems.map((item, index) => (
//               <SidebarItem
//                 key={index} label={item.label} icon={item.icon} badge={item.badge} path={item.path} 
//                 active={location.pathname === item.path}
//                 onClick={() => {
//                   if (item.onClick) item.onClick();
//                   if (window.innerWidth < 1024) setIsOpen(false); 
//                 }}
//               />
//             ))}
//           </nav>
//         </div>
        
//       </aside>
//     </>
//   );
// };

// export default Sidebar;

import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { useNavigate, useLocation, Link } from "react-router-dom"; 
import { Home, Wallet, Banknote, History, Users, UserCircle2, HelpCircle, BadgeDollarSign, BarChart, Zap, Coins } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const SidebarItem = ({ label, icon: Icon, active, onClick, badge, path }) => {
  const content = (
    <>
      <Icon size={20} className={active ? "text-[#d4af37]" : "text-gray-400"} />
      <span className="font-semibold tracking-wide whitespace-nowrap">{label}</span>
      {badge > 0 && (
        <span className="absolute top-1/2 -translate-y-1/2 right-3 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full shadow-md font-bold">
          {badge}
        </span>
      )}
    </>
  );

  // Dark Theme styling with Gold Accents
  const className = `relative flex items-center gap-3 px-4 py-3.5 cursor-pointer font-medium text-sm transition-all duration-300 border-l-4 ${
    active 
      ? "bg-white/10 border-[#d4af37] text-[#d4af37] shadow-sm" 
      : "border-transparent text-gray-300 hover:text-[#d4af37] hover:bg-white/5"
  }`;

  if (path && path !== "#") {
    return <Link to={path} onClick={onClick} className={className}>{content}</Link>;
  }
  return <div onClick={onClick} className={className}>{content}</div>;
};

const Sidebar = ({ user, isOpen, setIsOpen }) => { 
  const location = useLocation();
  const [notifCount, setNotifCount] = useState(0);
  const { logout } = useAuth();

  // 🔥 TEMPORARY HIDE SWITCH: Grand Launch tak isko 'true' rakhiye
  // Jab platform live karna ho, tab isko 'false' kar dena
  const HIDE_SIDEBAR_FOR_NOW = true;

  useEffect(() => {
    const fetchNotifCount = async () => {
      if (!user?.userId) return;
      try {
        const res = await api.get(`/admin/notifications/count/${user.userId}?t=${new Date().getTime()}`);
        setNotifCount(res.data.count || 0);
      } catch (err) {
        console.log("Notification error", err);
      }
    };
    fetchNotifCount();
    const interval = setInterval(fetchNotifCount, 15000);
    return () => clearInterval(interval);
  }, [user?.userId]);

  useEffect(() => {
    if (window.innerWidth < 1024) {
      document.body.style.overflow = isOpen ? "hidden" : "auto";
    }
  }, [isOpen]);

  // 🔥 Agar switch true hai, toh component yahi se 'null' return kar dega aur kuch bhi dikhayega nahi
  if (HIDE_SIDEBAR_FOR_NOW) {
    return null;
  }

  // Menu Items according to WORLD FINANCE PDF
  const menuItems = [
    { label: "Dashboard", icon: Home, path: "/dashboard" },
    { label: "My Profile", icon: UserCircle2, path: "/profile" },
    { label: "Deposit / Top-Up", icon: Zap, path: "/topup" },
    { label: "Deposit History", icon: History, path: "/deposit-history" },
    { label: "Direct Team", icon: Users, path: "/direct-team" },
    { label: "Level Team (2-12)", icon: Users, path: "/level-team" },
    
    // Incomes from PDF
    { label: "Daily ROI Income", icon: BarChart, path: "/roi-income" },
    { label: "Direct Income", icon: BadgeDollarSign, path: "/direct-income" },
    { label: "Daily Level Income", icon: Coins, path: "/level-income" },
    { label: "Monthly Salary", icon: Wallet, path: "/salary-income" },
    
    { label: "Withdrawals", icon: Banknote, path: "/withdrawals" },
    { label: "Help & Support", icon: HelpCircle, path: "/support" },
  ];

  return (
    <>
      {/* Background Overlay */}
      {isOpen && (
        <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] lg:hidden" />
      )}

      {/* Right side slide animation & Dark background */}
      <aside className={`fixed top-16 md:top-16 right-0 h-[calc(100vh-4rem)] z-[60] bg-[#0a0f1c] border-l border-[#1f2937] overflow-hidden transition-transform duration-300 ease-in-out shadow-2xl ${
        isOpen ? "translate-x-0 w-64" : "translate-x-full w-0 lg:w-64 lg:translate-x-0"
      }`}>
        
        <div className="w-64 h-full overflow-y-auto custom-scroll pb-24 pt-2">
          <nav className="space-y-1">
            <style>{`
              .custom-scroll::-webkit-scrollbar { width: 4px; }
              .custom-scroll::-webkit-scrollbar-thumb { background: #374151; border-radius: 10px; }
              .custom-scroll::-webkit-scrollbar-thumb:hover { background: #d4af37; }
            `}</style>
            
            {menuItems.map((item, index) => (
              <SidebarItem
                key={index} label={item.label} icon={item.icon} badge={item.badge} path={item.path} 
                active={location.pathname === item.path}
                onClick={() => {
                  if (item.onClick) item.onClick();
                  if (window.innerWidth < 1024) setIsOpen(false); 
                }}
              />
            ))}
          </nav>
        </div>
        
      </aside>
    </>
  );
};

export default Sidebar;