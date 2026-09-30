// // import React, { useState, useEffect } from "react";
// // import api from "../../api/axios";
// // import { useAuth } from "../../context/AuthContext";
// // import Swal from 'sweetalert2';
// // import { X, Eye, EyeOff, Zap, Users, RefreshCcw } from "lucide-react";

// // const CreditToWalletModal = ({ onClose }) => {
// //   const { user, token } = useAuth();
  
// //   const [loading, setLoading] = useState(false);
// //   const [walletData, setWalletData] = useState({ 
// //     directIncome: 0, levelIncome: 0, roiIncome: 0, balance: 0 
// //   });
  
// //   const [directAmount, setDirectAmount] = useState("");
// //   const [levelAmount, setLevelAmount] = useState("");
// //   const [roiAmount, setRoiAmount] = useState("");
// //   const [transactionPassword, setTransactionPassword] = useState("");
// //   const [showPassword, setShowPassword] = useState(false);

// //   useEffect(() => {
// //     fetchWalletData();
// //   }, []);

// //   const fetchWalletData = async () => {
// //     try {
// //       const res = await api.get(`/wallet/info`, { headers: { Authorization: `Bearer ${token}` }});
// //       setWalletData({
// //         directIncome: res.data.directIncome || 0,
// //         levelIncome: res.data.levelIncome || 0,
// //         roiIncome: res.data.roiIncome || 0,
// //         balance: res.data.availableBalance || 0 
// //       });
// //     } catch (err) {
// //       console.error("Failed to fetch wallet data", err);
// //     }
// //   };

// //   const totalSelection = (Number(directAmount) || 0) + (Number(levelAmount) || 0) + (Number(roiAmount) || 0);

// //   const handleSubmit = async () => {
// //     if (totalSelection < 1) {
// //       return Swal.fire({ icon: 'warning', title: 'Invalid Amount', text: 'Minimum credit amount is $1.', background: '#111827', color: '#d4af37' });
// //     }
// //     if (totalSelection > walletData.balance) {
// //       return Swal.fire({ icon: 'error', title: 'Insufficient Balance', text: `You only have $${walletData.balance.toFixed(2)} available.`, background: '#111827', color: '#ff4d4d' });
// //     }
// //     if (!transactionPassword) {
// //       return Swal.fire({ icon: 'warning', title: 'Password Required', text: 'Enter Transaction Password.', background: '#111827', color: '#d4af37' });
// //     }

// //     setLoading(true);
// //     try {
// //       const response = await api.post('/wallet/credit-to-wallet', {
// //         amount: totalSelection, 
// //         transactionPassword,
// //         details: { direct: directAmount, level: levelAmount, roi: roiAmount }
// //       }, { headers: { Authorization: `Bearer ${token}` }});

// //       if (response.data.success) {
// //         Swal.fire({ icon: 'success', title: 'Success!', text: response.data.message, background: '#111827', color: '#d4af37' });
// //         onClose();
// //        }
// //     } catch (err) {
// //       Swal.fire({ icon: 'error', title: 'Request Failed', text: err.response?.data?.message || 'Something went wrong.', background: '#111827', color: '#ff4d4d' });
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[99999] flex justify-center items-start sm:items-center pt-16 sm:pt-4 p-3 sm:p-4">
      
// //       <div className="bg-[#0b101e] w-full max-w-[420px] max-h-[85vh] sm:max-h-[90vh] rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.15)] border border-[#2d3748] overflow-hidden flex flex-col">
        
// //         {/* Header */}
// //         <div className="bg-[#e4c568] px-4 py-3 flex justify-between items-center shrink-0">
// //           <h2 className="text-black font-extrabold text-[17px] tracking-wide">
// //              Wallet to Fund
// //           </h2>
// //           <button onClick={onClose} className="text-black hover:bg-black/10 p-1 rounded-full transition-colors">
// //             <X size={20} strokeWidth={2.5} />
// //           </button>
// //         </div>

// //         {/* Scrollable Content Area */}
// //         <div className="p-4 bg-[#0b101e] flex-1 overflow-y-auto custom-scroll space-y-4">
          
// //           <div className="bg-[#161c2d] border border-[#2d3748] p-3 rounded-lg text-center shadow-inner mb-2">
// //             <p className="text-[10px] text-gray-400 font-bold tracking-wider mb-1 uppercase">Total Income Balance</p>
// //             <p className="text-[#00ff88] font-black text-xl">${walletData.balance.toFixed(2)}</p>
// //           </div>

