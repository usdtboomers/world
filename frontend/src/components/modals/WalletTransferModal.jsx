// import React, { useState, useEffect } from "react";
// import api from "../../api/axios";
// import { useAuth } from "../../context/AuthContext";
// import { useNavigate } from "react-router-dom";
// import Swal from 'sweetalert2';
// import { X, Eye, EyeOff } from "lucide-react";

// const WalletTransferModal = ({ onClose }) => {
//   const { user, token } = useAuth();
//   const navigate = useNavigate();
  
//   const [loading, setLoading] = useState(false);
//   const [walletData, setWalletData] = useState({ balance: 0 });
//   const [receiverId, setReceiverId] = useState("");
//   const [amount, setAmount] = useState("");
//   const [transactionPassword, setTransactionPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);

//   useEffect(() => {
//     fetchWalletData();
//   }, []);

//   const fetchWalletData = async () => {
//     try {
//       const res = await api.get(`/wallet/info`, { headers: { Authorization: `Bearer ${token}` }});
//       // Ab backend se walletBalance aayega, toh yahan $0 nahi dikhega
//       setWalletData({ balance: res.data.walletBalance || 0 });
//     } catch (err) {
//       console.error("Failed to fetch wallet data");
//     }
//   };

//   const handleQuickAmount = (val) => setAmount(val);

//   const handleSubmit = async () => {
//     if (!receiverId) return Swal.fire({ icon: 'warning', title: 'User ID Required', text: 'Please enter receiver User ID.', background: '#0b101e', color: '#e4c568' });
//     if (!amount || amount < 1) return Swal.fire({ icon: 'warning', title: 'Invalid Amount', text: 'Minimum transfer is $1.', background: '#0b101e', color: '#e4c568' });
//     if (!transactionPassword) return Swal.fire({ icon: 'warning', title: 'Password Required', text: 'Enter Transaction Password.', background: '#0b101e', color: '#e4c568' });

//     setLoading(true);
//     try {
//       const response = await api.post('/wallet/transfer', {
//         receiverId,
//         amount: Number(amount),
//         transactionPassword
//       }, { headers: { Authorization: `Bearer ${token}` }});

//       if (response.data.success) {
//         Swal.fire({ icon: 'success', title: 'Transferred!', text: response.data.message, background: '#0b101e', color: '#e4c568' });
//         onClose();
//       }
//     } catch (err) {
//       Swal.fire({ icon: 'error', title: 'Transfer Failed', text: err.response?.data?.message || 'Something went wrong.', background: '#0b101e', color: '#ff4d4d' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[99999] flex justify-center items-center p-3 sm:p-4">
//       <div className="bg-[#0b101e] w-full max-w-[420px] max-h-[85vh] sm:max-h-[90vh] rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.15)] border border-[#2d3748] overflow-hidden flex flex-col mt-4 sm:mt-0">
        
//         <div className="bg-[#e4c568] px-4 py-3 flex justify-between items-center shrink-0">
//           <h2 className="text-black font-extrabold text-[17px] tracking-wide">Fund  Transfer</h2>
//           <button onClick={onClose} className="text-black hover:bg-black/10 p-1 rounded-full transition-colors"><X size={20} strokeWidth={2.5} /></button>
//         </div>

//         <div className="bg-[#161c2d] px-4 py-2 border-b border-[#2d3748] shrink-0">
//           <p className="text-[#e4c568] text-xs font-bold tracking-wide">Minimum $1 Amount For Transfer!</p>
//         </div>

//         <div className="p-4 bg-[#0b101e] flex-1 overflow-y-auto">
//           <div className="border border-[#2d3748] rounded-md overflow-hidden flex flex-col font-semibold text-[13px]">
//             <div className="flex border-b border-[#2d3748]">
//               <div className="w-2/3 bg-[#131927] text-white p-2.5 border-r border-[#2d3748]">Available Fund Balance</div>
//               <div className="w-1/3 bg-[#131927] text-[#00ff88] p-2.5">${walletData.balance.toFixed(2)}</div>
//             </div>
//           </div>

//           <div className="mt-4 space-y-3">
//             {/* <input type="text" value={receiverId} onChange={(e) => setReceiverId(e.target.value)} placeholder="Enter Receiver User ID" className="w-full bg-[#131927] border border-[#2d3748] text-white px-3 py-2.5 rounded outline-none focus:border-[#e4c568] focus:ring-1 focus:ring-[#e4c568] placeholder-gray-500 text-sm" /> */}
            
