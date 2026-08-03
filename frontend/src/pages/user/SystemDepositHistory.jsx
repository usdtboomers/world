// // import React, { useState, useEffect } from "react";
// // import api from "../../api/axios";
// // import { useAuth } from "../../context/AuthContext";
// // import TopNav from "../../components/navbar/TopNav";
// // import Sidebar from "../../components/sidebar/Sidebar";
// // import SpinnerOverlay from "../../components/common/SpinnerOverlay";

// // const DepositHistory = () => {
// //   const { token, user } = useAuth();
// //   const [deposits, setDeposits] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [showSidebar, setShowSidebar] = useState(false);

// //   // --- Pagination States ---
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [itemsPerPage, setItemsPerPage] = useState(10); // Default 10 items per page

// //   // Formats addresses and hashes to look clean (e.g., 0xabcd...1234)
// //   const formatString = (str) => {
// //     if (!str) return "0x***...***";
// //     return `${str.substring(0, 6)}...${str.substring(str.length - 4)}`;
// //   };

// //   useEffect(() => {
// //     const fetchDeposits = async () => {
// //       try {
// //         const res = await api.get("/transactions/deposits/live-feed", {
// //           headers: { Authorization: `Bearer ${token}` }
// //         });
        
// //         // 🟢 FIX: Yahan humne filter laga diya hai. Sirf wahi array me jayega jiska amount 1 ya usse bada hai.
// //         const allDeposits = res.data.deposits || [];
// //         const validDeposits = allDeposits.filter(dep => Number(dep.amount) >= 1);
        
// //         setDeposits(validDeposits);
// //       } catch (err) {
// //         console.error("Error fetching live deposits", err);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchDeposits();
// //     const interval = setInterval(fetchDeposits, 180000); // Refreshes every 3 minutes
// //     return () => clearInterval(interval);
// //   }, [token]);

// //   // --- Pagination Logic ---
// //   const indexOfLastItem = currentPage * itemsPerPage;
// //   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
// //   const currentItems = deposits.slice(indexOfFirstItem, indexOfLastItem);
// //   const totalPages = Math.ceil(deposits.length / itemsPerPage);

// //   const handleNextPage = () => {
// //     if (currentPage < totalPages) setCurrentPage(currentPage + 1);
// //   };

// //   const handlePrevPage = () => {
// //     if (currentPage > 1) setCurrentPage(currentPage - 1);
// //   };

// //   const handleItemsPerPageChange = (e) => {
// //     setItemsPerPage(Number(e.target.value));
// //     setCurrentPage(1); // Reset to page 1 when changing items per page
// //   };

// //   return (
// //     <div className="relative min-h-screen bg-slate-950 text-slate-900 overflow-x-hidden font-sans">
// //       <TopNav onHamburgerClick={() => setShowSidebar(true)} />
// //       <div className="pt-1 p-2 md:p-0 flex gap-1 h-screen box-border">
// //         <Sidebar user={user} isOpen={showSidebar} onClose={() => setShowSidebar(false)} />
// //         <main className="flex-1 w-full max-w-full overflow-y-auto pb-20 custom-scroll rounded-2xl bg-slate-900/40 p-4 md:p-6 lg:mt-2">
          
// //           <h1 className="text-2xl font-bold pt-16 text-slate-900 mb-2">Live USDT (BEP-20) Deposits</h1>
// //           <p className="text-slate-900 mb-6 pt-2 font-bold text-sm italic opacity-80">Real-time platform deposit activity</p>
          
// //           {loading ? <SpinnerOverlay /> : (
// //             <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              
// //               {/* Pagination Controls - Top */}
// //               <div className="flex justify-between items-center mb-4">
// //                 <div className="flex items-center gap-2">
// //                   <span className="text-sm text-slate-900">Show</span>
// //                   <select 
// //                     value={itemsPerPage} 
// //                     onChange={handleItemsPerPageChange}
// //                     className="bg-slate-900 border border-slate-600 text-black text-sm rounded focus:ring-blue-500 focus:border-blue-500 block p-1.5"
// //                   >
// //                     <option value={10}>10</option>
// //                     <option value={20}>20</option>
// //                     <option value={50}>50</option>
// //                     <option value={100}>100</option>
// //                   </select>
// //                   <span className="text-sm text-slate-400">entries</span>
// //                 </div>
// //               </div>

