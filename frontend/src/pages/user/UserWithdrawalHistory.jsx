// // import React, { useEffect, useState } from "react";
// // import api from "../../api/axios";
// // import {
// //   Search,
// //   Banknote,
// //   ChevronLeft,
// //   ChevronRight,
// //   Wallet,
// // } from "lucide-react";

// // function UserWithdrawalHistory() {
// //   const [withdrawals, setWithdrawals] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [search, setSearch] = useState("");
// //   const [statusFilter, setStatusFilter] = useState("all");
// //   const [currentPage, setCurrentPage] = useState(1);

// //   const itemsPerPage = 10;

// //   const user = JSON.parse(localStorage.getItem("user"));
// //   const userId = Number(user?.userId);
  
// //   // 🔥 Check if user is a Leader
// //   const isLeader = user?.role?.toLowerCase() === "leader";

// //   useEffect(() => {
// //     const fetchWithdrawals = async () => {
// //       try {
// //         setLoading(true);
// //         const res = await api.get(
// //           `/wallet/withdrawals/${userId}?t=${new Date().getTime()}`
// //         );
// //         setWithdrawals(res.data.withdrawals || []);
// //       } catch (error) {
// //         console.error("Error fetching withdrawal history:", error);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     if (userId) fetchWithdrawals();
// //     else setLoading(false);
// //   }, [userId]);

// //   // 🔥 GROUP & ADJUST ENTRIES (WITH TIME-BASED LOGIC)
// //   const groupWithdrawals = (list) => {
// //     const sorted = [...list].sort(
// //       (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
// //     );

// //     const groups = [];
// //     const THRESHOLD_MS = 5000;
    
// //     // 🔥 CUTOFF TIME: 13 July 2026, 4:00 PM IST
// //     const CUTOFF_TIME = new Date("2026-07-13T16:00:00+05:30").getTime();

// //     for (const item of sorted) {
// //       const itemTime = new Date(item.createdAt).getTime();
// //       const lastGroup = groups[groups.length - 1];

// //       // 👉 TIME CHECK: Purana (before 4 PM) ya Naya (after 4 PM)
// //       const isNewLogic = itemTime >= CUTOFF_TIME;

// //       // 👉 AMOUNT CALCULATION LOGIC (Fee Removed completely)
// //       const iGross = isNewLogic ? Number(item.grossAmount || 0) : Number(item.grossAmount || 0) * 2;
// //       const iCryptoNet = Number(item.netAmount || 0); // USDT portion
      
// //       // TopUp calculation: Without fee -> TopUp = Gross - USDT
// //       const iTopupNet = isNewLogic ? (iGross - iCryptoNet) : Number(item.netAmount || 0);

// //       if (
// //         lastGroup &&
// //         itemTime -
// //           new Date(
// //             lastGroup.entries[lastGroup.entries.length - 1].createdAt
// //           ).getTime() <=
// //           THRESHOLD_MS
// //       ) {
// //         lastGroup.entries.push(item);

// //         lastGroup.rawGross += iGross;
// //         lastGroup.rawCryptoNet += iCryptoNet;
// //         lastGroup.rawTopupNet += iTopupNet;

// //         if (item.status?.toLowerCase() === "pending")
// //           lastGroup.status = "pending";
// //         else if (
// //           item.status?.toLowerCase() === "rejected" &&
// //           lastGroup.status !== "pending"
// //         )
// //           lastGroup.status = "rejected";
// //       } else {
// //         groups.push({
// //           _id: item._id,
// //           createdAt: item.createdAt,
// //           entries: [item],
// //           rawGross: iGross,
// //           rawCryptoNet: iCryptoNet,
// //           rawTopupNet: iTopupNet,
// //           walletAddress: item.walletAddress,
// //           status: item.status || "pending",
// //           isNewLogic: isNewLogic // Tracking for Leader override
// //         });
// //       }
// //     }

// //     // 🔥 LEADER ADJUSTMENT LOGIC (Fee removed, 50-50 split for old logic)
// //     groups.forEach(g => {
// //         if (isLeader && !g.isNewLogic) {
// //             // Agar Leader hai aur entry PURANI hai (Before 4 PM)
// //             const roundedGross = Math.floor(g.rawGross / 10) * 10;
// //             g.totalGross = roundedGross;
// //             g.totalCryptoNet = roundedGross * 0.50; // Adjusted for 0 fee
// //             g.totalTopupNet = roundedGross * 0.50;  // Adjusted for 0 fee
// //         } else {
// //             // Normal user YA Naya logic (After 4 PM) -> Exact backend values
// //             g.totalGross = g.rawGross;
// //             g.totalCryptoNet = g.rawCryptoNet;
// //             g.totalTopupNet = g.rawTopupNet;
// //         }
// //     });

// //     return groups;
// //   };

// //   const grouped = groupWithdrawals(withdrawals);

// //   const totalAmount = grouped.reduce((sum, g) => {
// //       // Sirf Success/Approved withdrawals ka total
// //       if (g.status?.toLowerCase() === "success" || g.status?.toLowerCase() === "approved") {
// //           return sum + g.totalGross;
// //       }
// //       return sum;
// //   }, 0);

