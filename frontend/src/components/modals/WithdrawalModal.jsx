import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { X, Eye, EyeOff, Zap, Users, RefreshCcw, ShieldCheck } from "lucide-react";

const WithdrawalModal = ({ onClose }) => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [walletData, setWalletData] = useState({ 
    directIncome: 0, levelIncome: 0, roiIncome: 0, balance: 0, totalWithdrawn: 0, 
    walletAddress: user?.walletAddress || null // 🔥 FIX: Direct user context se address le liya pehle
  });
  
  const [directAmount, setDirectAmount] = useState("");
  const [levelAmount, setLevelAmount] = useState("");
  const [roiAmount, setRoiAmount] = useState("");
  const [transactionPassword, setTransactionPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      const res = await api.get(`/wallet/info`, { headers: { Authorization: `Bearer ${token}` }});
      setWalletData({
        directIncome: res.data.directIncome || 0,
        levelIncome: res.data.levelIncome || 0,
        roiIncome: res.data.roiIncome || 0,
        balance: res.data.availableBalance || 0,
        totalWithdrawn: res.data.totalWithdrawn || 0,
        // 🔥 FIX: API se check karega, nahi mila toh existing user data se uthayega
        walletAddress: res.data.walletAddress || user?.walletAddress || null 
      });
    } catch (err) {
      console.error("Failed to fetch wallet data", err);
    }
  };

  const totalSelection = (Number(directAmount) || 0) + (Number(levelAmount) || 0) + (Number(roiAmount) || 0);

  // 🔥 YEH FUNCTION EXACT 4 DECIMALS DIKHAYEGA BINA ROUND OFF KIYE
  // const formatExact = (num) => {
  //   if (!num) return "0";
  //   const str = Number(num).toString(); 
  //   if (str.includes('.')) {
  //     const parts = str.split('.');
  //     return `${parts[0]}.${parts[1].substring(0, 4)}`; // Point ke baad max 4 digits
  //   }
  //   return str;
  // };

  // 🔥 YEH FUNCTION DUST (E-16) VALUES KO BHI PROPERLY HANDLE KAREGA
  const formatExact = (num) => {
    if (!num) return "0.0000";
    return Number(num).toFixed(4); 
  };

  const handleSubmit = async () => {
    if (!walletData.walletAddress) {
      return Swal.fire({ icon: 'error', title: 'Address Missing', text: 'Please update your USDT BEP-20 Wallet Address in your profile first.', background: '#111827', color: '#ff4d4d' });
    }
    if (totalSelection < 2) {
      return Swal.fire({ icon: 'warning', title: 'Invalid Amount', text: 'Minimum total withdrawal is $2.', background: '#111827', color: '#d4af37' });
    }
    if (totalSelection > walletData.balance) {
      // 🔥 FIX: Error message me bhi formatExact laga diya
      return Swal.fire({ icon: 'error', title: 'Insufficient Balance', text: `You only have $${formatExact(walletData.balance)} available to withdraw.`, background: '#111827', color: '#ff4d4d' });
    }
    if (!transactionPassword) {
      return Swal.fire({ icon: 'warning', title: 'Password Required', text: 'Enter Transaction Password.', background: '#111827', color: '#d4af37' });
    }

    setLoading(true);
    try {
      const response = await api.post('/wallet/withdraw', {
        amount: totalSelection, 
        transactionPassword,
        details: { direct: directAmount, level: levelAmount, roi: roiAmount }
      }, { headers: { Authorization: `Bearer ${token}` }});

      if (response.data.success) {
        Swal.fire({ icon: 'success', title: 'Success!', text: response.data.message, background: '#111827', color: '#d4af37' });
        onClose();
       }
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Request Failed', text: err.response?.data?.message || 'Something went wrong.', background: '#111827', color: '#ff4d4d' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[99999] flex justify-center items-start sm:items-center pt-16 sm:pt-4 p-3 sm:p-4">
      
      <div className="bg-[#0b101e] w-full max-w-[420px] max-h-[85vh] sm:max-h-[90vh] rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.15)] border border-[#2d3748] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-[#e4c568] px-4 py-3 flex justify-between items-center shrink-0">
          <h2 className="text-black font-extrabold text-[17px] tracking-wide">
            Withdraw Funds
          </h2>
          <button onClick={onClose} className="text-black hover:bg-black/10 p-1 rounded-full transition-colors">
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="p-4 bg-[#0b101e] flex-1 overflow-y-auto custom-scroll space-y-4">
          
          {/* Top Info Cards */}
          <div className="flex gap-2 mb-2">
            <div className="flex-1 bg-[#161c2d] border border-[#2d3748] p-3 rounded-lg text-center shadow-inner">
              <p className="text-[10px] text-gray-400 font-bold tracking-wider mb-1 uppercase">Withdrawable Balance</p>
              {/* 🔥 FIX: toFixed hatakar formatExact lagaya */}
              <p className="text-[#00ff88] font-black text-xl">${formatExact(walletData.balance)}</p>
            </div>
          </div>

          {/* 🔥 Mandatory Wallet Address Block */}
          <div className={`p-3 rounded-lg border ${walletData.walletAddress ? 'bg-[#131927] border-[#00ff88]/30' : 'bg-[#2a1111] border-[#ff4d4d]/50'}`}>
            <p className={`text-xs font-bold mb-1.5 flex items-center gap-1.5 ${walletData.walletAddress ? 'text-[#00ff88]' : 'text-[#ff4d4d]'}`}>
              <ShieldCheck size={14} /> YOUR SAVED USDT BEP-20 ADDRESS
            </p>
            {walletData.walletAddress ? (
              <p className="text-white text-sm break-all font-mono opacity-90">{walletData.walletAddress}</p>
            ) : (
              <p className="text-[#ff4d4d] text-[11px] font-semibold italic">Address not found! Please update in your profile to withdraw.</p>
            )}
          </div>

          {/* 🔥 DIRECT INCOME BOX */}
         

          <div className="bg-[#1e2536] p-3.5 rounded-lg border border-[#2d3748] shadow-sm">
  <div className="flex justify-between items-center mb-2.5">
    <span className="text-[#e4c568] text-xs font-bold flex items-center gap-1.5"><Zap size={14}/> DIRECT INCOME</span>
    {/* 🔥 Green color, increased text size, and bright white font */}
    <span className="text-green-400 text-sm sm:text-base font-extrabold">Earned: ${formatExact(walletData.directIncome)}</span>
  </div>
  <div className="flex items-center gap-2 bg-[#0b101e] border border-[#2d3748] rounded px-3 py-2.5 focus-within:border-[#e4c568] transition-colors">
    <span className="text-[#e4c568] font-bold">$</span>
    <input 
      type="number" value={directAmount} onChange={(e) => setDirectAmount(e.target.value)} 
      className="bg-transparent outline-none text-white w-full text-sm font-semibold" placeholder="0.00" 
    />
  </div>
</div>

          {/* 🔥 LEVEL INCOME BOX */}
         {/* 🔥 LEVEL INCOME BOX */}
          <div className="bg-[#1e2536] p-3.5 rounded-lg border border-[#2d3748] shadow-sm">
            <div className="flex justify-between items-center mb-2.5">
              <span className="text-[#60a5fa] text-xs font-bold flex items-center gap-1.5"><Users size={14}/> LEVEL INCOME</span>
              <span className="text-green-400 text-sm sm:text-base font-extrabold">Earned: ${formatExact(walletData.levelIncome)}</span>
            </div>
            <div className="flex items-center gap-2 bg-[#0b101e] border border-[#2d3748] rounded px-3 py-2.5 focus-within:border-[#60a5fa] transition-colors">
              <span className="text-[#60a5fa] font-bold">$</span>
              <input 
                type="number" value={levelAmount} onChange={(e) => setLevelAmount(e.target.value)} 
                className="bg-transparent outline-none text-white w-full text-sm font-semibold" placeholder="0.00" 
              />
            </div>
          </div>

          {/* 🔥 ROI INCOME BOX */}
          <div className="bg-[#1e2536] p-3.5 rounded-lg border border-[#2d3748] shadow-sm">
            <div className="flex justify-between items-center mb-2.5">
              <span className="text-[#c084fc] text-xs font-bold flex items-center gap-1.5"><RefreshCcw size5={14}/> ROI INCOME</span>
              <span className="text-green-400 text-sm sm:text-base font-extrabold">Earned: ${formatExact(walletData.roiIncome)}</span>
            </div>
            <div className="flex items-center gap-2 bg-[#0b101e] border border-[#2d3748] rounded px-3 py-2.5 focus-within:border-[#c084fc] transition-colors">
              <span className="text-[#c084fc] font-bold">$</span>
              <input 
                type="number" value={roiAmount} onChange={(e) => setRoiAmount(e.target.value)} 
                className="bg-transparent outline-none text-white w-full text-sm font-semibold" placeholder="0.00" 
              />
            </div>
          </div>

          {/* 🔥 TOTAL SELECTION */}
          <div className="flex justify-between items-center bg-[#131927] border border-[#d4af37]/30 p-3.5 rounded-lg mt-2">
            <span className="text-gray-300 text-xs font-extrabold tracking-widest uppercase">Total Selection</span>
            {/* 🔥 FIX: toFixed hatakar formatExact lagaya */}
            <span className="text-[#d4af37] text-lg font-black">${formatExact(totalSelection)}</span>
          </div>

          {/* Transaction Password */}
          <div className="mt-4">
            <label className="text-gray-400 text-[11px] font-bold mb-1.5 block tracking-wide uppercase">Transaction Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                value={transactionPassword}
                onChange={(e) => setTransactionPassword(e.target.value)}
                placeholder="Enter Secure PIN"
                className="w-full bg-[#131927] border border-[#2d3748] text-white px-4 py-3 rounded-lg outline-none focus:border-[#e4c568] focus:ring-1 focus:ring-[#e4c568] placeholder-gray-600 text-sm font-semibold"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            onClick={handleSubmit}
            disabled={loading || !walletData.walletAddress}
            className="w-full mt-2 bg-gradient-to-r from-[#d4af37] to-[#e4c568] hover:brightness-110 text-black font-extrabold py-3.5 rounded-lg shadow-[0_0_15px_rgba(228,197,104,0.3)] hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100 uppercase tracking-widest text-[14px]"
          >
            {loading ? 'Processing...' : 'WITHDRAW NOW'}
          </button>

          {/* Terms and Conditions */}
          {/* <div className="mt-4 text-[#6b7280] text-[10px] leading-relaxed font-medium text-center px-2">
            <p>Minimum withdrawal is $2. Timing: 10:00 AM to 12:00 PM.</p>
            <p>Withdrawal Fees 0%. Payments processed via USDT BEP20.</p>
          </div> */}

          <div className="mt-4 text-[#9ca3af] text-xs sm:text-sm font-bold text-center px-2 space-y-1.5">
            <p>Min withdrawal is $2. Timing: 10:00 AM to 12:00 PM.</p>
            
            {/* 🔥 NAYE RULES */}
            <p className="text-[#d4af37]">Daily Withdrawal Limit: Equal to your highest active package amount.</p>
             <p className="text-[#ff4d4d]">For Withdrawal Active package is mandatory. If expired, Direct & Level income will flush.</p>
            <p className="text-[#00ff88]">Withdraw ROI Income daily OR use 'Wallet to Fund' for compounding.</p>
            
            <p>Receive time: 10:00 PM to 12:00 AM. 0% Fees via USDT BEP20.</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default WithdrawalModal;















// import React, { useState, useEffect } from "react";
// import api from "../../api/axios";
// import { useAuth } from "../../context/AuthContext";
// import { useNavigate } from "react-router-dom";
// import Swal from 'sweetalert2';
// import { X, Eye, EyeOff, RefreshCcw, ShieldCheck } from "lucide-react";

// const WithdrawalModal = ({ onClose }) => {
//   const { user, token } = useAuth();
//   const navigate = useNavigate();
  
//   const [loading, setLoading] = useState(false);
//   const [walletData, setWalletData] = useState({ 
//     roiIncome: 0, balance: 0, totalWithdrawn: 0, 
//     walletAddress: user?.walletAddress || null 
//   });
  
//   // 🔥 FIX: Direct aur Level ka state hata diya, ab sirf ROI hai
//   const [roiAmount, setRoiAmount] = useState("");
//   const [transactionPassword, setTransactionPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);

//   useEffect(() => {
//     fetchWalletData();
//   }, []);

//   const fetchWalletData = async () => {
//     try {
//       const res = await api.get(`/wallet/info`, { headers: { Authorization: `Bearer ${token}` }});
//       setWalletData({
//         roiIncome: res.data.roiIncome || 0,
//         balance: res.data.availableBalance || 0,
//         totalWithdrawn: res.data.totalWithdrawn || 0,
//         walletAddress: res.data.walletAddress || user?.walletAddress || null 
//       });
//     } catch (err) {
//       console.error("Failed to fetch wallet data", err);
//     }
//   };

//   // 🔥 FIX: Total selection ab sirf ROI amount hoga
//   const totalSelection = Number(roiAmount) || 0;

//   // 🔥 EXACT 4 DECIMALS
//   const formatExact = (num) => {
//     if (!num) return "0.0000";
//     return Number(num).toFixed(4); 
//   };

//   const handleSubmit = async () => {
//     if (!walletData.walletAddress) {
//       return Swal.fire({ icon: 'error', title: 'Address Missing', text: 'Please update your USDT BEP-20 Wallet Address in your profile first.', background: '#111827', color: '#ff4d4d' });
//     }
//     if (totalSelection < 2) {
//       return Swal.fire({ icon: 'warning', title: 'Invalid Amount', text: 'Minimum total withdrawal is $2.', background: '#111827', color: '#d4af37' });
//     }
//     // Limit check by Wallet Balance OR ROI Income
//     if (totalSelection > walletData.roiIncome) {
//       return Swal.fire({ icon: 'error', title: 'Insufficient Balance', text: `You only have $${formatExact(walletData.roiIncome)} ROI Income available to withdraw.`, background: '#111827', color: '#ff4d4d' });
//     }
//     if (!transactionPassword) {
//       return Swal.fire({ icon: 'warning', title: 'Password Required', text: 'Enter Transaction Password.', background: '#111827', color: '#d4af37' });
//     }

//     setLoading(true);
//     try {
//       // 🔥 FIX: Backend ke naye logic ke hisaab se sirf amount bheja ja raha hai
//       const response = await api.post('/wallet/withdraw', {
//         amount: totalSelection, 
//         transactionPassword
//       }, { headers: { Authorization: `Bearer ${token}` }});

//       if (response.data.success) {
//         Swal.fire({ icon: 'success', title: 'Success!', text: response.data.message, background: '#111827', color: '#d4af37' });
//         onClose();
//        }
//     } catch (err) {
//       Swal.fire({ icon: 'error', title: 'Request Failed', text: err.response?.data?.message || 'Something went wrong.', background: '#111827', color: '#ff4d4d' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[99999] flex justify-center items-start sm:items-center pt-16 sm:pt-4 p-3 sm:p-4">
      
//       <div className="bg-[#0b101e] w-full max-w-[420px] max-h-[85vh] sm:max-h-[90vh] rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.15)] border border-[#2d3748] overflow-hidden flex flex-col">
        
//         {/* Header */}
//         <div className="bg-[#e4c568] px-4 py-3 flex justify-between items-center shrink-0">
//           <h2 className="text-black font-extrabold text-[17px] tracking-wide">
//             Withdraw Funds
//           </h2>
//           <button onClick={onClose} className="text-black hover:bg-black/10 p-1 rounded-full transition-colors">
//             <X size={20} strokeWidth={2.5} />
//           </button>
//         </div>

//         {/* Scrollable Content Area */}
//         <div className="p-4 bg-[#0b101e] flex-1 overflow-y-auto custom-scroll space-y-4">
          
//           {/* Top Info Cards */}
//           <div className="flex gap-2 mb-2">
//             <div className="flex-1 bg-[#161c2d] border border-[#2d3748] p-3 rounded-lg text-center shadow-inner">
//               <p className="text-[10px] text-gray-400 font-bold tracking-wider mb-1 uppercase">Withdrawable ROI Balance</p>
//               <p className="text-[#00ff88] font-black text-xl">${formatExact(walletData.roiIncome)}</p>
//             </div>
//           </div>

//           {/* 🔥 Mandatory Wallet Address Block */}
//           <div className={`p-3 rounded-lg border ${walletData.walletAddress ? 'bg-[#131927] border-[#00ff88]/30' : 'bg-[#2a1111] border-[#ff4d4d]/50'}`}>
//             <p className={`text-xs font-bold mb-1.5 flex items-center gap-1.5 ${walletData.walletAddress ? 'text-[#00ff88]' : 'text-[#ff4d4d]'}`}>
//               <ShieldCheck size={14} /> YOUR SAVED USDT BEP-20 ADDRESS
//             </p>
//             {walletData.walletAddress ? (
//               <p className="text-white text-sm break-all font-mono opacity-90">{walletData.walletAddress}</p>
//             ) : (
//               <p className="text-[#ff4d4d] text-[11px] font-semibold italic">Address not found! Please update in your profile to withdraw.</p>
//             )}
//           </div>

//           {/* 🔥 ROI INCOME BOX (Ab sirf yahi bacha hai) */}
//           <div className="bg-[#1e2536] p-3.5 rounded-lg border border-[#2d3748] shadow-sm">
//             <div className="flex justify-between items-center mb-2.5">
//               <span className="text-[#c084fc] text-xs font-bold flex items-center gap-1.5"><RefreshCcw size={14}/> ROI INCOME</span>
//               <span className="text-green-400 text-sm sm:text-base font-extrabold">Earned: ${formatExact(walletData.roiIncome)}</span>
//             </div>
//             <div className="flex items-center gap-2 bg-[#0b101e] border border-[#2d3748] rounded px-3 py-2.5 focus-within:border-[#c084fc] transition-colors">
//               <span className="text-[#c084fc] font-bold">$</span>
//               <input 
//                 type="number" value={roiAmount} onChange={(e) => setRoiAmount(e.target.value)} 
//                 className="bg-transparent outline-none text-white w-full text-sm font-semibold" placeholder="0.00" 
//               />
//             </div>
//           </div>

//           {/* 🔥 TOTAL SELECTION */}
//           <div className="flex justify-between items-center bg-[#131927] border border-[#d4af37]/30 p-3.5 rounded-lg mt-2">
//             <span className="text-gray-300 text-xs font-extrabold tracking-widest uppercase">Total Selection</span>
//             <span className="text-[#d4af37] text-lg font-black">${formatExact(totalSelection)}</span>
//           </div>

//           {/* Transaction Password */}
//           <div className="mt-4">
//             <label className="text-gray-400 text-[11px] font-bold mb-1.5 block tracking-wide uppercase">Transaction Password</label>
//             <div className="relative">
//               <input 
//                 type={showPassword ? "text" : "password"}
//                 value={transactionPassword}
//                 onChange={(e) => setTransactionPassword(e.target.value)}
//                 placeholder="Enter Secure PIN"
//                 className="w-full bg-[#131927] border border-[#2d3748] text-white px-4 py-3 rounded-lg outline-none focus:border-[#e4c568] focus:ring-1 focus:ring-[#e4c568] placeholder-gray-600 text-sm font-semibold"
//               />
//               <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
//                 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//               </button>
//             </div>
//           </div>

//           {/* Submit Button */}
//           <button 
//             onClick={handleSubmit}
//             disabled={loading || !walletData.walletAddress}
//             className="w-full mt-2 bg-gradient-to-r from-[#d4af37] to-[#e4c568] hover:brightness-110 text-black font-extrabold py-3.5 rounded-lg shadow-[0_0_15px_rgba(228,197,104,0.3)] hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100 uppercase tracking-widest text-[14px]"
//           >
//             {loading ? 'Processing...' : 'WITHDRAW NOW'}
//           </button>

//           {/* Terms and Conditions */}
//           {/* Terms and Conditions */}
//           <div className="mt-4 text-[#9ca3af] text-xs sm:text-sm font-bold text-center px-2 space-y-1.5">
//             <p>Min withdrawal is $2. Timing: 10:00 AM to 12:00 PM.</p>
            
//             {/* 🔥 NAYE RULES */}
//             <p className="text-[#d4af37]">Daily Withdrawal Limit: Equal to your total live topup amount.</p>
//             <p className="text-[#ff4d4d]">For Withdrawal Active package is mandatory. If expired, Direct & Level income will flush.</p>
//             <p className="text-[#00ff88]">Withdraw ROI Income daily OR use 'Wallet to Fund' for compounding.</p>
            
//             <p>Receive time: 10:00 PM to 12:00 AM. 0% Fees via USDT BEP20.</p>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default WithdrawalModal;