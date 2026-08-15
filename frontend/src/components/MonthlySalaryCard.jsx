// import React, { useState, useEffect } from "react";
// import api from "../api/axios"; 
// import { CheckCircle, Clock, XCircle, Gift, AlertCircle } from "lucide-react";

// const MonthlySalaryCard = ({ userId }) => {
//   const [progress, setProgress] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [timeDisplay, setTimeDisplay] = useState("");

//   useEffect(() => {
//     const fetchProgress = async () => {
//       try {
//         const res = await api.get(`/user/salary-progress/${userId}`);
//         setProgress(res.data.data);
//       } catch (error) {
//         console.error("Failed to load salary progress");
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (userId) fetchProgress();
//   }, [userId]);

//   // Timer Countdown Logic
//   useEffect(() => {
//     // Agar user ne ab tak topup hi nahi kiya hai, toh timer na chalayein
//     if (!progress || progress.status !== "pending" || progress.isNeverToppedUp) return;

//     const interval = setInterval(() => {
//       progress.timeLeftMs -= 1000;
//       if (progress.timeLeftMs <= 0) {
//         clearInterval(interval);
//         setTimeDisplay("Time Expired");
//         // Reload API to mark as failed
//         window.location.reload(); 
//         return;
//       }

//       const days = Math.floor(progress.timeLeftMs / (1000 * 60 * 60 * 24));
//       const hours = Math.floor((progress.timeLeftMs / (1000 * 60 * 60)) % 24);
//       const minutes = Math.floor((progress.timeLeftMs / 1000 / 60) % 60);

//       setTimeDisplay(`${days}d ${hours}h ${minutes}m left`);
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [progress]);

//   if (loading) return <div className="text-white p-4">Loading Salary Plan...</div>;
//   if (!progress) return null;

//   return (
//     <div className="bg-[#131c31] border-[2px] border-[#eab308] rounded-xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
      
//       {/* Background Graphic */}
//       <div className="absolute right-[-20px] top-[-20px] opacity-10">
//         <Gift size={150} color="#eab308" />
//       </div>

//       <h2 className="text-2xl font-black text-[#eab308] uppercase mb-1">
//         Monthly Salary 
//       </h2>
//       <p className="text-gray-400 text-sm mb-5">Earn $100 per month for 6 months! ($600 Total)</p>

//       {/* Progress Trackers */}
//       <div className="space-y-4 relative z-10">
        
//         {/* Condition 1: Self Package */}
//         <div className="flex items-center justify-between">
//           <span className="text-gray-200 font-medium">Self Topup $50+</span>
//           {progress.hasSelf50 ? <CheckCircle size={20} className="text-green-500"/> : <XCircle size={20} className="text-gray-600"/>}
//         </div>

//         {/* Condition 2: Level 1 */}
//         <div className="space-y-1">
//           <div className="flex justify-between text-sm">
//             <span className="text-gray-200">Level 1 ($50+ Users)</span>
//             <span className="text-[#eab308] font-bold">{Math.min(progress.l1Count, 3)} / 3</span>
//           </div>
//           <div className="w-full bg-gray-800 rounded-full h-2">
//             <div className="bg-[#eab308] h-2 rounded-full" style={{ width: `${(Math.min(progress.l1Count, 3) / 3) * 100}%` }}></div>
//           </div>
//         </div>

//         {/* Condition 3: Level 2 */}
//         <div className="space-y-1">
//           <div className="flex justify-between text-sm">
//             <span className="text-gray-200">Level 2 ($50+ Users)</span>
//             <span className="text-[#eab308] font-bold">{Math.min(progress.l2Count, 6)} / 6</span>
//           </div>
//           <div className="w-full bg-gray-800 rounded-full h-2">
//             <div className="bg-[#eab308] h-2 rounded-full" style={{ width: `${(Math.min(progress.l2Count, 6) / 6) * 100}%` }}></div>
//           </div>
//         </div>
//       </div>

//       {/* Status Box */}
//       <div className="mt-6">
//         {progress.status === "qualified" && (
//           <div className="bg-green-500/10 border border-green-500 text-green-400 p-4 rounded-lg flex items-center justify-between">
//             <div>
//               <p className="font-bold">🎉 Congratulations!</p>
//               <p className="text-xs">You are qualified for $100 Monthly Salary.</p>
//             </div>
//             <div className="text-right">
//               <p className="text-[10px] text-gray-400 uppercase">Paid Months</p>
//               <p className="text-lg font-black">{progress.salaryMonthsPaid} / 6</p>
//             </div>
//           </div>
//         )}

//         {/* 🔥 NAYA LOGIC: Agar kabhi topup nahi hua */}
//         {progress.status === "failed" && progress.isNeverToppedUp && (
//           <div className="bg-[#eab308]/10 border border-[#eab308] text-[#eab308] p-3 rounded-lg flex items-center gap-2">
//             <AlertCircle size={18} />
//             <span className="font-bold text-sm">Please Top-up to start the Salary Challenge!</span>
//           </div>
//         )}

//         {/* Agar topup kiya tha par time nikal gaya */}
//         {progress.status === "failed" && !progress.isNeverToppedUp && (
//           <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded-lg flex items-center gap-2">
//             <XCircle size={18} />
//             <span className="font-bold text-sm">Time limit expired! You didn't qualify.</span>
//           </div>
//         )}

