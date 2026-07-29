import React from "react";
import { useNavigate } from "react-router-dom";
import { DollarSign, CreditCard, Users, Headset, Ticket, Building, Send } from "lucide-react"; 

// 🔥 onDepositClick prop yahan receive kiya hai
const QuickActions = ({ onDepositClick }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Upar ki orange line */}
      <div className="h-1 w-full bg-[#ff8c00]"></div>
      
      <div className="p-6">
        <div className="grid grid-cols-4 gap-y-8 gap-x-2">
          
          {/* Recharge -> Ab yeh navigate ki jagah modal open karega */}
          <div 
            onClick={() => {
              if (onDepositClick) {
                onDepositClick();
              } else {
                navigate('/recharge'); // Fallback agar prop na mile
              }
            }} 
            className="flex flex-col items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="w-[50px] h-[50px] bg-[#1565c0] rounded text-white flex items-center justify-center shadow-md">
              <DollarSign size={32} strokeWidth={2.5} />
            </div>
            <span className="text-[13px] font-medium text-gray-800">Recharge</span>
          </div>

          {/* Withdrawal */}
          <div onClick={() => navigate('/withdrawal')} className="flex flex-col items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="w-[50px] h-[50px] bg-gradient-to-br from-[#ffb476] to-[#ff8c42] rounded-[18px] text-white flex items-center justify-center shadow-md">
              <CreditCard size={28} strokeWidth={2} />
            </div>
            <span className="text-[13px] font-medium text-gray-800">Withdrawal</span>
          </div>

          {/* Team */}
          <div onClick={() => navigate('/team')} className="flex flex-col items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="w-[50px] h-[50px] bg-gradient-to-br from-[#6cb0ff] to-[#3a8dff] rounded-full text-white flex items-center justify-center shadow-md">
              <Users size={26} strokeWidth={2} />
            </div>
            <span className="text-[13px] font-medium text-gray-800">Team</span>
          </div>

          {/* Support */}
          <div onClick={() => navigate('/support')} className="flex flex-col items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="w-[50px] h-[50px] bg-gradient-to-br from-[#6cb0ff] to-[#3a8dff] rounded-full text-white flex items-center justify-center shadow-md">
              <Headset size={26} strokeWidth={2} />
            </div>
            <span className="text-[13px] font-medium text-gray-800">Support</span>
          </div>

          {/* Ticket Reply */}
          <div onClick={() => navigate('/ticket-reply')} className="flex flex-col items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="w-[50px] h-[50px] bg-gradient-to-br from-[#ffb476] to-[#ff8c42] rounded-[18px] text-white flex items-center justify-center shadow-md">
              <Ticket size={28} strokeWidth={2} />
            </div>
            <span className="text-[13px] font-medium text-gray-800 text-center leading-tight">Ticket<br/>Reply</span>
          </div>

          {/* Plan */}
          <div onClick={() => navigate('/plan')} className="flex flex-col items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="w-[50px] h-[50px] bg-[#5c6e7a] rounded-xl text-yellow-400 flex items-center justify-center shadow-md border-2 border-yellow-500/30">
              <Building size={26} strokeWidth={2} />
            </div>
            <span className="text-[13px] font-medium text-gray-800">Plan</span>
          </div>

          {/* Telegram */}
          <div onClick={() => window.open('https://t.me/your_telegram_link', '_blank')} className="flex flex-col items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="w-[50px] h-[50px] bg-[#229ED9] rounded-full text-white flex items-center justify-center shadow-md">
              <Send size={24} strokeWidth={2} className="-ml-1" />
            </div>
            <span className="text-[13px] font-medium text-gray-800">Telegram</span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default QuickActions;