// //           {/* 🔥 DIRECT INCOME BOX */}
// //           <div className="bg-[#1e2536] p-3.5 rounded-lg border border-[#2d3748] shadow-sm">
// //             <div className="flex justify-between items-center mb-2.5">
// //               <span className="text-[#e4c568] text-xs font-bold flex items-center gap-1.5"><Zap size={14}/> DIRECT INCOME</span>
// //               <span className="text-gray-400 text-[11px] font-semibold">Earned: ${walletData.directIncome.toFixed(2)}</span>
// //             </div>
// //             <div className="flex items-center gap-2 bg-[#0b101e] border border-[#2d3748] rounded px-3 py-2.5 focus-within:border-[#e4c568] transition-colors">
// //               <span className="text-[#e4c568] font-bold">$</span>
// //               <input 
// //                 type="number" value={directAmount} onChange={(e) => setDirectAmount(e.target.value)} 
// //                 className="bg-transparent outline-none text-white w-full text-sm font-semibold" placeholder="0.00" 
// //               />
// //             </div>
// //           </div>

// //           {/* 🔥 LEVEL INCOME BOX */}
// //           <div className="bg-[#1e2536] p-3.5 rounded-lg border border-[#2d3748] shadow-sm">
// //             <div className="flex justify-between items-center mb-2.5">
// //               <span className="text-[#60a5fa] text-xs font-bold flex items-center gap-1.5"><Users size={14}/> LEVEL INCOME</span>
// //               <span className="text-gray-400 text-[11px] font-semibold">Earned: ${walletData.levelIncome.toFixed(2)}</span>
// //             </div>
// //             <div className="flex items-center gap-2 bg-[#0b101e] border border-[#2d3748] rounded px-3 py-2.5 focus-within:border-[#60a5fa] transition-colors">
// //               <span className="text-[#60a5fa] font-bold">$</span>
// //               <input 
// //                 type="number" value={levelAmount} onChange={(e) => setLevelAmount(e.target.value)} 
// //                 className="bg-transparent outline-none text-white w-full text-sm font-semibold" placeholder="0.00" 
// //               />
// //             </div>
// //           </div>

// //           {/* 🔥 ROI INCOME BOX */}
// //           <div className="bg-[#1e2536] p-3.5 rounded-lg border border-[#2d3748] shadow-sm">
// //             <div className="flex justify-between items-center mb-2.5">
// //               <span className="text-[#c084fc] text-xs font-bold flex items-center gap-1.5"><RefreshCcw size={14}/> ROI INCOME</span>
// //               <span className="text-gray-400 text-[11px] font-semibold">Earned: ${walletData.roiIncome.toFixed(2)}</span>
// //             </div>
// //             <div className="flex items-center gap-2 bg-[#0b101e] border border-[#2d3748] rounded px-3 py-2.5 focus-within:border-[#c084fc] transition-colors">
// //               <span className="text-[#c084fc] font-bold">$</span>
// //               <input 
// //                 type="number" value={roiAmount} onChange={(e) => setRoiAmount(e.target.value)} 
// //                 className="bg-transparent outline-none text-white w-full text-sm font-semibold" placeholder="0.00" 
// //               />
// //             </div>
// //           </div>

// //           {/* 🔥 TOTAL SELECTION */}
// //           <div className="flex justify-between items-center bg-[#131927] border border-[#d4af37]/30 p-3.5 rounded-lg mt-2">
// //             <span className="text-gray-300 text-xs font-extrabold tracking-widest uppercase">Total Transfer</span>
// //             <span className="text-[#d4af37] text-lg font-black">${totalSelection.toFixed(2)}</span>
// //           </div>

// //           {/* Transaction Password */}
// //           <div className="mt-4">
// //             <label className="text-gray-400 text-[11px] font-bold mb-1.5 block tracking-wide uppercase">Transaction Password</label>
// //             <div className="relative">
// //               <input 
// //                 type={showPassword ? "text" : "password"}
// //                 value={transactionPassword}
// //                 onChange={(e) => setTransactionPassword(e.target.value)}
// //                 placeholder="Enter Secure PIN"
// //                 className="w-full bg-[#131927] border border-[#2d3748] text-white px-4 py-3 rounded-lg outline-none focus:border-[#e4c568] focus:ring-1 focus:ring-[#e4c568] placeholder-gray-600 text-sm font-semibold"
// //               />
// //               <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
// //                 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
// //               </button>
// //             </div>
// //           </div>

