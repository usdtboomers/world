// import React, { useState, useEffect, useMemo } from 'react';
// import api from '../../api/axios'; 
// import { Trophy, Search, Users, ArrowUpCircle, Calendar, DollarSign, Award, Copy, LogIn, X, Target, Network, Clock, CheckCircle, XCircle } from 'lucide-react';

// // 🔥 NAYA COMPONENT: Live Timer ke liye (Taki har second page bina hang hue timer chalaye)
// const LiveTimer = ({ topUpDate }) => {
//   const [timeDisplay, setTimeDisplay] = useState("");

//   useEffect(() => {
//     if (!topUpDate) return;

//     const tenDaysMs = 10 * 24 * 60 * 60 * 1000;
//     const deadline = new Date(topUpDate).getTime() + tenDaysMs;

//     const updateTimer = () => {
//       const now = Date.now();
//       const diff = deadline - now;

//       if (diff <= 0) {
//         setTimeDisplay("Expired");
//         return;
//       }

//       const d = Math.floor(diff / (1000 * 60 * 60 * 24));
//       const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
//       const m = Math.floor((diff / 1000 / 60) % 60);
//       const s = Math.floor((diff / 1000) % 60);

//       setTimeDisplay(`${d}d ${h}h ${m}m ${s}s`);
//     };

//     updateTimer(); // Pehli baar turant call karne ke liye
//     const interval = setInterval(updateTimer, 1000); // Har second update
    
//     return () => clearInterval(interval);
//   }, [topUpDate]);

//   return (
//     <span className="text-[10px] text-gray-500 font-bold">
//       Time Left: {timeDisplay || "Calculating..."}
//     </span>
//   );
// };


// const MonthlyRewardReport = () => {
//   const [report, setReport] = useState([]);
//   const [loading, setLoading] = useState(true);
  
//   // States for Search, Filter & Pagination
//   const [search, setSearch] = useState("");
//   const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); 
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);

//   // 🔥 STATE FOR MODAL
//   const [legModal, setLegModal] = useState({ isOpen: false, title: "", count: 0, list: [] });

//   useEffect(() => {
//     const fetchProgress = async () => {
//       try {
//         setLoading(true);
//         // 🔥 Updated endpoint for the new Salary Plan Logic
//         const res = await api.get('/admin/monthly-salary-admin-report'); 
        
//         // Ensure data is array
//         const rawData = Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
//         setReport(rawData);
//         setCurrentPage(1); 
//       } catch (error) {
//         console.error("Failed to fetch report", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProgress();
//   }, [selectedMonth]); 

//   // Reset page when search changes
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [search, itemsPerPage]);

//   // 🔥 SUPER FAST MEMOIZED FILTERING
//   const filteredReport = useMemo(() => {
//     if (!search) return report;
    
//     const lowerSearch = search.toLowerCase().trim();
//     return report.filter(r => {
//       const idMatch = r.userId ? String(r.userId).toLowerCase().includes(lowerSearch) : false;
//       const nameMatch = r.name ? r.name.toLowerCase().includes(lowerSearch) : false;
//       return idMatch || nameMatch;
//     });
//   }, [report, search]);

//   // 🔥 MEMOIZED TOTALS (Updated for $100 Salary Plan)
//   const totals = useMemo(() => {
//     let qualifiedCount = 0;
    
//     for (let i = 0; i < report.length; i++) {
//       if (report[i].status === 'qualified') {
//         qualifiedCount++;
//       }
//     }
    
//     return {
//       runners: report.length,
//       qualified: qualifiedCount,
//       estimatedPayout: qualifiedCount * 100 // $100 per qualified user
//     };
//   }, [report]);

//   // Pagination Logic
//   const totalPages = Math.ceil(filteredReport.length / itemsPerPage) || 1;
//   const validCurrentPage = Math.min(currentPage, totalPages);
  
//   const indexOfLastItem = validCurrentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = filteredReport.slice(indexOfFirstItem, indexOfLastItem);

//   const handleNext = () => { if (validCurrentPage < totalPages) setCurrentPage(prev => prev + 1); };
//   const handlePrev = () => { if (validCurrentPage > 1) setCurrentPage(prev => prev - 1); };
//   const handleEntriesChange = (e) => { setItemsPerPage(Number(e.target.value)); };

