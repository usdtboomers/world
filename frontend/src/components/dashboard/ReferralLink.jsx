import React, { useState } from "react";
import { Copy, Check } from "lucide-react"; 

const ReferralLinkBox = ({ link }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2s
  };

  return (
    // 🔥 UPDATE: Dark background, shadow and border matching the theme
    <div className="bg-[#111827] border border-[#1f2937] rounded-xl shadow-lg shadow-black/40 w-full mb-6 overflow-hidden">
      
      {/* HEADER: Darker background with Gold Gradient Text */}
      <div className="border-b border-[#1f2937] px-5 py-4 bg-[#0a0f1c]">
        <h3 className="text-[1.05rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#f3e5ab] uppercase tracking-wide">
          Referral Link
        </h3>
      </div>

      {/* BODY: Input box aur attached Gold button */}
      <div className="p-5 bg-[#111827]">
        <div className="flex items-stretch w-full max-w-3xl drop-shadow-md">
          {/* LINK INPUT */}
          <input
            type="text"
            readOnly
            value={link}
            onFocus={(e) => e.target.select()}
            className="w-full bg-black/40 border border-[#d4af37]/30 border-r-0 text-[#d4af37] px-4 py-3 text-sm sm:text-base focus:outline-none rounded-l-lg font-mono tracking-wide selection:bg-[#d4af37] selection:text-black"
          />
          
          {/* GOLD COPY BUTTON */}
          <button 
            onClick={handleCopy}
            className="bg-gradient-to-r from-[#d4af37] to-[#f3e5ab] text-black px-5 sm:px-6 flex items-center justify-center rounded-r-lg transition-all shadow-[0_0_10px_rgba(212,175,55,0.2)] hover:shadow-[0_0_15px_rgba(212,175,55,0.5)]"
            title="Copy Link"
          >
            {copied ? (
              <Check size={20} strokeWidth={3} className="text-black" />
            ) : (
              <Copy size={20} strokeWidth={2.5} className="text-black" />
            )}
          </button>
        </div>
      </div>
      
    </div>
  );
};

export default ReferralLinkBox;