// //               <div className="overflow-x-auto">
// //                 {deposits.length === 0 ? (
// //                   <p className="text-black p-4 text-center">Waiting for live transactions...</p>
// //                 ) : (
// //                   <table className="w-full text-left min-w-[900px]">
// //                     <thead>
// //                       <tr className="border-b border-slate-700 text-yellow-500 text-sm">
// //                         <th className="py-3 px-2">Sr. No.</th>
// //                         {/* ✅ Header Update */}
// //                         <th className="py-3 px-2">Date </th>
// //                         <th className="py-3 px-2">Txn Hash</th>
// //                         <th className="py-3 px-2">From Address</th>
// //                         <th className="py-3 px-2">Amount (USDT)</th>
// //                         <th className="py-3 px-2">Status</th>
// //                       </tr>
// //                     </thead>
// //                     <tbody>
// //                       {currentItems.map((dep, idx) => {
// //                         const dateObj = new Date(dep.createdAt);
// //                         const formattedDate = dateObj.toLocaleDateString('en-GB'); // Ex: 25/12/2026

// //                         return (
// //                           <tr key={idx} className="border-b border-slate-700/50 text-sm hover:bg-slate-800/30 transition-colors">
                            
// //                             <td className="py-4 px-2 text-slate-400 font-medium">
// //                               {indexOfFirstItem + idx + 1}
// //                             </td>

// //                             {/* ✅ Date & Time Cells stacked */}
// //                             <td className="py-4 px-2 text-slate-900">
// //                                <div className="flex flex-col">
// //                                   <span className="font-semibold">{formattedDate}</span>
// //                                 </div>
// //                             </td>

// //                             <td className="py-4 px-2 font-mono">
// //                               <a 
// //                                 href={`https://bscscan.com/tx/${dep.hash}`} 
// //                                 target="_blank" 
// //                                 rel="noopener noreferrer"
// //                                 className="text-blue-400 hover:text-blue-300 underline transition-colors"
// //                               >
// //                                 {formatString(dep.hash)}
// //                               </a>
// //                             </td>
// //                             <td className="py-4 px-2 text-slate-900 font-mono">
// //                               {formatString(dep.fromAddress)}
// //                             </td>
// //                             <td className="py-4 px-2 text-green-400 font-bold">
// //                               + {dep.amount}
// //                             </td>
// //                             <td className="py-4 px-2">
// //                               <span className="bg-green-500/10 text-green-500 px-2 py-1 rounded text-xs border border-slate-200">
// //                                 Success
// //                               </span>
// //                             </td>
// //                           </tr>
// //                         );
// //                       })}
// //                     </tbody>
// //                   </table>
// //                 )}
// //               </div>

// //               {/* Pagination Controls - Bottom */}
// //               {deposits.length > 0 && (
// //                 <div className="flex justify-between items-center mt-4">
// //                   <div className="text-sm text-slate-400">
// //                     Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, deposits.length)} of {deposits.length} entries
// //                   </div>
// //                   <div className="flex gap-2">
// //                     <button 
// //                       onClick={handlePrevPage} 
// //                       disabled={currentPage === 1}
// //                       className={`px-3 py-1 text-sm rounded ${currentPage === 1 ? 'bg-slate-700 text-black cursor-not-allowed' : 'bg-slate-600 text-slate-900 hover:bg-slate-500 transition-colors'}`}
// //                     >
// //                       Previous
// //                     </button>
// //                     <button 
// //                       onClick={handleNextPage} 
// //                       disabled={currentPage === totalPages || totalPages === 0}
// //                       className={`px-3 py-1 text-sm rounded ${currentPage === totalPages || totalPages === 0 ? 'bg-slate-700 text-black cursor-not-allowed' : 'bg-slate-600 text-slate-900 hover:bg-slate-500 transition-colors'}`}
// //                     >
// //                       Next
// //                     </button>
// //                   </div>
// //                 </div>
// //               )}

// //             </div>
// //           )}
// //         </main>
// //       </div>
// //     </div>
// //   );
// // };

// // export default DepositHistory;



// import React, { useState, useEffect } from "react";
// import api from "../../api/axios";
// import { useAuth } from "../../context/AuthContext";
// import TopNav from "../../components/navbar/TopNav";
// import Sidebar from "../../components/sidebar/Sidebar";
// import SpinnerOverlay from "../../components/common/SpinnerOverlay";

// const SystemDepositHistory = () => {
//   const { token, user } = useAuth();
//   const [deposits, setDeposits] = useState([]);
//   const [stats, setStats] = useState({
//     totalGrandInvestment: 0,
//     todayTotalInvestment: 0,
//   });
//   const [loading, setLoading] = useState(true);
//   const [showSidebar, setShowSidebar] = useState(false);

//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10); 

//   const formatString = (str) => {
//     if (!str) return "0x***...***";
//     return `${str.substring(0, 6)}...${str.substring(str.length - 4)}`;
//   };

//   useEffect(() => {
//     const fetchDeposits = async () => {
//       try {
//         const res = await api.get("/transactions/deposits/live-feed", {
//           headers: { Authorization: `Bearer ${token}` }
//         });
        
//         if (res.data.stats) {
//             setStats({
//               totalGrandInvestment: res.data.stats.totalGrandInvestment || 0,
//               todayTotalInvestment: res.data.stats.todayTotalInvestment || 0
//             });
//         }

//         const allDeposits = res.data.deposits || [];
//         const validDeposits = allDeposits.filter(dep => Number(dep.amount) >= 1);
        
//         setDeposits(validDeposits);
//       } catch (err) {
//         console.error("Error fetching live deposits", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDeposits();
//     const interval = setInterval(fetchDeposits, 180000); 
//     return () => clearInterval(interval);
//   }, [token]);

//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = deposits.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(deposits.length / itemsPerPage);

//   const handleNextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
//   const handlePrevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };
//   const handleItemsPerPageChange = (e) => {
//     setItemsPerPage(Number(e.target.value));
//     setCurrentPage(1); 
//   };

//   return (
//     <div className="relative min-h-screen bg-slate-950 text-white overflow-x-hidden font-sans">
//       <TopNav onHamburgerClick={() => setShowSidebar(true)} />
//       <div className="pt-1 p-2 md:p-0 flex gap-1 h-screen box-border">
//         <Sidebar user={user} isOpen={showSidebar} onClose={() => setShowSidebar(false)} />
//         <main className="flex-1 w-full max-w-full overflow-y-auto pb-20 custom-scroll rounded-2xl bg-slate-900/40 p-4 md:p-6 lg:mt-2">
          
//           <h1 className="text-2xl font-bold pt-16 text-white mb-2 uppercase tracking-wide">
//             World Finance Dashboard
//           </h1>
//           <p className="text-white mb-6 pt-2 font-bold text-sm italic opacity-80">Platform Statistics & Live Feed</p>
          
//           {loading ? <SpinnerOverlay /> : (
//             <>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//                 <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-5 rounded-xl border border-yellow-400 shadow-lg">
//                   <h3 className="text-black font-bold text-sm uppercase tracking-wide">Grand Total Investment</h3>
//                   <p className="text-3xl font-extrabold text-black mt-2">
//                     ${stats.totalGrandInvestment.toFixed(2)}
//                   </p>
//                 </div>
//                 <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow-lg">
//                   <h3 className="text-slate-400 font-bold text-sm uppercase tracking-wide">Today's Total Investment</h3>
//                   <p className="text-3xl font-bold text-white mt-2">
//                     ${stats.todayTotalInvestment.toFixed(2)}
//                   </p>
//                 </div>
//               </div>

//               <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
//                 <div className="flex justify-between items-center mb-4">
//                   <div className="flex items-center gap-2">
//                     <span className="text-sm text-white">Show</span>
//                     <select 
//                       value={itemsPerPage} 
//                       onChange={handleItemsPerPageChange}
//                       className="bg-slate-900 border border-slate-600 text-slate-200 text-sm rounded focus:ring-blue-500 block p-1.5"
//                     >
//                       <option value={10}>10</option>
//                       <option value={20}>20</option>
//                       <option value={50}>50</option>
//                     </select>
//                     <span className="text-sm text-slate-400">entries</span>
//                   </div>
//                 </div>