// //   const filtered = grouped.filter((g) => {
// //     const searchLower = search.toLowerCase();
// //     const matchSearch =
// //       g.status?.toLowerCase().includes(searchLower) ||
// //       g.totalGross.toString().includes(searchLower) ||
// //       new Date(g.createdAt)
// //         .toLocaleDateString("en-GB")
// //         .includes(searchLower) ||
// //       (g.walletAddress?.toLowerCase() || "").includes(searchLower);

// //     const matchStatus =
// //       statusFilter === "all" ||
// //       g.status?.toLowerCase() === statusFilter.toLowerCase();

// //     return matchSearch && matchStatus;
// //   });

// //   const sortedFiltered = [...filtered].sort(
// //     (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
// //   );

// //   const totalPages =
// //     Math.ceil(sortedFiltered.length / itemsPerPage) || 1;

// //   const startIdx = (currentPage - 1) * itemsPerPage;

// //   const paginated = sortedFiltered.slice(
// //     startIdx,
// //     startIdx + itemsPerPage
// //   );

// //   useEffect(() => {
// //     setCurrentPage(1);
// //   }, [search, statusFilter]);

// //   const getStatusDetails = (group) => {
// //     const s = group.status?.toLowerCase();

// //     if (s === "approved" || s === "success") {
// //       return {
// //         label: group.status,
// //         color: "bg-green-500/10 text-green-400 border-green-500/20",
// //       };
// //     }

// //     if (s === "pending") {
// //       return {
// //         label: group.status,
// //         color: "bg-[#eab308]/10 text-[#eab308] border-[#eab308]/20",
// //       };
// //     }

// //     if (s === "rejected" || s === "failed") {
// //       return {
// //         label: group.status,
// //         color: "bg-red-500/10 text-red-400 border-red-500/20",
// //       };
// //     }

// //     return {
// //       label: group.status || "UNKNOWN",
// //       color: "bg-gray-500/10 text-gray-400 border-gray-500/20",
// //     };
// //   };

// //   return (
// //     <div className="w-full min-h-screen bg-[#0b1221] p-4 md:p-8 font-sans">

// //       {/* Inner Card Container */}
// //       <div className="max-w-7xl mx-auto bg-[#131c31] rounded-xl border-t-[3px] border-[#eab308] shadow-2xl p-4 sm:p-6">

// //         {/* HEADER */}
// //         <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
// //           <div>
// //             <h2 className="text-2xl sm:text-3xl text-[#eab308] font-bold tracking-wide flex items-center gap-3">
// //               <Banknote className="text-[#eab308]" size={28} />
// //               Withdrawal History
// //             </h2>
            
// //           </div>
// //         </div>

// //         {/* STATS */}
// //         <div className="mb-8">
// //           <div className="bg-[#0b1221] border border-gray-700 rounded-xl p-5 md:p-6 relative overflow-hidden flex flex-col justify-center max-w-sm">
// //             <h3 className="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-widest flex items-center gap-2 mb-2">
// //               <Wallet size={14} className="text-[#eab308]" />
// //               Total Withdrawn
// //             </h3>
// //             <p className="text-3xl md:text-4xl font-black text-green-400">
// //               ${totalAmount.toFixed(2)}
// //             </p>
// //           </div>
// //         </div>

// //         {/* FILTERS */}
// //         <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between items-start sm:items-center text-gray-300 text-sm">

// //           <div className="flex items-center gap-2 w-full sm:w-auto">
// //             <div className="relative w-full sm:w-80 group">
// //               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
// //                 <Search size={16} className="text-gray-500" />
// //               </div>
// //               <input
// //                 type="text"
// //                 placeholder="Search amount, wallet..."
// //                 value={search}
// //                 onChange={(e) => setSearch(e.target.value)}
// //                 className="w-full bg-[#0b1221] border border-gray-700 text-gray-200 rounded px-3 py-2 pl-10 focus:outline-none focus:border-[#eab308] transition-colors placeholder-gray-500"
// //               />
// //             </div>
// //           </div>

// //           <div className="flex items-center gap-3 w-full sm:w-auto">
// //             <span className="text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
// //               Filter:
// //             </span>
// //             <select
// //               value={statusFilter}
// //               onChange={(e) => setStatusFilter(e.target.value)}
// //               className="w-full sm:w-auto bg-[#0b1221] border border-gray-700 text-[#eab308] text-sm font-bold rounded px-4 py-2 focus:outline-none focus:border-[#eab308] transition-colors cursor-pointer capitalize"
// //             >
// //               <option value="all">All Statuses</option>
// //               <option value="pending">Pending</option>
// //               <option value="approved">Approved</option>
// //               <option value="rejected">Rejected</option>
// //             </select>
// //           </div>
// //         </div>

// //         {/* TABLE */}
// //         <div className="overflow-x-auto border border-gray-700 rounded-lg">
// //           <table className="w-full text-left whitespace-nowrap border-collapse">
// //             <thead className="text-[#eab308] bg-[#1a253e] text-sm border-b border-gray-700">
// //               <tr>
// //                 <th className="p-4 border-r border-gray-700/50 font-bold text-center w-16">Sr. <span className="text-[10px] text-gray-500 ml-1">♦</span></th>
// //                 <th className="p-4 border-r border-gray-700/50 font-bold text-center">Date <span className="text-[10px] text-gray-500 ml-1">♦</span></th>
// //                 <th className="p-4 border-r border-gray-700/50 font-bold text-center">Total <span className="text-[10px] text-gray-500 ml-1">♦</span></th>
// //                 <th className="p-4 border-r border-gray-700/50 font-bold text-center">USDT <span className="text-[10px] text-gray-500 ml-1">♦</span></th>
// //                 <th className="p-4 border-r border-gray-700/50 font-bold text-center">TopUp Wallet <span className="text-[10px] text-gray-500 ml-1">♦</span></th>
// //                 <th className="p-4 border-r border-gray-700/50 font-bold">Wallet Address</th>
// //                 <th className="p-4 font-bold text-center">Status</th>
// //               </tr>
// //             </thead>

// //             <tbody className="text-gray-300 text-sm">
// //               {loading ? (
// //                 <tr>
// //                   <td colSpan="7" className="text-center py-12 text-[#eab308]">
// //                      <div className="animate-spin h-8 w-8 mx-auto mb-3 border-4 border-t-transparent border-[#eab308] rounded-full"></div>
// //                      Loading History...
// //                   </td>
// //                 </tr>
// //               ) : paginated.length === 0 ? (
// //                 <tr>
// //                   <td colSpan="7" className="text-center py-12 text-gray-500">
// //                     No Withdrawal Records Found
// //                   </td>
// //                 </tr>
// //               ) : (
// //                 paginated.map((group, idx) => {
// //                   const statusInfo = getStatusDetails(group);

// //                   return (
// //                     <tr
// //                       key={group._id}
// //                       className="border-b border-gray-700 hover:bg-[#1a253e] transition-colors"
// //                     >
// //                       <td className="p-4 border-r border-gray-700/50 font-medium text-center">
// //                         {startIdx + idx + 1}
// //                       </td>

// //                       <td className="p-4 border-r border-gray-700/50 font-medium text-center">
// //                         {new Date(group.createdAt).toLocaleDateString(
// //                           "en-GB", { day: '2-digit', month: 'short', year: 'numeric' }
// //                         )}
// //                       </td>

// //                       <td className="p-4 border-r border-gray-700/50 font-bold text-center text-white">
// //                         ${group.totalGross.toFixed(2)}
// //                       </td>

// //                       <td className="p-4 border-r border-gray-700/50 font-bold text-center text-[#eab308]">
// //                         ${group.totalCryptoNet.toFixed(2)}
// //                       </td>

// //                       <td className="p-4 border-r border-gray-700/50 font-bold text-center text-purple-400">
// //                         ${group.totalTopupNet.toFixed(2)}
// //                       </td>

// //                       <td className="p-4 border-r border-gray-700/50 text-gray-400 font-mono text-[11px] sm:text-xs">
// //                         {group.walletAddress ? (
// //                           <span className="px-2 py-1 rounded border border-gray-700 bg-[#0b1221]">
// //                             {group.walletAddress}
// //                           </span>
// //                         ) : (
// //                           "N/A"
// //                         )}
// //                       </td>

// //                       <td className="p-4 text-center">
// //                         <span
// //                           className={`inline-flex items-center justify-center border px-2.5 py-1 text-[10px] font-bold tracking-widest rounded uppercase ${statusInfo.color}`}
// //                         >
// //                           {statusInfo.label}
// //                         </span>
// //                       </td>

// //                     </tr>
// //                   );
// //                 })
// //               )}
// //             </tbody>
// //           </table>
// //         </div>

// //         {/* PAGINATION */}
// //         {!loading && sortedFiltered.length > 0 && (
// //           <div className="flex flex-col sm:flex-row justify-between items-center mt-6 text-gray-400 text-sm gap-4">
// //             <div>
// //               Showing <span className="text-white font-medium">{startIdx + 1}</span> to{" "}
// //               <span className="text-white font-medium">
// //                 {Math.min(startIdx + itemsPerPage, sortedFiltered.length)}
// //               </span>{" "}
// //               of <span className="text-white font-medium">{sortedFiltered.length}</span> entries
// //             </div>

// //             <div className="flex items-center bg-[#0b1221] rounded border border-gray-700 overflow-hidden">
// //               <button
// //                 onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
// //                 disabled={currentPage === 1}
// //                 className={`px-4 py-2 transition-colors ${
// //                   currentPage === 1
// //                     ? "text-gray-600 bg-transparent cursor-not-allowed"
// //                     : "text-[#eab308] hover:bg-[#1a253e]"
// //                 }`}
// //               >
// //                 Previous
// //               </button>
// //               <div className="px-4 py-2 border-l border-r border-gray-700 bg-[#1a253e] text-[#eab308] font-bold">
// //                 {currentPage}
// //               </div>
// //               <button
// //                 onClick={() =>
// //                   setCurrentPage((p) => Math.min(p + 1, totalPages))
// //                 }
// //                 disabled={currentPage === totalPages}
// //                 className={`px-4 py-2 transition-colors ${
// //                   currentPage === totalPages
// //                     ? "text-gray-600 bg-transparent cursor-not-allowed"
// //                     : "text-[#eab308] hover:bg-[#1a253e]"
// //                 }`}
// //               >
// //                 Next
// //               </button>
// //             </div>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }

// // export default UserWithdrawalHistory;

// import React, { useEffect, useState } from "react";
// import api from "../../api/axios";
// import { useAuth } from "../../context/AuthContext"; // 🔥 FIX 1: useAuth import kiya
// import {
//   Search,
//   Banknote,
//   ChevronLeft,
//   ChevronRight,
//   Wallet,
// } from "lucide-react";

// function UserWithdrawalHistory() {
//   const { user, token } = useAuth(); // 🔥 FIX 2: localStorage ki jagah useAuth use kiya

//   const [withdrawals, setWithdrawals] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [currentPage, setCurrentPage] = useState(1);

//   const itemsPerPage = 10;

//   // 🔥 FIX 3: Number() hata diya taaki 'WF...' string ID exactly waisi hi jaye
//   const userId = user?.userId; 
  
//   // Check if user is a Leader
//   const isLeader = user?.role?.toLowerCase() === "leader";

//   useEffect(() => {
//     const fetchWithdrawals = async () => {
//       if (!userId || !token) return; // Token aur userId ke bina API call nahi hogi
//       try {
//         setLoading(true);
//         // 🔥 FIX 4: Token pass kiya aur aapke naye route /wallet/withdrawals par request bheji
//         const res = await api.get(
//           `/wallet/withdrawals/${userId}?t=${new Date().getTime()}`,
//           { headers: { Authorization: `Bearer ${token}` } } 
//         );
        
//         // Backend seedha 'withdrawals' array bhej raha hai
//         setWithdrawals(res.data.withdrawals || []);
//       } catch (error) {
//         console.error("Error fetching withdrawal history:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchWithdrawals();
//   }, [userId, token]);

//   // 🔥 GROUP & ADJUST ENTRIES (WITH TIME-BASED LOGIC)
//   const groupWithdrawals = (list) => {
//     const sorted = [...list].sort(
//       (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
//     );

//     const groups = [];
//     const THRESHOLD_MS = 5000;
    
//     // 🔥 CUTOFF TIME: 13 July 2026, 4:00 PM IST
//     const CUTOFF_TIME = new Date("2026-07-13T16:00:00+05:30").getTime();

//     for (const item of sorted) {
//       const itemTime = new Date(item.createdAt).getTime();
//       const lastGroup = groups[groups.length - 1];

//       // 👉 TIME CHECK: Purana (before 4 PM) ya Naya (after 4 PM)
//       const isNewLogic = itemTime >= CUTOFF_TIME;

//       // 👉 AMOUNT CALCULATION LOGIC (Fee Removed completely)
//       const iGross = isNewLogic ? Number(item.grossAmount || 0) : Number(item.grossAmount || 0) * 2;
//       const iCryptoNet = Number(item.netAmount || 0); // USDT portion
      
//       // TopUp calculation: Without fee -> TopUp = Gross - USDT
//       const iTopupNet = isNewLogic ? (iGross - iCryptoNet) : Number(item.netAmount || 0);

//       if (
//         lastGroup &&
//         itemTime -
//           new Date(
//             lastGroup.entries[lastGroup.entries.length - 1].createdAt
//           ).getTime() <=
//           THRESHOLD_MS
//       ) {
//         lastGroup.entries.push(item);

//         lastGroup.rawGross += iGross;
//         lastGroup.rawCryptoNet += iCryptoNet;
//         lastGroup.rawTopupNet += iTopupNet;

//         if (item.status?.toLowerCase() === "pending")
//           lastGroup.status = "pending";
//         else if (
//           item.status?.toLowerCase() === "rejected" &&
//           lastGroup.status !== "pending"
//         )
//           lastGroup.status = "rejected";
//       } else {
//         groups.push({
//           _id: item._id,
//           createdAt: item.createdAt,
//           entries: [item],
//           rawGross: iGross,
//           rawCryptoNet: iCryptoNet,
//           rawTopupNet: iTopupNet,
//           walletAddress: item.walletAddress,
//           status: item.status || "pending",
//           isNewLogic: isNewLogic // Tracking for Leader override
//         });
//       }
//     }

//     // 🔥 LEADER ADJUSTMENT LOGIC (Fee removed, 50-50 split for old logic)
//     groups.forEach(g => {
//         if (isLeader && !g.isNewLogic) {
//             // Agar Leader hai aur entry PURANI hai (Before 4 PM)
//             const roundedGross = Math.floor(g.rawGross / 10) * 10;
//             g.totalGross = roundedGross;
//             g.totalCryptoNet = roundedGross * 0.50; // Adjusted for 0 fee
//             g.totalTopupNet = roundedGross * 0.50;  // Adjusted for 0 fee
//         } else {
//             // Normal user YA Naya logic (After 4 PM) -> Exact backend values
//             g.totalGross = g.rawGross;
//             g.totalCryptoNet = g.rawCryptoNet;
//             g.totalTopupNet = g.rawTopupNet;
//         }
//     });

