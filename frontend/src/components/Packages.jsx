// import React, { useState } from 'react';
// import { useAuth } from "../context/AuthContext";
// // 🔥 Naya Premium Modal Import Kar Liya
// import TopUpModalWithInput from "./modals/TopUpModalWithInput"; 

// const Packages = () => {
//   const { user } = useAuth();
  
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedPackage, setSelectedPackage] = useState({ amount: 0, name: '' });

//   // USD Packages List (Data same as before)
// const packagesList = [
//     { id: 1, name: 'SAVING 1', price: 2, roi: 0.10, days: 25, profit: 2.50 },
//     { id: 2, name: 'SAVING 2', price: 5, roi: 0.25, days: 25, profit: 6.25 },
//     { id: 3, name: 'SAVING 3', price: 10, roi: 0.50, days: 25, profit: 12.50 },
//     { id: 4, name: 'SAVING 4', price: 20, roi: 1, days: 25, profit: 25 },
//     { id: 5, name: 'SAVING 5', price: 50, roi: 2.50, days: 25, profit: 62.50 },
//     { id: 6, name: 'SAVING 6', price: 100, roi: 5, days: 25, profit: 125 },
//     { id: 7, name: 'SAVING 7', price: 200, roi: 10, days: 25, profit: 250 },
//     { id: 8, name: 'SAVING 8', price: 500, roi: 25, days: 25, profit: 625 },
//     { id: 9, name: 'SAVING 9', price: 1000, roi: 50, days: 25, profit: 1250 },
// ];

//   const handleBuyClick = (pkg) => {
//     setSelectedPackage({ amount: pkg.price, name: pkg.name });
//     setIsModalOpen(true);
//   };

//   if (!user) return null;

//   return (
//     <div className="w-full pb-2 md:pb-8 pt-4">
//       {/* --- USD PACKAGE GRID --- */}
//       {/* 🔥 UPDATE: Mobile ke liye grid-cols-2 set kiya hai aur baaki screens ke liye 3 aur 4 */}
//       <div className="max-w-6xl mx-auto px-2 sm:px-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
//         {packagesList.map((pkg) => (
//           // 🔥 UPDATE: Dark Theme, Gold Borders & Responsive Padding
//           <div key={pkg.id} className="bg-[#111827] border border-[#d4af37]/40 p-4 md:p-6 flex flex-col justify-between shadow-lg shadow-black/50 rounded-xl hover:border-[#d4af37] transition-all">
//             <div>
//               <h3 className="text-sm md:text-xl font-black text-[#d4af37] mb-3 md:mb-4 tracking-wide">{pkg.name}</h3>
              
//               {/* Data list with Flexbox for clean alignment */}
//               <div className="space-y-1.5 md:space-y-2">
//                 <p className="text-gray-400 text-xs md:text-sm font-semibold flex justify-between">
//                   <span>Price:</span> <span className="text-[#22c55e]">${pkg.price}</span>
//                 </p>
//                 <p className="text-gray-400 text-xs md:text-sm font-semibold flex justify-between">
//                   <span>Daily ROI:</span> <span className="text-[#22c55e]">${pkg.roi.toFixed(2)}</span>
//                 </p>
//                 <p className="text-gray-400 text-xs md:text-sm font-semibold flex justify-between">
//                   <span>Days:</span> <span className="text-white">{pkg.days}</span>
//                 </p>
//                 <p className="text-gray-400 text-xs md:text-sm font-semibold flex justify-between border-t border-gray-700 pt-1.5 md:pt-2 mt-1.5 md:mt-2">
//                   <span>Total Profit:</span> <span className="text-[#d4af37]">${pkg.profit.toFixed(2)}</span>
//                 </p>
//               </div>
//             </div>

//             {/* Premium Gold Button */}
//             <button 
//               onClick={() => handleBuyClick(pkg)}
//               className="mt-4 md:mt-6 w-full bg-gradient-to-r from-[#d4af37] to-[#f3e5ab] text-black font-extrabold py-1.5 md:py-2 px-4 rounded-lg shadow-[0_0_10px_rgba(212,175,55,0.4)] hover:shadow-[0_0_15px_rgba(212,175,55,0.6)] hover:scale-[1.02] transition-all text-xs md:text-sm"
//             >
//               BUY NOW
//             </button>
//           </div>
//         ))}
//       </div>

//       {/* --- PREMIUM ACTIVATION MODAL --- */}
//       {isModalOpen && (
//         <TopUpModalWithInput 
//            onClose={() => setIsModalOpen(false)}
//            onSuccess={() => console.log("Package Activated!")}
//            packageAmount={selectedPackage.amount}
//            packageName={selectedPackage.name}
//         />
//       )}
//     </div>
//   );
// };

// export default Packages;















import React, { useState } from 'react';
import { useAuth } from "../context/AuthContext";
import { X, TrendingUp, Layers } from 'lucide-react'; // Icons import kiye achhe UI ke liye
import TopUpModalWithInput from "./modals/TopUpModalWithInput"; 
import AutoCompoundModal from "./modals/AutoCompoundModal"; // 🔥 Naya Auto Compound Modal Import Kiya

const Packages = () => {
  const { user } = useAuth();
  
  // Modals handle karne ke liye naye states
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
  const [isNormalModalOpen, setIsNormalModalOpen] = useState(false);
  const [isCompoundModalOpen, setIsCompoundModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState({ amount: 0, name: '' });

  // USD Packages List
  const packagesList = [
    { id: 1, name: 'SAVING 1', price: 2, roi: 0.10, days: 25, profit: 2.50 },
    { id: 2, name: 'SAVING 2', price: 5, roi: 0.25, days: 25, profit: 6.25 },
    { id: 3, name: 'SAVING 3', price: 10, roi: 0.50, days: 25, profit: 12.50 },
    { id: 4, name: 'SAVING 4', price: 20, roi: 1, days: 25, profit: 25 },
    { id: 5, name: 'SAVING 5', price: 50, roi: 2.50, days: 25, profit: 62.50 },
    { id: 6, name: 'SAVING 6', price: 100, roi: 5, days: 25, profit: 125 },
    { id: 7, name: 'SAVING 7', price: 200, roi: 10, days: 25, profit: 250 },
    { id: 8, name: 'SAVING 8', price: 500, roi: 25, days: 25, profit: 625 },
    { id: 9, name: 'SAVING 9', price: 1000, roi: 50, days: 25, profit: 1250 },
  ];

  // Buy Now click karne par ab Selection Modal khulega
  const handleBuyClick = (pkg) => {
    setSelectedPackage({ amount: pkg.price, name: pkg.name });
    setIsSelectionModalOpen(true);
  };

  // Option 1: Normal Select kiya
  const handleSelectNormal = () => {
    setIsSelectionModalOpen(false);
    setIsNormalModalOpen(true);
  };

  // Option 2: Compound Select kiya
  const handleSelectCompound = () => {
    setIsSelectionModalOpen(false);
    setIsCompoundModalOpen(true);
  };

  if (!user) return null;

  return (
    <div className="w-full pb-2 md:pb-8 pt-4 relative">
      {/* --- USD PACKAGE GRID --- */}
      <div className="max-w-6xl mx-auto px-2 sm:px-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
        {packagesList.map((pkg) => (
          <div key={pkg.id} className="bg-[#111827] border border-[#d4af37]/40 p-4 md:p-6 flex flex-col justify-between shadow-lg shadow-black/50 rounded-xl hover:border-[#d4af37] transition-all">
            <div>
              <h3 className="text-sm md:text-xl font-black text-[#d4af37] mb-3 md:mb-4 tracking-wide">{pkg.name}</h3>
              
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

            <button 
              onClick={() => handleBuyClick(pkg)}
              className="mt-4 md:mt-6 w-full bg-gradient-to-r from-[#d4af37] to-[#f3e5ab] text-black font-extrabold py-1.5 md:py-2 px-4 rounded-lg shadow-[0_0_10px_rgba(212,175,55,0.4)] hover:shadow-[0_0_15px_rgba(212,175,55,0.6)] hover:scale-[1.02] transition-all text-xs md:text-sm"
            >
              BUY NOW
            </button>
          </div>
        ))}
      </div>

      {/* ========================================================= */}
      {/* 🚀 STEP 1: PACKAGE SELECTION MODAL (Normal vs Compound) */}
      {/* ========================================================= */}
      {isSelectionModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[9990] flex justify-center items-center p-4">
          <div className="bg-[#0b101e] border border-[#d4af37]/40 w-full max-w-md rounded-2xl p-6 shadow-[0_0_30px_rgba(212,175,55,0.2)] relative animate-in fade-in zoom-in duration-200">
            
            <button 
              onClick={() => setIsSelectionModalOpen(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-white bg-white/5 hover:bg-red-500/20 p-1.5 rounded-full transition-all"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-black text-center text-white mb-2">Select Package Type</h2>
            <p className="text-center text-gray-400 text-sm mb-6">Choose how you want to invest your <span className="text-[#00ff88] font-bold">${selectedPackage.amount}</span></p>

            <div className="flex flex-col gap-4">
              
              {/* Option 1: NORMAL PACKAGE */}
              <div 
                onClick={handleSelectNormal}
                className="group cursor-pointer border border-[#2d3748] hover:border-[#22c55e] bg-[#131927] hover:bg-[#131927]/80 rounded-xl p-4 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-[#22c55e]/10 p-3 rounded-lg text-[#22c55e] group-hover:scale-110 transition-transform">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">Normal Active Package</h3>
                    <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                      <strong className="text-[#22c55e]">5% Daily ROI.
                        </strong> 
                     </p>
                  </div>
                </div>
              </div>

              {/* Option 2: AUTO COMPOUND PACKAGE */}
              <div 
                onClick={handleSelectCompound}
                className="group cursor-pointer border border-[#2d3748] hover:border-[#d4af37] bg-gradient-to-r hover:from-[#131927] hover:to-[#d4af37]/10 bg-[#131927] rounded-xl p-4 transition-all shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-[#d4af37]/10 p-3 rounded-lg text-[#d4af37] group-hover:scale-110 transition-transform">
                    <Layers size={24} />
                  </div>
                  <div>
                    <h3 className="text-[#e4c568] font-black text-lg">Auto Compound (6%)</h3>
                    <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                      <strong className="text-[#e4c568]">6% Daily ROI.</strong> 
                     </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 🚀 STEP 2A: NORMAL TOPUP MODAL */}
      {/* ========================================================= */}
      {isNormalModalOpen && (
        <TopUpModalWithInput 
           onClose={() => setIsNormalModalOpen(false)}
           onSuccess={() => { setIsNormalModalOpen(false); console.log("Normal Package Activated!"); }}
           packageAmount={selectedPackage.amount}
           packageName={selectedPackage.name}
        />
      )}

      {/* ========================================================= */}
      {/* 🚀 STEP 2B: AUTO COMPOUND MODAL */}
      {/* ========================================================= */}
      {isCompoundModalOpen && (
        <AutoCompoundModal 
           onClose={() => setIsCompoundModalOpen(false)}
           onSuccess={() => { setIsCompoundModalOpen(false); console.log("Compound Package Activated!"); }}
           packageAmount={selectedPackage.amount}
           packageName={selectedPackage.name}
        />
      )}

    </div>
  );
};

export default Packages;