//                 <div className="overflow-x-auto">
//                   {deposits.length === 0 ? (
//                     <p className="text-gray-400 p-4 text-center">Waiting for live transactions...</p>
//                   ) : (
//                     <table className="w-full text-left min-w-[950px]">
//                       <thead>
//                         <tr className="border-b border-slate-700 text-yellow-500 text-sm">
//                           <th className="py-3 px-2">Sr. No.</th>
//                           <th className="py-3 px-2">Date</th>
//                           {/* 🟢 NAYA: User ID Header */}
//                           <th className="py-3 px-2">User ID</th>
//                           <th className="py-3 px-2">Txn Hash</th>
//                           <th className="py-3 px-2">From Address</th>
//                           <th className="py-3 px-2">Amount (USDT)</th>
//                           <th className="py-3 px-2">Status</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {currentItems.map((dep, idx) => {
//                           const dateObj = new Date(dep.createdAt || dep.detectedAt);
//                           const formattedDate = dateObj.toLocaleDateString('en-GB'); 

//                           return (
//                             <tr key={idx} className="border-b border-slate-700/50 text-sm hover:bg-slate-800/30 transition-colors">
//                               <td className="py-4 px-2 text-slate-400 font-medium">
//                                 {indexOfFirstItem + idx + 1}
//                               </td>

//                               <td className="py-4 px-2 text-white">
//                                  <span className="font-semibold text-slate-300">{formattedDate}</span>
//                               </td>
                              
//                               {/* 🟢 NAYA: WF User ID dikhane wala column */}
//                               <td className="py-4 px-2 text-white font-bold tracking-wide">
//                                 {dep.userId ? dep.userId : "WF-------"}
//                               </td>

//                               <td className="py-4 px-2 font-mono">
//                                 <a 
//                                   href={`https://bscscan.com/tx/${dep.hash}`} 
//                                   target="_blank" 
//                                   rel="noopener noreferrer"
//                                   className="text-blue-400 hover:text-blue-300 underline transition-colors"
//                                 >
//                                   {formatString(dep.hash)}
//                                 </a>
//                               </td>
                              
//                               <td className="py-4 px-2 text-white font-mono">
//                                 {formatString(dep.fromAddress)}
//                               </td>
                              
//                               <td className="py-4 px-2 text-green-400 font-bold">
//                                 + ${Number(dep.amount).toFixed(2)}
//                               </td>
                              
//                               <td className="py-4 px-2">
//                                 <span className="bg-green-500/10 text-green-500 px-2 py-1 rounded text-xs border border-green-500/20">
//                                   Success
//                                 </span>
//                               </td>
//                             </tr>
//                           );
//                         })}
//                       </tbody>
//                     </table>
//                   )}
//                 </div>

//                 {deposits.length > 0 && (
//                   <div className="flex justify-between items-center mt-4">
//                     <div className="text-sm text-slate-400">
//                       Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, deposits.length)} of {deposits.length} entries
//                     </div>
//                     <div className="flex gap-2">
//                       <button 
//                         onClick={handlePrevPage} 
//                         disabled={currentPage === 1}
//                         className={`px-3 py-1 text-sm rounded ${currentPage === 1 ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-slate-600 text-white hover:bg-slate-500 transition-colors'}`}
//                       >
//                         Previous
//                       </button>
//                       <button 
//                         onClick={handleNextPage} 
//                         disabled={currentPage === totalPages || totalPages === 0}
//                         className={`px-3 py-1 text-sm rounded ${currentPage === totalPages || totalPages === 0 ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-slate-600 text-white hover:bg-slate-500 transition-colors'}`}
//                       >
//                         Next
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </>
//           )}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default SystemDepositHistory;


// import React, { useState, useEffect } from "react";
// import api from "../../api/axios";
// import { useAuth } from "../../context/AuthContext";
// import TopNav from "../../components/navbar/TopNav";
// import Sidebar from "../../components/sidebar/Sidebar";
// import SpinnerOverlay from "../../components/common/SpinnerOverlay";

// const SystemDepositHistory = () => {
//   const { token, user } = useAuth();
//   const [deposits, setDeposits] = useState([]);
//   const [stats, setStats] = useState({
//     totalGrandInvestment: 0,
//     todayTotalInvestment: 0,
//   });
//   const [loading, setLoading] = useState(true);
//   const [showSidebar, setShowSidebar] = useState(false);

//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10); 

//   // 🔥 Hash ko aur chota kar diya taaki mobile me fit ho sake
//   const formatString = (str) => {
//     if (!str) return "0x..";
//     return `${str.substring(0, 4)}..${str.substring(str.length - 4)}`;
//   };