// //           {/* Submit Button */}
// //           <button 
// //             onClick={handleSubmit}
// //             disabled={loading}
// //             className="w-full mt-2 bg-gradient-to-r from-[#d4af37] to-[#e4c568] hover:brightness-110 text-black font-extrabold py-3.5 rounded-lg shadow-[0_0_15px_rgba(228,197,104,0.3)] hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100 uppercase tracking-widest text-[14px]"
// //           >
// //             {loading ? 'Processing...' : 'CREDIT FUNDS'}
// //           </button>

// //           {/* Terms and Conditions */}
// //           <div className="mt-4 text-[#6b7280] text-[10px] leading-relaxed font-medium text-center px-2">
// //             <p>1. Convert income balance to fund balance for upgrades.</p>
// //             <p>2. Minimum transfer amount is $1.</p>
// //             <p>3. Active package upgrade is required.</p>
// //           </div>

// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default CreditToWalletModal;






// import React, { useState, useEffect } from "react";
// import api from "../../api/axios";
// import { useAuth } from "../../context/AuthContext";
// import Swal from 'sweetalert2';
// import { X, Eye, EyeOff, Zap, Users, RefreshCcw } from "lucide-react";

// const CreditToWalletModal = ({ onClose }) => {
//   const { user, token } = useAuth();
  
//   const [loading, setLoading] = useState(false);
//   const [walletData, setWalletData] = useState({ 
//     directIncome: 0, levelIncome: 0, roiIncome: 0, balance: 0 
//   });
  
//   const [directAmount, setDirectAmount] = useState("");
//   const [levelAmount, setLevelAmount] = useState("");
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
//         directIncome: res.data.directIncome || 0,
//         levelIncome: res.data.levelIncome || 0,
//         roiIncome: res.data.roiIncome || 0,
//         balance: res.data.availableBalance || 0 
//       });
//     } catch (err) {
//       console.error("Failed to fetch wallet data", err);
//     }
//   };

//   const totalSelection = (Number(directAmount) || 0) + (Number(levelAmount) || 0) + (Number(roiAmount) || 0);

//   // 🔥 YEH FUNCTION EXACT 4 DECIMALS DIKHAYEGA BINA ROUND OFF KIYE
//   // const formatExact = (num) => {
//   //   if (!num) return "0";
//   //   const str = Number(num).toString(); // Pehle usko normal string banayega
//   //   if (str.includes('.')) {
//   //     const parts = str.split('.');
//   //     return `${parts[0]}.${parts[1].substring(0, 4)}`; // Point ke baad sirf 4 number lega, kuch round nahi karega
//   //   }
//   //   return str;
//   // };

//   // 🔥 YEH FUNCTION DUST (E-16) VALUES KO BHI PROPERLY HANDLE KAREGA
//   const formatExact = (num) => {
//     if (!num) return "0.0000";
//     return Number(num).toFixed(4); 
//   };

//   const handleSubmit = async () => {
//     if (totalSelection < 1) {
//       return Swal.fire({ icon: 'warning', title: 'Invalid Amount', text: 'Minimum credit amount is $1.', background: '#111827', color: '#d4af37' });
//     }
//     if (totalSelection > walletData.balance) {
//       return Swal.fire({ icon: 'error', title: 'Insufficient Balance', text: `You only have $${formatExact(walletData.balance)} available.`, background: '#111827', color: '#ff4d4d' });
//     }
//     if (!transactionPassword) {
//       return Swal.fire({ icon: 'warning', title: 'Password Required', text: 'Enter Transaction Password.', background: '#111827', color: '#d4af37' });
//     }

//     setLoading(true);
//     try {
//       const response = await api.post('/wallet/credit-to-wallet', {
//         amount: totalSelection, 
//         transactionPassword,
//         details: { direct: directAmount, level: levelAmount, roi: roiAmount }
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
//              Wallet to Fund
//           </h2>
//           <button onClick={onClose} className="text-black hover:bg-black/10 p-1 rounded-full transition-colors">
//             <X size={20} strokeWidth={2.5} />
//           </button>
//         </div>

//         {/* Scrollable Content Area */}
//         <div className="p-4 bg-[#0b101e] flex-1 overflow-y-auto custom-scroll space-y-4">
          
//           <div className="bg-[#161c2d] border border-[#2d3748] p-3 rounded-lg text-center shadow-inner mb-2">
//             <p className="text-[10px] text-gray-400 font-bold tracking-wider mb-1 uppercase">Total Income Balance</p>
//             <p className="text-[#00ff88] font-black text-xl">${formatExact(walletData.balance)}</p>
//           </div>

