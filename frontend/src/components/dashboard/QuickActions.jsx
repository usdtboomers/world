import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DollarSign, CreditCard, Users, Headset, Ticket, Building, Send, ArrowLeftRight, Wallet } from "lucide-react"; 

// 🔥 Modals import kiye hain
import WithdrawalModal from "../modals/WithdrawalModal";
import WalletTransferModal from "../modals/WalletTransferModal";
import CreditToWalletModal from "../modals/CreditToWalletModal";

const QuickActions = ({ onDepositClick }) => {
  const navigate = useNavigate();
  
  // 🔥 Modals ke states
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);

  const iconBoxStyle = "w-[50px] h-[50px] bg-[#0a0f1c] border border-[#d4af37]/40 text-[#d4af37] flex items-center justify-center shadow-[0_0_10px_rgba(0,0,0,0.5)] group-hover:border-[#d4af37] group-hover:shadow-[0_0_12px_rgba(212,175,55,0.5)] group-hover:scale-105 transition-all duration-300";

  return (
    <>
      <div className="bg-[#111827] rounded-xl shadow-lg shadow-black/40 border border-[#1f2937] overflow-hidden">
        <div className="h-1.5 w-full bg-gradient-to-r from-[#d4af37] to-[#f3e5ab]"></div>
        
        <div className="p-5 md:p-6">
          <div className="grid grid-cols-4 gap-y-7 gap-x-2">
            
            {/* Recharge */}
            <div 
              onClick={() => {
                if (onDepositClick) {
                  onDepositClick();
                } else {
                  navigate('/recharge'); 
                }
              }} 
              className="flex flex-col items-center gap-2 cursor-pointer group"
            >
              <div className={`${iconBoxStyle} rounded-2xl`}>
                <DollarSign size={26} strokeWidth={2.5} />
              </div>
              <span className="text-[12px] md:text-[13px] font-semibold text-white group-hover:text-[#d4af37] transition-colors">Recharge</span>
            </div>

            {/* Withdrawal */}
            <div onClick={() => setIsWithdrawModalOpen(true)} className="flex flex-col items-center gap-2 cursor-pointer group">
              <div className={`${iconBoxStyle} rounded-[18px]`}>
                <CreditCard size={24} strokeWidth={2.5} />
              </div>
              <span className="text-[12px] md:text-[13px] font-semibold text-white group-hover:text-[#d4af37] transition-colors">Withdrawal</span>
            </div>

            {/* 🔥 Fund Transfer Button */}
            <div onClick={() => setIsTransferModalOpen(true)} className="flex flex-col items-center gap-2 cursor-pointer group">
              <div className={`${iconBoxStyle} rounded-full`}>
                <ArrowLeftRight size={24} strokeWidth={2.5} />
              </div>
              <span className="text-[11px] md:text-[12px] font-semibold text-white group-hover:text-[#d4af37] transition-colors text-center leading-tight">Fund<br/>Transfer</span>
            </div>

            {/* 🔥 Credit To Wallet Button */}
            <div onClick={() => setIsCreditModalOpen(true)} className="flex flex-col items-center gap-2 cursor-pointer group">
              <div className={`${iconBoxStyle} rounded-[18px]`}>
                <Wallet size={24} strokeWidth={2.5} />
              </div>
              <span className="text-[11px] md:text-[12px] font-semibold text-white group-hover:text-[#d4af37] transition-colors text-center leading-tight">Credit<br/>To Wallet</span>
            </div>

            {/* Team */}
            <div onClick={() => navigate('/team')} className="flex flex-col items-center gap-2 cursor-pointer group">
              <div className={`${iconBoxStyle} rounded-full`}>
                <Users size={24} strokeWidth={2.5} />
              </div>
              <span className="text-[12px] md:text-[13px] font-semibold text-white group-hover:text-[#d4af37] transition-colors">Team</span>
            </div>

            {/* Support */}
            <div onClick={() => navigate('/support')} className="flex flex-col items-center gap-2 cursor-pointer group">
              <div className={`${iconBoxStyle} rounded-full`}>
                <Headset size={24} strokeWidth={2.5} />
              </div>
              <span className="text-[12px] md:text-[13px] font-semibold text-white group-hover:text-[#d4af37] transition-colors">Support</span>
            </div>

            {/* Ticket Reply */}
            <div onClick={() => navigate('/ticket-reply')} className="flex flex-col items-center gap-2 cursor-pointer group">
              <div className={`${iconBoxStyle} rounded-[18px]`}>
                <Ticket size={24} strokeWidth={2.5} />
              </div>
              <span className="text-[11px] md:text-[12px] font-semibold text-white group-hover:text-[#d4af37] transition-colors text-center leading-tight">Ticket<br/>Reply</span>
            </div>

            {/* 🔥 Plan (PDF Open/Download logic) */}
            <div onClick={() => window.open('/WORLD FINANCE.pdf', '_blank')} className="flex flex-col items-center gap-2 cursor-pointer group">
              <div className={`${iconBoxStyle} rounded-xl`}>
                <Building size={24} strokeWidth={2.5} />
              </div>
              <span className="text-[12px] md:text-[13px] font-semibold text-white group-hover:text-[#d4af37] transition-colors">Plan</span>
            </div>

            {/* Telegram */}
            <div onClick={() => window.open('https://t.me/your_telegram_link', '_blank')} className="flex flex-col items-center gap-2 cursor-pointer group col-span-4 justify-center">
              <div className="flex items-center gap-2 bg-[#0a0f1c] border border-[#229ED9]/50 hover:border-[#229ED9] px-6 py-2 rounded-full transition-all group-hover:shadow-[0_0_12px_rgba(34,158,217,0.5)]">
                <Send size={20} strokeWidth={2.5} className="text-[#229ED9]" />
                <span className="text-[13px] font-semibold text-white group-hover:text-[#229ED9] transition-colors">Join Telegram Channel</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 🔥 Modals Rendering */}
      {isWithdrawModalOpen && (
        <WithdrawalModal onClose={() => setIsWithdrawModalOpen(false)} />
      )}

      {isTransferModalOpen && (
        <WalletTransferModal onClose={() => setIsTransferModalOpen(false)} />
      )}

      {isCreditModalOpen && (
        <CreditToWalletModal onClose={() => setIsCreditModalOpen(false)} />
      )}
    </>
  );
};

export default QuickActions;