//             <input 
//     type="text" 
//     value={receiverId} 
//     // 🔥 YAHAN CHANGE KIYA HAI: .toUpperCase() add kiya hai
//     onChange={(e) => setReceiverId(e.target.value.toUpperCase())} 
//     placeholder="Enter Receiver User ID" 
//     // 🔥 YAHAN CHANGE KIYA HAI: End me 'uppercase' class add ki hai
//     className="w-full bg-[#131927] border border-[#2d3748] text-white px-3 py-2.5 rounded outline-none focus:border-[#e4c568] focus:ring-1 focus:ring-[#e4c568] placeholder-gray-500 text-sm uppercase" 
// />

//             <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter Transfer Amount ($)" className="w-full bg-[#131927] border border-[#2d3748] text-white px-3 py-2.5 rounded outline-none focus:border-[#e4c568] focus:ring-1 focus:ring-[#e4c568] placeholder-gray-500 text-sm" />
            
//             <div className="flex gap-2">
//               {[1, 5, 10, 20, 50].map((val) => (
//                 <button key={val} type="button" onClick={() => handleQuickAmount(val)} className="flex-1 bg-[#1e2536] hover:bg-[#2d3748] border border-[#2d3748] text-white py-1.5 rounded font-bold text-sm transition-colors">${val}</button>
//               ))}
//             </div>

//             <div className="relative mt-2">
//               <input type={showPassword ? "text" : "password"} value={transactionPassword} onChange={(e) => setTransactionPassword(e.target.value)} placeholder="Enter Transaction Password" className="w-full bg-[#131927] border border-[#2d3748] text-white px-3 py-2.5 rounded outline-none focus:border-[#e4c568] focus:ring-1 focus:ring-[#e4c568] placeholder-gray-500 pr-10 text-sm" />
//               <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
//             </div>

//             <button onClick={handleSubmit} disabled={loading} className="w-full mt-3 bg-[#e4c568] hover:bg-[#d4af37] text-black font-extrabold py-2.5 rounded shadow-[0_0_10px_rgba(228,197,104,0.3)] hover:scale-[1.02] transition-transform disabled:opacity-70 disabled:hover:scale-100 uppercase tracking-widest text-[15px]">
//               {loading ? 'Processing...' : 'TRANSFER FUNDS'}
//             </button>
//           </div>

//           <div className="mt-4 pb-2 text-[#9ca3af] text-[11px] leading-relaxed font-medium">
//             <h4 className="text-[#e4c568] font-bold text-xs mb-1.5">Terms & Conditions</h4>
//             <p>1. Minimum transfer amount is $1.</p>
//             <p>2. Fund transfers cannot be reversed once processed.</p>
//             <p>3. Active package upgrade is required for transfers.</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WalletTransferModal;