//   // Kept empty to avoid crash since JSX button uses it
//   const handleLoginAsUser = async (targetUserId) => {
//     alert("Login as User function is currently disabled in code.");
//   };

//   const handleCopy = (text) => {
//     navigator.clipboard.writeText(text);
//     alert(`Copied ID: ${text}`); 
//   };

//   const openLegModal = (userName, legType, count, listArray = []) => {
//     setLegModal({
//       isOpen: true,
//       title: `${legType} - ${userName}`,
//       count: count,
//       list: listArray 
//     });
//   };

//   return (
//     <div className="p-4">
      
//       <style>{`
//         .custom-scroll::-webkit-scrollbar { height: 8px; width: 8px; }
//         .custom-scroll::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 4px;}
//         .custom-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
//       `}</style>

//       {/* 🔥 MODAL POPUP FOR L1 / L2 USERS */}
//       {legModal.isOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
//             <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
//               <h3 className="font-black text-slate-800 uppercase tracking-wide text-sm flex items-center gap-2">
//                 <Network size={16} className="text-indigo-600"/> {legModal.title}
//               </h3>
//               <button onClick={() => setLegModal({ isOpen: false })} className="text-slate-400 hover:text-red-500 bg-white rounded-md p-1 border border-slate-200 transition-colors">
//                 <X size={18}/>
//               </button>
//             </div>
            
//             <div className="p-5">
//               <div className="flex items-center justify-between bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-xl mb-4">
//                  <span className="text-xs font-bold text-indigo-800 uppercase tracking-widest">Qualified ($50+) Downline Count:</span>
//                  <span className="text-lg font-black text-indigo-600">{legModal.count}</span>
//               </div>
              
//               <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">
//                 Downline Members IDs (Who Topped Up)
//               </div>

//               <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 min-h-[150px] max-h-[300px] overflow-y-auto custom-scroll">
//                  {legModal.list && legModal.list.length > 0 ? (
//                     <div className="flex flex-col gap-2">
//                       {legModal.list.map((item, i) => {
//                         const uid = typeof item === 'object' ? item.userId : item;
//                         const uname = typeof item === 'object' ? item.name : "User";
//                         return (
//                           <div key={i} className="flex justify-between items-center bg-white border border-slate-200 px-4 py-2.5 rounded-lg shadow-sm hover:border-indigo-200 transition-colors">
//                             <span className="font-bold text-slate-700 text-sm capitalize">{uname}</span>
//                             <div className="flex items-center gap-2">
//                                <span className="text-xs font-black bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-1 rounded">#{uid}</span>
//                                <button onClick={() => handleCopy(uid.toString())} className="text-slate-400 hover:text-slate-800 transition-colors"><Copy size={12}/></button>
//                             </div>
//                           </div>
//                         )
//                       })}
//                     </div>
//                  ) : (
//                     <div className="text-center flex flex-col items-center justify-center h-full opacity-70 mt-6">
//                        <Target size={24} className="text-slate-400 mb-2"/>
//                        <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">No Qualified Downline Found</p>
//                     </div>
//                  )}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Header */}
//       <div className="mb-6 mt-4">
//         <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
//           <Trophy className="text-yellow-500" size={28} /> Salary Progress Report
//         </h2>
//         <p className="text-gray-500 text-sm mt-1">Track monthly team business (Level 1 & 2 targets) for $100 Salary qualification.</p>
//       </div>

