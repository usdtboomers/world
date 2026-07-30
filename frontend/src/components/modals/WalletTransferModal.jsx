import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { X, Eye, EyeOff } from "lucide-react";

const WalletTransferModal = ({ onClose }) => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [walletData, setWalletData] = useState({ balance: 0 });
  const [receiverId, setReceiverId] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionPassword, setTransactionPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      const res = await api.get(`/wallet/info`, { headers: { Authorization: `Bearer ${token}` }});
      setWalletData({ balance: res.data.walletBalance || 0 });
    } catch (err) {
      console.error("Failed to fetch wallet data");
    }
  };

  const handleQuickAmount = (val) => setAmount(val);

  const handleSubmit = async () => {
    if (!receiverId) return Swal.fire({ icon: 'warning', title: 'User ID Required', text: 'Please enter receiver User ID.', background: '#0b101e', color: '#e4c568' });
    if (!amount || amount < 1) return Swal.fire({ icon: 'warning', title: 'Invalid Amount', text: 'Minimum transfer is $1.', background: '#0b101e', color: '#e4c568' });
    if (!transactionPassword) return Swal.fire({ icon: 'warning', title: 'Password Required', text: 'Enter Transaction Password.', background: '#0b101e', color: '#e4c568' });

    setLoading(true);
    try {
      const response = await api.post('/wallet/transfer', {
        receiverId,
        amount: Number(amount),
        transactionPassword
      }, { headers: { Authorization: `Bearer ${token}` }});

      if (response.data.success) {
        Swal.fire({ icon: 'success', title: 'Transferred!', text: response.data.message, background: '#0b101e', color: '#e4c568' });
        onClose();
      }
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Transfer Failed', text: err.response?.data?.message || 'Something went wrong.', background: '#0b101e', color: '#ff4d4d' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[99999] flex justify-center items-center p-3 sm:p-4">
      <div className="bg-[#0b101e] w-full max-w-[420px] max-h-[85vh] sm:max-h-[90vh] rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.15)] border border-[#2d3748] overflow-hidden flex flex-col mt-4 sm:mt-0">
        
        <div className="bg-[#e4c568] px-4 py-3 flex justify-between items-center shrink-0">
          <h2 className="text-black font-extrabold text-[17px] tracking-wide">Fund Transfer</h2>
          <button onClick={onClose} className="text-black hover:bg-black/10 p-1 rounded-full transition-colors"><X size={20} strokeWidth={2.5} /></button>
        </div>

        <div className="bg-[#161c2d] px-4 py-2 border-b border-[#2d3748] shrink-0">
          <p className="text-[#e4c568] text-xs font-bold tracking-wide">Minimum $1 Amount For Transfer!</p>
        </div>

        <div className="p-4 bg-[#0b101e] flex-1 overflow-y-auto">
          <div className="border border-[#2d3748] rounded-md overflow-hidden flex flex-col font-semibold text-[13px]">
            <div className="flex border-b border-[#2d3748]">
              <div className="w-2/3 bg-[#131927] text-white p-2.5 border-r border-[#2d3748]">Available Wallet Balance</div>
              <div className="w-1/3 bg-[#131927] text-[#00ff88] p-2.5">${walletData.balance.toFixed(2)}</div>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <input type="text" value={receiverId} onChange={(e) => setReceiverId(e.target.value)} placeholder="Enter Receiver User ID" className="w-full bg-[#131927] border border-[#2d3748] text-white px-3 py-2.5 rounded outline-none focus:border-[#e4c568] focus:ring-1 focus:ring-[#e4c568] placeholder-gray-500 text-sm" />
            
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter Transfer Amount ($)" className="w-full bg-[#131927] border border-[#2d3748] text-white px-3 py-2.5 rounded outline-none focus:border-[#e4c568] focus:ring-1 focus:ring-[#e4c568] placeholder-gray-500 text-sm" />
            
            <div className="flex gap-2">
              {[1, 5, 10, 20, 50].map((val) => (
                <button key={val} onClick={() => handleQuickAmount(val)} className="flex-1 bg-[#1e2536] hover:bg-[#2d3748] border border-[#2d3748] text-white py-1.5 rounded font-bold text-sm transition-colors">${val}</button>
              ))}
            </div>

            <div className="relative mt-2">
              <input type={showPassword ? "text" : "password"} value={transactionPassword} onChange={(e) => setTransactionPassword(e.target.value)} placeholder="Enter Transaction Password" className="w-full bg-[#131927] border border-[#2d3748] text-white px-3 py-2.5 rounded outline-none focus:border-[#e4c568] focus:ring-1 focus:ring-[#e4c568] placeholder-gray-500 pr-10 text-sm" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
            </div>

            <button onClick={handleSubmit} disabled={loading} className="w-full mt-3 bg-[#e4c568] hover:bg-[#d4af37] text-black font-extrabold py-2.5 rounded shadow-[0_0_10px_rgba(228,197,104,0.3)] hover:scale-[1.02] transition-transform disabled:opacity-70 disabled:hover:scale-100 uppercase tracking-widest text-[15px]">
              {loading ? 'Processing...' : 'TRANSFER FUNDS'}
            </button>
          </div>

          <div className="mt-4 pb-2 text-[#9ca3af] text-[11px] leading-relaxed font-medium">
            <h4 className="text-[#e4c568] font-bold text-xs mb-1.5">Terms & Conditions</h4>
            <p>1. Minimum transfer amount is $1.</p>
            <p>2. Fund transfers cannot be reversed once processed.</p>
            <p>3. Active package upgrade is required for transfers.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletTransferModal;