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
    <header className="fixed top-0 left-0 w-full bg-[#0a0f1c] shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-16">
          
          {/* 1. Left Section: Brand Name Only (Logo Removed) */}
          <div 
            className="cursor-pointer flex items-center"
            onClick={handleLogoClick}
          >
            <span className="text-[1.2rem] md:text-2xl font-black tracking-wider uppercase text-[#d4af37] whitespace-nowrap">
World Together            </span>
          </div>

          {/* 2. Right Section: Logout & Hamburger */}
          <div className="flex items-center gap-4">
            
            {/* Blue Logout Icon matching image */}
            <button
              onClick={logout}
              className="flex items-center text-[#0ea5e9] hover:text-[#38bdf8] transition-all active:scale-95"
            >
              <LogOut size={24} strokeWidth={2.5} />
            </button>

            {/* Gold Hamburger Icon */}
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