//   useEffect(() => {
//     const fetchDeposits = async () => {
//       try {
//         const res = await api.get("/transactions/deposits/live-feed", {
//           headers: { Authorization: `Bearer ${token}` }
//         });
        
//         if (res.data.stats) {
//             setStats({
//               totalGrandInvestment: res.data.stats.totalGrandInvestment || 0,
//               todayTotalInvestment: res.data.stats.todayTotalInvestment || 0
//             });
//         }

//         const allDeposits = res.data.deposits || [];
//         const validDeposits = allDeposits.filter(dep => Number(dep.amount) >= 1);
        
//         setDeposits(validDeposits);
//       } catch (err) {
//         console.error("Error fetching live deposits", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDeposits();
//     const interval = setInterval(fetchDeposits, 180000); 
//     return () => clearInterval(interval);
//   }, [token]);

//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = deposits.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(deposits.length / itemsPerPage);

//   const handleNextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
//   const handlePrevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };
//   const handleItemsPerPageChange = (e) => {
//     setItemsPerPage(Number(e.target.value));
//     setCurrentPage(1); 
//   };

//   return (
//     <div className="relative min-h-screen bg-slate-950 text-white overflow-x-hidden font-sans">
//       <TopNav onHamburgerClick={() => setShowSidebar(true)} />
//       <div className="pt-1 p-2 md:p-0 flex gap-1 h-screen box-border">
//         <Sidebar user={user} isOpen={showSidebar} onClose={() => setShowSidebar(false)} />
//         <main className="flex-1 w-full max-w-full overflow-y-auto pb-20 custom-scroll rounded-2xl bg-slate-900/40 p-2 md:p-6 lg:mt-2">
        
//           {loading ? <SpinnerOverlay /> : (
//             <>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
//                 <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-4 rounded-xl border border-yellow-400 shadow-lg">
//                   <h3 className="text-black font-bold text-xs md:text-sm uppercase tracking-wide">Total Investment</h3>
//                   <p className="text-2xl md:text-3xl font-extrabold text-black mt-1">
//                     ${stats.totalGrandInvestment.toFixed(2)}
//                   </p>
//                 </div>
//                 <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-lg">
//                   <h3 className="text-slate-400 font-bold text-xs md:text-sm uppercase tracking-wide">Today's Total</h3>
//                   <p className="text-2xl md:text-3xl font-bold text-white mt-1">
//                     ${stats.todayTotalInvestment.toFixed(2)}
//                   </p>
//                 </div>
//               </div>

//               <div className="bg-slate-800/50 rounded-xl p-2 md:p-4 border border-slate-700">
//                 <div className="flex justify-between items-center mb-3">
//                   <div className="flex items-center gap-2">
//                     <span className="text-xs md:text-sm text-white">Live Investment</span>
                   
//                    </div>
//                 </div>

//                 {/* 🔥 min-w-[850px] hata diya hai aur overflow hidden rakha hai taaki ek screen me fit ho */}
//                 <div className="overflow-x-hidden w-full">
//                   {deposits.length === 0 ? (
//                     <p className="text-gray-400 p-4 text-center text-sm">Waiting for live transactions...</p>
//                   ) : (
//                     <table className="w-full text-left table-fixed md:table-auto">
//                       <thead>
//                         {/* 🔥 Header padding aur text size minimize kar diya */}
//                         <tr className="border-b border-slate-700 text-yellow-500 text-[9px] md:text-sm whitespace-nowrap">
//                           <th className="py-1 px-1 w-[8%]">Sr.</th>
//                           <th className="py-1 px-1 w-[15%]">Date</th>
//                           <th className="py-1 px-1 w-[15%]">Amt($)</th>
//                           <th className="py-1 px-1 w-[18%]">User ID</th>
//                           <th className="py-1 px-1 w-[17%]">Name</th>
//                           <th className="py-1 px-1 w-[15%]">Hash</th>
//                          </tr>
//                       </thead>
//                       <tbody>
//                         {currentItems.map((dep, idx) => {
//                           const dateObj = new Date(dep.createdAt || dep.detectedAt);
//                           // Date me year ko chota rakha (jaise 03/08/26) jagah bachane ke liye
//                           const formattedDate = dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }); 

