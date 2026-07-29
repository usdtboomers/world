import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Menu, LogOut } from "lucide-react";

const TopNav = ({ onHamburgerClick }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Dashboard pe le jayega aur page ko top par scroll karega
  const handleLogoClick = () => {
    navigate("/dashboard");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    // 🔥 UPDATE: Background changed to match the green theme in image_7e7825.png
    <header className="fixed top-0 left-0 w-full bg-[#71e08c] shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex justify-between items-center h-16 md:h-20">
          
          {/* 1. Left Section: Hamburger & Brand */}
          <div className="flex items-center gap-3 md:gap-4">
            
            {/* Hamburger Icon (Kept for mobile sidebar functionality) */}
            <button 
              onClick={onHamburgerClick} 
              className="p-1 md:p-2 text-white hover:bg-white/20 rounded-lg transition-all active:scale-95 cursor-pointer"
            >
              <Menu size={28} strokeWidth={2.5} />
            </button>

            {/* Brand Logo & Name (Clickable) */}
            <div
              className="cursor-pointer flex items-center gap-2"
              onClick={handleLogoClick}
            >
              {/* Custom SVG Logo matching the red house in a circle */}
              <div className="text-[#f42a28] flex items-center justify-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="36" 
                  height="36" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="11" />
                  <path d="M3 11l9-7 9 7" />
                  <path d="M9 21V10h6v11" />
                </svg>
              </div>

              {/* Brand Name */}
              <span className="text-[1.1rem] md:text-2xl font-black tracking-wide uppercase text-[#f42a28] whitespace-nowrap mt-1">
                World Finance
              </span>
            </div>
          </div>

          {/* 2. Right Section: Logout */}
          <div className="flex items-center">
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-white hover:text-gray-100 transition-all active:scale-95 px-2 py-2"
            >
              <LogOut size={22} strokeWidth={2.5} />
              <span className="font-semibold text-base md:text-lg tracking-wide">Logout</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};

export default TopNav;