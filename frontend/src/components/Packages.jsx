import React, { useState } from 'react';
import { useAuth } from "../context/AuthContext";
// 🔥 Naya Premium Modal Import Kar Liya
import TopUpModalWithInput from "./modals/TopUpModalWithInput"; 

const Packages = () => {
  const { user } = useAuth();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState({ amount: 0, name: '' });

  // USD Packages List
  const packagesList = [
    { id: 1, name: 'SAVING 1', price: 2, roi: 0.10, days: 25, profit: 2.50 },
    { id: 2, name: 'SAVING 2', price: 10, roi: 0.50, days: 25, profit: 12.50 },
    { id: 3, name: 'SAVING 3', price: 20, roi: 1, days: 25, profit: 25 },
    { id: 4, name: 'SAVING 4', price: 50, roi: 2.50, days: 25, profit: 62.50 },
    { id: 5, name: 'SAVING 5', price: 100, roi: 5, days: 25, profit: 125 },
    { id: 6, name: 'SAVING 6', price: 200, roi: 10, days: 25, profit: 250 },
    { id: 7, name: 'SAVING 7', price: 500, roi: 25, days: 25, profit: 625 },
    { id: 8, name: 'SAVING 8', price: 1000, roi: 50, days: 25, profit: 1250 },
    { id: 9, name: 'SAVING 9', price: 2000, roi: 100, days: 25, profit: 2500 },
    { id: 10, name: 'SAVING 10', price: 5000, roi: 250, days: 25, profit: 6250 },
  ];

  const handleBuyClick = (pkg) => {
    setSelectedPackage({ amount: pkg.price, name: pkg.name });
    setIsModalOpen(true);
  };

  if (!user) return null;

  return (
    <div className="w-full pb-28 md:pb-8 pt-4">
      {/* --- USD PACKAGE GRID --- */}
      <div className="max-w-6xl mx-auto px-2 sm:px-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {packagesList.map((pkg) => (
          <div key={pkg.id} className="bg-white border-2 border-orange-500 p-6 flex flex-col justify-between shadow-md rounded-xl">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">{pkg.name}</h3>
              <p className="text-gray-700 text-sm font-semibold">Price : <span className="text-green-700">${pkg.price}</span></p>
              <p className="text-gray-700 text-sm font-semibold">Daily ROI : <span className="text-green-700">${pkg.roi.toFixed(2)}</span></p>
              <p className="text-gray-700 text-sm font-semibold">Days : <span className="text-green-700">{pkg.days} Days</span></p>
              <p className="text-gray-700 text-sm font-semibold">Total Profit : <span className="text-green-700">${pkg.profit.toFixed(2)}</span></p>
            </div>
            <button 
              onClick={() => handleBuyClick(pkg)}
              className="mt-4 bg-orange-600 text-white font-bold py-2 px-6 rounded-lg shadow hover:bg-orange-700 w-32 transition-colors"
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