//         {progress.status === "pending" && (
//           <div className="bg-blue-500/10 border border-blue-500 text-blue-400 p-3 rounded-lg flex items-center gap-2">
//             <Clock className="animate-pulse" size={18} />
//             <span className="font-bold text-sm">Time Left: {timeDisplay || "Calculating..."}</span>
//           </div>
//         )}
//       </div>

//     </div>
//   );
// };

// export default MonthlySalaryCard;
import React, { useState, useEffect } from "react";
import api from "../api/axios"; 
import { CheckCircle, Clock, XCircle, Gift, AlertCircle } from "lucide-react";

const MonthlySalaryCard = ({ userId }) => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeDisplay, setTimeDisplay] = useState("");

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await api.get(`/user/salary-progress/${userId}`);
        setProgress(res.data.data);
      } catch (error) {
        console.error("Failed to load salary progress");
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchProgress();
  }, [userId]);

  // Timer Countdown Logic
  useEffect(() => {
    // Agar status pending nahi hai ya kabhi topup nahi kiya toh timer mat chalao
    if (!progress || progress.status !== "pending" || progress.isNeverToppedUp) return;

    const interval = setInterval(() => {
      progress.timeLeftMs -= 1000;
      if (progress.timeLeftMs <= 0) {
        clearInterval(interval);
        setTimeDisplay("Time Expired");
        // Reload API to mark as failed
        window.location.reload(); 
        return;
      }

      const days = Math.floor(progress.timeLeftMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((progress.timeLeftMs / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((progress.timeLeftMs / 1000 / 60) % 60);

      setTimeDisplay(`${days}d ${hours}h ${minutes}m left`);
    }, 1000);

    return () => clearInterval(interval);
  }, [progress]);

  if (loading) return <div className="text-white p-4">Loading Salary Plan...</div>;
  if (!progress) return null;

  return (
    <div className="bg-[#131c31] border-[2px] border-[#eab308] rounded-xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
      
      {/* Background Graphic */}
      <div className="absolute right-[-20px] top-[-20px] opacity-10">
        <Gift size={150} color="#eab308" />
      </div>

      <h2 className="text-2xl font-black text-[#eab308] uppercase mb-1">
        Monthly Salary 
      </h2>
      <p className="text-gray-400 text-sm mb-5">Earn $100 per month for 6 months! ($600 Total)</p>

      {/* Progress Trackers */}
      <div className="space-y-4 relative z-10">
        
        {/* Condition 1: Self Package */}
        <div className="flex items-center justify-between">
          <span className="text-gray-200 font-medium">Self Topup $50+</span>
          {progress.hasSelf50 ? <CheckCircle size={20} className="text-green-500"/> : <XCircle size={20} className="text-gray-600"/>}
        </div>

        {/* Condition 2: Level 1 */}
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-200">Level 1 ($50+ Users)</span>
            <span className="text-[#eab308] font-bold">{Math.min(progress.l1Count, 3)} / 3</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div className="bg-[#eab308] h-2 rounded-full" style={{ width: `${(Math.min(progress.l1Count, 3) / 3) * 100}%` }}></div>
          </div>
        </div>

        {/* Condition 3: Level 2 */}
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-200">Level 2 ($50+ Users)</span>
            <span className="text-[#eab308] font-bold">{Math.min(progress.l2Count, 6)} / 6</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div className="bg-[#eab308] h-2 rounded-full" style={{ width: `${(Math.min(progress.l2Count, 6) / 6) * 100}%` }}></div>
          </div>
        </div>
      </div>

      {/* Status Box */}
      <div className="mt-6">
        {progress.status === "qualified" && (
          <div className="bg-green-500/10 border border-green-500 text-green-400 p-4 rounded-lg flex items-center justify-between">
            <div>
              <p className="font-bold">🎉 Congratulations!</p>
              <p className="text-xs">You are qualified for $100 Monthly Salary.</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-400 uppercase">Paid Months</p>
              <p className="text-lg font-black">{progress.salaryMonthsPaid} / 6</p>
            </div>
          </div>
        )}

        {/* 🔥 NAYA LOGIC: Agar kabhi topup nahi hua */}
        {progress.isNeverToppedUp && progress.status === "failed" && (
          <div className="bg-[#eab308]/10 border border-[#eab308] text-[#eab308] p-3 rounded-lg flex items-center gap-2">
            <AlertCircle size={18} />
            <span className="font-bold text-sm">Please Top-up to start the Monthly Salary!</span>
          </div>
        )}

        {/* Agar topup kiya tha par time nikal gaya aur qualify bhi nahi hua */}
        {!progress.isNeverToppedUp && progress.status === "failed" && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded-lg flex items-center gap-2">
            <XCircle size={18} />
            <span className="font-bold text-sm">Time limit expired! You didn't qualify.</span>
          </div>
        )}

        {progress.status === "pending" && !progress.isNeverToppedUp && (
          <div className="bg-blue-500/10 border border-blue-500 text-blue-400 p-3 rounded-lg flex items-center gap-2">
            <Clock className="animate-pulse" size={18} />
            <span className="font-bold text-sm">Time Left: {timeDisplay || "Calculating..."}</span>
          </div>
        )}
      </div>

    </div>
  );
};

export default MonthlySalaryCard;