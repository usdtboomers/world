// import React from 'react';

// const SpinnerOverlay = () => {
//   return (
//     <div className="fixed inset-0 bg-slate-50 bg-opacity-40 flex items-center justify-center z-50">
//       <div className="loader border-4 border-t-blue-500 rounded-full w-12 h-12 animate-spin"></div>
//     </div>
//   );
// };

// export default SpinnerOverlay;

import React from 'react';

const SpinnerOverlay = () => {
  return (
    <div className="fixed inset-0 bg-[#0b1221]/80 backdrop-blur-sm flex flex-col items-center justify-center z-[99999]">
      
      {/* 🚀 Unique Animated Spinner Container */}
      <div className="relative flex items-center justify-center w-20 h-20">
        
        {/* Outer Spinning Ring (Gold) */}
        <div className="absolute inset-0 border-[4px] border-transparent border-t-[#eab308] border-b-[#eab308] rounded-full animate-spin shadow-[0_0_15px_rgba(234,179,8,0.4)]"></div>
        
        {/* Middle Pulse Ring (Subtle Glow) */}
        <div className="absolute inset-2 border-[3px] border-transparent border-l-[#eab308] border-r-[#eab308] rounded-full animate-spin opacity-70" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        
        {/* Inner Glowing Core */}
        <div className="absolute w-4 h-4 bg-[#eab308] rounded-full animate-pulse shadow-[0_0_20px_#eab308]"></div>
        
      </div>

      {/* Loading Text */}
      <h3 className="mt-6 text-[#eab308] font-black tracking-[0.2em] text-sm uppercase animate-pulse drop-shadow-md">
        Loading...
      </h3>
      
    </div>
  );
};

export default SpinnerOverlay;