//           {/* 🔥 DIRECT INCOME BOX */}
//           <div className="bg-[#1e2536] p-3.5 rounded-lg border border-[#2d3748] shadow-sm">
//             <div className="flex justify-between items-center mb-2.5">
//               <span className="text-[#e4c568] text-xs font-bold flex items-center gap-1.5"><Zap size={14}/> DIRECT INCOME</span>
//               <span className="text-gray-400 text-[11px] font-semibold">Earned: ${formatExact(walletData.directIncome)}</span>
//             </div>
//             <div className="flex items-center gap-2 bg-[#0b101e] border border-[#2d3748] rounded px-3 py-2.5 focus-within:border-[#e4c568] transition-colors">
//               <span className="text-[#e4c568] font-bold">$</span>
//               <input 
//                 type="number" value={directAmount} onChange={(e) => setDirectAmount(e.target.value)} 
//                 className="bg-transparent outline-none text-white w-full text-sm font-semibold" placeholder="0.00" 
//               />
//             </div>
//           </div>

//           {/* 🔥 LEVEL INCOME BOX */}
//           <div className="bg-[#1e2536] p-3.5 rounded-lg border border-[#2d3748] shadow-sm">
//             <div className="flex justify-between items-center mb-2.5">
//               <span className="text-[#60a5fa] text-xs font-bold flex items-center gap-1.5"><Users size={14}/> LEVEL INCOME</span>
//               <span className="text-gray-400 text-[11px] font-semibold">Earned: ${formatExact(walletData.levelIncome)}</span>
//             </div>
//             <div className="flex items-center gap-2 bg-[#0b101e] border border-[#2d3748] rounded px-3 py-2.5 focus-within:border-[#60a5fa] transition-colors">
//               <span className="text-[#60a5fa] font-bold">$</span>
//               <input 
//                 type="number" value={levelAmount} onChange={(e) => setLevelAmount(e.target.value)} 
//                 className="bg-transparent outline-none text-white w-full text-sm font-semibold" placeholder="0.00" 
//               />
//             </div>
//           </div>

//           {/* 🔥 ROI INCOME BOX */}
//           <div className="bg-[#1e2536] p-3.5 rounded-lg border border-[#2d3748] shadow-sm">
//             <div className="flex justify-between items-center mb-2.5">
//               <span className="text-[#c084fc] text-xs font-bold flex items-center gap-1.5"><RefreshCcw size={14}/> ROI INCOME</span>
//               <span className="text-gray-400 text-[11px] font-semibold">Earned: ${formatExact(walletData.roiIncome)}</span>
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
//             <span className="text-gray-300 text-xs font-extrabold tracking-widest uppercase">Total Transfer</span>
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
//             disabled={loading}
//             className="w-full mt-2 bg-gradient-to-r from-[#d4af37] to-[#e4c568] hover:brightness-110 text-black font-extrabold py-3.5 rounded-lg shadow-[0_0_15px_rgba(228,197,104,0.3)] hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100 uppercase tracking-widest text-[14px]"
//           >
//             {loading ? 'Processing...' : 'CREDIT FUNDS'}
//           </button>

//           {/* Terms and Conditions */}
//           <div className="mt-4 text-[#6b7280] text-[10px] leading-relaxed font-medium text-center px-2">
//             <p>1. Convert income balance to fund balance for upgrades.</p>
//             <p>2. Minimum transfer amount is $1.</p>
//             <p>3. Active package upgrade is required.</p>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreditToWalletModal;









 import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import Swal from 'sweetalert2';
import { X, Eye, EyeOff, Zap, Users, RefreshCcw, Gift } from "lucide-react";

