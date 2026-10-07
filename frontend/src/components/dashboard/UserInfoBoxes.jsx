 


// import React, { useState } from 'react';
// import { useAuth } from '../../context/AuthContext'; 
// import { Copy, Check, User } from 'lucide-react'; 

// const UserInfoBoxes = () => {
//   const { user } = useAuth();
//   const [copied, setCopied] = useState(false); 

//   // 🔥 NAYA LOGIC: 1 August 2026 se pehle walo ko fix '01-Aug-2026' dikhana hai
//   let joinDate = 'N/A';
//   if (user?.createdAt) {
//     const userDate = new Date(user.createdAt);
    
//     // Threshold date set ki hai: 1 August 2026
//     const thresholdDate = new Date('2026-08-01T00:00:00'); 

//     // Agar joining date 1 Aug 2026 se pehle ki hai (jaise 31 July), toh fix '01-Aug-2026' dikhao
//     if (userDate < thresholdDate) {
//       joinDate = '01-Aug-2026';
//     } else {
//       // Warna asli date dikhao
//       joinDate = userDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');
//     }
//   }

//   // ID Copy Function
//   const handleCopyId = () => {
//     if (user?.userId) {
//       navigator.clipboard.writeText(user.userId);
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     }
//   };

//   return (
//     <div className="w-full mb-2  flex justify-center">
      
//       {/* 🔥 THODA BADA AUR KHULA HUA BLUE BOARD 🔥 */}
//       <div className="bg-[#1c2233] border border-gray-700/50 w-full max-w-4xl rounded-xl shadow-lg p-3 sm:p-5 flex justify-between items-center">
        
//         {/* 1. NAME */}
//         <div className="flex items-center gap-2 sm:gap-4">
//           <div className="bg-white/5 p-1.5 sm:p-2.5 rounded-lg text-[#d89814]">
//             <User className="w-4 h-4 sm:w-6 sm:h-6" />
//           </div>
//           <div className="flex flex-col">
//             <span className="text-gray-500 text-[9px] sm:text-xs font-bold uppercase tracking-wider mb-0.5">Name</span>
//             <span className="text-white text-xs sm:text-base font-bold capitalize truncate max-w-[80px] sm:max-w-[200px]">
//               {user?.name || 'Unknown'}
//             </span>
//           </div>
//         </div>

//         {/* DIVIDER */}
//         <div className="w-[1px] h-8 sm:h-12 bg-gray-700/50 mx-2 sm:mx-6"></div>

//         {/* 2. USER ID */}
//         <div className="flex items-center gap-2 sm:gap-4">
         
//           <div className="flex flex-col">
//             <span className="text-gray-500 text-[9px] sm:text-xs font-bold uppercase tracking-wider mb-0.5">User ID</span>
//             <div className="flex items-center gap-1.5 sm:gap-2">
//               <span className="text-[#d89814] text-xs sm:text-base font-extrabold">
//                 {user?.userId || 'N/A'}
//               </span>
//               {user?.userId && (
//                 <button 
//                   onClick={handleCopyId} 
//                   className="text-gray-400 hover:text-white transition-colors p-1"
//                   title="Copy ID"
//                 >
//                   {copied ? <Check size={14} className="text-green-500 sm:w-5 sm:h-5" /> : <Copy size={14} className="sm:w-5 sm:h-5" />}
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* DIVIDER */}
//         <div className="w-[1px] h-8 sm:h-12 bg-gray-700/50 mx-2 sm:mx-6"></div>

//         {/* 3. JOINING DATE */}
//         <div className="flex items-center gap-2 sm:gap-4">
          
//           <div className="flex flex-col">
//             <span className="text-gray-500 text-[9px] sm:text-xs font-bold uppercase tracking-wider mb-0.5">Joined</span>
//             <span className="text-gray-200 text-xs sm:text-base font-bold">
//               {joinDate}
//             </span>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default UserInfoBoxes;

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext'; 
import { Copy, Check, User, X } from 'lucide-react'; 

