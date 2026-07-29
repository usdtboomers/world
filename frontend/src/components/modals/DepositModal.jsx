// import React, { useEffect, useState } from "react";
// import api from "../../api/axios"; 
// import { QRCodeCanvas } from "qrcode.react";
// import { Copy, CheckCircle2, AlertTriangle, X, Wallet, QrCode } from "lucide-react";

// // 🔥 FIX: 'isOpen' yahan se hata diya kyunki UserLayout already condition check kar raha hai
// export default function DepositModal({ onClose, user, userId }) {
//   const [address, setAddress] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [copied, setCopied] = useState(false);

//   // Fetch the permanent address when the modal opens
//   useEffect(() => {
//     // 🔥 FIX: Jaise hi ye load hoga, turant API hit karega
//     if (userId) {
//       fetchDepositAddress();
//     }
//   }, [userId]);

//   const fetchDepositAddress = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('token');
      
//       const res = await api.get("/deposit/get-address", {
//         headers: { Authorization: `Bearer ${token}` }
//       }); 
      
//       setAddress(res.data.address);
//     } catch (err) {
//       console.error("Failed to fetch address", err);
//       alert("Could not load deposit address. Please try again.");
//       onClose(); 
//     } finally {
//       setLoading(false);
//     }
//   };

//   const copyText = async () => {
//     if (!address) return;
//     try {
//       if (navigator.clipboard?.writeText) {
//         await navigator.clipboard.writeText(address);
//       } else {
//         const ta = document.createElement("textarea");
//         ta.value = address;
//         document.body.appendChild(ta);
//         ta.select();
//         document.execCommand("copy");
//         document.body.removeChild(ta);
//       }
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     } catch {
//       alert("Copy failed. Please copy manually.");
//     }
//   };

//   // 🔥 FIX: Wo 'return null' wali line yahan se completely hata di hai!

//   return (
//     <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[1000] flex justify-center items-center p-4">
      
//       {/* Modal Container - Height Compact & Scrollable */}
//       <div className="bg-white mt-8 w-full max-w-md rounded-3xl border border-slate-200 shadow-2xl flex flex-col relative overflow-hidden animate-in zoom-in duration-300 max-h-[90vh]">
        
//         {/* Ambient Glow Effects */}
//         <div className="absolute top-0 right-0 w-32 h-32 bg-green-100 blur-[60px] pointer-events-none rounded-full"></div>
//         <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-50 blur-[60px] pointer-events-none rounded-full"></div>

//         {/* Header - Padding Reduced */}
//         <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center relative z-10 shrink-0">
//            <div className="flex items-center gap-3">
//               <div className="p-2 bg-green-100 rounded-xl border border-green-200 text-green-600">
//                   <Wallet size={18} />
//               </div>
//               <div>
//                 <h2 className="text-slate-800 font-black text-base md:text-lg uppercase tracking-wide flex items-center gap-2">
//                   Deposit USDT
//                   <span className="bg-green-100 text-green-700 border border-green-200 text-[9px] px-2 py-0.5 rounded-md font-bold tracking-widest">
//                     BEP-20
//                   </span>
//                 </h2>
//                 <p className="text-black text-[9px] font-bold uppercase tracking-widest mt-0.5">Add funds to your wallet</p>
//               </div>
//            </div>
//            <button onClick={onClose} className="group bg-white hover:bg-red-50 p-1.5 md:p-2 rounded-full transition-all border border-slate-200 hover:border-red-200 shadow-sm cursor-pointer">
//               <X size={18} className="text-slate-400 group-hover:text-red-500" />
//            </button>
//         </div>

//         {/* Body - Padding Reduced & Scrollbar Added */}
//         <div className="p-4 md:p-5 relative z-10 flex flex-col items-center bg-white overflow-y-auto custom-scroll">
//           {loading ? (
//             <div className="py-10 flex flex-col items-center justify-center gap-4">
//                <svg className="animate-spin h-8 w-8 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                </svg>
//                <p className="text-black text-[10px] font-bold uppercase tracking-widest animate-pulse">Generating Secure Address...</p>
//             </div>
//           ) : (
//             <div className="w-full">
//               <p className="text-center text-black text-[10px] md:text-[11px] font-medium mb-4 px-1">
//                 Send any amount of USDT to this address. Your wallet will be credited automatically.
//               </p>

//               {/* QR Code Container */}
//               <div className="flex justify-center mb-4 relative">
//                  <div className="absolute inset-0 bg-green-100 rounded-3xl blur-[15px] opacity-60"></div>
//                  <div className="relative p-2.5 bg-white rounded-2xl border-2 border-slate-100 shadow-md flex flex-col items-center">
//                    <QRCodeCanvas value={address} size={120} level="H" />
//                    <div className="mt-1.5 text-slate-400 font-black text-[8px] tracking-widest uppercase flex items-center gap-1">
//                       <QrCode size={10} /> Scan to Pay
//                    </div>
//                  </div>
//               </div>

//               {/* Address Display & Copy */}
//               <div className="w-full">
//                 <label className="block text-[9px] font-bold text-black mb-1 ml-1 uppercase tracking-wider">
//                   Your Permanent Deposit Address
//                 </label>
//                 <div className="flex flex-col sm:flex-row gap-2">
//                   <input
//                     readOnly
//                     value={address}
//                     onFocus={(e) => e.target.select()}
//                     className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 text-[11px] md:text-xs font-mono tracking-wider focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all text-center sm:text-left shadow-inner"
//                   />
//                   <button 
//                     onClick={copyText} 
//                     className={`flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl font-black text-[11px] tracking-wide transition-all shadow-sm shrink-0 ${
//                         copied 
//                             ? 'bg-green-50 text-green-600 border border-green-200' 
//                             : 'bg-green-600 hover:bg-green-700 text-white border border-transparent hover:-translate-y-0.5 active:scale-95'
//                     }`}
//                   >
//                     {copied ? <><CheckCircle2 size={14} /> COPIED</> : <><Copy size={14} /> COPY</>}
//                   </button>
//                 </div>
//               </div>

//               {/* Warning Note */}
//               <div className="mt-4 bg-red-50 border border-red-200 p-3 rounded-xl flex items-start gap-2 shadow-sm">
//                 <AlertTriangle className="text-red-500 shrink-0 w-4 h-4 mt-0.5" />
//                 <p className="text-red-600 text-[9px] md:text-[10px] font-bold leading-relaxed">
//                   <span className="text-red-800 font-black">WARNING:</span> Send only USDT via the <span className="text-red-800 font-black">BNB Smart Chain (BEP-20)</span> network.
//                 </p>
//               </div>

//               {/* Cancel Button */}
//               <div className="mt-4 pt-3 border-t border-slate-100 w-full">
//                  <button 
//                    onClick={onClose} 
//                    className="w-full py-2.5 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors shadow-sm"
//                  >
//                     Cancel
//                  </button>
//               </div>

//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import api from "../../api/axios"; 
import { QRCodeCanvas } from "qrcode.react";
import { ChevronLeft } from "lucide-react"; // Image me back arrow '<' hai, uske liye
import Swal from 'sweetalert2';
import SuccessModal from "./SuccessModal"; 

export default function DepositModal({ onClose, user, userId }) {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false); 

  // 🔥 FORM STATES (Naye image ke hisaab se)
  const [amount, setAmount] = useState("");
  const [txnHash, setTxnHash] = useState("");

  // Nayi states custom modal ke liye
  const [isSuccessMode, setIsSuccessMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Exchange rate assumption (1 USDT = 90 INR) - Aap isko apne hisaab se change kar sakte hain
  const exchangeRate = 90; 

  useEffect(() => {
    if (userId) {
      fetchDepositAddress();
    }
  }, [userId]);

  const fetchDepositAddress = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const res = await api.get("/deposit/get-address", {
        headers: { Authorization: `Bearer ${token}` }
      }); 
      
      setAddress(res.data.address);
    } catch (err) {
      console.error("Failed to fetch address", err);
      alert("Could not load deposit address. Please try again.");
      onClose(); 
    } finally {
      setLoading(false);
    }
  };

  const copyText = async () => {
    if (!address) return;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(address);
      } else {
        const ta = document.createElement("textarea");
        ta.value = address;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Copy failed. Please copy manually.");
    }
  };

  // 🔥 Form Reset Function
  const handleReset = () => {
    setAmount("");
    setTxnHash("");
  };

  // 🔥 Submit Form Function
  const handleSubmit = async () => {
    if (!amount || !txnHash) {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete',
        text: 'Please enter both Amount and Transaction Hash!',
      });
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');

      // Note: Backend me amount aur hash bhejna zaroori hai is naye form ke sath
      const response = await api.post('/deposit/verify-deposit', {
        amount: Number(amount),
        transactionHash: txnHash
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setSuccessMessage(response.data.message || "Deposit submitted successfully!");
        setIsSuccessMode(true);
      }
    } catch (error) {
      Swal.fire({
        icon: 'info',
        title: 'Pending...',
        text: error.response?.data?.message || "Deposit not found or pending. Please wait.",
        confirmButtonColor: '#ff8c00'
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Agar Success ho gaya toh apna Naya Wala Modal dikhao
  if (isSuccessMode) {
    return (
      <SuccessModal 
        isOpen={true}
        onClose={() => {
          onClose(); 
          window.location.reload(); 
        }}
        customTitle="Payment Submitted! 🎉"
        customMessage={successMessage}
        zIndex={2050} 
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-[1000] flex justify-center items-center p-0 sm:p-4">
      
      {/* 🔶 MAIN MODAL CONTAINER (Orange Background) */}
      <div className="bg-[#ff8c00] w-full h-full sm:h-auto sm:max-h-[95vh] sm:max-w-xl sm:rounded-md flex flex-col relative overflow-y-auto custom-scroll shadow-2xl">
        
        {/* Header with Back Button */}
        <div className="p-4 flex items-center gap-2">
          <button onClick={onClose} className="text-gray-800 hover:text-black transition-colors cursor-pointer">
            <ChevronLeft size={28} strokeWidth={2.5} />
          </button>
          <h2 className="text-[22px] font-bold text-gray-800">
            Instant Deposite Fund
          </h2>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-6 flex-1 flex flex-col">
          
          {/* Form Fields */}
          <div className="space-y-4 mb-6">
            
            {/* USDT Amount */}
            <div>
              <label className="block text-gray-800 text-[15px] mb-1.5">Fund Amount (USDT)</label>
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter USDT Amount" 
                className="w-full p-2.5 bg-white text-gray-800 rounded-sm border-none outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

          
            {/* Transaction Hash */}
            <div>
              <label className="block text-gray-800 text-[15px] mb-1.5">Transaction Hash</label>
              <input 
                type="text" 
                value={txnHash}
                onChange={(e) => setTxnHash(e.target.value)}
                placeholder="Paste Transaction Hash" 
                className="w-full p-2.5 bg-white text-gray-800 rounded-sm border-none outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-gray-700 text-xs mt-1">Example : 0x123456789abcdef....</p>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-8">
            <button 
              onClick={handleSubmit} 
              disabled={submitting || loading}
              className="bg-[#007bff] hover:bg-blue-600 text-white font-medium px-6 py-2 rounded-sm transition-colors shadow-sm disabled:opacity-70"
            >
              {submitting ? "Wait..." : "Submit"}
            </button>
            <button 
              onClick={handleReset}
              className="bg-[#f8f9fa] hover:bg-gray-200 text-gray-800 font-medium px-6 py-2 rounded-sm transition-colors shadow-sm"
            >
              Reset
            </button>
          </div>

          {/* QR Code Section */}
          <div className="flex flex-col items-center">
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              USDT (BEP-20) Wallet Address
            </h3>

            {loading ? (
              <div className="w-[180px] h-[180px] bg-white/50 animate-pulse rounded-md flex items-center justify-center mb-4">
                <span className="text-gray-700 text-sm font-bold">Loading QR...</span>
              </div>
            ) : (
              <div className="bg-white p-3 rounded-sm shadow-md mb-6 inline-block">
                <QRCodeCanvas value={address} size={200} level="H" />
              </div>
            )}

            {/* Readonly Address Field */}
            <div className="w-full mb-3">
              <input 
                type="text" 
                value={address || "Loading address..."}
                readOnly
                className="w-full p-2.5 bg-[#e9ecef] text-gray-600 text-sm md:text-base rounded-sm border-none outline-none text-center sm:text-left shadow-inner"
              />
            </div>

            {/* Copy Button */}
            <div className="w-full flex justify-start">
              <button 
                onClick={copyText}
                className="bg-[#007bff] hover:bg-blue-600 text-white font-medium px-6 py-2 rounded-sm transition-colors shadow-sm"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>

          </div>

        </div>
      </div>
      
    </div>
  );
}