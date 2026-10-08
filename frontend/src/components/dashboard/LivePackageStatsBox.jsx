import React, { useState, useEffect } from "react";
import { X } from "lucide-react"; 
import api from "../../api/axios"; 
import { useAuth } from "../../context/AuthContext"; 

const LivePackageStatsBox = ({ user }) => {
  const { token } = useAuth(); 

  const [highestActive, setHighestActive] = useState(0);
  const [totalCompound, setTotalCompound] = useState(0);

  const isPromo = user?.role === 'promo';
  const [promoCompound, setPromoCompound] = useState(() => localStorage.getItem(`promo_compound_${user?.userId}`) || null);
  const [promoHighest, setPromoHighest] = useState(() => localStorage.getItem(`promo_highest_${user?.userId}`) || null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editType, setEditType] = useState(""); 
  const [editValue, setEditValue] = useState("");

  const getSafeAmount = (val) => {
    if (!val) return 0;
    if (val.$numberDecimal) return parseFloat(val.$numberDecimal);
    return parseFloat(val) || 0;
  };

  useEffect(() => {
    const fetchLiveStats = async () => {
      if (!user?.userId || !token) return; 

      try {
        // =======================================================
        // 1. FETCH EXACT AUTO COMPOUND AMOUNT FROM DATABASE (NEW)
        // =======================================================
        const resCompound = await api.get(`/package/auto-compound/${user.userId}?t=${new Date().getTime()}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (resCompound.data.success && resCompound.data.packages) {
          let exactCompoundTotal = 0;
          // Database me jitne child+master active hain, unka sum kar do
          resCompound.data.packages.forEach(pkg => {
            exactCompoundTotal += Number(pkg.packageAmount);
          });
          setTotalCompound(exactCompoundTotal);
          //console.log(`✅ [COMPOUND SYNC] Exact Database Amount: $${exactCompoundTotal}`);
        }

        // =======================================================
        // 2. FETCH HIGHEST ACTIVE NORMAL PACKAGE FROM HISTORY
        // =======================================================
        const resHistory = await api.get(`/wallet/topup-history/${user.userId}?t=${new Date().getTime()}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (Array.isArray(resHistory.data) && resHistory.data.length > 0) {
          let calcHighest = 0;
          const now = new Date();

          resHistory.data.forEach((tx) => {
            let receiverId = tx.toUserId ? String(tx.toUserId) : String(tx.userId);
            if (receiverId !== String(user.userId)) return; 

            const txDate = new Date(tx.createdAt || tx.date);
            const diffTime = Math.abs(now.getTime() - txDate.getTime());
            const diffDays = Math.floor(diffTime / (1000 * 3600 * 24)); 
            
            const originalAmount = getSafeAmount(tx.amount || tx.grossAmount);
            const typeStr = (tx.type || "").toLowerCase();
            const descStr = (tx.description || "").toLowerCase();

            if ((typeStr.includes("activation") || typeStr.includes("topup") || typeStr.includes("package")) && !typeStr.includes("compound")) {
              if (!descStr.includes("promotion")) { 
                if (diffDays <= 25 && originalAmount > calcHighest) {
                  calcHighest = originalAmount;
                }
              }
            }
          });
          setHighestActive(calcHighest);
        }
      } catch (error) {
        console.error("❌ [LIVE STATS] API Error:", error);
      }
    };

    fetchLiveStats();
  }, [user?.userId, token]); 

  // MODAL HANDLERS FOR PROMO USER
  const handleDoubleClick = (type) => {
    if (!isPromo) return; 
    setEditType(type);
    if (type === 'compound') setEditValue(promoCompound || totalCompound.toFixed(2));
    if (type === 'highest') setEditValue(promoHighest || highestActive.toFixed(2));
    setIsModalOpen(true);
  };

  const handleSavePromo = () => {
    if (editType === 'compound') {
      setPromoCompound(editValue);
      localStorage.setItem(`promo_compound_${user?.userId}`, editValue);
    } else if (editType === 'highest') {
      setPromoHighest(editValue);
      localStorage.setItem(`promo_highest_${user?.userId}`, editValue);
    }
    setIsModalOpen(false);
  };

  const handleResetPromo = () => {
    if (editType === 'compound') {
      setPromoCompound(null);
      localStorage.removeItem(`promo_compound_${user?.userId}`);
    } else if (editType === 'highest') {
      setPromoHighest(null);
      localStorage.removeItem(`promo_highest_${user?.userId}`);
    }
    setIsModalOpen(false);
  };

  const displayCompound = promoCompound !== null ? Number(promoCompound).toFixed(2) : totalCompound.toFixed(2);
  const displayHighest = promoHighest !== null ? Number(promoHighest).toFixed(2) : highestActive.toFixed(2);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {/* 🌑 DARK CARD 1: TOTAL AUTO COMPOUND */}
        <div 
          onDoubleClick={() => handleDoubleClick('compound')}
          className={`bg-[#1c2233] p-4 rounded-xl border border-slate-700 shadow-lg flex flex-col justify-center min-h-[95px] transition-transform hover:scale-[1.02] ${isPromo ? 'cursor-pointer' : ''}`}
        >
          <h3 className="text-[#00ff88] font-extrabold text-[11px] sm:text-sm uppercase tracking-wider">
            Auto Compound Active
          </h3>
          <p className="text-2xl sm:text-3xl font-black text-white mt-1 drop-shadow-md transition-all duration-500">
            ${displayCompound}
          </p>
        </div>

        {/* 🌑 DARK CARD 2: HIGHEST ACTIVE PACKAGE */}
        <div 
          onDoubleClick={() => handleDoubleClick('highest')}
          className={`bg-[#1c2233] p-4 rounded-xl border border-slate-700 shadow-lg flex flex-col justify-center min-h-[95px] transition-transform hover:scale-[1.02] ${isPromo ? 'cursor-pointer' : ''}`}
        >
          <h3 className="text-cyan-400 font-extrabold text-[11px] sm:text-sm uppercase tracking-wider">
            Highest Active Pkg
          </h3>
          <p className="text-2xl sm:text-3xl font-black text-white mt-1 drop-shadow-md">
            ${displayHighest}
          </p>
        </div>
      </div>

      {/* 🔥 PROMO EDIT MODAL 🔥 */}
      {isModalOpen && isPromo && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[99999] flex justify-center items-center p-4">
          <div className="bg-[#0b101e] w-full max-w-sm rounded-xl border border-[#d4af37]/30 p-5 shadow-[0_0_20px_rgba(212,175,55,0.15)]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[#d4af37] font-bold text-lg">
                 {editType === 'compound' ? 'Auto Compound Pkg' : 'Highest Active Pkg'} 
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <input 
              type="number"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full bg-[#131927] border border-[#2d3748] text-white px-4 py-3 rounded-lg outline-none focus:border-[#e4c568] mb-4"
              placeholder="Enter custom amount..."
            />
            
            <div className="flex gap-3">
              <button onClick={handleResetPromo} className="flex-1 bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500/20 font-bold py-2.5 rounded-lg transition-colors">Reset</button>
              <button onClick={handleSavePromo} className="flex-1 bg-gradient-to-r from-[#d4af37] to-[#e4c568] text-black font-extrabold py-2.5 rounded-lg hover:brightness-110 transition-all">Save</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LivePackageStatsBox;