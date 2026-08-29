// // // // import React from 'react';

// // // // const TelegramButton = () => {
// // // //   return (
// // // //     <>
// // // //       <style>
// // // //         {`
// // // //           /* Pehle wala pulse animation */
// // // //           @keyframes attention-pulse {
// // // //             0% { transform: scale(1); box-shadow: 0 4px 15px rgba(34, 158, 217, 0.4); }
// // // //             50% { transform: scale(1.02); box-shadow: 0 0 25px rgba(34, 158, 217, 0.8); }
// // // //             100% { transform: scale(1); box-shadow: 0 4px 15px rgba(34, 158, 217, 0.4); }
// // // //           }

// // // //           /* Shine (Chamkili line) Animation */
// // // //           @keyframes shine-effect {
// // // //             0% { left: -100%; }
// // // //             20% { left: 100%; }
// // // //             100% { left: 100%; }
// // // //           }

// // // //           .telegram-animated-btn {
// // // //             position: relative; 
// // // //             overflow: hidden; 
// // // //             animation: attention-pulse 2s infinite;
// // // //             box-sizing: border-box; /* Padding ki wajah se width bahar na jaye */
// // // //           }

// // // //           /* Ye wo safed chamakti hui line hai jo cross karegi */
// // // //           .telegram-animated-btn::after {
// // // //             content: '';
// // // //             position: absolute;
// // // //             top: 0;
// // // //             left: -100%;
// // // //             width: 50px;
// // // //             height: 100%;
// // // //             background: linear-gradient(
// // // //               to right, 
// // // //               rgba(255, 255, 255, 0) 0%, 
// // // //               rgba(255, 255, 255, 0.7) 50%, 
// // // //               rgba(255, 255, 255, 0) 100%
// // // //             );
// // // //             transform: skewX(-25deg);
// // // //             animation: shine-effect 3s infinite;
// // // //           }

// // // //           .telegram-animated-btn:hover {
// // // //             animation: none;
// // // //             transform: translateY(-2px);
// // // //             background-color: #1C88BA !important;
// // // //             box-shadow: 0 6px 20px rgba(34, 158, 217, 0.6) !important;
// // // //           }

// // // //           .telegram-animated-btn:hover::after {
// // // //             animation: none; 
// // // //           }

// // // //           /* Mobile screens ke liye padding aur size */
// // // //           @media (max-width: 768px) {
// // // //             .telegram-animated-btn {
// // // //               padding: 12px 16px !important;
// // // //               font-size: 15px !important;
// // // //               gap: 8px !important;
// // // //             }
// // // //             .telegram-animated-btn svg {
// // // //               width: 20px !important;
// // // //               height: 20px !important;
// // // //               flex-shrink: 0; 
// // // //             }
// // // //           }
// // // //         `}
// // // //       </style>

// // // //       <a
// // // //         href="https://t.me/worldfinance01"
// // // //         target="_blank"
// // // //         rel="noopener noreferrer"
// // // //         className="telegram-animated-btn"
// // // //         style={{
// // // //           display: 'flex',       /* CHANGED: inline-flex se flex kar diya */
// // // //           width: '100%',         /* ADDED: Taki button poori width le (100%) */
// // // //           alignItems: 'center',
// // // //           justifyContent: 'center',
// // // //           gap: '10px',
// // // //           backgroundColor: '#229ED9',
// // // //           color: '#ffffff',
// // // //           padding: '14px 24px',  /* Thoda padding badhaya taki upar wale button jaisa mota lage */
// // // //           borderRadius: '8px',
// // // //           textDecoration: 'none',
// // // //           fontSize: '16px',
// // // //           fontWeight: '600',
// // // //           fontFamily: 'system-ui, -apple-system, sans-serif',
// // // //           transition: 'all 0.3s ease',
// // // //           cursor: 'pointer',
// // // //           border: 'none',
// // // //           textAlign: 'center', 
// // // //           whiteSpace: 'normal', 
// // // //           lineHeight: '1.4',
// // // //         }}
// // // //       >
// // // //         <svg 
// // // //           xmlns="http://www.w3.org/2000/svg" 
// // // //           width="22" 
// // // //           height="22" 
// // // //           fill="currentColor" 
// // // //           viewBox="0 0 16 16"
// // // //         >
// // // //           <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.287 5.906c-.778.324-2.334.994-4.666 2.01-.378.15-.577.298-.595.442-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.292.26.004.545-.106.855-.332 2.07-1.419 3.123-2.14 3.158-2.163.021-.013.048-.024.08-.024.043 0 .083.023.083.064 0 .025-.015.05-.084.126-.068.075-1.503 1.405-1.637 1.543-.109.112-.224.22-.116.327.105.106 1.48 1.002 1.944 1.32.193.133.35.242.49.336.195.132.368.248.583.226.13-.013.256-.129.324-.447.214-1.002.684-3.418.9-4.57.022-.12.008-.22-.038-.282-.047-.063-.128-.088-.236-.06z"/>
// // // //         </svg>
// // // //         Join Telegram Channel
// // // //       </a>
// // // //     </>
// // // //   );
// // // // };

// // // // export default TelegramButton;

// // // import React from 'react';

// // // const TelegramButton = () => {
// // //   const telegramLink = "https://t.me/worldfinance01";

// // //   return (
// // //     <a
// // //       href={telegramLink}
// // //       target="_blank"
// // //       rel="noopener noreferrer"
// // //       className="fixed bottom-6 right-6 z-[99] flex items-center justify-center w-14 h-14 bg-[#2AABEE] text-white rounded-full shadow-[0_0_15px_rgba(42,171,238,0.5)] hover:scale-110 hover:shadow-[0_0_25px_rgba(42,171,238,0.8)] transition-all duration-300 group animate-bounce"
// // //       aria-label="Join our Telegram"
// // //     >
// // //       {/* Official Telegram SVG Icon */}
// // //       <svg
// // //         xmlns="http://www.w3.org/2000/svg"
// // //         viewBox="0 0 24 24"
// // //         fill="currentColor"
// // //         className="w-8 h-8 pr-0.5 pt-0.5" 
// // //       >
// // //         <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.895-1.056-.693-1.653-1.124-2.678-1.8-1.185-.774-.417-1.205.243-1.875.173-.174 3.184-2.936 3.242-3.185.008-.035.014-.165-.058-.232-.072-.068-.184-.045-.264-.029-.115.023-1.944 1.23-5.49 3.626-.518.361-1.002.535-1.428.525-.47-.012-1.373-.265-2.043-.483-.827-.27-1.483-.414-1.425-.875.03-.239.354-.484.97-.736 3.816-1.658 6.36-2.753 7.632-3.284 3.633-1.517 4.388-1.776 4.873-1.785z"/>
// // //       </svg>

// // //       {/* Tooltip on Hover */}
// // //       <span className="absolute right-16 bg-[#131c31] text-[#eab308] border border-[#eab308]/30 px-3 py-1.5 rounded-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-lg pointer-events-none">
// // //         Join Telegram Community
// // //       </span>
// // //     </a>
// // //   );
// // // };

// // // export default TelegramButton;


// // import React, { useState, useEffect } from 'react';
// // import { X, Send } from 'lucide-react';

// // const TelegramButton = () => {
// //   const telegramLink = "https://t.me/worldfinance01";
// //   const [showPopup, setShowPopup] = useState(false);
// //   const [isAnimating, setIsAnimating] = useState(false);

// //   // 🚀 Popup Logic: Har baar page load hone ke 2.5 seconds baad aayega
// //   useEffect(() => {
// //     const timer = setTimeout(() => {
// //       setShowPopup(true);
// //       setTimeout(() => setIsAnimating(true), 50); // Smooth slide-in animation
// //     }, 2500); 
    
// //     return () => clearTimeout(timer);
// //   }, []);

// //   const closePopup = () => {
// //     setIsAnimating(false);
// //     setTimeout(() => setShowPopup(false), 300); // Animation khatam hone ka wait
// //   };

// //   if (!showPopup) return null;

// //   return (
// //     <div className={`fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${isAnimating ? "opacity-100" : "opacity-0"}`}>
      
// //       {/* Modal Container - Dark Navy + Gold Border Theme */}
// //       <div className={`relative w-full max-w-[340px] bg-[#131c31] border-t-[4px] border-[#eab308] rounded-2xl shadow-[0_0_30px_rgba(234,179,8,0.15)] overflow-hidden transition-all duration-500 transform ${isAnimating ? "scale-100 translate-y-0" : "scale-90 translate-y-10"}`}>
        
// //         {/* Background Glow */}
// //         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150px] h-[150px] bg-[#eab308]/10 blur-[60px] rounded-full pointer-events-none"></div>

// //         {/* Close Button */}
// //         <button 
// //           onClick={closePopup} 
// //           className="absolute top-3 right-3 text-gray-400 hover:text-white bg-[#0b1221]/50 hover:bg-[#0b1221] p-1.5 rounded-full transition-all"
// //         >
// //           <X size={18} strokeWidth={2.5} />
// //         </button>