//     return groups;
//   };

//   const grouped = groupWithdrawals(withdrawals);

//   const totalAmount = grouped.reduce((sum, g) => {
//       // Sirf Success/Approved withdrawals ka total
//       if (g.status?.toLowerCase() === "success" || g.status?.toLowerCase() === "approved") {
//           return sum + g.totalGross;
//       }
//       return sum;
//   }, 0);

//   const filtered = grouped.filter((g) => {
//     const searchLower = search.toLowerCase();
//     const matchSearch =
//       g.status?.toLowerCase().includes(searchLower) ||
//       g.totalGross.toString().includes(searchLower) ||
//       new Date(g.createdAt)
//         .toLocaleDateString("en-GB")
//         .includes(searchLower) ||
//       (g.walletAddress?.toLowerCase() || "").includes(searchLower);

//     const matchStatus =
//       statusFilter === "all" ||
//       g.status?.toLowerCase() === statusFilter.toLowerCase();

//     return matchSearch && matchStatus;
//   });

//   const sortedFiltered = [...filtered].sort(
//     (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//   );

//   const totalPages =
//     Math.ceil(sortedFiltered.length / itemsPerPage) || 1;

//   const startIdx = (currentPage - 1) * itemsPerPage;

//   const paginated = sortedFiltered.slice(
//     startIdx,
//     startIdx + itemsPerPage
//   );

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [search, statusFilter]);

//   const getStatusDetails = (group) => {
//     const s = group.status?.toLowerCase();

//     if (s === "approved" || s === "success") {
//       return {
//         label: group.status,
//         color: "bg-green-500/10 text-green-400 border-green-500/20",
//       };
//     }

//     if (s === "pending") {
//       return {
//         label: group.status,
//         color: "bg-[#eab308]/10 text-[#eab308] border-[#eab308]/20",
//       };
//     }

//     if (s === "rejected" || s === "failed") {
//       return {
//         label: group.status,
//         color: "bg-red-500/10 text-red-400 border-red-500/20",
//       };
//     }

//     return {
//       label: group.status || "UNKNOWN",
//       color: "bg-gray-500/10 text-gray-400 border-gray-500/20",
//     };
//   };

//   return (
//     <div className="w-full min-h-screen bg-[#0b1221] p-4 md:p-8 font-sans">

//       {/* Inner Card Container */}
//       <div className="max-w-7xl mx-auto bg-[#131c31] rounded-xl border-t-[3px] border-[#eab308] shadow-2xl p-4 sm:p-6">

//         {/* HEADER */}
//         <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
//           <div>
//             <h2 className="text-2xl sm:text-3xl text-[#eab308] font-bold tracking-wide flex items-center gap-3">
//               <Banknote className="text-[#eab308]" size={28} />
//               Withdrawal History
//             </h2>
            
//           </div>
//         </div>

//         {/* STATS */}
//         <div className="mb-8">
//           <div className="bg-[#0b1221] border border-gray-700 rounded-xl p-5 md:p-6 relative overflow-hidden flex flex-col justify-center max-w-sm">
//             <h3 className="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-widest flex items-center gap-2 mb-2">
//               <Wallet size={14} className="text-[#eab308]" />
//               Total Withdrawn
//             </h3>
//             <p className="text-3xl md:text-4xl font-black text-green-400">
//               ${totalAmount.toFixed(2)}
//             </p>
//           </div>
//         </div>

//         {/* FILTERS */}
//         <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between items-start sm:items-center text-gray-300 text-sm">

//           <div className="flex items-center gap-2 w-full sm:w-auto">
//             <div className="relative w-full sm:w-80 group">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <Search size={16} className="text-gray-500" />
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search amount, wallet..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="w-full bg-[#0b1221] border border-gray-700 text-gray-200 rounded px-3 py-2 pl-10 focus:outline-none focus:border-[#eab308] transition-colors placeholder-gray-500"
//               />
//             </div>
//           </div>

//           <div className="flex items-center gap-3 w-full sm:w-auto">
//             <span className="text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
//               Filter:
//             </span>
//             <select
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//               className="w-full sm:w-auto bg-[#0b1221] border border-gray-700 text-[#eab308] text-sm font-bold rounded px-4 py-2 focus:outline-none focus:border-[#eab308] transition-colors cursor-pointer capitalize"
//             >
//               <option value="all">All Statuses</option>
//               <option value="pending">Pending</option>
//               <option value="approved">Approved</option>
//               <option value="rejected">Rejected</option>
//             </select>
//           </div>
//         </div>

//         {/* TABLE */}
//         <div className="overflow-x-auto border border-gray-700 rounded-lg">
//           <table className="w-full text-left whitespace-nowrap border-collapse">
//             <thead className="text-[#eab308] bg-[#1a253e] text-sm border-b border-gray-700">
//               <tr>
//                 <th className="p-4 border-r border-gray-700/50 font-bold text-center w-16">Sr. <span className="text-[10px] text-gray-500 ml-1">♦</span></th>
//                 <th className="p-4 border-r border-gray-700/50 font-bold text-center">Date <span className="text-[10px] text-gray-500 ml-1">♦</span></th>
//                 <th className="p-4 border-r border-gray-700/50 font-bold text-center">Total <span className="text-[10px] text-gray-500 ml-1">♦</span></th>
//                  <th className="p-4 border-r border-gray-700/50 font-bold">Wallet Address</th>
//                 <th className="p-4 font-bold text-center">Status</th>
//               </tr>
//             </thead>

//             <tbody className="text-gray-300 text-sm">
//               {loading ? (
//                 <tr>
//                   <td colSpan="7" className="text-center py-12 text-[#eab308]">
//                      <div className="animate-spin h-8 w-8 mx-auto mb-3 border-4 border-t-transparent border-[#eab308] rounded-full"></div>
//                      Loading History...
//                   </td>
//                 </tr>
//               ) : paginated.length === 0 ? (
//                 <tr>
//                   <td colSpan="7" className="text-center py-12 text-gray-500">
//                     No Withdrawal Records Found
//                   </td>
//                 </tr>
//               ) : (
//                 paginated.map((group, idx) => {
//                   const statusInfo = getStatusDetails(group);

//                   return (
//                     <tr
//                       key={group._id || idx}
//                       className="border-b border-gray-700 hover:bg-[#1a253e] transition-colors"
//                     >
//                       <td className="p-4 border-r border-gray-700/50 font-medium text-center">
//                         {startIdx + idx + 1}
//                       </td>

//                       <td className="p-4 border-r border-gray-700/50 font-medium text-center">
//                         {new Date(group.createdAt).toLocaleDateString(
//                           "en-GB", { day: '2-digit', month: 'short', year: 'numeric' }
//                         )}
//                       </td>

//                       <td className="p-4 border-r border-gray-700/50 font-bold text-center text-white">
//                         ${group.totalGross.toFixed(2)}
//                       </td>
 

                       

//                       <td className="p-4 border-r border-gray-700/50 text-gray-400 font-mono text-[11px] sm:text-xs">
//                         {group.walletAddress ? (
//                           <span className="px-2 py-1 rounded border border-gray-700 bg-[#0b1221]">
//                             {group.walletAddress}
//                           </span>
//                         ) : (
//                           "N/A"
//                         )}
//                       </td>

//                       <td className="p-4 text-center">
//                         <span
//                           className={`inline-flex items-center justify-center border px-2.5 py-1 text-[10px] font-bold tracking-widest rounded uppercase ${statusInfo.color}`}
//                         >
//                           {statusInfo.label}
//                         </span>
//                       </td>

//                     </tr>
//                   );
//                 })
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* PAGINATION */}
//         {!loading && sortedFiltered.length > 0 && (
//           <div className="flex flex-col sm:flex-row justify-between items-center mt-6 text-gray-400 text-sm gap-4">
//             <div>
//               Showing <span className="text-white font-medium">{startIdx + 1}</span> to{" "}
//               <span className="text-white font-medium">
//                 {Math.min(startIdx + itemsPerPage, sortedFiltered.length)}
//               </span>{" "}
//               of <span className="text-white font-medium">{sortedFiltered.length}</span> entries
//             </div>

//             <div className="flex items-center bg-[#0b1221] rounded border border-gray-700 overflow-hidden">
//               <button
//                 onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//                 disabled={currentPage === 1}
//                 className={`px-4 py-2 transition-colors ${
//                   currentPage === 1
//                     ? "text-gray-600 bg-transparent cursor-not-allowed"
//                     : "text-[#eab308] hover:bg-[#1a253e]"
//                 }`}
//               >
//                 Previous
//               </button>
//               <div className="px-4 py-2 border-l border-r border-gray-700 bg-[#1a253e] text-[#eab308] font-bold">
//                 {currentPage}
//               </div>
//               <button
//                 onClick={() =>
//                   setCurrentPage((p) => Math.min(p + 1, totalPages))
//                 }
//                 disabled={currentPage === totalPages}
//                 className={`px-4 py-2 transition-colors ${
//                   currentPage === totalPages
//                     ? "text-gray-600 bg-transparent cursor-not-allowed"
//                     : "text-[#eab308] hover:bg-[#1a253e]"
//                 }`}
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default UserWithdrawalHistory;


import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext"; 
import {
  Search,
  Banknote,
  ChevronLeft,
  ChevronRight,
  Wallet,
  CalendarClock
} from "lucide-react";

