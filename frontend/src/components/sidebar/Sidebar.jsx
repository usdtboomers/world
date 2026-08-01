import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { useNavigate, useLocation, Link } from "react-router-dom"; 
import { 
  Home, Wallet, Banknote, History, Users, UserCircle2, 
  HelpCircle, BadgeDollarSign, BarChart, Zap, Coins, LogOut, Box 
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const SidebarItem = ({ label, icon: Icon, active, onClick, badge, path }) => {
  const content = (
    <>
      <Icon size={18} className={`transition-colors duration-300 ${active ? "text-[#eab308]" : "text-gray-400 group-hover:text-[#eab308]"}`} />
      <span className="font-semibold tracking-wide whitespace-nowrap">{label}</span>
      
      {badge > 0 && (
        <span className="absolute top-1/2 -translate-y-1/2 right-3 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full shadow-md font-bold">
          {badge}
        </span>
      )}
    </>
  );

  // 🔥 UPDATE: Dark Theme styling with Gold Accents & Rounded UI
  const className = `group relative flex items-center gap-3 px-4 py-3 mx-3 my-1 cursor-pointer font-medium text-sm transition-all duration-300 rounded-xl ${
    active 
      ? "bg-[#eab308]/10 text-[#eab308] shadow-[inset_4px_0_0_0_#eab308]" 
      : "text-gray-400 hover:text-white hover:bg-white/5"
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
  const navigate = useNavigate();

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

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // 🔥 UPDATE: Grouped Menu Items for a cleaner professional look
  const menuGroups = [
    {
      title: "Main Menu",
      items: [
        { label: "Dashboard", icon: Home, path: "/dashboard" },
        { label: "My Profile", icon: UserCircle2, path: "/profile" },
        { label: "Package Details", icon: Zap, path: "/topup-details" },
        { label: "My Packages", icon: Box, path: "/my-packages" },
      ]
    },
    {
      title: "Network & History",
      items: [
        { label: "Deposit History", icon: History, path: "/deposit-history" },
        { label: "Direct Team", icon: Users, path: "/direct-team" },
        { label: "Level Team", icon: Users, path: "/all-team" },
      ]
    },
    {
      title: "Income Reports",
      items: [
        { label: "Daily ROI Income", icon: BarChart, path: "/roi-income" },
        { label: "Direct Income", icon: BadgeDollarSign, path: "/direct-income" },
        { label: "Daily Level Income", icon: Coins, path: "/level-income" },
        { label: "Monthly Salary", icon: Wallet, path: "/salary-income" },
      ]
    },
    {
      title: "Financials & Support",
      items: [
        { label: "Withdrawals", icon: Banknote, path: "/withdrawals" },
        { label: "Support and Raise Ticket", icon: HelpCircle, path: "/support" },
      ]
    }
  ];

  return (
    <>
      {/* Background Overlay for Mobile */}
      {isOpen && (
        <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] lg:hidden" />
      )}

      {/* Sidebar Container */}
      <aside className={`fixed top-16 md:top-16 right-0 h-[calc(100vh-4rem)] z-[60] bg-[#131c31] border-l border-gray-800 overflow-hidden transition-transform duration-300 ease-in-out shadow-2xl flex flex-col ${
        isOpen ? "translate-x-0 w-64" : "translate-x-full w-0 lg:w-64 lg:translate-x-0"
      }`}>
        
        {/* Scrollable Menu Section */}
        <div className="flex-1 overflow-y-auto custom-scroll py-4">
          <style>{`
            .custom-scroll::-webkit-scrollbar { width: 4px; }
            .custom-scroll::-webkit-scrollbar-thumb { background: #374151; border-radius: 10px; }
            .custom-scroll::-webkit-scrollbar-thumb:hover { background: #eab308; }
          `}</style>
          
          <nav className="flex flex-col gap-6">
            {menuGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                {/* Group Title */}
                <h3 className="px-6 mb-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
                  {group.title}
                </h3>
                
                {/* Group Items */}
                <div className="space-y-0.5">
                  {group.items.map((item, index) => (
                    <SidebarItem
                      key={index} 
                      label={item.label} 
                      icon={item.icon} 
                      badge={item.badge} 
                      path={item.path} 
                      active={location.pathname === item.path}
                      onClick={() => {
                        if (item.onClick) item.onClick();
                        if (window.innerWidth < 1024) setIsOpen(false); 
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* 🔥 Sticky Logout Button at Bottom */}
        <div className="p-4 border-t border-gray-800 bg-[#0b1221]">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300 text-red-400 bg-red-500/10 hover:bg-red-500 hover:text-white hover:shadow-lg hover:shadow-red-500/20"
          >
            <LogOut size={18} />
            <span>Logout Account</span>
          </button>
        </div>
        
      </aside>
    </>
  );
};

export default Sidebar;