//       {/* Summary Boxes */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//          <div className="bg-white p-4 rounded shadow border border-gray-200 flex items-center gap-4">
//             <div className="bg-blue-100 p-3 rounded text-blue-600"><Users size={24}/></div>
//             <div>
//                <p className="text-xs font-bold text-gray-500 uppercase">Active Runners</p>
//                <h3 className="text-xl font-bold text-gray-800">{totals.runners}</h3>
//             </div>
//          </div>
//          <div className="bg-white p-4 rounded shadow border border-gray-200 flex items-center gap-4">
//             <div className="bg-green-100 p-3 rounded text-green-600"><Award size={24}/></div>
//             <div>
//                <p className="text-xs font-bold text-gray-500 uppercase">Total Qualified</p>
//                <h3 className="text-xl font-bold text-gray-800">{totals.qualified}</h3>
//             </div>
//          </div>
//          <div className="bg-white p-4 rounded shadow border border-gray-200 flex items-center gap-4">
//             <div className="bg-yellow-100 p-3 rounded text-yellow-600"><DollarSign size={24}/></div>
//             <div>
//                <p className="text-xs font-bold text-gray-500 uppercase">Est. Monthly Payout</p>
//                <h3 className="text-xl font-bold text-gray-800">${totals.estimatedPayout.toFixed(2)}</h3>
//             </div>
//          </div>
//       </div>

//       {/* Top Controls */}
//       <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-6">
//         <div className="flex flex-col md:flex-row gap-2 w-full xl:w-auto flex-wrap">
//           <input
//             type="text"
//             className="border text-black border-gray-300 rounded px-3 py-2 w-full md:w-64 outline-none focus:ring-2 focus:ring-indigo-400"
//             placeholder="Search UserID or Name"
//             value={search}
//             onChange={(e) => { setSearch(e.target.value); }}
//           />
//           <select 
//             className="border border-gray-300 text-black rounded px-3 py-2 bg-white cursor-pointer outline-none focus:ring-2 focus:ring-indigo-400"
//             value={itemsPerPage}
//             onChange={handleEntriesChange}
//           >
//             <option value={10}>Show 10</option>
//             <option value={30}>Show 30</option>
//             <option value={50}>Show 50</option>
//             <option value={100}>Show 100</option>
//           </select>
//         </div>

//         <div className="flex gap-2 items-center justify-between md:justify-end">
//           <span className="text-gray-600 text-sm font-medium">
//             Total Entries: {filteredReport.length}
//           </span>
//         </div>
//       </div>

//       {/* Table Section */}
//       <div className="overflow-auto border border-gray-200 rounded shadow bg-white">
//         <table className="min-w-full bg-white text-sm text-left whitespace-nowrap">
//           <thead className="bg-gray-100 text-gray-600 uppercase text-xs border-b border-gray-200">
//             <tr>
//               <th className="px-4 py-3 border-r text-center w-12">Sr.</th>
//               <th className="px-4 py-3 border-r text-center w-32">User ID</th>
//               <th className="px-4 py-3 border-r">Name</th>
//               <th className="px-4 py-3 border-r text-center">L1 & L2 Targets ($50+)</th>
//               <th className="px-4 py-3 border-r text-center">Status</th>
//               <th className="px-4 py-3">Next Target Progress</th>
//             </tr>
//           </thead>
          
//           <tbody>
//             {loading ? (
//               <tr><td colSpan="6" className="text-center py-16 text-indigo-600 font-black uppercase tracking-widest text-lg bg-indigo-50/50 animate-pulse">⏳ Loading Salary Plans... Please Wait.</td></tr>
//             ) : currentItems.length === 0 ? (
//               <tr><td colSpan="6" className="text-center py-10 font-bold text-gray-500 uppercase tracking-widest bg-gray-50">No data found.</td></tr>
//             ) : (
//               currentItems.map((user, idx) => {
//                 // Calculation based on L1 (target 3) and L2 (target 6)
//                 const l1Progress = Math.min((user.l1Count / 3) * 100, 100) || 0;
//                 const l2Progress = Math.min((user.l2Count / 6) * 100, 100) || 0;
//                 const averageProgress = (l1Progress + l2Progress) / 2;

//                 return (
//                   <tr key={user.userId} className="hover:bg-gray-50 border-b border-gray-200 group">
                    
//                     <td className="px-4 py-2 border-r text-gray-500 text-center font-bold">
//                        {indexOfFirstItem + idx + 1}
//                     </td>