// //         {/* Content Area */}
// //         <div className="px-6 py-8 flex flex-col items-center text-center relative z-10">
          
// //           {/* Animated Telegram Icon Box */}
// //           <div className="relative mb-6 group">
// //             <div className="absolute inset-0 bg-[#eab308] rounded-full blur-md opacity-30 animate-pulse"></div>
// //             <div className="relative bg-[#0b1221] border border-[#eab308]/40 w-20 h-20 rounded-full flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110 duration-300">
// //               <Send size={36} strokeWidth={2} className="text-[#2AABEE] pr-1 pt-1 drop-shadow-[0_0_8px_rgba(42,171,238,0.6)]" />
// //             </div>
// //           </div>

// //           {/* Heading with Branding */}
// //           <h3 className="text-xl sm:text-2xl font-black text-white mb-2 tracking-wide">
// //             Join Official <br/> 
// //             <span className="text-[#eab308]">World Finance Channel</span>
// //           </h3>
          
          

// //           {/* Action Button */}
// //           <a 
// //             href={telegramLink}
// //             target="_blank"
// //             rel="noopener noreferrer"
// //             onClick={closePopup}
// //             className="w-full bg-[#eab308] hover:bg-[#d4af37] text-black font-extrabold text-[14px] py-3.5 rounded-xl shadow-[0_0_15px_rgba(234,179,8,0.25)] hover:shadow-[0_0_20px_rgba(234,179,8,0.4)] hover:scale-[1.02] transition-all duration-300 uppercase tracking-widest flex items-center justify-center gap-2"
// //           >
// //             <Send size={18} strokeWidth={2.5} />
// //             Join Telegram
// //           </a>

// //           <button 
// //             onClick={closePopup}
// //             className="mt-4 text-[11px] font-bold text-gray-500 hover:text-gray-300 uppercase tracking-wider transition-colors"
// //           >
// //             Maybe Later
// //           </button>

// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default TelegramButton;











// import React, { useState, useEffect } from 'react';
// import { X, Send } from 'lucide-react';

// const TelegramButton = () => {
//   const telegramLink = "https://t.me/worldfinance01";
//   const [showPopup, setShowPopup] = useState(false);
//   const [isAnimating, setIsAnimating] = useState(false);

//   // 🚀 Popup Logic: Har baar page load hone ke 2.5 seconds baad aayega
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setShowPopup(true);
//       setTimeout(() => setIsAnimating(true), 50); // Smooth slide-in animation
//     }, 2500); 
    
//     return () => clearTimeout(timer);
//   }, []);

//   const closePopup = () => {
//     setIsAnimating(false);
//     setTimeout(() => setShowPopup(false), 300); // Animation khatam hone ka wait
//   };

//   if (!showPopup) return null;

//   return (
//     <div className={`fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${isAnimating ? "opacity-100" : "opacity-0"}`}>
      
//       {/* Modal Container - Dark Navy + Telegram Blue Border Theme */}
//       <div className={`relative w-full max-w-[340px] bg-[#131c31] border-t-[4px] border-[#2AABEE] rounded-2xl shadow-[0_0_30px_rgba(42,171,238,0.15)] overflow-hidden transition-all duration-500 transform ${isAnimating ? "scale-100 translate-y-0" : "scale-90 translate-y-10"}`}>
        
//         {/* Background Glow (Telegram Blue) */}
//         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150px] h-[150px] bg-[#2AABEE]/15 blur-[60px] rounded-full pointer-events-none"></div>

//         {/* Close Button */}
//         <button 
//           onClick={closePopup} 
//           className="absolute top-3 right-3 text-gray-400 hover:text-white bg-[#0b1221]/50 hover:bg-[#0b1221] p-1.5 rounded-full transition-all"
//         >
//           <X size={18} strokeWidth={2.5} />
//         </button>

//         {/* Content Area */}
//         <div className="px-6 py-8 flex flex-col items-center text-center relative z-10">
          
//           {/* Animated Telegram Icon Box (Solid Blue) */}
//           <div className="relative mb-6 group">
//             <div className="absolute inset-0 bg-[#2AABEE] rounded-full blur-md opacity-40 animate-pulse"></div>
//             <div className="relative bg-gradient-to-br from-[#2AABEE] to-[#1c84c4] border border-[#2AABEE]/50 w-20 h-20 rounded-full flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110 duration-300">
//               <Send size={36} strokeWidth={2.5} className="text-white pr-1 pt-1 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
//             </div>
//           </div>