const CreditToWalletModal = ({ onClose }) => {
  const { user, token } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [walletData, setWalletData] = useState({ 
    directIncome: 0, levelIncome: 0, roiIncome: 0, balance: 0 
  });
  
  const [directAmount, setDirectAmount] = useState("");
  const [levelAmount, setLevelAmount] = useState("");
  const [roiAmount, setRoiAmount] = useState("");
  const [transactionPassword, setTransactionPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // 🔥 SALARY STATES
  const [salaryInfo, setSalaryInfo] = useState(null);
  const [claimingSalary, setClaimingSalary] = useState(false);

  useEffect(() => {
    fetchWalletData();
    fetchSalaryData(); // Modal khulte hi salary status bhi layega
  }, []);

  const fetchWalletData = async () => {
    try {
      const res = await api.get(`/wallet/info`, { headers: { Authorization: `Bearer ${token}` }});
      setWalletData({
        directIncome: res.data.directIncome || 0,
        levelIncome: res.data.levelIncome || 0,
        roiIncome: res.data.roiIncome || 0,
        balance: res.data.availableBalance || 0 
      });
    } catch (err) {
      console.error("Failed to fetch wallet data", err);
    }
  };

  // 🔥 FETCH SALARY PROGRESS API
  const fetchSalaryData = async () => {
    try {
      const res = await api.get(`/user/salary-progress/${user.userId}`, { 
        headers: { Authorization: `Bearer ${token}` }
      });
      setSalaryInfo(res.data.data);
    } catch (err) {
      console.error("Failed to fetch salary info", err);
    }
  };

  const totalSelection = (Number(directAmount) || 0) + (Number(levelAmount) || 0) + (Number(roiAmount) || 0);

  const formatExact = (num) => {
    if (!num) return "0.0000";
    return Number(num).toFixed(4); 
  };

  // 🔥 CLAIM SALARY BUTTON FUNCTION
  const handleClaimSalary = async () => {
    setClaimingSalary(true);
    try {
      const res = await api.post('/wallet/claim-salary', {}, { 
        headers: { Authorization: `Bearer ${token}` }
      });
      Swal.fire({ icon: 'success', title: '🎉 Success!', text: res.data.message, background: '#111827', color: '#d4af37' });
      fetchSalaryData(); // Status update karo
      fetchWalletData(); // Main wallet balance update karo
    } catch (err) {
      // BACKEND KA MESSAGE YAHAN POPUP HOGA JAB CRITERIA FAIL HOGA (eg. 3 L1 & 6 L2 active)
      Swal.fire({ icon: 'error', title: 'Claim Failed', text: err.response?.data?.message || 'Something went wrong.', background: '#111827', color: '#ff4d4d' });
    } finally {
      setClaimingSalary(false);
    }
  };

  const handleSubmit = async () => {
    if (totalSelection < 1) {
      return Swal.fire({ icon: 'warning', title: 'Invalid Amount', text: 'Minimum credit amount is $1.', background: '#111827', color: '#d4af37' });
    }
    if (totalSelection > walletData.balance) {
      return Swal.fire({ icon: 'error', title: 'Insufficient Balance', text: `You only have $${formatExact(walletData.balance)} available.`, background: '#111827', color: '#ff4d4d' });
    }
    if (!transactionPassword) {
      return Swal.fire({ icon: 'warning', title: 'Password Required', text: 'Enter Transaction Password.', background: '#111827', color: '#d4af37' });
    }

    setLoading(true);
    try {
      const response = await api.post('/wallet/credit-to-wallet', {
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
             Wallet to Fund
          </h2>
          <button onClick={onClose} className="text-black hover:bg-black/10 p-1 rounded-full transition-colors">
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="p-4 bg-[#0b101e] flex-1 overflow-y-auto custom-scroll space-y-4">
          
          <div className="bg-[#161c2d] border border-[#2d3748] p-3 rounded-lg text-center shadow-inner mb-2">
            <p className="text-[10px] text-gray-400 font-bold tracking-wider mb-1 uppercase">Total Income Balance</p>
            <p className="text-[#00ff88] font-black text-xl">${formatExact(walletData.balance)}</p>
          </div>

          {/* DIRECT INCOME BOX */}
          <div className="bg-[#1e2536] p-3.5 rounded-lg border border-[#2d3748] shadow-sm">
            <div className="flex justify-between items-center mb-2.5">
              <span className="text-[#e4c568] text-xs font-bold flex items-center gap-1.5"><Zap size={14}/> DIRECT INCOME</span>
              <span className="text-gray-400 text-[11px] font-semibold">Earned: ${formatExact(walletData.directIncome)}</span>
            </div>
            <div className="flex items-center gap-2 bg-[#0b101e] border border-[#2d3748] rounded px-3 py-2.5 focus-within:border-[#e4c568] transition-colors">
              <span className="text-[#e4c568] font-bold">$</span>
              <input 
                type="number" value={directAmount} onChange={(e) => setDirectAmount(e.target.value)} 
                className="bg-transparent outline-none text-white w-full text-sm font-semibold" placeholder="0.00" 
              />
            </div>
          </div>

          {/* LEVEL INCOME BOX */}
          <div className="bg-[#1e2536] p-3.5 rounded-lg border border-[#2d3748] shadow-sm">
            <div className="flex justify-between items-center mb-2.5">
              <span className="text-[#60a5fa] text-xs font-bold flex items-center gap-1.5"><Users size={14}/> LEVEL INCOME</span>
              <span className="text-gray-400 text-[11px] font-semibold">Earned: ${formatExact(walletData.levelIncome)}</span>
            </div>
            <div className="flex items-center gap-2 bg-[#0b101e] border border-[#2d3748] rounded px-3 py-2.5 focus-within:border-[#60a5fa] transition-colors">
              <span className="text-[#60a5fa] font-bold">$</span>
              <input 
                type="number" value={levelAmount} onChange={(e) => setLevelAmount(e.target.value)} 
                className="bg-transparent outline-none text-white w-full text-sm font-semibold" placeholder="0.00" 
              />
            </div>
          </div>

          {/* ROI INCOME BOX */}
          <div className="bg-[#1e2536] p-3.5 rounded-lg border border-[#2d3748] shadow-sm">
            <div className="flex justify-between items-center mb-2.5">
              <span className="text-[#c084fc] text-xs font-bold flex items-center gap-1.5"><RefreshCcw size={14}/> ROI INCOME</span>
              <span className="text-gray-400 text-[11px] font-semibold">Earned: ${formatExact(walletData.roiIncome)}</span>
            </div>
            <div className="flex items-center gap-2 bg-[#0b101e] border border-[#2d3748] rounded px-3 py-2.5 focus-within:border-[#c084fc] transition-colors">
              <span className="text-[#c084fc] font-bold">$</span>
              <input 
                type="number" value={roiAmount} onChange={(e) => setRoiAmount(e.target.value)} 
                className="bg-transparent outline-none text-white w-full text-sm font-semibold" placeholder="0.00" 
              />
            </div>
          </div>

          {/* 🎁 MONTHLY SALARY CLAIM BOX (EXACTLY AS PER IMAGE) */}
          {salaryInfo && salaryInfo.salaryMonthsPaid < 6 && salaryInfo.status !== 'waiting_time' && (
            <div className="bg-[#1e2536] p-4 rounded-lg border border-[#2d3748] shadow-sm mt-2 flex justify-between items-center">
              
              {/* Left Side: Title & Month Info */}
              <div>
                 <span className="text-[#e4c568] text-[14px] font-black flex items-center gap-2 mb-2 uppercase tracking-wide">
                   <Gift size={16}/> MONTHLY SALARY
                 </span>
                 <span className="text-gray-300 text-[11px] font-bold flex items-center gap-1.5 bg-[#0b101e] px-2.5 py-1 rounded w-fit">
                    MONTH: <span className="text-[#e4c568] font-black">{(salaryInfo.salaryMonthsPaid || 0) + 1} / 6</span>
                 </span>
              </div>

              {/* Right Side: Claim Button */}
              <button 
                onClick={handleClaimSalary}
                disabled={claimingSalary}
                className="px-5 py-2.5 rounded text-[13px] font-black uppercase transition-all bg-[#00c853] hover:bg-[#00e676] text-white shadow-[0_4px_14px_0_rgba(0,200,83,0.39)] hover:shadow-[0_6px_20px_rgba(0,200,83,0.23)] hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:translate-y-0"
              >
                {claimingSalary ? 'WAIT...' : 'CLAIM $100'}
              </button>
              
            </div>
          )}

          {/* TOTAL SELECTION */}
          <div className="flex justify-between items-center bg-[#131927] border border-[#d4af37]/30 p-3.5 rounded-lg mt-2">
            <span className="text-gray-300 text-xs font-extrabold tracking-widest uppercase">Total Transfer</span>
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
            disabled={loading}
            className="w-full mt-2 bg-gradient-to-r from-[#d4af37] to-[#e4c568] hover:brightness-110 text-black font-extrabold py-3.5 rounded-lg shadow-[0_0_15px_rgba(228,197,104,0.3)] hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100 uppercase tracking-widest text-[14px]"
          >
            {loading ? 'Processing...' : 'CREDIT FUNDS'}
          </button>

          {/* Terms and Conditions */}
          <div className="mt-4 text-[#6b7280] text-[10px] leading-relaxed font-medium text-center px-2">
            <p>1. Convert income balance to fund balance for upgrades.</p>
            <p>2. Minimum transfer amount is $1.</p>
            <p>3. Active package upgrade is required.</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CreditToWalletModal;