//                     {/* 🔥 User ID Column */}
//                     <td className="px-4 py-2 border-r text-center">
//                       <div className="flex items-center justify-center gap-2">
//                          <span className="font-bold text-gray-800">#{user.userId}</span>
//                          <div className="flex items-center gap-1">
//                            <button 
//                               onClick={() => handleCopy(user.userId.toString())} 
//                               title="Copy ID" 
//                               className="text-gray-400 hover:text-gray-700 transition-colors"
//                            >
//                               <Copy size={14}/>
//                            </button>
//                            <button 
//                               onClick={() => handleLoginAsUser(user.userId)} 
//                               className="text-indigo-600 hover:text-indigo-800 transition-colors"
//                            >
//                               <LogIn size={14} />
//                            </button>
//                          </div>
//                       </div>
//                     </td>

//                     {/* 🔥 Name Column */}
//                     <td className="px-4 py-2 border-r">
//                       <div className="font-semibold text-gray-800 capitalize truncate max-w-[150px]" title={user.name}>
//                         {user.name}
//                       </div>
//                     </td>
                    
//                     {/* Clickable Level Details */}
//                     <td className="px-4 py-2 border-r text-center">
//                       <div className="flex flex-col gap-2 items-center justify-center">
//                           <button 
//                              onClick={() => openLegModal(user.name, 'Level 1 Users', user.l1Count, user.l1List)}
//                              className="flex items-center justify-between text-xs font-semibold text-gray-600 bg-white hover:bg-green-50 px-2 py-1 rounded border border-gray-300 w-32 transition-colors cursor-pointer shadow-sm"
//                           >
//                              <span className="flex items-center gap-1"><ArrowUpCircle className="text-green-500" size={12} /> L1:</span>
//                              <span className="text-green-600 font-bold">{user.l1Count} / 3</span>
//                           </button>
//                           <button 
//                              onClick={() => openLegModal(user.name, 'Level 2 Users', user.l2Count, user.l2List)}
//                              className="flex items-center justify-between text-xs font-semibold text-gray-600 bg-white hover:bg-blue-50 px-2 py-1 rounded border border-gray-300 w-32 transition-colors cursor-pointer shadow-sm"
//                           >
//                              <span className="flex items-center gap-1"><Users className="text-blue-500" size={12} /> L2:</span>
//                              <span className="text-blue-600 font-bold">{user.l2Count} / 6</span>
//                           </button>
//                       </div>
//                     </td>
                    
//                     {/* Status Column with 🔥 LIVE TIMER 🔥 */}
//                     <td className="px-4 py-2 border-r text-center">
//                        {user.status === 'qualified' ? (
//                           <div className="flex flex-col items-center gap-1">
//                               <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs font-bold uppercase border border-green-200 flex items-center gap-1">
//                                   <CheckCircle size={12}/> QUALIFIED
//                               </span>
//                               <span className="text-xs font-bold text-gray-800 flex items-center gap-1">
//                                   <DollarSign size={12} className="text-yellow-500"/> $100 / month
//                               </span>
//                               <span className="text-[10px] text-gray-500 font-bold">Paid: {user.salaryMonthsPaid}/6</span>
//                           </div>
//                        ) : user.status === 'failed' ? (
//                           <div className="flex flex-col items-center gap-1">
//                               <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded text-xs font-bold uppercase border border-red-200 flex items-center gap-1">
//                                   <XCircle size={12}/> FAILED
//                               </span>
//                               <span className="text-[10px] text-gray-500 font-bold">Time limit expired</span>
//                           </div>
//                        ) : (
//                           <div className="flex flex-col items-center gap-1">
//                               <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-bold uppercase border border-blue-200 flex items-center gap-1">
//                                   <Clock size={12}/> PENDING
//                               </span>
//                               {/* 🔥 Yahan LiveTimer component laga diya hai */}
//                               <LiveTimer topUpDate={user.topUpDate} />
//                           </div>
//                        )}
//                     </td>
                    
//                     {/* Progress Bar */}
//                     <td className="px-4 py-2">
//                        <div className="w-full min-w-[200px]">
//                           <div className="flex justify-between text-[10px] font-bold uppercase text-gray-500 mb-1">
//                               <span>Target: $100 Salary</span>
//                               <span>{averageProgress.toFixed(0)}%</span>
//                           </div>
//                           <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden relative">
//                              <div 
//                                 className={`h-full rounded-full transition-all duration-1000 ${averageProgress === 100 ? 'bg-green-500' : 'bg-indigo-500'}`}
//                                 style={{ width: `${averageProgress}%` }}
//                              ></div>
//                           </div>
//                           <div className="flex justify-between mt-1 text-[10px] text-gray-400">
//                               <span>Req L1: 3 Users</span>
//                               <span>Req L2: 6 Users</span>
//                           </div>
//                        </div>
//                     </td>