function UserWithdrawalHistory() {
  const { user, token } = useAuth(); 

  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;
  const userId = user?.userId; 
  const isLeader = user?.role?.toLowerCase() === "leader";

  useEffect(() => {
    const fetchWithdrawals = async () => {
      if (!userId || !token) return; 
      try {
        setLoading(true);
        const res = await api.get(
          `/wallet/withdrawals/${userId}?t=${new Date().getTime()}`,
          { headers: { Authorization: `Bearer ${token}` } } 
        );
        
        setWithdrawals(res.data.withdrawals || []);
      } catch (error) {
        console.error("Error fetching withdrawal history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWithdrawals();
  }, [userId, token]);

  const groupWithdrawals = (list) => {
    const sorted = [...list].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );

    const groups = [];
    const THRESHOLD_MS = 5000;
    const CUTOFF_TIME = new Date("2026-07-13T16:00:00+05:30").getTime();

    for (const item of sorted) {
      const itemTime = new Date(item.createdAt).getTime();
      const lastGroup = groups[groups.length - 1];
      const isNewLogic = itemTime >= CUTOFF_TIME;

      const iGross = isNewLogic ? Number(item.grossAmount || 0) : Number(item.grossAmount || 0) * 2;
      const iCryptoNet = Number(item.netAmount || 0); 
      const iTopupNet = isNewLogic ? (iGross - iCryptoNet) : Number(item.netAmount || 0);

      if (
        lastGroup &&
        itemTime -
          new Date(
            lastGroup.entries[lastGroup.entries.length - 1].createdAt
          ).getTime() <=
          THRESHOLD_MS
      ) {
        lastGroup.entries.push(item);

        lastGroup.rawGross += iGross;
        lastGroup.rawCryptoNet += iCryptoNet;
        lastGroup.rawTopupNet += iTopupNet;

        if (item.status?.toLowerCase() === "pending")
          lastGroup.status = "pending";
        else if (
          item.status?.toLowerCase() === "rejected" &&
          lastGroup.status !== "pending"
        )
          lastGroup.status = "rejected";
      } else {
        groups.push({
          _id: item._id,
          createdAt: item.createdAt,
          entries: [item],
          rawGross: iGross,
          rawCryptoNet: iCryptoNet,
          rawTopupNet: iTopupNet,
          walletAddress: item.walletAddress,
          status: item.status || "pending",
          isNewLogic: isNewLogic 
        });
      }
    }

    groups.forEach(g => {
        if (isLeader && !g.isNewLogic) {
            const roundedGross = Math.floor(g.rawGross / 10) * 10;
            g.totalGross = roundedGross;
            g.totalCryptoNet = roundedGross * 0.50; 
            g.totalTopupNet = roundedGross * 0.50;  
        } else {
            g.totalGross = g.rawGross;
            g.totalCryptoNet = g.rawCryptoNet;
            g.totalTopupNet = g.rawTopupNet;
        }
    });

    return groups;
  };

  const grouped = groupWithdrawals(withdrawals);

  const totalAmount = grouped.reduce((sum, g) => {
      if (g.status?.toLowerCase() === "success" || g.status?.toLowerCase() === "approved") {
          return sum + g.totalGross;
      }
      return sum;
  }, 0);

  const filtered = grouped.filter((g) => {
    const searchLower = search.toLowerCase();
    const matchSearch =
      g.status?.toLowerCase().includes(searchLower) ||
      g.totalGross.toString().includes(searchLower) ||
      new Date(g.createdAt)
        .toLocaleDateString("en-GB")
        .includes(searchLower) ||
      (g.walletAddress?.toLowerCase() || "").includes(searchLower);

    const matchStatus =
      statusFilter === "all" ||
      g.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchSearch && matchStatus;
  });

  const sortedFiltered = [...filtered].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const totalPages = Math.ceil(sortedFiltered.length / itemsPerPage) || 1;
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginated = sortedFiltered.slice(startIdx, startIdx + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const getStatusDetails = (group) => {
    const s = group.status?.toLowerCase();

    if (s === "approved" || s === "success") {
      return {
        label: group.status,
        color: "bg-green-500/10 text-green-400 border-green-500/20",
      };
    }
    if (s === "pending") {
      return {
        label: group.status,
        color: "bg-[#eab308]/10 text-[#eab308] border-[#eab308]/20",
      };
    }
    if (s === "rejected" || s === "failed") {
      return {
        label: group.status,
        color: "bg-red-500/10 text-red-400 border-red-500/20",
      };
    }
    return {
      label: group.status || "UNKNOWN",
      color: "bg-gray-500/10 text-gray-400 border-gray-500/20",
    };
  };

  // 🔥 NAYA LOGIC: EXPECTED CREDIT DATE CALCULATION
  const getExpectedCreditDate = (createdAtStr) => {
    const createdDate = new Date(createdAtStr);
    const ruleStartDate = new Date("2026-10-11T00:00:00+05:30"); // Naya rule kal se lagu hua hai

    if (createdDate >= ruleStartDate) {
        // Naye withdrawals ke liye +10 Din jod do
        const expectedDate = new Date(createdDate);
        expectedDate.setDate(expectedDate.getDate() + 10);
        return expectedDate.toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' });
    } else {
        // Purane withdrawals (Jo pehle hi aa chuke hain) unki same date dikhao
        return createdDate.toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' });
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#0b1221] p-4 md:p-8 font-sans">

      <div className="max-w-7xl mx-auto bg-[#131c31] rounded-xl border-t-[3px] border-[#eab308] shadow-2xl p-4 sm:p-6">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl text-[#eab308] font-bold tracking-wide flex items-center gap-3">
              <Banknote className="text-[#eab308]" size={28} />
              Withdrawal History
            </h2>
          </div>
        </div>

        {/* STATS */}
        <div className="mb-8">
          <div className="bg-[#0b1221] border border-gray-700 rounded-xl p-5 md:p-6 relative overflow-hidden flex flex-col justify-center max-w-sm">
            <h3 className="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-widest flex items-center gap-2 mb-2">
              <Wallet size={14} className="text-[#eab308]" />
              Total Withdrawn
            </h3>
            <p className="text-3xl md:text-4xl font-black text-green-400">
              ${totalAmount.toFixed(2)}
            </p>
          </div>
        </div>

        {/* FILTERS */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between items-start sm:items-center text-gray-300 text-sm">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-80 group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Search amount, wallet..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#0b1221] border border-gray-700 text-gray-200 rounded px-3 py-2 pl-10 focus:outline-none focus:border-[#eab308] transition-colors placeholder-gray-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
              Filter:
            </span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto bg-[#0b1221] border border-gray-700 text-[#eab308] text-sm font-bold rounded px-4 py-2 focus:outline-none focus:border-[#eab308] transition-colors cursor-pointer capitalize"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto border border-gray-700 rounded-lg">
          <table className="w-full text-left whitespace-nowrap border-collapse">
            <thead className="text-[#eab308] bg-[#1a253e] text-sm border-b border-gray-700">
              <tr>
                <th className="p-4 border-r border-gray-700/50 font-bold text-center w-16">Sr.</th>
                <th className="p-4 border-r border-gray-700/50 font-bold text-center">Request Date</th>
                {/* 🔥 NAYA COLUMN: Credit Date */}
                <th className="p-4 border-r border-gray-700/50 font-bold text-center">Total</th>
                 <th className="p-4 border-r border-gray-700/50 font-bold">Wallet Address</th>
                <th className="p-4 border-r border-gray-700/50 font-bold text-center">Credit Date</th>
                <th className="p-4 font-bold text-center">Status</th>
              </tr>
            </thead>

            <tbody className="text-gray-300 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-[#eab308]">
                     <div className="animate-spin h-8 w-8 mx-auto mb-3 border-4 border-t-transparent border-[#eab308] rounded-full"></div>
                     Loading History...
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-gray-500">
                    No Withdrawal Records Found
                  </td>
                </tr>
              ) : (
                paginated.map((group, idx) => {
                  const statusInfo = getStatusDetails(group);
                  const expectedDate = getExpectedCreditDate(group.createdAt); // 🔥 Naya function call kiya

                  return (
                    <tr
                      key={group._id || idx}
                      className="border-b border-gray-700 hover:bg-[#1a253e] transition-colors"
                    >
                      <td className="p-4 border-r border-gray-700/50 font-medium text-center">
                        {startIdx + idx + 1}
                      </td>

                      <td className="p-4 border-r border-gray-700/50 font-medium text-center text-gray-400">
                        {new Date(group.createdAt).toLocaleDateString(
                          "en-GB", { day: '2-digit', month: 'short', year: 'numeric' }
                        )}
                      </td>

                     

                      <td className="p-4 border-r border-gray-700/50 font-black text-center text-white">
                        ${group.totalGross.toFixed(2)}
                      </td>
 
                      <td className="p-4 border-r border-gray-700/50 text-gray-400 font-mono text-[11px] sm:text-xs">
                        {group.walletAddress ? (
                          <span className="px-2 py-1 rounded border border-gray-700 bg-[#0b1221]">
                            {group.walletAddress}
                          </span>
                        ) : (
                          "N/A"
                        )}
                      </td>

                       {/* 🔥 EXPECTED DATE DISPLAY */}
                      <td className="p-4 border-r border-gray-700/50 font-bold text-center text-[#eab308]">
                        <div className="flex items-center justify-center gap-1.5">
                            <CalendarClock size={14} className="text-[#eab308]/70" />
                            {expectedDate}
                        </div>
                      </td>

                      <td className="p-4 text-center">
                        <span
                          className={`inline-flex items-center justify-center border px-2.5 py-1 text-[10px] font-bold tracking-widest rounded uppercase ${statusInfo.color}`}
                        >
                          {statusInfo.label}
                        </span>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {!loading && sortedFiltered.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 text-gray-400 text-sm gap-4">
            <div>
              Showing <span className="text-white font-medium">{startIdx + 1}</span> to{" "}
              <span className="text-white font-medium">
                {Math.min(startIdx + itemsPerPage, sortedFiltered.length)}
              </span>{" "}
              of <span className="text-white font-medium">{sortedFiltered.length}</span> entries
            </div>

            <div className="flex items-center bg-[#0b1221] rounded border border-gray-700 overflow-hidden">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 transition-colors ${
                  currentPage === 1
                    ? "text-gray-600 bg-transparent cursor-not-allowed"
                    : "text-[#eab308] hover:bg-[#1a253e]"
                }`}
              >
                Previous
              </button>
              <div className="px-4 py-2 border-l border-r border-gray-700 bg-[#1a253e] text-[#eab308] font-bold">
                {currentPage}
              </div>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`px-4 py-2 transition-colors ${
                  currentPage === totalPages
                    ? "text-gray-600 bg-transparent cursor-not-allowed"
                    : "text-[#eab308] hover:bg-[#1a253e]"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserWithdrawalHistory;