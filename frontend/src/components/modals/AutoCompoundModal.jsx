import React, { useState, useEffect } from "react";
import api from "../../api/axios"; 
import MessageModal from "./MessageModal";
import { useAuth } from "../../context/AuthContext";
import { X, Eye, EyeOff, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react"; 

const AutoCompoundModal = ({ onClose, onSuccess, packageAmount }) => {
  const { user: loggedInUser, token, login } = useAuth();
  
  // Check if user is Promo
  const isPromoUser = loggedInUser?.role === "promo";
  
  const [memberId, setMemberId] = useState(loggedInUser?.userId || "");
  const [fundWallet, setFundWallet] = useState(0);
  const [transactionPassword, setTransactionPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔥 NAYA STATE: Compounding Duration (25, 50, 100)
  const [duration, setDuration] = useState(25);

  // RECEIVER NAME FETCH LOGIC (Debounced)
  const [receiverName, setReceiverName] = useState("");
  const [isCheckingName, setIsCheckingName] = useState(false);

  const [messageModal, setMessageModal] = useState({ open: false, title: "", message: "", type: "info" });
  const showMessage = (title, message, type = "info") => setMessageModal({ open: true, title, message, type });

  // 1. Fetch Fund Wallet Balance
  useEffect(() => {
    const fetchBalance = async () => {
      if (!loggedInUser?.userId || !token) return;
      try {
        const res = await api.get(`/user/${loggedInUser.userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFundWallet(res.data.user.walletBalance || 0);
      } catch (err) {
        console.error(err);
        setFundWallet(0);
      }
    };
    fetchBalance();
  }, [loggedInUser?.userId, token]);

  // 2. Fetch Receiver Name Logic
  useEffect(() => {
    const checkReceiverName = async () => {
      if (isPromoUser) return; 
      if (memberId.length < 5) {
        setReceiverName("");
        return;
      }
      
      setIsCheckingName(true);
      try {
        const res = await api.get(`/user/check-sponsor/${memberId}`);
        setReceiverName(res.data.name);
      } catch (err) {
        setReceiverName("Invalid User ID");
      } finally {
        setIsCheckingName(false);
      }
    };

    const timeoutId = setTimeout(checkReceiverName, 500);
    return () => clearTimeout(timeoutId);
  }, [memberId, isPromoUser]);

  // 3. Handle Form Submit (Auto Compound Logic)
  const handleBuyPackage = async (e) => {
    e.preventDefault();
    if (!isPromoUser && !memberId) return showMessage("Error", "❌ Please enter Member ID.", "error");
    if (!isPromoUser && receiverName === "Invalid User ID") return showMessage("Error", "❌ Invalid Member ID.", "error");
    if (!transactionPassword) return showMessage("Error", "❌ Enter transaction password.", "error");
    
    setLoading(true);

    try {
      if (isPromoUser) {
        // PROMO USER LOGIC (Agar auto compound me promo allow karna hai toh)
        const response = await api.post('/transactions/promo-dummy-topup', {
          amount: packageAmount,
          transactionPassword: transactionPassword,
          duration: duration // Sending duration as well
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          showMessage(
            "Success", 
            `Auto Compound Package of $${packageAmount} (Timer: 100 Days) activated for ${response.data.generatedId}!`, 
            "success"
          );
          setTransactionPassword("");
         }
      } else {
        // ===========================================
        // 🔥 NORMAL USER LOGIC (New Backend Route call)
        // ===========================================
        // Note: Apne backend route ka naam yahan check kar lena (maine activate-auto-compound rakha hai)
        const response = await api.post('/package/activate-auto-compound', {
          userId: loggedInUser.userId,
          memberId: memberId,
          packageAmount: packageAmount,
          txnPassword: transactionPassword,
          duration: duration // 🔥 Yeh backend ko pass kar rahe hain
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          showMessage("Success", response.data.message, "success");
          
          // Update local wallet state
          const refreshedRes = await api.get(`/user/${loggedInUser.userId}`, { headers: { Authorization: `Bearer ${token}` } });
          login(refreshedRes.data.user, token);
          setFundWallet(refreshedRes.data.user.walletBalance);

          
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message || "❌ Auto Compound Activation failed";
      showMessage("Transaction Failed", msg, "error");
    } finally {
      setLoading(false);
    }
  };

  // Reset button ka logic
  const handleReset = () => {
    setMemberId(loggedInUser?.userId || "");
    setTransactionPassword("");
    setDuration(25); // Reset duration to 25
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[9990] flex justify-center items-center p-3 sm:p-4">
        {/* Dark Navy Theme Container */}
        <div className="bg-[#0b101e] w-full max-w-[420px] max-h-[85vh] sm:max-h-[90vh] rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.15)] border border-[#2d3748] overflow-hidden flex flex-col mt-4 sm:mt-0">
          
          {/* Header - Gold Theme */}
          <div className="bg-[#e4c568] px-4 py-3 flex justify-between items-center shrink-0">
            <h2 className="text-black font-extrabold text-[17px] tracking-wide">
              {isPromoUser ? "Promo Auto Compound" : "Auto Compound Package (6%)"}
            </h2>
            <button onClick={onClose} className="text-black hover:bg-black/10 p-1 rounded-full transition-colors">
              <X size={20} strokeWidth={2.5} />
            </button>
          </div>

          {/* Sub Header Notice */}
          <div className="bg-[#161c2d] px-4 py-2 border-b border-[#2d3748] shrink-0">
            <p className="text-[#e4c568] text-xs font-bold tracking-wide">
              {isPromoUser ? "System will generate Fake Profile & Feed Entry" : "Confirm Auto Compounding Details"}
            </p>
          </div>

          {/* Content Body */}
          <div className="p-4 bg-[#0b101e] flex-1 overflow-y-auto">
            <form onSubmit={handleBuyPackage} className="space-y-4">
              
              {/* Balance Display Box */}
              <div className="border border-[#2d3748] rounded-md overflow-hidden flex flex-col font-semibold text-[13px] mb-2">
                <div className="flex border-b border-[#2d3748]">
                  <div className="w-2/3 bg-[#131927] text-white p-2.5 border-r border-[#2d3748]">Fund Amount</div>
                  <div className="w-1/3 bg-[#131927] text-[#00ff88] p-2.5">${fundWallet.toFixed(2)}</div>
                </div>
              </div>

              {/* User Id (Read-only for normal users) */}
              {!isPromoUser && (
                <div>
                  <label className="text-gray-400 text-[11px] uppercase tracking-wider font-bold mb-1 block">Your User ID</label>
                  <input 
                    type="text" 
                    value={loggedInUser?.userId || ""} 
                    readOnly 
                    className="w-full bg-[#131927] border border-[#2d3748] text-gray-400 px-3 py-2.5 rounded outline-none text-sm cursor-not-allowed"
                  />
                </div>
              )}

              {/* Target Member ID Box */}
              {isPromoUser ? (
                <div>
                  <label className="text-[#e4c568] text-[11px] uppercase tracking-wider font-bold mb-1 block"> Member ID</label>
                  <div className="w-full bg-[#131927] border border-[#2d3748] text-[#e4c568] px-3 py-3 rounded flex items-center gap-2 shadow-inner text-sm font-bold">
                     <ShieldCheck size={18} /> System will Auto-Generate Dummy ID
                  </div>
                </div>
              ) : (
                <div>
                  <label className="text-[#e4c568] text-[11px] uppercase tracking-wider font-bold mb-1 block"> Member ID</label>
                  <input 
                    type="text" 
                    value={memberId} 
                    onChange={(e) => setMemberId(e.target.value.toUpperCase())}
                    required
                    placeholder="Enter Member ID"
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
              )}

              {/* Package Amount (Read-only) */}
              <div>
                <label className="text-gray-400 text-[11px] uppercase tracking-wider font-bold mb-1 block">Package Amount ($)</label>
                <input 
                  type="text" 
                  value={`$${packageAmount}`} 
                  readOnly 
                  className="w-full bg-[#131927] border border-[#2d3748] text-gray-400 px-3 py-2.5 rounded outline-none text-sm cursor-not-allowed font-mono"
                />
              </div>

              {/* 🔥 NEW: Compounding Duration Selection */}
              <div>
                <label className="text-[#e4c568] text-[11px] uppercase tracking-wider font-bold mb-1 block">Compounding Cycle (Days)</label>
                <div className="flex gap-2">
                  {[25, 50, 100].map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setDuration(days)}
                      className={`flex-1 py-2 text-sm font-extrabold rounded border transition-colors ${
                        duration === days 
                          ? 'bg-[#e4c568] text-black border-[#e4c568] shadow-[0_0_10px_rgba(228,197,104,0.4)]' 
                          : 'bg-[#131927] text-gray-400 border-[#2d3748] hover:border-gray-500'
                      }`}
                    >
                      {days} Days
                    </button>
                  ))}
                </div>
              </div>

              {/* Transaction Password (With Show/Hide) */}
              <div>
                <label className="text-[#e4c568] text-[11px] uppercase tracking-wider font-bold mb-1 block">Transaction Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={transactionPassword} 
                    onChange={(e) => setTransactionPassword(e.target.value)}
                    required
                    placeholder="Enter Trx Password"
                    className="w-full bg-[#131927] border border-[#2d3748] text-white px-3 py-2.5 rounded outline-none focus:border-[#e4c568] focus:ring-1 focus:ring-[#e4c568] placeholder-gray-500 pr-10 text-sm"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4 pt-2">
                <button 
                  type="button" 
                  onClick={handleReset}
                  className="w-1/3 bg-[#1e2536] hover:bg-[#2d3748] text-white font-bold py-2.5 rounded border border-[#2d3748] transition-colors text-sm uppercase tracking-wider"
                >
                  Reset
                </button>
                <button 
                  type="submit" 
                  disabled={loading || (!isPromoUser && receiverName === "Invalid User ID")}
                  className="w-2/3 bg-[#e4c568] hover:bg-[#d4af37] text-black font-extrabold py-2.5 rounded shadow-[0_0_10px_rgba(228,197,104,0.3)] hover:scale-[1.02] transition-transform disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed uppercase tracking-widest text-[14px]"
                >
                  {loading ? "Processing..." : (isPromoUser ? "Generate & Activate" : "Activate Now")}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>

     <div className="relative z-[999999]">
        <MessageModal
          isOpen={messageModal.open}
          onClose={() => {
            // 1. Message modal ko band karo
            setMessageModal({ ...messageModal, open: false });
            
            // 2. Agar success message tha, toh main modal ko bhi band kar do
            if (messageModal.type === "success") {
              if (onSuccess) onSuccess();
            }
          }}
          title={messageModal.title}
          message={messageModal.message}
          type={messageModal.type}
        />
      </div>
    </>
  );
};

export default AutoCompoundModal;