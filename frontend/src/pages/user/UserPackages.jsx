import React, { useState, useEffect } from "react";
import { CalendarDays, DollarSign, CheckCircle2, Activity, Loader2 } from "lucide-react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

// 🔹 Circular Progress Component
const CircularProgress = ({ days, totalDays, status }) => {
  const percentage = Math.min((days / totalDays) * 100, 100);
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  const ringColor = status === "completed" ? "text-emerald-500" : "text-[#eab308]";

  return (
    <div className="relative flex items-center justify-center w-16 h-16 shrink-0">
      <svg className="w-full h-full transform -rotate-90">
        <circle cx="32" cy="32" r={radius} stroke="currentColor" strokeWidth="4" fill="transparent" className="text-gray-800" />
        <circle
          cx="32" cy="32" r={radius} stroke="currentColor" strokeWidth="4" fill="transparent"
          strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round"
          className={`${ringColor} transition-all duration-1000 ease-out`}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center mt-0.5">
        <span className="text-sm font-black text-white leading-none">{days}</span>
        <span className="text-[8px] text-gray-400 uppercase font-bold tracking-widest mt-0.5">Day</span>
      </div>
    </div>
  );
};

const UserPackages = () => {
  const { user, token } = useAuth();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 REAL DATA FETCHING LOGIC
  useEffect(() => {
    const fetchRealPackages = async () => {
      if (!user?.userId || !token) return;
      
      try {
        setLoading(true);
        const res = await api.get(`/package/user/${user.userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const packageData = res.data.data || res.data.packages || res.data || [];
        setPackages(Array.isArray(packageData) ? packageData : []);
      } catch (error) {
        console.error("Failed to fetch packages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRealPackages();
  }, [user?.userId, token]);

  // Calendar date only, stripping timestamp
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit", month: "short", year: "numeric"
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 sm:p-6 bg-[#070b14] min-h-screen sm:min-h-0 rounded-none sm:rounded-2xl">
      
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide uppercase">My Packages</h2>
          <p className="text-[10px] sm:text-xs text-gray-400 font-medium tracking-widest mt-1 uppercase">Financial Saarthi</p>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="animate-spin text-[#eab308] mb-3" size={32} />
          <span className="text-sm text-gray-400 font-bold tracking-widest uppercase">Loading Packages...</span>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {packages.length > 0 ? (
            packages.map((pkg, index) => {
              const amount = Number(pkg.packageAmount) || 0;
              const daysDone = Number(pkg.daysCompleted) || 0;
              const totalDays = Number(pkg.totalDays) || 25;
              
              const dailyRoi = (amount * 5) / 100;
              const earnedRoi = dailyRoi * daysDone;
              const totalExpected = dailyRoi * totalDays;

              return (
                <div key={pkg._id || Math.random()} 
                  className="bg-[#111827] border border-gray-800 rounded-2xl p-4 flex flex-row items-center gap-4 sm:gap-5 shadow-lg relative overflow-hidden transition-all hover:border-gray-700"
                >
                  {pkg.status === "active" && (
                    <div className="absolute top-0 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-[#eab308]/5 blur-[40px] pointer-events-none"></div>
                  )}

                  {/* Circle Chart */}
                  <CircularProgress days={daysDone} totalDays={totalDays} status={pkg.status} />

                  {/* Details Area */}
                  <div className="flex-1 min-w-0 z-10">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 sm:mb-1 gap-1">
                      
                      {/* 🔥 YAHAN CHANGE KIYA HAI: Package Number aur Amount clearly dikhega */}
                      <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-1.5 truncate">
                        <DollarSign size={16} className="text-[#eab308]" />
                        Package {index + 1} <span className="text-gray-400 text-sm font-medium">(${amount})</span>
                      </h3>
                      
                      <span className={`w-fit text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full border flex items-center gap-1 ${
                        pkg.status === "completed" 
                          ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" 
                          : "text-[#eab308] bg-[#eab308]/10 border-[#eab308]/20"
                      }`}>
                        {pkg.status === "completed" ? <CheckCircle2 size={12} /> : <Activity size={12} />}
                        {pkg.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-2 sm:mt-3 bg-[#0b1221] p-2.5 sm:p-3 rounded-xl border border-gray-800/60">
                      <div className="flex flex-col">
                        <span className="text-[8px] sm:text-[9px] text-gray-500 uppercase tracking-widest font-bold">ROI Received</span>
                        <span className="text-xs sm:text-sm font-black text-emerald-400">${earnedRoi.toFixed(2)}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[8px] sm:text-[9px] text-gray-500 uppercase tracking-widest font-bold">Total Expected</span>
                        <span className="text-xs sm:text-sm font-black text-white">${totalExpected.toFixed(2)}</span>
                      </div>
                      <div className="flex flex-col col-span-2 pt-1.5 border-t border-gray-800/50 mt-1 sm:mt-1.5">
                        <span className="text-[8px] sm:text-[9px] text-gray-500 uppercase tracking-widest font-bold flex items-center gap-1">
                          <CalendarDays size={10} /> Activated On
                        </span>
                        <span className="text-[10px] sm:text-xs font-bold text-gray-300 mt-0.5">{formatDate(pkg.startDate)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-10 border border-dashed border-gray-800 rounded-2xl bg-[#0b1221]/50">
              <span className="text-gray-500 text-xs sm:text-sm font-bold tracking-widest uppercase">No Active Packages Found</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserPackages;