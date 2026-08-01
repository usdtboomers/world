// import React from "react";
// import { CheckCircle2, Zap, Landmark, ArrowRightLeft, Gift, ShieldCheck, ArrowDownLeft, User, CalendarDays } from "lucide-react";

// const SuccessModal = ({
//   isOpen,
//   onClose,
//   type = "credit", 
//   userId = "",
//   userName = "",
//   amount = 0,
//   reward = 0,
//   spinQuantity = 0,
//   customTitle = "",
//   customMessage = "",
//   source = "", 
//   zIndex = 2000,
// }) => {
//   if (!isOpen) return null;

//   const currentDate = new Date().toLocaleDateString("en-GB", {
//     day: '2-digit', month: 'short', year: 'numeric'
//   });

//   /* ================= MODERN GREEN THEME LAYOUT ================= */
//   const SuccessLayout = ({ title, icon: Icon, children }) => (
//     <div className="flex flex-col items-center w-full relative z-10">
//       <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(34,197,94,0.4)] border-4 border-white bg-gradient-to-br from-green-400 to-emerald-600 text-white">
//          <Icon size={32} />
//       </div>
//       <h2 className="text-slate-800 text-xl sm:text-2xl font-black uppercase tracking-widest text-center mb-2">
//         {title}
//       </h2>
//       <div className="w-full">
//         {children}
//       </div>
//       <div className="mt-5 flex flex-col items-center justify-center gap-2">
//         <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
//            <CalendarDays size={12} /> {currentDate}
//         </span>
//         <span className="text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
//            <ShieldCheck size={14} /> Secured Transaction
//         </span>
//       </div>
//     </div>
//   );

//   /* ✅ REUSABLE USER INFO BLOCK (ID + NAME) */
//   const UserInfoBlock = ({ idLabel }) => (
//     <div className="bg-white border border-green-100 rounded-xl p-3 mb-3 shadow-sm">
//        <div className="flex justify-between items-center mb-1.5">
//           <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{idLabel}</span>
//           <span className="text-slate-800 font-black font-mono text-sm">{userId}</span>
//        </div>
//        {userName && userName !== "N/A" && (
//          <div className="flex justify-between items-center border-t border-slate-100 pt-2 mt-1.5">
//             <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
//                <User size={10}/> Name
//             </span>
//             <span className="text-green-700 font-black text-xs uppercase tracking-wider">{userName}</span>
//          </div>
//        )}
//     </div>
//   );

//   /* ================= CONTENT LOGIC ================= */
//   const renderContent = () => {
    
//     if (customTitle || customMessage) {
//       return (
//         <SuccessLayout title={customTitle} icon={CheckCircle2}>
//           <p className="text-sm text-slate-600 font-medium leading-relaxed px-4 text-center mt-2">
//             {customMessage}
//           </p>
//         </SuccessLayout>
//       );
//     }

//     switch (type) {
//       case "withdrawal":
//         const isPlan = source && source.toLowerCase().startsWith("plan");
//         const wTitle = isPlan ? "Withdrawal Success" : "Withdrawal Success";
        
//         return (
//           <SuccessLayout title={wTitle} icon={Landmark}>
//             <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 w-full shadow-sm mt-2">
//               <UserInfoBlock idLabel="User ID" />
//               <div className="flex flex-col items-center pt-2">
//                  <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Amount Processed</span>
//                  <span className="text-4xl sm:text-5xl font-black text-emerald-600 drop-shadow-sm">
//                    ${amount}
//                  </span>
//               </div>
//             </div>
//           </SuccessLayout>
//         );

//       case "convert":
//         return (
//           <SuccessLayout title="Conversion Done" icon={ArrowRightLeft}>
//             <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 w-full shadow-sm mt-2">
//               <UserInfoBlock idLabel="User ID" />
//               <div className="flex flex-col items-center pt-1">
//                  <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Converted Value</span>
//                  <span className="text-4xl font-black text-emerald-600 drop-shadow-sm">
//                    {amount} CCT
//                  </span>
//               </div>
//             </div>
//           </SuccessLayout>
//         );

//       case "stake":
//         return (
//           <SuccessLayout title="Staking Done" icon={ShieldCheck}>
//             <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-3 w-full shadow-sm mt-1">
//               <UserInfoBlock idLabel="Target ID" />
//               <div className="flex flex-col items-center pt-0.5">
//                  <span className="text-slate-500 text-[9px] font-bold uppercase tracking-widest mb-0.5">Staked Amount</span>
//                  <span className="text-3xl font-black text-emerald-600 drop-shadow-sm">
//                    {amount} CCT
//                  </span>
//               </div>
//             </div>
//           </SuccessLayout>
//         );
        
//       case "deposit":
//         return (
//           <SuccessLayout title="Deposit Successful" icon={ArrowDownLeft}>
//              <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-6 w-full shadow-sm mt-2 text-center">
//                 <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest block mb-2">Fund Added</span>
//                 <span className="text-4xl sm:text-5xl font-black text-emerald-600 drop-shadow-sm">
//                   + ${amount}
//                 </span>
//              </div>
//           </SuccessLayout>
//         );

//       case "credit":
//         return (
//           <SuccessLayout title="Wallet Credited" icon={ArrowDownLeft}>
//             <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 w-full shadow-sm mt-2">
//               {source && (
//                  <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-green-100 mb-3 shadow-sm">
//                    <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Source</span>
//                    <span className="text-emerald-700 font-black text-xs uppercase tracking-wider">{source}</span>
//                  </div>
//               )}
//               <div className="flex flex-col items-center pt-1">
//                  <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Amount Added</span>
//                  <span className="text-4xl font-black text-emerald-600 drop-shadow-sm">
//                    + ${amount}
//                  </span>
//               </div>
//             </div>
//           </SuccessLayout>
//         );

//       // 🔥 USDT TRANSFER (NORMAL)
//       case "transfer":
//         return (
//           <SuccessLayout title="Wallet Transfer Done" icon={ArrowRightLeft}>
//             <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 w-full shadow-sm mt-2">
//               <UserInfoBlock idLabel="Sent To" />
//               <div className="flex flex-col items-center pt-1">
//                  <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Transfer Amount</span>
//                  <span className="text-4xl font-black text-emerald-600 drop-shadow-sm">
//                    ${amount}
//                  </span>
//               </div>
//             </div>
//           </SuccessLayout>
//         );

//       // 🔥 CCT TRANSFER (NAYA CASE ADD KIYA)
//       case "cct_transfer":
//         return (
//           <SuccessLayout title="CCT Transfer Done" icon={ArrowRightLeft}>
//             <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 w-full shadow-sm mt-2">
//               <UserInfoBlock idLabel="Sent To" />
//               <div className="flex flex-col items-center pt-1">
//                  <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Transfer Amount</span>
//                  <span className="text-4xl font-black text-emerald-600 drop-shadow-sm">
//                    {amount} CCT
//                  </span>
//               </div>
//             </div>
//           </SuccessLayout>
//         );
//       case "usdt_transfer":
//         return (
//           <SuccessLayout title="USDT Transfer Done" icon={ArrowRightLeft}>
//             <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 w-full shadow-sm mt-2">
//               <UserInfoBlock idLabel="Sent To" />
//               <div className="flex flex-col items-center pt-1">
//                  <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Transfer Amount</span>
//                  <span className="text-4xl font-black text-emerald-600 drop-shadow-sm">
//                   ${amount} 
//                  </span>
//               </div>
//             </div>
//           </SuccessLayout>
//         );

//       case "topup":
//         return (
//           <SuccessLayout title="Node Activated" icon={Zap}>
//             <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 w-full shadow-sm mt-2">
//               <UserInfoBlock idLabel="Target ID" />
//               <div className="flex flex-col items-center pt-1">
//                  <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Activation Value</span>
//                  <span className="text-4xl sm:text-5xl font-black text-emerald-600 drop-shadow-sm">
//                    ${amount}
//                  </span>
//               </div>
//             </div>
//           </SuccessLayout>
//         );