//                   </tr>
//                 )
//               })
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination Footer */}
//       {!loading && filteredReport.length > 0 && (
//         <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4 text-sm">
//           <span className="text-gray-600 font-bold uppercase tracking-widest text-[11px]">
//             Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredReport.length)} of {filteredReport.length} entries
//           </span>
          
//           <div className="flex gap-2">
//             <button
//               onClick={handlePrev}
//               disabled={validCurrentPage === 1}
//               className={`px-4 py-1.5 rounded-lg font-bold uppercase text-xs tracking-widest transition-all ${
//                 validCurrentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' : 'bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-sm'
//               }`}
//             >
//               Prev
//             </button>
//             <span className="px-4 py-1.5 border rounded-lg bg-indigo-600 text-white font-black shadow-md">
//               {validCurrentPage} / {totalPages}
//             </span>
//             <button
//               onClick={handleNext}
//               disabled={validCurrentPage === totalPages}
//               className={`px-4 py-1.5 rounded-lg font-bold uppercase text-xs tracking-widest transition-all ${
//                 validCurrentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' : 'bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-sm'
//               }`}
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       )}

//     </div>
//   )
// }

// export default MonthlyRewardReport;





import React, { useState, useEffect, useMemo } from 'react';
import api from '../../api/axios'; 
import { Trophy, Search, Users, ArrowUpCircle, Calendar, DollarSign, Award, Copy, LogIn, X, Target, Network, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

// 🔥 LIVE TIMER COMPONENT
const LiveTimer = ({ topUpDate }) => {
  const [timeDisplay, setTimeDisplay] = useState("");

  useEffect(() => {
    if (!topUpDate) return;

    const tenDaysMs = 10 * 24 * 60 * 60 * 1000;
    const deadline = new Date(topUpDate).getTime() + tenDaysMs;

    const updateTimer = () => {
      const now = Date.now();
      const diff = deadline - now;

      if (diff <= 0) {
        setTimeDisplay("Expired");
        return;
      }

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / 1000 / 60) % 60);
      const s = Math.floor((diff / 1000) % 60);

      setTimeDisplay(`${d}d ${h}h ${m}m ${s}s`);
    };

    updateTimer(); 
    const interval = setInterval(updateTimer, 1000); 
    
    return () => clearInterval(interval);
  }, [topUpDate]);

  return (
    <span className="text-[10px] text-gray-500 font-bold">
      Time Left: {timeDisplay || "Calculating..."}
    </span>
  );
};


const MonthlyRewardReport = () => {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); 
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [legModal, setLegModal] = useState({ isOpen: false, title: "", count: 0, list: [] });

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true);
        const res = await api.get('/admin/monthly-salary-admin-report'); 
        
        const rawData = Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
        setReport(rawData);
        setCurrentPage(1); 
      } catch (error) {
        console.error("Failed to fetch report", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, [selectedMonth]); 

  useEffect(() => {
    setCurrentPage(1);
  }, [search, itemsPerPage]);

  const filteredReport = useMemo(() => {
    if (!search) return report;
    
    const lowerSearch = search.toLowerCase().trim();
    return report.filter(r => {
      const idMatch = r.userId ? String(r.userId).toLowerCase().includes(lowerSearch) : false;
      const nameMatch = r.name ? r.name.toLowerCase().includes(lowerSearch) : false;
      return idMatch || nameMatch;
    });
  }, [report, search]);

  const totals = useMemo(() => {
    let qualifiedCount = 0;
    
    for (let i = 0; i < report.length; i++) {
      if (report[i].status === 'qualified') {
        qualifiedCount++;
      }
    }
    
    return {
      runners: report.length,
      qualified: qualifiedCount,
      estimatedPayout: qualifiedCount * 100 
    };
  }, [report]);

  const totalPages = Math.ceil(filteredReport.length / itemsPerPage) || 1;
  const validCurrentPage = Math.min(currentPage, totalPages);
  
  const indexOfLastItem = validCurrentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReport.slice(indexOfFirstItem, indexOfLastItem);

  const handleNext = () => { if (validCurrentPage < totalPages) setCurrentPage(prev => prev + 1); };
  const handlePrev = () => { if (validCurrentPage > 1) setCurrentPage(prev => prev - 1); };
  const handleEntriesChange = (e) => { setItemsPerPage(Number(e.target.value)); };

  const handleLoginAsUser = async (targetUserId) => {
    alert("Login as User function is currently disabled in code.");
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert(`Copied ID: ${text}`); 
  };

  const openLegModal = (userName, legType, count, listArray = []) => {
    setLegModal({
      isOpen: true,
      title: `${legType} - ${userName}`,
      count: count,
      list: listArray 
    });
  };

  return (
    <div className="p-4">
      
      <style>{`
        .custom-scroll::-webkit-scrollbar { height: 8px; width: 8px; }
        .custom-scroll::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 4px;}
        .custom-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
      `}</style>

      {/* 🔥 MODAL POPUP FOR L1 / L2 USERS */}
      {legModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-black text-slate-800 uppercase tracking-wide text-sm flex items-center gap-2">
                <Network size={16} className="text-indigo-600"/> {legModal.title}
              </h3>
              <button onClick={() => setLegModal({ isOpen: false })} className="text-slate-400 hover:text-red-500 bg-white rounded-md p-1 border border-slate-200 transition-colors">
                <X size={18}/>
              </button>
            </div>
            
            <div className="p-5">
              <div className="flex items-center justify-between bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-xl mb-4">
                 <span className="text-xs font-bold text-indigo-800 uppercase tracking-widest">Qualified ($50+) Downline Count:</span>
                 <span className="text-lg font-black text-indigo-600">{legModal.count}</span>
              </div>
              
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">
                Downline Members IDs (Who Topped Up)
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 min-h-[150px] max-h-[300px] overflow-y-auto custom-scroll">
                 {legModal.list && legModal.list.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      {legModal.list.map((item, i) => {
                        const uid = typeof item === 'object' ? item.userId : item;
                        const uname = typeof item === 'object' ? item.name : "User";
                        return (
                          <div key={i} className="flex justify-between items-center bg-white border border-slate-200 px-4 py-2.5 rounded-lg shadow-sm hover:border-indigo-200 transition-colors">
                            <span className="font-bold text-slate-700 text-sm capitalize">{uname}</span>
                            <div className="flex items-center gap-2">
                               <span className="text-xs font-black bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-1 rounded">#{uid}</span>
                               <button onClick={() => handleCopy(uid.toString())} className="text-slate-400 hover:text-slate-800 transition-colors"><Copy size={12}/></button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                 ) : (
                    <div className="text-center flex flex-col items-center justify-center h-full opacity-70 mt-6">
                       <Target size={24} className="text-slate-400 mb-2"/>
                       <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">No Qualified Downline Found</p>
                    </div>
                 )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6 mt-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Trophy className="text-yellow-500" size={28} /> Salary Progress Report
        </h2>
        <p className="text-gray-500 text-sm mt-1">Track monthly team business (Level 1 & 2 targets) for $100 Salary qualification.</p>
      </div>

      {/* Summary Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
         <div className="bg-white p-4 rounded shadow border border-gray-200 flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded text-blue-600"><Users size={24}/></div>
            <div>
               <p className="text-xs font-bold text-gray-500 uppercase">Active Runners</p>
               <h3 className="text-xl font-bold text-gray-800">{totals.runners}</h3>
            </div>
         </div>
         <div className="bg-white p-4 rounded shadow border border-gray-200 flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded text-green-600"><Award size={24}/></div>
            <div>
               <p className="text-xs font-bold text-gray-500 uppercase">Total Qualified</p>
               <h3 className="text-xl font-bold text-gray-800">{totals.qualified}</h3>
            </div>
         </div>
         <div className="bg-white p-4 rounded shadow border border-gray-200 flex items-center gap-4">
            <div className="bg-yellow-100 p-3 rounded text-yellow-600"><DollarSign size={24}/></div>
            <div>
               <p className="text-xs font-bold text-gray-500 uppercase">Est. Monthly Payout</p>
               <h3 className="text-xl font-bold text-gray-800">${totals.estimatedPayout.toFixed(2)}</h3>
            </div>
         </div>
      </div>

      {/* Top Controls */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-6">
        <div className="flex flex-col md:flex-row gap-2 w-full xl:w-auto flex-wrap">
          <input
            type="text"
            className="border text-black border-gray-300 rounded px-3 py-2 w-full md:w-64 outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Search UserID or Name"
            value={search}
            onChange={(e) => { setSearch(e.target.value); }}
          />
          <select 
            className="border border-gray-300 text-black rounded px-3 py-2 bg-white cursor-pointer outline-none focus:ring-2 focus:ring-indigo-400"
            value={itemsPerPage}
            onChange={handleEntriesChange}
          >
            <option value={10}>Show 10</option>
            <option value={30}>Show 30</option>
            <option value={50}>Show 50</option>
            <option value={100}>Show 100</option>
          </select>
        </div>

        <div className="flex gap-2 items-center justify-between md:justify-end">
          <span className="text-gray-600 text-sm font-medium">
            Total Entries: {filteredReport.length}
          </span>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-auto border border-gray-200 rounded shadow bg-white">
        <table className="min-w-full bg-white text-sm text-left whitespace-nowrap">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 border-r text-center w-12">Sr.</th>
              <th className="px-4 py-3 border-r text-center w-32">User ID</th>
              <th className="px-4 py-3 border-r">Name</th>
              <th className="px-4 py-3 border-r text-center">L1 & L2 Targets ($50+)</th>
              <th className="px-4 py-3 border-r text-center">Status</th>
              <th className="px-4 py-3">Next Target Progress</th>
            </tr>
          </thead>
          
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="text-center py-16 text-indigo-600 font-black uppercase tracking-widest text-lg bg-indigo-50/50 animate-pulse">⏳ Loading Salary Plans... Please Wait.</td></tr>
            ) : currentItems.length === 0 ? (
              <tr><td colSpan="6" className="text-center py-10 font-bold text-gray-500 uppercase tracking-widest bg-gray-50">No data found.</td></tr>
            ) : (
              currentItems.map((user, idx) => {
                
                const l1Progress = Math.min((user.l1Count / 3) * 100, 100) || 0;
                const l2Progress = Math.min((user.l2Count / 6) * 100, 100) || 0;
                const averageProgress = (l1Progress + l2Progress) / 2;

                return (
                  <tr key={user.userId} className="hover:bg-gray-50 border-b border-gray-200 group">
                    
                    <td className="px-4 py-2 border-r text-gray-500 text-center font-bold">
                       {indexOfFirstItem + idx + 1}
                    </td>

                    <td className="px-4 py-2 border-r text-center">
                      <div className="flex items-center justify-center gap-2">
                         <span className="font-bold text-gray-800">#{user.userId}</span>
                         <div className="flex items-center gap-1">
                           <button 
                              onClick={() => handleCopy(user.userId.toString())} 
                              title="Copy ID" 
                              className="text-gray-400 hover:text-gray-700 transition-colors"
                           >
                              <Copy size={14}/>
                           </button>
                           <button 
                              onClick={() => handleLoginAsUser(user.userId)} 
                              className="text-indigo-600 hover:text-indigo-800 transition-colors"
                           >
                              <LogIn size={14} />
                           </button>
                         </div>
                      </div>
                    </td>

                    <td className="px-4 py-2 border-r">
                      <div className="font-semibold text-gray-800 capitalize truncate max-w-[150px]" title={user.name}>
                        {user.name}
                      </div>
                    </td>
                    
                    <td className="px-4 py-2 border-r text-center">
                      <div className="flex flex-col gap-2 items-center justify-center">
                          <button 
                             onClick={() => openLegModal(user.name, 'Level 1 Users', user.l1Count, user.l1List)}
                             className="flex items-center justify-between text-xs font-semibold text-gray-600 bg-white hover:bg-green-50 px-2 py-1 rounded border border-gray-300 w-32 transition-colors cursor-pointer shadow-sm"
                          >
                             <span className="flex items-center gap-1"><ArrowUpCircle className="text-green-500" size={12} /> L1:</span>
                             <span className="text-green-600 font-bold">{user.l1Count} / 3</span>
                          </button>
                          <button 
                             onClick={() => openLegModal(user.name, 'Level 2 Users', user.l2Count, user.l2List)}
                             className="flex items-center justify-between text-xs font-semibold text-gray-600 bg-white hover:bg-blue-50 px-2 py-1 rounded border border-gray-300 w-32 transition-colors cursor-pointer shadow-sm"
                          >
                             <span className="flex items-center gap-1"><Users className="text-blue-500" size={12} /> L2:</span>
                             <span className="text-blue-600 font-bold">{user.l2Count} / 6</span>
                          </button>
                      </div>
                    </td>
                    
                    <td className="px-4 py-2 border-r text-center">
                       {user.status === 'qualified' ? (
                          <div className="flex flex-col items-center gap-1">
                              <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs font-bold uppercase border border-green-200 flex items-center gap-1">
                                  <CheckCircle size={12}/> QUALIFIED
                              </span>
                              <span className="text-xs font-bold text-gray-800 flex items-center gap-1">
                                  <DollarSign size={12} className="text-yellow-500"/> $100 / month
                              </span>
                              <span className="text-[10px] text-gray-500 font-bold">Paid: {user.salaryMonthsPaid}/6</span>
                          </div>
                       ) : user.status === 'failed' && user.isNeverToppedUp ? (
                          <div className="flex flex-col items-center gap-1">
                             <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs font-bold uppercase border border-yellow-200 flex items-center gap-1">
                                <AlertCircle size={12} /> NO TOPUP
                             </span>
                             <span className="text-[10px] text-gray-500 font-bold">Please Top-up ($50+)</span>
                          </div>
                       ) : user.status === 'failed' ? (
                          <div className="flex flex-col items-center gap-1">
                              <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded text-xs font-bold uppercase border border-red-200 flex items-center gap-1">
                                  <XCircle size={12}/> FAILED
                              </span>
                              <span className="text-[10px] text-gray-500 font-bold">Time limit expired</span>
                          </div>
                       ) : (
                          <div className="flex flex-col items-center gap-1">
                              <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-bold uppercase border border-blue-200 flex items-center gap-1">
                                  <Clock size={12}/> PENDING
                              </span>
                              <LiveTimer topUpDate={user.topUpDate} />
                          </div>
                       )}
                    </td>
                    
                    <td className="px-4 py-2">
                       <div className="w-full min-w-[200px]">
                          <div className="flex justify-between text-[10px] font-bold uppercase text-gray-500 mb-1">
                              <span>Target: $100 Salary</span>
                              <span>{averageProgress.toFixed(0)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden relative">
                             <div 
                                className={`h-full rounded-full transition-all duration-1000 ${averageProgress === 100 ? 'bg-green-500' : 'bg-indigo-500'}`}
                                style={{ width: `${averageProgress}%` }}
                             ></div>
                          </div>
                          <div className="flex justify-between mt-1 text-[10px] text-gray-400">
                              <span>Req L1: 3 Users</span>
                              <span>Req L2: 6 Users</span>
                          </div>
                       </div>
                    </td>

                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {!loading && filteredReport.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4 text-sm">
          <span className="text-gray-600 font-bold uppercase tracking-widest text-[11px]">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredReport.length)} of {filteredReport.length} entries
          </span>
          
          <div className="flex gap-2">
            <button
              onClick={handlePrev}
              disabled={validCurrentPage === 1}
              className={`px-4 py-1.5 rounded-lg font-bold uppercase text-xs tracking-widest transition-all ${
                validCurrentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' : 'bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-sm'
              }`}
            >
              Prev
            </button>
            <span className="px-4 py-1.5 border rounded-lg bg-indigo-600 text-white font-black shadow-md">
              {validCurrentPage} / {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={validCurrentPage === totalPages}
              className={`px-4 py-1.5 rounded-lg font-bold uppercase text-xs tracking-widest transition-all ${
                validCurrentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' : 'bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-sm'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

    </div>
  )
}

export default MonthlyRewardReport;