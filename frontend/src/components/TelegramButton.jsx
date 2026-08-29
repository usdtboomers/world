// import React from 'react';

// const TelegramButton = () => {
//   return (
//     <>
//       <style>
//         {`
//           /* Pehle wala pulse animation */
//           @keyframes attention-pulse {
//             0% { transform: scale(1); box-shadow: 0 4px 15px rgba(34, 158, 217, 0.4); }
//             50% { transform: scale(1.02); box-shadow: 0 0 25px rgba(34, 158, 217, 0.8); }
//             100% { transform: scale(1); box-shadow: 0 4px 15px rgba(34, 158, 217, 0.4); }
//           }

//           /* Shine (Chamkili line) Animation */
//           @keyframes shine-effect {
//             0% { left: -100%; }
//             20% { left: 100%; }
//             100% { left: 100%; }
//           }

//           .telegram-animated-btn {
//             position: relative; 
//             overflow: hidden; 
//             animation: attention-pulse 2s infinite;
//             box-sizing: border-box; /* Padding ki wajah se width bahar na jaye */
//           }

//           /* Ye wo safed chamakti hui line hai jo cross karegi */
//           .telegram-animated-btn::after {
//             content: '';
//             position: absolute;
//             top: 0;
//             left: -100%;
//             width: 50px;
//             height: 100%;
//             background: linear-gradient(
//               to right, 
//               rgba(255, 255, 255, 0) 0%, 
//               rgba(255, 255, 255, 0.7) 50%, 
//               rgba(255, 255, 255, 0) 100%
//             );
//             transform: skewX(-25deg);
//             animation: shine-effect 3s infinite;
//           }

//           .telegram-animated-btn:hover {
//             animation: none;
//             transform: translateY(-2px);
//             background-color: #1C88BA !important;
//             box-shadow: 0 6px 20px rgba(34, 158, 217, 0.6) !important;
//           }

//           .telegram-animated-btn:hover::after {
//             animation: none; 
//           }

//           /* Mobile screens ke liye padding aur size */
//           @media (max-width: 768px) {
//             .telegram-animated-btn {
//               padding: 12px 16px !important;
//               font-size: 15px !important;
//               gap: 8px !important;
//             }
//             .telegram-animated-btn svg {
//               width: 20px !important;
//               height: 20px !important;
//               flex-shrink: 0; 
//             }
//           }
//         `}
//       </style>

//       <a
//         href="https://t.me/worldfinance01"
//         target="_blank"
//         rel="noopener noreferrer"
//         className="telegram-animated-btn"
//         style={{
//           display: 'flex',       /* CHANGED: inline-flex se flex kar diya */
//           width: '100%',         /* ADDED: Taki button poori width le (100%) */
//           alignItems: 'center',
//           justifyContent: 'center',
//           gap: '10px',
//           backgroundColor: '#229ED9',
//           color: '#ffffff',
//           padding: '14px 24px',  /* Thoda padding badhaya taki upar wale button jaisa mota lage */
//           borderRadius: '8px',
//           textDecoration: 'none',
//           fontSize: '16px',
//           fontWeight: '600',
//           fontFamily: 'system-ui, -apple-system, sans-serif',
//           transition: 'all 0.3s ease',
//           cursor: 'pointer',
//           border: 'none',
//           textAlign: 'center', 
//           whiteSpace: 'normal', 
//           lineHeight: '1.4',
//         }}
//       >
//         <svg 
//           xmlns="http://www.w3.org/2000/svg" 
//           width="22" 
//           height="22" 
//           fill="currentColor" 
//           viewBox="0 0 16 16"
//         >
//           <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.287 5.906c-.778.324-2.334.994-4.666 2.01-.378.15-.577.298-.595.442-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.292.26.004.545-.106.855-.332 2.07-1.419 3.123-2.14 3.158-2.163.021-.013.048-.024.08-.024.043 0 .083.023.083.064 0 .025-.015.05-.084.126-.068.075-1.503 1.405-1.637 1.543-.109.112-.224.22-.116.327.105.106 1.48 1.002 1.944 1.32.193.133.35.242.49.336.195.132.368.248.583.226.13-.013.256-.129.324-.447.214-1.002.684-3.418.9-4.57.022-.12.008-.22-.038-.282-.047-.063-.128-.088-.236-.06z"/>
//         </svg>
//         Join Telegram Channel
//       </a>
//     </>
//   );
// };

// export default TelegramButton;

import React from 'react';

const TelegramButton = () => {
  const telegramLink = "https://t.me/worldfinance01";

  return (
    <a
      href={telegramLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-[99] flex items-center justify-center w-14 h-14 bg-[#2AABEE] text-white rounded-full shadow-[0_0_15px_rgba(42,171,238,0.5)] hover:scale-110 hover:shadow-[0_0_25px_rgba(42,171,238,0.8)] transition-all duration-300 group animate-bounce"
      aria-label="Join our Telegram"
    >
      {/* Official Telegram SVG Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-8 h-8 pr-0.5 pt-0.5" 
      >
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.895-1.056-.693-1.653-1.124-2.678-1.8-1.185-.774-.417-1.205.243-1.875.173-.174 3.184-2.936 3.242-3.185.008-.035.014-.165-.058-.232-.072-.068-.184-.045-.264-.029-.115.023-1.944 1.23-5.49 3.626-.518.361-1.002.535-1.428.525-.47-.012-1.373-.265-2.043-.483-.827-.27-1.483-.414-1.425-.875.03-.239.354-.484.97-.736 3.816-1.658 6.36-2.753 7.632-3.284 3.633-1.517 4.388-1.776 4.873-1.785z"/>
      </svg>

      {/* Tooltip on Hover */}
      <span className="absolute right-16 bg-[#131c31] text-[#eab308] border border-[#eab308]/30 px-3 py-1.5 rounded-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-lg pointer-events-none">
        Join Telegram Community
      </span>
    </a>
  );
};

export default TelegramButton;