//       case "buy":
//         return (
//           <SuccessLayout title="Spins Purchased" icon={Gift}>
//              <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-6 w-full shadow-sm mt-2 text-center">
//                 <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest block mb-2">Cost: ${amount}</span>
//                 <span className="text-4xl font-black text-emerald-600 drop-shadow-sm">
//                   {spinQuantity} Spins
//                 </span>
//              </div>
//           </SuccessLayout>
//         );

//       case "spin":
//         return (
//           <SuccessLayout title="Spin Reward" icon={Gift}>
//              <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-6 w-full shadow-sm mt-2 text-center">
//                 <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest block mb-2">You Won</span>
//                 <span className="text-5xl font-black text-emerald-600 drop-shadow-sm">
//                   ${reward}
//                 </span>
//              </div>
//           </SuccessLayout>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <div
//       className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300"
//       style={{ zIndex }}
//     >
//       <div className="bg-white border border-slate-200 rounded-[24px] p-6 w-full max-w-sm shadow-2xl relative overflow-hidden transform scale-100 transition-all">
        
//         {/* Glow Effects (Green Theme) */}
//         <div className="absolute top-0 right-0 w-40 h-40 bg-green-100 blur-[60px] pointer-events-none"></div>
//         <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-50 blur-[60px] pointer-events-none"></div>

//         {/* Content Render hoga */}
//         {renderContent()}

//         <div className="mt-6 flex justify-center w-full relative z-10">
//           <button
//             onClick={onClose}
//             className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transition-all font-black uppercase tracking-widest text-xs px-6 py-4 rounded-xl shadow-[0_4px_15px_rgba(34,197,94,0.3)] hover:-translate-y-0.5 active:scale-95"
//           >
//             Acknowledge & Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SuccessModal;


import React from "react";
import { 
  CheckCircle2, 
  Zap, 
  Landmark, 
  ArrowRightLeft, 
  Gift, 
  ShieldCheck, 
  ArrowDownLeft, 
  User, 
  CalendarDays 
} from "lucide-react";