const UserInfoBoxes = () => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false); 

  // 🔥 PROMO ROLE LOGIC & STATES
  const isPromo = user?.role === 'promo';

  const [promoName, setPromoName] = useState(() => localStorage.getItem(`promo_name_${user?.userId}`) || null);
  const [promoUserId, setPromoUserId] = useState(() => localStorage.getItem(`promo_userid_${user?.userId}`) || null);
  const [promoJoinDate, setPromoJoinDate] = useState(() => localStorage.getItem(`promo_date_${user?.userId}`) || null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editType, setEditType] = useState(""); 
  const [editValue, setEditValue] = useState("");

  // 🔥 1 August 2026 Logic
  let originalJoinDate = 'N/A';
  if (user?.createdAt) {
    const userDate = new Date(user.createdAt);
    const thresholdDate = new Date('2026-08-01T00:00:00'); 

    if (userDate < thresholdDate) {
      originalJoinDate = '01-Aug-2026';
    } else {
      originalJoinDate = userDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');
    }
  }

  const displayName = promoName !== null ? promoName : (user?.name || 'Unknown');
  const displayUserId = promoUserId !== null ? promoUserId : (user?.userId || 'N/A');
  const displayJoinDate = promoJoinDate !== null ? promoJoinDate : originalJoinDate;

  const handleCopyId = () => {
    if (displayUserId && displayUserId !== 'N/A') {
      navigator.clipboard.writeText(displayUserId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDoubleClick = (type) => {
    if (!isPromo) return; 
    setEditType(type);
    if (type === 'name') setEditValue(displayName);
    if (type === 'userid') setEditValue(displayUserId);
    if (type === 'date') setEditValue(displayJoinDate);
    setIsModalOpen(true);
  };

  const handleSavePromo = () => {
    if (editType === 'userid') {
      const formattedVal = editValue.trim().toUpperCase();
      const isValid = /^WF\d{7}$/.test(formattedVal); 
      
      if (!isValid) {
        alert("🚨 Invalid Format! User ID must start with 'WF' followed by exactly 7 digits. (Example: WF1234567)");
        return;
      }
      setPromoUserId(formattedVal);
      localStorage.setItem(`promo_userid_${user?.userId}`, formattedVal);
    } 
    else if (editType === 'name') {
      setPromoName(editValue);
      localStorage.setItem(`promo_name_${user?.userId}`, editValue);
    } 
    else if (editType === 'date') {
      setPromoJoinDate(editValue);
      localStorage.setItem(`promo_date_${user?.userId}`, editValue);
    }
    
    setIsModalOpen(false);
  };

  const handleResetPromo = () => {
    if (editType === 'name') {
      setPromoName(null);
      localStorage.removeItem(`promo_name_${user?.userId}`);
    } else if (editType === 'userid') {
      setPromoUserId(null);
      localStorage.removeItem(`promo_userid_${user?.userId}`);
    } else if (editType === 'date') {
      setPromoJoinDate(null);
      localStorage.removeItem(`promo_date_${user?.userId}`);
    }
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="w-full mb-2 flex justify-center">
        <div className="bg-[#1c2233] border border-gray-700/50 w-full max-w-4xl rounded-xl shadow-lg p-3 sm:p-5 flex justify-between items-center overflow-hidden">
          
          {/* 1. NAME */}
          <div 
            onDoubleClick={() => handleDoubleClick('name')} 
            className={`flex items-center gap-2 sm:gap-4 flex-shrink min-w-0 ${isPromo ? 'cursor-pointer hover:bg-white/5  rounded transition-colors' : ''}`}
          >
            <div className="bg-white/5 p-1.5 sm:p-2.5 rounded-lg text-[#d89814] flex-shrink-0">
              <User className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-gray-500 text-[9px] sm:text-xs font-bold uppercase tracking-wider mb-0.5 whitespace-nowrap">Name</span>
              {/* 🔥 FIX: whitespace-nowrap se text totega nahi */}
              <span className="text-white text-xs sm:text-base font-bold capitalize truncate max-w-[80px] sm:max-w-[150px] whitespace-nowrap">
                {displayName}
              </span>
            </div>
          </div>

          {/* DIVIDER */}
          <div className="w-[1px] h-8 sm:h-12 bg-gray-700/50 mx-2 sm:mx-4 flex-shrink-0"></div>

          {/* 2. USER ID */}
          <div 
            onDoubleClick={() => handleDoubleClick('userid')}
            className={`flex items-center gap-2 sm:gap-4 flex-shrink-0 ${isPromo ? 'cursor-pointer hover:bg-white/5 p-1 rounded transition-colors' : ''}`}
          >
            <div className="flex flex-col">
              <span className="text-gray-500 text-[9px] sm:text-xs font-bold uppercase tracking-wider mb-0.5 whitespace-nowrap">User ID</span>
              <div className="flex items-center gap-1 sm:gap-2 whitespace-nowrap">
                <span className="text-[#d89814] text-xs sm:text-base font-extrabold">
                  {displayUserId}
                </span>
                {displayUserId !== 'N/A' && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleCopyId(); }} 
                    className="text-gray-400 hover:text-white transition-colors p-1"
                    title="Copy ID"
                  >
                    {copied ? <Check size={14} className="text-green-500 sm:w-4 sm:h-4" /> : <Copy size={14} className="sm:w-4 sm:h-4" />}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* DIVIDER */}
          <div className="w-[1px] h-8 sm:h-12 bg-gray-700/50 mx-2 sm:mx-4 flex-shrink-0"></div>

          {/* 3. JOINING DATE */}
          <div 
            onDoubleClick={() => handleDoubleClick('date')}
            className={`flex items-center gap-2 sm:gap-4 flex-shrink-0 ${isPromo ? 'cursor-pointer hover:bg-white/5 p-1 rounded transition-colors' : ''}`}
          >
            <div className="flex flex-col">
              <span className="text-gray-500 text-[9px] sm:text-xs font-bold uppercase tracking-wider mb-0.5 whitespace-nowrap">Joined</span>
              {/* 🔥 FIX: whitespace-nowrap add kiya */}
              <span className="text-gray-200 text-[11px] sm:text-base font-bold whitespace-nowrap">
                {displayJoinDate}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* 🔥 PROMO EDIT MODAL 🔥 */}
      {isModalOpen && isPromo && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[99999] flex justify-center items-center p-4">
          <div className="bg-[#0b101e] w-full max-w-sm rounded-xl border border-[#d4af37]/30 p-5 shadow-[0_0_20px_rgba(212,175,55,0.15)]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[#d4af37] font-bold text-lg capitalize">
                {editType} 
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <input 
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full bg-[#131927] border border-[#2d3748] text-white px-4 py-3 rounded-lg outline-none focus:border-[#e4c568] mb-4"
              placeholder={`Enter custom ${editType}...`}
            />
            
            {editType === 'userid' && (
              <p className="text-xs text-gray-400 mb-4 -mt-2">Format: WF followed by 7 digits (e.g., WF8489157)</p>
            )}
            
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

export default UserInfoBoxes;