//                           return (
//                             // 🔥 Rows ko bhi ekdum chota (text-[10px]) aur nazdik-nazdik (py-1.5) kar diya
//                             <tr key={idx} className="border-b border-slate-700/50 text-[10px] md:text-[13px] hover:bg-slate-800/30 transition-colors whitespace-nowrap overflow-hidden">
//                               <td className="py-1.5 px-1 text-slate-400 font-medium">
//                                 {indexOfFirstItem + idx + 1}
//                               </td>

//                               <td className="py-1.5 px-1 text-white">
//                                  <span className="font-semibold text-slate-300">{formattedDate}</span>
//                               </td>
                              
//                               <td className="py-1.5 px-1 text-green-400 font-bold">
//                                 +{Number(dep.amount).toFixed(2)}
//                               </td>

//                               <td className="py-1.5 px-1 text-white font-bold tracking-tight">
//                                 {dep.userId ? dep.userId : "WF----"}
//                               </td>

//                               <td className="py-1.5 px-1 text-slate-300 truncate max-w-[50px] md:max-w-none">
//                                 {dep.name ? dep.name.split(" ")[0] : "System"}
//                               </td>

//                               <td className="py-1.5 px-1 font-mono">
//                                 <a 
//                                   href={`https://bscscan.com/tx/${dep.hash}`} 
//                                   target="_blank" 
//                                   rel="noopener noreferrer"
//                                   className="text-blue-400 hover:text-blue-300 transition-colors"
//                                 >
//                                   {formatString(dep.hash)}
//                                 </a>
//                               </td>
                              
                            
//                             </tr>
//                           );
//                         })}
//                       </tbody>
//                     </table>
//                   )}
//                 </div>

//                 {deposits.length > 0 && (
//                   <div className="flex justify-between items-center mt-3 gap-2">
//                     <div className="text-[10px] md:text-sm text-slate-400">
//                       Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, deposits.length)} of {deposits.length}
//                     </div>
//                     <div className="flex gap-1">
//                       <button 
//                         onClick={handlePrevPage} 
//                         disabled={currentPage === 1}
//                         className={`px-2 py-1 text-[10px] md:text-sm rounded ${currentPage === 1 ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-slate-600 text-white hover:bg-slate-500 transition-colors'}`}
//                       >
//                         Prev
//                       </button>
//                       <button 
//                         onClick={handleNextPage} 
//                         disabled={currentPage === totalPages || totalPages === 0}
//                         className={`px-2 py-1 text-[10px] md:text-sm rounded ${currentPage === totalPages || totalPages === 0 ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-slate-600 text-white hover:bg-slate-500 transition-colors'}`}
//                       >
//                         Next
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </>
//           )}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default SystemDepositHistory;


import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import TopNav from "../../components/navbar/TopNav";
import Sidebar from "../../components/sidebar/Sidebar";
import SpinnerOverlay from "../../components/common/SpinnerOverlay";

