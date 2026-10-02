import React, { useState, useEffect } from 'react';
import { Zap, X, Send, Users, Clock, Wallet } from 'lucide-react';

const InstantSalaryPopup = () => {
  const telegramLink = "https://t.me/worldfinance01";
  const [showPopup, setShowPopup] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Dashboard load hone ke 1 second baad popup automatic aayega
    const timer = setTimeout(() => {
      setShowPopup(true);
      setTimeout(() => setIsAnimating(true), 50); // Animation ke liye delay
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const closePopup = () => {
    setIsAnimating(false);
    setTimeout(() => setShowPopup(false), 300); // Fade out hone ka wait karega
  };

  if (!showPopup) return null;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center mt-16 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* 🌟 Popup Box */}
      <div className={`relative bg-[#131c31] border-[2px] border-[#eab308] w-[90%] max-w-md rounded-2xl p-6 shadow-[0_0_40px_rgba(234,179,8,0.25)] transform transition-all duration-300 ${isAnimating ? 'scale-100 translate-y-0' : 'scale-90 translate-y-10'}`}>
        
        {/* ❌ Close Button */}
        <button 
          onClick={closePopup} 
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 bg-[#0b1221] p-1.5 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        {/* ⚡ Header Icon */}
        <div className="flex justify-center -mt-12 mb-3">
          <div className="bg-[#131c31] p-3 rounded-full border-[2px] border-[#eab308] shadow-[0_0_20px_rgba(234,179,8,0.5)]">
            <Zap size={40} className="text-[#eab308] animate-pulse" />
          </div>
        </div>

        {/* 📝 Content */}
        <div className="text-center">
          <h2 className="text-2xl font-black text-white uppercase tracking-wide mb-1">
            <span className="text-[#eab308]">Instant</span> Salary Update!
          </h2>
          <p className="text-gray-400 text-sm font-medium mb-5">Achieve your targets faster than ever!</p>

          {/* Highlights (Target Details Added Here) */}
          <div className="bg-[#0b1221] border border-gray-700 rounded-xl p-4 mb-6 space-y-3 text-left">
            
            {/* Condition 1: 3 Directs & 6 L2 */}
            <div className="flex items-start gap-3">
              <Users className="text-[#eab308] shrink-0 mt-0.5" size={18} />
              <p className="text-sm text-gray-200">
                Complete <span className="text-[#eab308] font-bold">3 Directs (L1)</span> & <span className="text-[#eab308] font-bold">6 Users in Level 2 (L2)</span> with <span className="text-white font-bold">$50+ Package</span>.
              </p>
            </div>
            
            <div className="w-full h-px bg-gray-800"></div>
            
            {/* Condition 2: 10 Days Limit */}
            <div className="flex items-start gap-3">
              <Clock className="text-orange-400 shrink-0 mt-0.5" size={18} />
              <p className="text-sm text-gray-200">
                Finish this target strictly within <span className="text-orange-400 font-bold">10 Days</span> of your top-up.
              </p>
            </div>

            <div className="w-full h-px bg-gray-800"></div>
            
            {/* Reward: Instant Next Day */}
            <div className="flex items-start gap-3">
              <Wallet className="text-green-400 shrink-0 mt-0.5" size={18} />
              <p className="text-sm text-gray-200">
                Get <span className="text-green-400 font-bold">$100 Salary credited</span> directly to your wallet the <span className="text-white font-bold underline decoration-[#eab308]">Very Next Day!</span>
              </p>
            </div>

          </div>

          {/* ✈️ Telegram Button */}
          <a 
            href={telegramLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-3.5 px-4 rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all transform hover:-translate-y-1"
          >
            <Send size={20} />
            Join Official Telegram
          </a>
          <p className="text-[10px] text-gray-500 mt-3 font-medium uppercase tracking-widest">
            Stay updated with live announcements
          </p>
        </div>

      </div>
    </div>
  );
};

export default InstantSalaryPopup;