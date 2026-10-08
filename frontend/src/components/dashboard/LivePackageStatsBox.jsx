import React, { useState, useEffect } from "react";
import { X } from "lucide-react"; 
import api from "../../api/axios"; 
import { useAuth } from "../../context/AuthContext"; // 🔥 FIX 1: useAuth import kiya

const LivePackageStatsBox = ({ user }) => {
  const { token } = useAuth(); // 🔥 FIX 2: Context se token nikala

  const [highestActive, setHighestActive] = useState(0);
  const [totalCompound, setTotalCompound] = useState(0);

  // PROMO ROLE LOGIC & STATES
  const isPromo = user?.role === 'promo';
  
  const [promoCompound, setPromoCompound] = useState(() => localStorage.getItem(`promo_compound_${user?.userId}`) || null);
  const [promoHighest, setPromoHighest] = useState(() => localStorage.getItem(`promo_highest_${user?.userId}`) || null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editType, setEditType] = useState(""); 
  const [editValue, setEditValue] = useState("");

  // 🔥 CORE LOGIC: API se real-time user packages fetch karna
  useEffect(() => {
    const fetchUserPackages = async () => {
      // Agar token ya userId nahi hai, toh wait karo
      if (!user?.userId || !token) return; 

      try {
        // 🔥 FIX 3: API call mein Token bhej diya!
        const res = await api.get(`/user/${user.userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const freshUser = res.data.user;

        if (freshUser?.packages && Array.isArray(freshUser.packages)) {
          let calcHighest = 0;
          let calcCompound = 0;
          const now = new Date();

          freshUser.packages.forEach(pkg => {
            const pkgDate = new Date(pkg.startDate);
            const diffDays = (now.getTime() - pkgDate.getTime()) / (1000 * 3600 * 24);
            
            // Name ko lowercase kar diya safe check ke liye
            const planName = (pkg.plan || "").toLowerCase();

            // 1. Auto Compound Package (Pehle isko check karte hain)
            if (planName.includes("compound")) {
              const cycle = pkg.duration || 25; 
              if (diffDays <= cycle) {
                calcCompound += Number(pkg.amount);
              }
            }
            // 2. Normal Active Package (Agar compound nahi hai)
            else if (planName.includes("investment") || planName !== "") {
              if (diffDays <= 25 && pkg.amount > calcHighest) {
                calcHighest = pkg.amount;
              }
            }
          });

          setHighestActive(calcHighest);
          setTotalCompound(calcCompound);
        }
      } catch (error) {
        console.error("Error fetching live package stats:", error);
      }
    };

    fetchUserPackages();
  }, [user?.userId, token]); // Dependency me token add kiya

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

  // Final display values
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
          <p className="text-2xl sm:text-3xl font-black text-white mt-1 drop-shadow-md">
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
              <button 
                onClick={handleResetPromo}
                className="flex-1 bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500/20 font-bold py-2.5 rounded-lg transition-colors"
              >
                Reset
              </button>
              <button 
                onClick={handleSavePromo}
                className="flex-1 bg-gradient-to-r from-[#d4af37] to-[#e4c568] text-black font-extrabold py-2.5 rounded-lg hover:brightness-110 transition-all"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LivePackageStatsBox;