//           {/* Heading with Telegram Branding */}
//           <h3 className="text-xl sm:text-2xl font-black text-white mb-3 tracking-wide">
//             Join Official <br/> 
//             <span className="text-[#2AABEE]">World Finance Channel</span>
//           </h3>
           

//           {/* Action Button - Telegram Blue Style */}
//           <a 
//             href={telegramLink}
//             target="_blank"
//             rel="noopener noreferrer"
//             onClick={closePopup}
//             className="w-full bg-[#2AABEE] hover:bg-[#1c84c4] text-white font-extrabold text-[14px] py-3.5 rounded-xl shadow-[0_0_15px_rgba(42,171,238,0.3)] hover:shadow-[0_0_20px_rgba(42,171,238,0.5)] hover:scale-[1.02] transition-all duration-300 uppercase tracking-widest flex items-center justify-center gap-2"
//           >
//             <Send size={18} strokeWidth={2.5} />
//             Join Telegram
//           </a>

//           <button 
//             onClick={closePopup}
//             className="mt-4 text-[11px] font-bold text-gray-500 hover:text-gray-300 uppercase tracking-wider transition-colors"
//           >
//             Maybe Later
//           </button>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default TelegramButton;

import React, { useState, useEffect } from 'react';
import { X, Send } from 'lucide-react';

const TelegramButton = () => {
  const telegramLink = "https://t.me/worldfinance01";
  const [showPopup, setShowPopup] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // 🚀 Popup Logic: Har baar page load hone ke 2.5 seconds baad aayega
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(true);
      setTimeout(() => setIsAnimating(true), 50); // Smooth slide-in animation
    }, 2500); 
    
    return () => clearTimeout(timer);
  }, []);

  const closePopup = () => {
    setIsAnimating(false);
    setTimeout(() => setShowPopup(false), 300); // Animation khatam hone ka wait
  };

  if (!showPopup) return null;

  return (
    <div className={`fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${isAnimating ? "opacity-100" : "opacity-0"}`}>
      
      {/* Modal Container - Dark Navy + Telegram Blue Border Theme */}
      <div className={`relative w-full max-w-[340px] bg-[#131c31] border-t-[4px] border-[#2AABEE] rounded-2xl shadow-[0_0_30px_rgba(42,171,238,0.15)] overflow-hidden transition-all duration-500 transform ${isAnimating ? "scale-100 translate-y-0" : "scale-90 translate-y-10"}`}>
        
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150px] h-[150px] bg-[#2AABEE]/10 blur-[60px] rounded-full pointer-events-none"></div>

        {/* 🔥 FIX: Close Button par z-20 add kiya taaki click proper kaam kare */}
        <button 
          onClick={closePopup} 
          className="absolute top-3 right-3 z-20 cursor-pointer text-gray-400 hover:text-white bg-[#0b1221]/50 hover:bg-[#0b1221] p-1.5 rounded-full transition-all"
        >
          <X size={18} strokeWidth={2.5} />
        </button>

        {/* Content Area */}
        <div className="px-6 py-8 flex flex-col items-center text-center relative z-10">
          
          {/* Animated Telegram Icon Box */}
          <div className="relative mb-6 group">
            <div className="absolute inset-0 bg-[#2AABEE] rounded-full blur-md opacity-40 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-[#2AABEE] to-[#1c84c4] border border-[#2AABEE]/50 w-20 h-20 rounded-full flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110 duration-300">
              <Send size={36} strokeWidth={2.5} className="text-white pr-1 pt-1 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
            </div>
          </div>

          {/* Heading with Telegram Branding */}
          <h3 className="text-xl sm:text-2xl font-black text-white mb-3 tracking-wide">
            Join Official <br/> 
            <span className="text-[#2AABEE]">World Finance Channel</span>
          </h3>
          
          {/* Action Button - Telegram Blue Style */}
          <a 
            href={telegramLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={closePopup}
            className="w-full mt-4 bg-[#2AABEE] hover:bg-[#1c84c4] text-white font-extrabold text-[14px] py-3.5 rounded-xl shadow-[0_0_15px_rgba(42,171,238,0.3)] hover:shadow-[0_0_20px_rgba(42,171,238,0.5)] hover:scale-[1.02] transition-all duration-300 uppercase tracking-widest flex items-center justify-center gap-2"
          >
            <Send size={18} strokeWidth={2.5} />
            Join Telegram
          </a>

          <button 
            onClick={closePopup}
            className="mt-4 text-[11px] font-bold text-gray-500 hover:text-gray-300 uppercase tracking-wider transition-colors"
          >
            Maybe Later
          </button>

        </div>
      </div>
    </div>
  );
};

export default TelegramButton;