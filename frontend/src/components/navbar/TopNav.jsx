// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import { Menu, LogOut } from "lucide-react";

// const TopNav = ({ onHamburgerClick }) => {
//   const navigate = useNavigate();
//   const { logout } = useAuth();

//   // Dashboard pe le jayega aur page ko top par scroll karega
//   const handleLogoClick = () => {
//     navigate("/dashboard");
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   return (
//     <header className="fixed top-0 left-0 w-full bg-[#0a0f1c] shadow-md z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16 md:h-16">
          
//           {/* 1. Left Section: Brand Name Only (Logo Removed) */}
//           <div 
//             className="cursor-pointer flex items-center"
//             onClick={handleLogoClick}
//           >
//             <span className="text-[1.2rem] md:text-2xl font-black tracking-wider uppercase text-[#d4af37] whitespace-nowrap">
// World Finance            </span>
//           </div>

//           {/* 2. Right Section: Logout & Hamburger */}
//           <div className="flex items-center gap-4">
            
//             {/* Blue Logout Icon matching image */}
//             <button
//               onClick={logout}
//               className="flex items-center text-[#0ea5e9] hover:text-[#38bdf8] transition-all active:scale-95"
//             >
//               <LogOut size={24} strokeWidth={2.5} />
//             </button>

//             {/* Gold Hamburger Icon */}
//             <button 
//               onClick={onHamburgerClick} 
//               className="text-[#d4af37] hover:bg-white/10 p-1 rounded-md transition-all active:scale-95 cursor-pointer"
//             >
//               <Menu size={28} strokeWidth={2.5} />
//             </button>

//           </div>

//         </div>
//       </div>
//     </header>
//   );
// };

// export default TopNav;


import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
// 🔥 Copy aur Check icon bhi import kar liye
import { Menu, LogOut, UserCircle, Copy, Check } from "lucide-react"; 

const TopNav = ({ onHamburgerClick }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); 
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [copied, setCopied] = useState(false); // 🔥 Copy feedback ke liye state
  const profileRef = useRef(null);

  const handleLogoClick = () => {
    navigate("/dashboard");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const joinDate = user?.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-')
    : 'N/A';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 🔥 ID Copy karne ka function
  const handleCopyId = () => {
    if (user?.userId) {
      navigator.clipboard.writeText(user.userId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // 2 second baad wapas copy icon dikhega
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-[#0a0f1c] shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-16">
          
          <div 
            className="cursor-pointer flex items-center"
            onClick={handleLogoClick}
          >
            <span className="text-[1.2rem] md:text-2xl font-black tracking-wider uppercase text-[#d4af37] whitespace-nowrap">
              World Finance
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="text-[#d4af37] hover:text-[#fde047] hover:bg-white/10 p-1.5 rounded-full transition-all active:scale-95 flex items-center justify-center"
                title="Profile"
              >
                <UserCircle size={28} strokeWidth={2} />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-56 sm:w-64 bg-[#131c31] border border-gray-700 rounded-xl shadow-2xl p-4 z-50 transition-all duration-200 origin-top-right">
                  
                  <div className="absolute -top-2 right-3 w-4 h-4 bg-[#131c31] border-t border-l border-gray-700 transform rotate-45"></div>

                  <div className="relative z-10">
                    
                    <div className="border-b border-gray-700 pb-2 mb-2">
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-0.5">My Name</p>
                      <p className="text-white font-bold text-sm capitalize truncate">{user?.name || 'N/A'}</p>
                    </div>
                    
                    {/* 🔥 User ID Box with Copy Button (Hash Hata Diya) */}
                    <div className="border-b border-gray-700 pb-2 mb-2">
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-0.5">User ID</p>
                      <div className="flex justify-between items-center bg-[#0a0f1c] px-2 py-1.5 rounded-md mt-1">
                        <p className="text-[#eab308] font-bold text-sm">{user?.userId || 'N/A'}</p>
                        
                        {user?.userId && (
                          <button 
                            onClick={handleCopyId} 
                            className="text-gray-400 hover:text-white transition-colors p-1"
                            title="Copy ID"
                          >
                            {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                          </button>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-0.5 mt-2">Joining Date</p>
                      <p className="text-gray-300 font-medium text-sm">{joinDate}</p>
                    </div>

                  </div>
                </div>
              )}
            </div>
{/* 
            <button
              onClick={logout}
              className="flex items-center text-[#0ea5e9] hover:text-[#38bdf8] hover:bg-white/5 p-1.5 rounded-full transition-all active:scale-95"
              title="Logout"
            >
              <LogOut size={24} strokeWidth={2.5} />
            </button> */}

            <button 
              onClick={onHamburgerClick} 
              className="text-[#d4af37] hover:bg-white/10 p-1 rounded-md transition-all active:scale-95 cursor-pointer"
            >
              <Menu size={28} strokeWidth={2.5} />
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};

export default TopNav;