import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { X, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";

const WalletTransferModal = ({ onClose }) => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [walletData, setWalletData] = useState({ balance: 0 });
  const [receiverId, setReceiverId] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionPassword, setTransactionPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // 🔥 NAYE STATES: Receiver ka naam aur loading check karne ke liye
  const [receiverName, setReceiverName] = useState("");
  const [isCheckingName, setIsCheckingName] = useState(false);

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

  // ==========================================
  // 🔥 RECEIVER NAME FETCH LOGIC (Debounced)
  // ==========================================
  useEffect(() => {
    const checkReceiverName = async () => {
      // Agar ID 5 character se choti hai, toh check mat karo
      if (receiverId.length < 5) {
        setReceiverName("");
        return;
      }
      
      setIsCheckingName(true);
      try {
        // Aapke existing check-sponsor route ko call kar raha hai
        const res = await api.get(`/user/check-sponsor/${receiverId}`);
        setReceiverName(res.data.name);
      } catch (err) {
        setReceiverName("Invalid User ID");
      } finally {
        setIsCheckingName(false);
      }
    };

    // User ke type karne ke baad 500ms (aadha second) wait karke API call karega (Load bachane ke liye)
    const timeoutId = setTimeout(checkReceiverName, 500);
    return () => clearTimeout(timeoutId);
  }, [receiverId]);

  const handleQuickAmount = (val) => setAmount(val);

  const handleSubmit = async () => {
    if (!receiverId) return Swal.fire({ icon: 'warning', title: 'User ID Required', text: 'Please enter receiver User ID.', background: '#0b101e', color: '#e4c568' });
    if (receiverName === "Invalid User ID") return Swal.fire({ icon: 'error', title: 'Invalid Receiver', text: 'Please enter a valid User ID.', background: '#0b101e', color: '#ff4d4d' });
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
          <h2 className="text-black font-extrabold text-[17px] tracking-wide">Fund  Transfer</h2>
          <button onClick={onClose} className="text-black hover:bg-black/10 p-1 rounded-full transition-colors"><X size={20} strokeWidth={2.5} /></button>
        </div>

        <div className="bg-[#161c2d] px-4 py-2 border-b border-[#2d3748] shrink-0">
          <p className="text-[#e4c568] text-xs font-bold tracking-wide">Minimum $1 Amount For Transfer!</p>
        </div>

        <div className="p-4 bg-[#0b101e] flex-1 overflow-y-auto">
          <div className="border border-[#2d3748] rounded-md overflow-hidden flex flex-col font-semibold text-[13px]">
            <div className="flex border-b border-[#2d3748]">
              <div className="w-2/3 bg-[#131927] text-white p-2.5 border-r border-[#2d3748]">Available Fund Balance</div>
              <div className="w-1/3 bg-[#131927] text-[#00ff88] p-2.5">${walletData.balance.toFixed(2)}</div>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            
            {/* 🔥 RECEIVER ID INPUT WITH NAME PREVIEW */}
            <div>
                <input 
                    type="text" 
                    value={receiverId} 
                    onChange={(e) => setReceiverId(e.target.value.toUpperCase())} 
                    placeholder="Enter Receiver User ID" 
                    className={`w-full bg-[#131927] border text-white px-3 py-2.5 rounded outline-none placeholder-gray-500 text-sm uppercase transition-colors ${receiverName === "Invalid User ID" ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500" : "border-[#2d3748] focus:border-[#e4c568] focus:ring-1 focus:ring-[#e4c568]"}`} 
                />
                
                {/* Name validation visual feedback */}
                <div className="h-5 mt-1 px-1">
                  {isCheckingName ? (
                    <span className="text-[11px] text-gray-400 font-medium flex items-center gap-1.5 animate-pulse">
                       <span className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></span> Checking ID...
                    </span>
                  ) : receiverName && receiverName !== "Invalid User ID" ? (
                    <span className="text-[12px] text-[#00ff88] font-bold flex items-center gap-1.5 capitalize tracking-wide">
                       <CheckCircle2 size={14} /> {receiverName}
                    </span>
                  ) : receiverName === "Invalid User ID" ? (
                    <span className="text-[12px] text-red-400 font-bold flex items-center gap-1.5 tracking-wide">
                       <AlertCircle size={14} /> Invalid User ID
                    </span>
                  ) : null}
                </div>
            </div>

            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter Transfer Amount ($)" className="w-full bg-[#131927] border border-[#2d3748] text-white px-3 py-2.5 rounded outline-none focus:border-[#e4c568] focus:ring-1 focus:ring-[#e4c568] placeholder-gray-500 text-sm" />
            
            <div className="flex gap-2">
              {[1, 5, 10, 20, 50].map((val) => (
                <button key={val} type="button" onClick={() => handleQuickAmount(val)} className="flex-1 bg-[#1e2536] hover:bg-[#2d3748] border border-[#2d3748] text-white py-1.5 rounded font-bold text-sm transition-colors">${val}</button>
              ))}
            </div>

            <div className="relative mt-2">
              <input type={showPassword ? "text" : "password"} value={transactionPassword} onChange={(e) => setTransactionPassword(e.target.value)} placeholder="Enter Transaction Password" className="w-full bg-[#131927] border border-[#2d3748] text-white px-3 py-2.5 rounded outline-none focus:border-[#e4c568] focus:ring-1 focus:ring-[#e4c568] placeholder-gray-500 pr-10 text-sm" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
            </div>

            <button onClick={handleSubmit} disabled={loading || receiverName === "Invalid User ID"} className="w-full mt-3 bg-[#e4c568] hover:bg-[#d4af37] text-black font-extrabold py-2.5 rounded shadow-[0_0_10px_rgba(228,197,104,0.3)] hover:scale-[1.02] transition-transform disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed uppercase tracking-widest text-[15px]">
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