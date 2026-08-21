// import React, { useState } from 'react';
// import { useAuth } from '../../context/AuthContext'; 
// import { Copy, Check, User, Fingerprint, Calendar } from 'lucide-react'; 

// const UserInfoBoxes = () => {
//   const { user } = useAuth();
//   const [copied, setCopied] = useState(false); 

//   // Format Joining Date
//   const joinDate = user?.createdAt 
//     ? new Date(user.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-')
//     : 'N/A';

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

//         {/* DIVIDER (Aaju-baaju space badhaya) */}
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

//         {/* DIVIDER (Aaju-baaju space badhaya) */}
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
import { Copy, Check, User } from 'lucide-react'; 

const UserInfoBoxes = () => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false); 

  // 🔥 NAYA LOGIC: 1 August 2026 se pehle walo ko fix '01-Aug-2026' dikhana hai
  let joinDate = 'N/A';
  if (user?.createdAt) {
    const userDate = new Date(user.createdAt);
    
    // Threshold date set ki hai: 1 August 2026
    const thresholdDate = new Date('2026-08-01T00:00:00'); 

    // Agar joining date 1 Aug 2026 se pehle ki hai (jaise 31 July), toh fix '01-Aug-2026' dikhao
    if (userDate < thresholdDate) {
      joinDate = '01-Aug-2026';
    } else {
      // Warna asli date dikhao
      joinDate = userDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');
    }
  }

  // ID Copy Function
  const handleCopyId = () => {
    if (user?.userId) {
      navigator.clipboard.writeText(user.userId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full mb-2  flex justify-center">
      
      {/* 🔥 THODA BADA AUR KHULA HUA BLUE BOARD 🔥 */}
      <div className="bg-[#1c2233] border border-gray-700/50 w-full max-w-4xl rounded-xl shadow-lg p-3 sm:p-5 flex justify-between items-center">
        
        {/* 1. NAME */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="bg-white/5 p-1.5 sm:p-2.5 rounded-lg text-[#d89814]">
            <User className="w-4 h-4 sm:w-6 sm:h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500 text-[9px] sm:text-xs font-bold uppercase tracking-wider mb-0.5">Name</span>
            <span className="text-white text-xs sm:text-base font-bold capitalize truncate max-w-[80px] sm:max-w-[200px]">
              {user?.name || 'Unknown'}
            </span>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="w-[1px] h-8 sm:h-12 bg-gray-700/50 mx-2 sm:mx-6"></div>

        {/* 2. USER ID */}
        <div className="flex items-center gap-2 sm:gap-4">
         
          <div className="flex flex-col">
            <span className="text-gray-500 text-[9px] sm:text-xs font-bold uppercase tracking-wider mb-0.5">User ID</span>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-[#d89814] text-xs sm:text-base font-extrabold">
                {user?.userId || 'N/A'}
              </span>
              {user?.userId && (
                <button 
                  onClick={handleCopyId} 
                  className="text-gray-400 hover:text-white transition-colors p-1"
                  title="Copy ID"
                >
                  {copied ? <Check size={14} className="text-green-500 sm:w-5 sm:h-5" /> : <Copy size={14} className="sm:w-5 sm:h-5" />}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="w-[1px] h-8 sm:h-12 bg-gray-700/50 mx-2 sm:mx-6"></div>

        {/* 3. JOINING DATE */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          <div className="flex flex-col">
            <span className="text-gray-500 text-[9px] sm:text-xs font-bold uppercase tracking-wider mb-0.5">Joined</span>
            <span className="text-gray-200 text-xs sm:text-base font-bold">
              {joinDate}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserInfoBoxes;