import React, { useState, useEffect } from 'react';
import { Clock, X, AlertCircle } from 'lucide-react';

const WithdrawalPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // 🔥 NAYA LOGIC: Jaise hi Dashboard load hoga, 0.5 second me popup samne aa jayega (Har baar)
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const closePopup = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm transition-opacity duration-300">
      
      {/* POPUP BOX (World Finance Theme) */}
      <div className="bg-[#1c2233] border-2 border-[#d89814] rounded-2xl p-6 max-w-sm w-full relative shadow-[0_0_20px_rgba(216,152,20,0.3)] transform transition-all duration-300 scale-100">
        
        {/* CLOSE BUTTON */}
        <button 
          onClick={closePopup} 
          className="absolute top-3 right-3 text-slate-400 hover:text-white transition-colors bg-[#0b1120] rounded-full p-1 border border-slate-700"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center mt-2">
          
          {/* ICON BOX */}
          <div className="bg-[#d89814]/20 p-4 rounded-full mb-4 border border-[#d89814]/50 shadow-inner">
            <Clock size={40} className="text-[#d89814]" />
          </div>

          <h2 className="text-2xl font-black text-white uppercase tracking-wide mb-2">
            Withdrawal Time
          </h2>
          
          <p className="text-slate-300 font-medium mb-5 text-sm">
            Dear World Finance members, the daily withdrawal window is open between:
          </p>

          {/* TIME HIGHLIGHT BOX */}
          <div className="bg-[#0b1120] border border-slate-700 w-full py-4 rounded-xl mb-6 shadow-inner relative overflow-hidden">
             {/* Styling accent */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#d89814]"></div>
            
            <p className="text-[#d89814] text-2xl font-extrabold tracking-widest">
              10:00 AM - 02:00 PM
            </p>
           
          </div>

          {/* ACTION BUTTON */}
          <button 
            onClick={closePopup} 
            className="w-full bg-[#d89814] text-black font-black uppercase tracking-widest py-3 rounded-xl hover:bg-yellow-500 hover:shadow-lg transition-all active:scale-95"
          >
            I Understand
          </button>

        </div>
      </div>
    </div>
  );
};

export default WithdrawalPopup;