const SuccessModal = ({
  isOpen,
  onClose,
  type = "credit", 
  userId = "",
  userName = "",
  amount = 0,
  reward = 0,
  spinQuantity = 0,
  customTitle = "",
  customMessage = "",
  source = "", 
  zIndex = 2000,
}) => {
  if (!isOpen) return null;

  // Sirf date dikhegi, time nahi (as requested earlier)
  const currentDate = new Date().toLocaleDateString("en-GB", {
    day: '2-digit', 
    month: 'short', 
    year: 'numeric'
  });

  /* ================= PREMIUM DARK & GOLD THEME LAYOUT ================= */
  const SuccessLayout = ({ title, icon: Icon, children }) => (
    <div className="flex flex-col items-center w-full relative z-10">
      {/* Golden Glowing Icon */}
      <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5 shadow-[0_0_25px_rgba(234,179,8,0.25)] border-[3px] border-[#1f2937] bg-gradient-to-br from-[#d4af37] to-[#eab308] text-[#070b14]">
         <Icon size={32} strokeWidth={2.5} />
      </div>
      
      {/* Title */}
      <h2 className="text-[#eab308] text-xl sm:text-2xl font-black uppercase tracking-widest text-center mb-3">
        {title}
      </h2>
      
      {/* Dynamic Content Area */}
      <div className="w-full">
        {children}
      </div>
      
      {/* Footer Info (Date & Security Badge) */}
      <div className="mt-6 flex flex-col items-center justify-center gap-2.5">
        <span className="text-gray-400 text-[11px] font-bold uppercase tracking-widest flex items-center gap-1.5">
           <CalendarDays size={13} className="text-[#eab308]" /> {currentDate}
        </span>
        <span className="text-[#eab308] bg-[#eab308]/10 px-4 py-1.5 rounded-full border border-[#eab308]/30 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
           <ShieldCheck size={14} /> Secured Transaction
        </span>
      </div>
    </div>
  );

  /* ✅ REUSABLE USER INFO BLOCK */
  const UserInfoBlock = ({ idLabel }) => (
    <div className="bg-[#0f172a] border border-gray-800 rounded-xl p-3.5 mb-3 shadow-inner">
       <div className="flex justify-between items-center mb-1.5">
          <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">{idLabel}</span>
          <span className="text-white font-black font-mono text-sm">{userId}</span>
       </div>
       {userName && userName !== "N/A" && (
         <div className="flex justify-between items-center border-t border-gray-800/60 pt-2.5 mt-2">
            <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
               <User size={11}/> Name
            </span>
            <span className="text-[#eab308] font-black text-xs uppercase tracking-wider">{userName}</span>
         </div>
       )}
    </div>
  );

  /* ================= CONTENT LOGIC ================= */
  const renderContent = () => {
    if (customTitle || customMessage) {
      return (
        <SuccessLayout title={customTitle} icon={CheckCircle2}>
          <p className="text-sm text-gray-300 font-medium leading-relaxed px-4 text-center mt-3">
            {customMessage}
          </p>
        </SuccessLayout>
      );
    }

    switch (type) {
      case "withdrawal":
        const isPlan = source && source.toLowerCase().startsWith("plan");
        const wTitle = isPlan ? "Withdrawal Success" : "Withdrawal Success";
        return (
          <SuccessLayout title={wTitle} icon={Landmark}>
            <div className="bg-[#111827] border border-gray-800 rounded-2xl p-4 w-full mt-2">
              <UserInfoBlock idLabel="User ID" />
              <div className="flex flex-col items-center pt-2">
                 <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Amount Processed</span>
                 <span className="text-4xl sm:text-5xl font-black text-emerald-400 drop-shadow-md">
                   ${amount}
                 </span>
              </div>
            </div>
          </SuccessLayout>
        );

      case "convert":
        return (
          <SuccessLayout title="Conversion Done" icon={ArrowRightLeft}>
            <div className="bg-[#111827] border border-gray-800 rounded-2xl p-4 w-full mt-2">
              <UserInfoBlock idLabel="User ID" />
              <div className="flex flex-col items-center pt-2">
                 <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Converted Value</span>
                 <span className="text-4xl font-black text-emerald-400 drop-shadow-md">
                   {amount} CCT
                 </span>
              </div>
            </div>
          </SuccessLayout>
        );

      case "stake":
        return (
          <SuccessLayout title="Staking Done" icon={ShieldCheck}>
            <div className="bg-[#111827] border border-gray-800 rounded-2xl p-4 w-full mt-2">
              <UserInfoBlock idLabel="Target ID" />
              <div className="flex flex-col items-center pt-2">
                 <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Staked Amount</span>
                 <span className="text-4xl font-black text-emerald-400 drop-shadow-md">
                   {amount} CCT
                 </span>
              </div>
            </div>
          </SuccessLayout>
        );
        
      case "deposit":
        return (
          <SuccessLayout title="Deposit Successful" icon={ArrowDownLeft}>
             <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 w-full mt-2 text-center">
                <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest block mb-2">Fund Added</span>
                <span className="text-4xl sm:text-5xl font-black text-emerald-400 drop-shadow-md">
                  + ${amount}
                </span>
             </div>
          </SuccessLayout>
        );

      case "credit":
        return (
          <SuccessLayout title="Wallet Credited" icon={ArrowDownLeft}>
            <div className="bg-[#111827] border border-gray-800 rounded-2xl p-4 w-full mt-2">
              {source && (
                 <div className="flex justify-between items-center bg-[#0f172a] p-3.5 rounded-xl border border-gray-800 mb-3">
                   <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Source</span>
                   <span className="text-[#eab308] font-black text-xs uppercase tracking-wider">{source}</span>
                 </div>
              )}
              <div className="flex flex-col items-center pt-2">
                 <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Amount Added</span>
                 <span className="text-4xl font-black text-emerald-400 drop-shadow-md">
                   + ${amount}
                 </span>
              </div>
            </div>
          </SuccessLayout>
        );

      case "transfer":
      case "usdt_transfer":
        return (
          <SuccessLayout title={type === "usdt_transfer" ? "USDT Transfer Done" : "Wallet Transfer Done"} icon={ArrowRightLeft}>
            <div className="bg-[#111827] border border-gray-800 rounded-2xl p-4 w-full mt-2">
              <UserInfoBlock idLabel="Sent To" />
              <div className="flex flex-col items-center pt-2">
                 <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Transfer Amount</span>
                 <span className="text-4xl font-black text-emerald-400 drop-shadow-md">
                   ${amount}
                 </span>
              </div>
            </div>
          </SuccessLayout>
        );

      case "cct_transfer":
        return (
          <SuccessLayout title="CCT Transfer Done" icon={ArrowRightLeft}>
            <div className="bg-[#111827] border border-gray-800 rounded-2xl p-4 w-full mt-2">
              <UserInfoBlock idLabel="Sent To" />
              <div className="flex flex-col items-center pt-2">
                 <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Transfer Amount</span>
                 <span className="text-4xl font-black text-emerald-400 drop-shadow-md">
                   {amount} CCT
                 </span>
              </div>
            </div>
          </SuccessLayout>
        );

      case "topup":
        return (
          <SuccessLayout title="Node Activated" icon={Zap}>
            <div className="bg-[#111827] border border-gray-800 rounded-2xl p-4 w-full mt-2">
              <UserInfoBlock idLabel="Target ID" />
              <div className="flex flex-col items-center pt-2">
                 <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Activation Value</span>
                 <span className="text-4xl sm:text-5xl font-black text-emerald-400 drop-shadow-md">
                   ${amount}
                 </span>
              </div>
            </div>
          </SuccessLayout>
        );

      case "buy":
        return (
          <SuccessLayout title="Spins Purchased" icon={Gift}>
             <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 w-full mt-2 text-center">
                <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest block mb-2">Cost: ${amount}</span>
                <span className="text-4xl font-black text-emerald-400 drop-shadow-md">
                  {spinQuantity} Spins
                </span>
             </div>
          </SuccessLayout>
        );

      case "spin":
        return (
          <SuccessLayout title="Spin Reward" icon={Gift}>
             <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 w-full mt-2 text-center">
                <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest block mb-2">You Won</span>
                <span className="text-5xl font-black text-emerald-400 drop-shadow-md">
                  ${reward}
                </span>
             </div>
          </SuccessLayout>
        );

      default:
        return null;
    }
  };

  return (
    <div
      // 🚫 Background par onClick nahi diya hai taaki bahar click karne se modal band na ho
      className="fixed inset-0 bg-[#070b14]/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300"
    >
      <div className="bg-[#111827] border border-gray-800 rounded-[24px] p-6 w-full max-w-sm shadow-2xl relative overflow-hidden transform scale-100 transition-all">
        
        {/* Glow Effects (Dark & Gold Theme) */}
        <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-[#eab308]/15 blur-[70px] pointer-events-none rounded-full"></div>
        <div className="absolute bottom-[-50px] left-[-50px] w-40 h-40 bg-emerald-500/10 blur-[70px] pointer-events-none rounded-full"></div>

        {/* Content Render */}
        {renderContent()}

        {/* Close Button - Sirf yahi click karne se modal close hoga */}
        <div className="mt-7 flex justify-center w-full relative z-10">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-[#d4af37] to-[#eab308] hover:from-yellow-500 hover:to-yellow-600 text-[#070b14] transition-all font-black uppercase tracking-widest text-sm px-6 py-4 rounded-xl shadow-[0_4px_20px_rgba(234,179,8,0.25)] hover:-translate-y-1 active:scale-95"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;