const SystemDepositHistory = () => {
  const { token, user } = useAuth();
  const [deposits, setDeposits] = useState([]);
  const [stats, setStats] = useState({
    totalGrandInvestment: 0,
    todayTotalInvestment: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); 

  // 🔥 Hash ko chota kar diya taaki mobile me fit ho sake
  const formatString = (str) => {
    if (!str) return "0x..";
    return `${str.substring(0, 4)}..${str.substring(str.length - 4)}`;
  };

  useEffect(() => {
    const fetchDeposits = async () => {
      try {
        const res = await api.get("/transactions/deposits/live-feed", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.data.stats) {
            setStats({
              totalGrandInvestment: res.data.stats.totalGrandInvestment || 0,
              todayTotalInvestment: res.data.stats.todayTotalInvestment || 0
            });
        }

        const allDeposits = res.data.deposits || [];
        const validDeposits = allDeposits.filter(dep => Number(dep.amount) >= 1);
        
        setDeposits(validDeposits);
      } catch (err) {
        console.error("Error fetching live deposits", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDeposits();
    const interval = setInterval(fetchDeposits, 180000); 
    return () => clearInterval(interval);
  }, [token]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = deposits.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(deposits.length / itemsPerPage);

  const handleNextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
  const handlePrevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); 
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-white overflow-x-hidden font-sans">
      <TopNav onHamburgerClick={() => setShowSidebar(true)} />
      <div className="pt-1 p-2 md:p-0 flex gap-1 h-screen box-border">
        <Sidebar user={user} isOpen={showSidebar} onClose={() => setShowSidebar(false)} />
        <main className="flex-1 w-full max-w-full overflow-y-auto pb-20 custom-scroll rounded-2xl bg-slate-900/40 p-2 md:p-6 lg:mt-2">
        
          {/* 🔥 Ye Title aap se galti se delete ho gaya tha, maine wapas laga diya */}
         

          {loading ? <SpinnerOverlay /> : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
    <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-4 rounded-xl border border-yellow-400 shadow-lg">
        <h3 className="text-black font-bold text-xs md:text-sm uppercase tracking-wide">Total Investment</h3>
        <p className="text-2xl md:text-3xl font-extrabold text-black mt-1">
             ${(2000 + (Number(stats.totalGrandInvestment) || 0)).toFixed(2)}
        </p>
    </div>
</div>
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-lg">
                  <h3 className="text-slate-400 font-bold text-xs md:text-sm uppercase tracking-wide">Today's Total</h3>
                  <p className="text-2xl md:text-3xl font-bold text-white mt-1">
                    ${stats.todayTotalInvestment.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-2 md:p-4 border border-slate-700">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs md:text-sm text-white">Live Investment</span>
                    
                   </div>
                </div>

                {/* 🔥 Mobile ke liye best layout */}
                <div className="overflow-x-hidden w-full">
                  {deposits.length === 0 ? (
                    <p className="text-gray-400 p-4 text-center text-sm">Waiting for live transactions...</p>
                  ) : (
                    <table className="w-full text-left table-fixed md:table-auto">
                      <thead>
                        <tr className="border-b border-slate-700 text-yellow-500 text-[9px] md:text-sm whitespace-nowrap">
                          <th className="py-1 px-1 w-[8%]">Sr.</th>
                          <th className="py-1 px-1 w-[15%]">Date</th>
                          <th className="py-1 px-1 w-[15%]">Amt($)</th>
                          <th className="py-1 px-1 w-[18%]">User ID</th>
                          <th className="py-1 px-1 w-[17%]">Name</th>
                          <th className="py-1 px-1 w-[15%]">Hash</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentItems.map((dep, idx) => {
                          const dateObj = new Date(dep.createdAt || dep.detectedAt);
                          const formattedDate = dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }); 

                          return (
                            <tr key={idx} className="border-b border-slate-700/50 text-[10px] md:text-[13px] hover:bg-slate-800/30 transition-colors whitespace-nowrap overflow-hidden">
                              <td className="py-1.5 px-1 text-slate-400 font-medium">
                                {indexOfFirstItem + idx + 1}
                              </td>

                              <td className="py-1.5 px-1 text-white">
                                 <span className="font-semibold text-slate-300">{formattedDate}</span>
                              </td>
                              
                              <td className="py-1.5 px-1 text-green-400 font-bold">
                                +{Number(dep.amount).toFixed(2)}
                              </td>

                              <td className="py-1.5 px-1 text-white font-bold tracking-tight">
                                {dep.userId ? dep.userId : "WF----"}
                              </td>

                              {/* 🔥 Sirf First Name Dikhayega */}
                            <td className="py-1.5 px-1 text-slate-300 truncate max-w-[50px] md:max-w-none">
    {dep.name ? dep.name : "user"}
</td>

                              <td className="py-1.5 px-1 font-mono">
                                <a 
                                  href={`https://bscscan.com/tx/${dep.hash}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                  {formatString(dep.hash)}
                                </a>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>

                {deposits.length > 0 && (
                  <div className="flex justify-between items-center mt-3 gap-2">
                    <div className="text-[10px] md:text-sm text-slate-400">
                      Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, deposits.length)} of {deposits.length}
                    </div>
                    <div className="flex gap-1">
                      <button 
                        onClick={handlePrevPage} 
                        disabled={currentPage === 1}
                        className={`px-2 py-1 text-[10px] md:text-sm rounded ${currentPage === 1 ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-slate-600 text-white hover:bg-slate-500 transition-colors'}`}
                      >
                        Prev
                      </button>
                      <button 
                        onClick={handleNextPage} 
                        disabled={currentPage === totalPages || totalPages === 0}
                        className={`px-2 py-1 text-[10px] md:text-sm rounded ${currentPage === totalPages || totalPages === 0 ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-slate-600 text-white hover:bg-slate-500 transition-colors'}`}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default SystemDepositHistory;