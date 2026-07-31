import React, { useState } from 'react';
import { useAuth } from "../context/AuthContext";
// 🔥 Naya Premium Modal Import Kar Liya
import TopUpModalWithInput from "./modals/TopUpModalWithInput"; 

const Packages = () => {
  const { user } = useAuth();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState({ amount: 0, name: '' });

  // USD Packages List (Data same as before)
  const packagesList = [
    { id: 1, name: 'SAVING 1', price: 2, roi: 0.10, days: 25, profit: 2.50 },
    { id: 2, name: 'SAVING 2', price: 10, roi: 0.50, days: 25, profit: 12.50 },
    { id: 3, name: 'SAVING 3', price: 20, roi: 1, days: 25, profit: 25 },
    { id: 4, name: 'SAVING 4', price: 50, roi: 2.50, days: 25, profit: 62.50 },
    { id: 5, name: 'SAVING 5', price: 100, roi: 5, days: 25, profit: 125 },
    { id: 6, name: 'SAVING 6', price: 200, roi: 10, days: 25, profit: 250 },
    { id: 7, name: 'SAVING 7', price: 500, roi: 25, days: 25, profit: 625 },
    { id: 8, name: 'SAVING 8', price: 1000, roi: 50, days: 25, profit: 1250 },
    
  ];

  const handleBuyClick = (pkg) => {
    setSelectedPackage({ amount: pkg.price, name: pkg.name });
    setIsModalOpen(true);
  };

  if (!user) return null;

  return (
    <div className="w-full pb-28 md:pb-8 pt-4">
      {/* --- USD PACKAGE GRID --- */}
      {/* 🔥 UPDATE: Mobile ke liye grid-cols-2 set kiya hai aur baaki screens ke liye 3 aur 4 */}
      <div className="max-w-6xl mx-auto px-2 sm:px-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
        {packagesList.map((pkg) => (
          // 🔥 UPDATE: Dark Theme, Gold Borders & Responsive Padding
          <div key={pkg.id} className="bg-[#111827] border border-[#d4af37]/40 p-4 md:p-6 flex flex-col justify-between shadow-lg shadow-black/50 rounded-xl hover:border-[#d4af37] transition-all">
            <div>
              <h3 className="text-sm md:text-xl font-black text-[#d4af37] mb-3 md:mb-4 tracking-wide">{pkg.name}</h3>
              
              {/* Data list with Flexbox for clean alignment */}
              <div className="space-y-1.5 md:space-y-2">
                <p className="text-gray-400 text-xs md:text-sm font-semibold flex justify-between">
                  <span>Price:</span> <span className="text-[#22c55e]">${pkg.price}</span>
                </p>
                <p className="text-gray-400 text-xs md:text-sm font-semibold flex justify-between">
                  <span>Daily ROI:</span> <span className="text-[#22c55e]">${pkg.roi.toFixed(2)}</span>
                </p>
                <p className="text-gray-400 text-xs md:text-sm font-semibold flex justify-between">
                  <span>Days:</span> <span className="text-white">{pkg.days}</span>
                </p>
                <p className="text-gray-400 text-xs md:text-sm font-semibold flex justify-between border-t border-gray-700 pt-1.5 md:pt-2 mt-1.5 md:mt-2">
                  <span>Total Profit:</span> <span className="text-[#d4af37]">${pkg.profit.toFixed(2)}</span>
                </p>
              </div>
            </div>

            {/* Premium Gold Button */}
            <button 
              onClick={() => handleBuyClick(pkg)}
              className="mt-4 md:mt-6 w-full bg-gradient-to-r from-[#d4af37] to-[#f3e5ab] text-black font-extrabold py-1.5 md:py-2 px-4 rounded-lg shadow-[0_0_10px_rgba(212,175,55,0.4)] hover:shadow-[0_0_15px_rgba(212,175,55,0.6)] hover:scale-[1.02] transition-all text-xs md:text-sm"
            >
              BUY NOW
            </button>
          </div>
        ))}
      </div>

      {/* --- PREMIUM ACTIVATION MODAL --- */}
      {isModalOpen && (
        <TopUpModalWithInput 
           onClose={() => setIsModalOpen(false)}
           onSuccess={() => console.log("Package Activated!")}
           packageAmount={selectedPackage.amount}
           packageName={selectedPackage.name}
        />
      )}
    </div>
  );
};

export default Packages;