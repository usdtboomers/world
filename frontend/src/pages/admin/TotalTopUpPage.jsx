// import React, { useEffect, useState } from 'react';
// import api from "../../api/axios";
// import Papa from 'papaparse';
// import { saveAs } from 'file-saver';
// import { Package, User } from 'lucide-react';

// const getISTDateStr = (dateObj = new Date()) => {
//   if (!dateObj) return '';
//   return new Date(dateObj).toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
// };

// const getISTDateTimeString = (dateString) => {
//   if (!dateString) return '';
//   return new Date(dateString).toLocaleString('en-IN', {
//     timeZone: 'Asia/Kolkata',
//     day: '2-digit',
//     month: 'short',
//     year: 'numeric',
//     hour: '2-digit',
//     minute: '2-digit',
//     hour12: true
//   });
// };

// const toNumber = (val) => {
//   if (val == null) return 0;
//   if (typeof val === 'number') return val;
//   if (typeof val === 'string') return parseFloat(val) || 0;
//   if (typeof val === 'object' && val.$numberDecimal) {
//     return parseFloat(val.$numberDecimal) || 0;
//   }
//   return Number(val) || 0;
// };

// const TotalTopUpPage = () => {
//   const [topupUsers, setTopupUsers] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [searchId, setSearchId] = useState('');
//   const [searchPackage, setSearchPackage] = useState(''); 
//   const [fromDate, setFromDate] = useState('');
//   const [toDate, setToDate] = useState('');
  
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(20); 

//   useEffect(() => {
//     const fetchTopupUsers = async () => {
//       try {
//         const token = localStorage.getItem('adminToken');
//         const res = await api.get('/admin/topup-users', {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const users = (res.data || []).map((u) => ({
//           ...u,
//           topUpAmount: toNumber(u.topUpAmount),
//         }));

//         setTopupUsers(users);
//       } catch (err) {
//         console.error("Topup Fetch Error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTopupUsers();
//   }, []);

//   useEffect(() => {
//     const filtered = topupUsers.filter((user) => {
//       const matchesId = searchId ? String(user.userId).includes(searchId) : true;
//       const matchesPackage = searchPackage ? user.packageName === searchPackage : true; 

//       const dateStr = user.topUpDate ? getISTDateStr(new Date(user.topUpDate)) : null;
      
//       const matchesFrom = fromDate ? dateStr && dateStr >= fromDate : true;
//       const matchesTo = toDate ? dateStr && dateStr <= toDate : true;

//       return matchesId && matchesPackage && matchesFrom && matchesTo;
//     });

//     setFilteredUsers(filtered);
//     setCurrentPage(1);
//   }, [searchId, searchPackage, fromDate, toDate, topupUsers]);

//   const todayIST = getISTDateStr(); 
  
//   let totalBusiness = 0;
//   let todayBusiness = 0;
//   let todayCount = 0;

//   // 🔥 NAYA LOGIC: Har package ka count track karne ke liye
//   let packageCounts = {
//     'SAVING 1': 0, 'SAVING 2': 0, 'SAVING 3': 0, 
//     'SAVING 4': 0, 'SAVING 5': 0, 'SAVING 6': 0, 
//     'SAVING 7': 0, 'SAVING 8': 0, 'SAVING 9': 0
//   };

//   filteredUsers.forEach(u => {
//       const amt = u.topUpAmount;
//       const dateStr = u.topUpDate ? getISTDateStr(new Date(u.topUpDate)) : null;
//       const isToday = dateStr === todayIST;

//       totalBusiness += amt;
//       if (isToday) {
//           todayBusiness += amt;
//           todayCount++;
//       }

//       // 📦 Count incrementing logic based on packageName
//       if (u.packageName && packageCounts[u.packageName] !== undefined) {
//           packageCounts[u.packageName]++;
//       }
//   });

//   const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

//   const handleEntriesChange = (e) => {
//     setItemsPerPage(Number(e.target.value));
//     setCurrentPage(1);
//   };

//   const exportToCSV = () => {
//     const summary = [
//       { Metric: 'Total TopUps', Value: filteredUsers.length },
//       { Metric: 'Total Business ($)', Value: totalBusiness },
//       { Metric: 'Today TopUps', Value: todayCount },
//       { Metric: 'Today Business ($)', Value: todayBusiness }
//     ];

//     const table = filteredUsers.map((u, i) => ({
//       SNo: i + 1,
//       UserID: u.userId,
//       Name: u.name || '',
//       Package: u.packageName,
//       ToppedUpBy: u.topUpBy || 'Self / System',
//       Amount: u.topUpAmount,
//       Date: getISTDateTimeString(u.topUpDate),
//     }));

//     const csv = Papa.unparse(summary) + '\n\n' + Papa.unparse(table);
//     const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
//     saveAs(blob, `topup-report-IST-${Date.now()}.csv`);
//   };

//   return (
//     <div className="p-6 max-w-7xl pt-24 text-black mx-auto">
//       <h2 className="text-3xl font-bold text-indigo-700 mb-6">📦 User Package Report</h2>

//       {/* FILTER SECTION */}
//       <div className="flex flex-col md:flex-row gap-4 mb-6 flex-wrap bg-slate-50 p-4 rounded-xl border border-slate-200">
//         <input
//           type="text"
//           placeholder="Search User ID"
//           value={searchId}
//           onChange={(e) => setSearchId(e.target.value)}
//           className="px-4 py-2 border rounded w-full md:flex-1 shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none font-semibold"
//         />

//         <select
//           value={searchPackage}
//           onChange={(e) => setSearchPackage(e.target.value)}
//           className="px-4 py-2 border rounded w-full md:flex-1 shadow-sm outline-none font-semibold text-slate-700"
//         >
//           <option value="">All Packages</option>
//           <option value="SAVING 1">SAVING 1 ($2)</option>
//           <option value="SAVING 2">SAVING 2 ($5)</option>
//           <option value="SAVING 3">SAVING 3 ($10)</option>
//           <option value="SAVING 4">SAVING 4 ($20)</option>
//           <option value="SAVING 5">SAVING 5 ($50)</option>
//           <option value="SAVING 6">SAVING 6 ($100)</option>
//           <option value="SAVING 7">SAVING 7 ($200)</option>
//           <option value="SAVING 8">SAVING 8 ($500)</option>
//           <option value="SAVING 9">SAVING 9 ($1000)</option>
//         </select>

//         <div className="flex items-center gap-2">
//             <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">From:</span>
//             <input
//               type="date"
//               value={fromDate}
//               onChange={(e) => setFromDate(e.target.value)}
//               className="px-4 py-2 border rounded w-full md:flex-1 shadow-sm outline-none font-semibold"
//             />
//         </div>

//         <div className="flex items-center gap-2">
//             <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">To:</span>
//             <input
//               type="date"
//               value={toDate}
//               onChange={(e) => setToDate(e.target.value)}
//               className="px-4 py-2 border rounded w-full md:flex-1 shadow-sm outline-none font-semibold"
//             />
//         </div>

//         <select 
//           className="px-4 py-2 border rounded w-full md:w-32 shadow-sm bg-white outline-none font-semibold"
//           value={itemsPerPage}
//           onChange={handleEntriesChange}
//         >
//           <option value={10}>Show 10</option>
//           <option value={20}>Show 20</option>
//           <option value={50}>Show 50</option>
//           <option value={100}>Show 100</option>
//         </select>
        
//         <button 
//            onClick={() => { setFromDate(''); setToDate(''); setSearchPackage(''); setSearchId(''); }} 
//            className="bg-gray-200 text-gray-700 font-bold px-4 py-2 rounded hover:bg-gray-300 transition shadow-sm text-xs w-full md:w-auto"
//         >
//           Clear
//         </button>
//       </div>

//       {/* 🚀 MAIN STATS CARDS */}
//       <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
//         <SummaryCard label="Total TopUps" value={filteredUsers.length} color="bg-indigo-100 border-indigo-200" />
//         <SummaryCard label="Total Business" value={`$${totalBusiness}`} color="bg-green-100 border-green-200" />
//         <SummaryCard label="Today TopUps" value={todayCount} color="bg-blue-100 border-blue-200" />
//         <SummaryCard label="Today Business" value={`$${todayBusiness}`} color="bg-teal-100 border-teal-200" />
//       </div>

//       {/* 📦 PACKAGE-WISE STATS CARDS */}
//       <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-3 border-b pb-2">📦 Package Sales Summary</h3>
//       <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9 gap-3 mb-8">
//         <SmallCard label="SAVING 1 ($2)" value={packageCounts['SAVING 1']} />
//         <SmallCard label="SAVING 2 ($5)" value={packageCounts['SAVING 2']} />
//         <SmallCard label="SAVING 3 ($10)" value={packageCounts['SAVING 3']} />
//         <SmallCard label="SAVING 4 ($20)" value={packageCounts['SAVING 4']} />
//         <SmallCard label="SAVING 5 ($50)" value={packageCounts['SAVING 5']} />
//         <SmallCard label="SAVING 6 ($100)" value={packageCounts['SAVING 6']} />
//         <SmallCard label="SAVING 7 ($200)" value={packageCounts['SAVING 7']} />
//         <SmallCard label="SAVING 8 ($500)" value={packageCounts['SAVING 8']} />
//         <SmallCard label="SAVING 9 ($1K)" value={packageCounts['SAVING 9']} />
//       </div>

//       {/* TABLE HEADER */}
//       <div className="flex justify-between items-center mb-4 mt-4">
//         <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredUsers.length)} of {filteredUsers.length} entries</p>
//         <button
//           onClick={exportToCSV}
//           className="bg-green-600 hover:bg-green-700 transition text-white px-5 py-2 rounded shadow-sm font-black uppercase tracking-wider text-[11px]"
//         >
//           Export CSV
//         </button>
//       </div>

//       {/* DATA TABLE */}
//       {loading ? (
//         <div className="text-center p-10 text-gray-500 font-bold tracking-widest uppercase text-lg animate-pulse">⏳ Loading Data...</div>
//       ) : (
//         <div className="overflow-auto border rounded-lg shadow-sm bg-white">
//           <table className="min-w-full text-sm text-left">
//             <thead className="bg-slate-100 border-b border-slate-200">
//               <tr>
//                 <th className="px-4 py-3 font-black text-slate-600 uppercase tracking-widest text-[11px]">#</th>
//                 <th className="px-4 py-3 font-black text-slate-600 uppercase tracking-widest text-[11px]">User ID</th>
//                 <th className="px-4 py-3 font-black text-slate-600 uppercase tracking-widest text-[11px]">Name</th>
//                 <th className="px-4 py-3 font-black text-slate-600 uppercase tracking-widest text-[11px]">Package Name</th>
//                 <th className="px-4 py-3 font-black text-slate-600 uppercase tracking-widest text-[11px] whitespace-nowrap">Topped Up By</th>
//                 <th className="px-4 py-3 font-black text-slate-600 uppercase tracking-widest text-[11px]">Amount</th>
//                 <th className="px-4 py-3 font-black text-slate-600 uppercase tracking-widest text-[11px]">Date (IST)</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100">
//               {paginatedUsers.length === 0 ? (
//                 <tr>
//                   <td colSpan="7" className="text-center py-10 text-gray-400 font-bold uppercase tracking-widest">No records found</td>
//                 </tr>
//               ) : (
//                 paginatedUsers.map((u, i) => (
//                   <tr 
//                     key={u._id || i} 
//                     className="transition-colors border-b bg-white hover:bg-indigo-50/30 border-slate-100"
//                   >
//                     <td className="px-4 py-3 text-gray-500 font-bold">{startIndex + i + 1}</td>
                    
//                     <td className="px-4 py-3 font-black text-indigo-600">
//                       <span className="flex items-center gap-1">#{u.userId}</span>
//                     </td>

//                     <td className="px-4 py-3 text-gray-800 capitalize font-bold">{u.name}</td>
                    
//                     <td className="px-4 py-3">
//                         <span className="inline-flex items-center gap-1.5 bg-indigo-100 text-indigo-800 border border-indigo-200 px-2 py-1 rounded text-[11px] font-black tracking-wider">
//                           <Package size={14} /> {u.packageName}
//                         </span>
//                     </td>

//                     <td className="px-4 py-3 text-gray-600 font-medium">
//                        {(!u.topUpBy || String(u.topUpBy).toLowerCase() === 'self' || String(u.topUpBy).toLowerCase() === 'system') ? (
//                          <span className="text-[10px] border px-2 py-0.5 rounded font-black uppercase tracking-widest bg-slate-100 border-slate-200 text-slate-500">
//                            {u.topUpBy || 'Self'}
//                          </span>
//                        ) : (
//                          <span className="text-xs font-bold text-indigo-600 border border-indigo-100 bg-indigo-50 px-2 py-1 rounded">
//                            {u.topUpBy}
//                          </span>
//                        )}
//                     </td>

//                     <td className="px-4 py-3 text-emerald-600 font-black text-base">${u.topUpAmount}</td>
                    
//                     <td className="px-4 py-3 text-slate-500 font-bold text-[11px] md:text-xs whitespace-nowrap">
//                         {getISTDateTimeString(u.topUpDate)}
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {totalPages > 1 && (
//         <div className="flex justify-center gap-4 mt-6">
//           <button 
//             onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
//             disabled={currentPage === 1}
//             className={`px-5 py-2 rounded shadow-sm font-black uppercase tracking-widest text-xs transition-colors ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed border' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
//           >
//             Previous
//           </button>
//           <span className="flex items-center font-black text-slate-500 px-3 uppercase tracking-widest text-xs">Page {currentPage} of {totalPages}</span>
//           <button 
//             onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
//             disabled={currentPage === totalPages}
//             className={`px-5 py-2 rounded shadow-sm font-black uppercase tracking-widest text-xs transition-colors ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed border' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
//           >
//             Next
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// // Main Stats Card Component
// const SummaryCard = ({ label, value, color }) => (
//   <div className={`${color} p-4 rounded-xl shadow-sm border flex flex-col justify-center transform hover:scale-[1.02] transition-transform`}>
//     <h4 className="text-slate-600 text-[10px] sm:text-[11px] font-black uppercase tracking-widest mb-1.5 leading-tight">{label}</h4>
//     <p className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">{value}</p>
//   </div>
// );

// // 🔥 New Component for Package Mini Cards
// const SmallCard = ({ label, value }) => (
//   <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center">
//     <h4 className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">{label}</h4>
//     <p className="text-lg font-black text-indigo-600">{value}</p>
//   </div>
// );

// export default TotalTopUpPage;

import React, { useEffect, useState } from 'react';
import api from "../../api/axios";
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import { Package, User } from 'lucide-react';

const getISTDateStr = (dateObj = new Date()) => {
  if (!dateObj) return '';
  return new Date(dateObj).toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
};

const getISTDateTimeString = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

const toNumber = (val) => {
  if (val == null) return 0;
  if (typeof val === 'number') return val;
  if (typeof val === 'string') return parseFloat(val) || 0;
  if (typeof val === 'object' && val.$numberDecimal) {
    return parseFloat(val.$numberDecimal) || 0;
  }
  return Number(val) || 0;
};

// 🔥 Helper for 1st, 2nd, 3rd formatting
const getOrdinal = (n) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

const TotalTopUpPage = () => {
  const [topupUsers, setTopupUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchId, setSearchId] = useState('');
  const [searchPackage, setSearchPackage] = useState(''); 
  const [searchSequence, setSearchSequence] = useState(''); // 🔥 NAYA: Topup Sequence Filter
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20); 

  useEffect(() => {
    const fetchTopupUsers = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await api.get('/admin/topup-users', {
          headers: { Authorization: `Bearer ${token}` },
        });

        let users = (res.data || []).map((u) => ({
          ...u,
          topUpAmount: toNumber(u.topUpAmount),
        }));

        // Sort oldest to newest to calculate who is doing 1st, 2nd, 3rd Topup
        users.sort((a, b) => new Date(a.topUpDate) - new Date(b.topUpDate));

        const userTopupCounts = {};
        users = users.map(u => {
            const uid = u.userId;
            userTopupCounts[uid] = (userTopupCounts[uid] || 0) + 1;
            return {
                ...u,
                topUpSequence: userTopupCounts[uid],
                isFirstTopUp: userTopupCounts[uid] === 1
            };
        });

        // Sort back to newest first for display
        users.sort((a, b) => new Date(b.topUpDate) - new Date(a.topUpDate));

        setTopupUsers(users);
      } catch (err) {
        console.error("Topup Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopupUsers();
  }, []);

  useEffect(() => {
    const filtered = topupUsers.filter((user) => {
      const matchesId = searchId ? String(user.userId).includes(searchId) : true;
      const matchesPackage = searchPackage ? user.packageName === searchPackage : true; 
      
      // 🔥 NAYA LOGIC: TopUp Sequence filtering
      let matchesSequence = true;
      if (searchSequence) {
          if (searchSequence === '5+') {
              matchesSequence = user.topUpSequence >= 5;
          } else {
              matchesSequence = user.topUpSequence === Number(searchSequence);
          }
      }

      const dateStr = user.topUpDate ? getISTDateStr(new Date(user.topUpDate)) : null;
      
      const matchesFrom = fromDate ? dateStr && dateStr >= fromDate : true;
      const matchesTo = toDate ? dateStr && dateStr <= toDate : true;

      return matchesId && matchesPackage && matchesSequence && matchesFrom && matchesTo;
    });

    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchId, searchPackage, searchSequence, fromDate, toDate, topupUsers]);

  const todayIST = getISTDateStr(); 
  
  let totalBusiness = 0;
  let todayBusiness = 0;
  let todayCount = 0;
  let totalFreshBusiness = 0; // Filtered range ka fresh business
  let todayFreshBusiness = 0; // Sirf aaj ka fresh business

  let packageCounts = {
    'SAVING 1': 0, 'SAVING 2': 0, 'SAVING 3': 0, 
    'SAVING 4': 0, 'SAVING 5': 0, 'SAVING 6': 0, 
    'SAVING 7': 0, 'SAVING 8': 0, 'SAVING 9': 0
  };

  filteredUsers.forEach(u => {
      const amt = u.topUpAmount;
      const dateStr = u.topUpDate ? getISTDateStr(new Date(u.topUpDate)) : null;
      const isToday = dateStr === todayIST;

      totalBusiness += amt;
      if (isToday) {
          todayBusiness += amt;
          todayCount++;
      }
      
      if (u.isFirstTopUp) {
          totalFreshBusiness += amt;
          if (isToday) todayFreshBusiness += amt;
      }

      if (u.packageName && packageCounts[u.packageName] !== undefined) {
          packageCounts[u.packageName]++;
      }
  });

  // 🔥 NAYA LOGIC: Agar Date filter laga hai toh totalFreshBusiness dikhao, warna todayFreshBusiness dikhao
  const isDateFiltered = fromDate !== '' || toDate !== '';
  const freshBusinessToShow = isDateFiltered ? totalFreshBusiness : todayFreshBusiness;
  const freshBusinessLabel = isDateFiltered ? "Filtered Fresh (1st)" : "Today's Fresh (1st)";

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const handleEntriesChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const exportToCSV = () => {
    const summary = [
      { Metric: 'Total TopUps', Value: filteredUsers.length },
      { Metric: 'Total Business ($)', Value: totalBusiness },
      { Metric: freshBusinessLabel, Value: freshBusinessToShow }, 
      { Metric: 'Today TopUps', Value: todayCount },
      { Metric: 'Today Business ($)', Value: todayBusiness }
    ];

    const table = filteredUsers.map((u, i) => ({
      SNo: i + 1,
      UserID: u.userId,
      Name: u.name || '',
      Package: u.packageName,
      Sequence: getOrdinal(u.topUpSequence) + ' TopUp', 
      ToppedUpBy: u.topUpBy || 'Self / System',
      Amount: u.topUpAmount,
      Date: getISTDateTimeString(u.topUpDate),
    }));

    const csv = Papa.unparse(summary) + '\n\n' + Papa.unparse(table);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `topup-report-IST-${Date.now()}.csv`);
  };

  return (
    <div className="p-6 max-w-7xl pt-24 text-black mx-auto">
      <h2 className="text-3xl font-bold text-indigo-700 mb-6">📦 User Package Report</h2>

      {/* FILTER SECTION */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 flex-wrap bg-slate-50 p-4 rounded-xl border border-slate-200">
        <input
          type="text"
          placeholder="Search User ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="px-4 py-2 border rounded w-full md:flex-1 shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none font-semibold"
        />

        <select
          value={searchPackage}
          onChange={(e) => setSearchPackage(e.target.value)}
          className="px-4 py-2 border rounded w-full md:flex-1 shadow-sm outline-none font-semibold text-slate-700"
        >
          <option value="">All Packages</option>
          <option value="SAVING 1">SAVING 1 ($2)</option>
          <option value="SAVING 2">SAVING 2 ($5)</option>
          <option value="SAVING 3">SAVING 3 ($10)</option>
          <option value="SAVING 4">SAVING 4 ($20)</option>
          <option value="SAVING 5">SAVING 5 ($50)</option>
          <option value="SAVING 6">SAVING 6 ($100)</option>
          <option value="SAVING 7">SAVING 7 ($200)</option>
          <option value="SAVING 8">SAVING 8 ($500)</option>
          <option value="SAVING 9">SAVING 9 ($1000)</option>
        </select>

        {/* 🔥 NAYA: TopUp Sequence Dropdown */}
        <select
          value={searchSequence}
          onChange={(e) => setSearchSequence(e.target.value)}
          className="px-4 py-2 border rounded w-full md:flex-1 shadow-sm outline-none font-semibold text-slate-700"
        >
          <option value="">All TopUp Sequences</option>
          <option value="1">1st TopUp (Fresh)</option>
          <option value="2">2nd TopUp</option>
          <option value="3">3rd TopUp</option>
          <option value="4">4th TopUp</option>
          <option value="5+">5th & Above</option>
        </select>

        <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">From:</span>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="px-4 py-2 border rounded w-full md:flex-1 shadow-sm outline-none font-semibold"
            />
        </div>

        <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">To:</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="px-4 py-2 border rounded w-full md:flex-1 shadow-sm outline-none font-semibold"
            />
        </div>

        <select 
          className="px-4 py-2 border rounded w-full md:w-32 shadow-sm bg-white outline-none font-semibold"
          value={itemsPerPage}
          onChange={handleEntriesChange}
        >
          <option value={10}>Show 10</option>
          <option value={20}>Show 20</option>
          <option value={50}>Show 50</option>
          <option value={100}>Show 100</option>
        </select>
        
        <button 
           onClick={() => { setFromDate(''); setToDate(''); setSearchPackage(''); setSearchId(''); setSearchSequence(''); }} 
           className="bg-gray-200 text-gray-700 font-bold px-4 py-2 rounded hover:bg-gray-300 transition shadow-sm text-xs w-full md:w-auto"
        >
          Clear
        </button>
      </div>

      {/* 🚀 MAIN STATS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
        <SummaryCard label="Total TopUps" value={filteredUsers.length} color="bg-indigo-100 border-indigo-200" />
        <SummaryCard label="Total Business" value={`$${totalBusiness}`} color="bg-green-100 border-green-200" />
        <SummaryCard label={freshBusinessLabel} value={`$${freshBusinessToShow}`} color="bg-red-100 border-red-300 text-red-900" />
        <SummaryCard label="Today TopUps" value={todayCount} color="bg-blue-100 border-blue-200" />
        <SummaryCard label="Today Business" value={`$${todayBusiness}`} color="bg-teal-100 border-teal-200" />
      </div>

      {/* 📦 PACKAGE-WISE STATS CARDS */}
      <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-3 border-b pb-2">📦 Package Sales Summary</h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9 gap-3 mb-8">
        <SmallCard label="SAVING 1 ($2)" value={packageCounts['SAVING 1']} />
        <SmallCard label="SAVING 2 ($5)" value={packageCounts['SAVING 2']} />
        <SmallCard label="SAVING 3 ($10)" value={packageCounts['SAVING 3']} />
        <SmallCard label="SAVING 4 ($20)" value={packageCounts['SAVING 4']} />
        <SmallCard label="SAVING 5 ($50)" value={packageCounts['SAVING 5']} />
        <SmallCard label="SAVING 6 ($100)" value={packageCounts['SAVING 6']} />
        <SmallCard label="SAVING 7 ($200)" value={packageCounts['SAVING 7']} />
        <SmallCard label="SAVING 8 ($500)" value={packageCounts['SAVING 8']} />
        <SmallCard label="SAVING 9 ($1K)" value={packageCounts['SAVING 9']} />
      </div>

      {/* TABLE HEADER */}
      <div className="flex justify-between items-center mb-4 mt-4">
        <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredUsers.length)} of {filteredUsers.length} entries</p>
        <button
          onClick={exportToCSV}
          className="bg-green-600 hover:bg-green-700 transition text-white px-5 py-2 rounded shadow-sm font-black uppercase tracking-wider text-[11px]"
        >
          Export CSV
        </button>
      </div>

      {/* DATA TABLE */}
      {loading ? (
        <div className="text-center p-10 text-gray-500 font-bold tracking-widest uppercase text-lg animate-pulse">⏳ Loading Data...</div>
      ) : (
        <div className="overflow-auto border rounded-lg shadow-sm bg-white">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-slate-100 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-black text-slate-600 uppercase tracking-widest text-[11px]">#</th>
                <th className="px-4 py-3 font-black text-slate-600 uppercase tracking-widest text-[11px]">User ID</th>
                <th className="px-4 py-3 font-black text-slate-600 uppercase tracking-widest text-[11px]">Name</th>
                <th className="px-4 py-3 font-black text-slate-600 uppercase tracking-widest text-[11px]">Topup Seq.</th>
                <th className="px-4 py-3 font-black text-slate-600 uppercase tracking-widest text-[11px]">Package Name</th>
                <th className="px-4 py-3 font-black text-slate-600 uppercase tracking-widest text-[11px] whitespace-nowrap">Topped Up By</th>
                <th className="px-4 py-3 font-black text-slate-600 uppercase tracking-widest text-[11px]">Amount</th>
                <th className="px-4 py-3 font-black text-slate-600 uppercase tracking-widest text-[11px]">Date (IST)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-10 text-gray-400 font-bold uppercase tracking-widest">No records found</td>
                </tr>
              ) : (
                paginatedUsers.map((u, i) => (
                  <tr 
                    key={u._id || i} 
                    className={`transition-colors border-b ${u.isFirstTopUp ? 'bg-red-50 hover:bg-red-100/70 border-red-100' : 'bg-white hover:bg-indigo-50/30 border-slate-100'}`}
                  >
                    <td className="px-4 py-3 text-gray-500 font-bold">{startIndex + i + 1}</td>
                    
                    <td className="px-4 py-3 font-black text-indigo-600">
                      <span className="flex items-center gap-1">#{u.userId}</span>
                    </td>

                    <td className="px-4 py-3 text-gray-800 capitalize font-bold">{u.name}</td>
                    
                    {/* 🔥 FIX: whitespace-nowrap aur inline-block se text break nahi hoga */}
                    <td className="px-4 py-3">
                      {u.isFirstTopUp ? (
                          <span className="inline-block whitespace-nowrap bg-red-100 text-red-700 border border-red-300 px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest">
                            1st TopUp
                          </span>
                      ) : (
                          <span className="inline-block whitespace-nowrap bg-slate-100 text-slate-600 border border-slate-200 px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest">
                            {getOrdinal(u.topUpSequence)} TopUp
                          </span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 bg-indigo-100 text-indigo-800 border border-indigo-200 px-2 py-1 rounded text-[11px] font-black tracking-wider whitespace-nowrap">
                          <Package size={14} /> {u.packageName}
                        </span>
                    </td>

                    <td className="px-4 py-3 text-gray-600 font-medium whitespace-nowrap">
                       {(!u.topUpBy || String(u.topUpBy).toLowerCase() === 'self' || String(u.topUpBy).toLowerCase() === 'system') ? (
                         <span className="text-[10px] border px-2 py-0.5 rounded font-black uppercase tracking-widest bg-slate-100 border-slate-200 text-slate-500">
                           {u.topUpBy || 'Self'}
                         </span>
                       ) : (
                         <span className="text-xs font-bold text-indigo-600 border border-indigo-100 bg-indigo-50 px-2 py-1 rounded">
                           {u.topUpBy}
                         </span>
                       )}
                    </td>

                    <td className="px-4 py-3 text-emerald-600 font-black text-base">${u.topUpAmount}</td>
                    
                    <td className="px-4 py-3 text-slate-500 font-bold text-[11px] md:text-xs whitespace-nowrap">
                        {getISTDateTimeString(u.topUpDate)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-4 mt-6">
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`px-5 py-2 rounded shadow-sm font-black uppercase tracking-widest text-xs transition-colors ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed border' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
          >
            Previous
          </button>
          <span className="flex items-center font-black text-slate-500 px-3 uppercase tracking-widest text-xs">Page {currentPage} of {totalPages}</span>
          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={`px-5 py-2 rounded shadow-sm font-black uppercase tracking-widest text-xs transition-colors ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed border' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

// Main Stats Card Component
const SummaryCard = ({ label, value, color }) => (
  <div className={`${color} p-4 rounded-xl shadow-sm border flex flex-col justify-center transform hover:scale-[1.02] transition-transform`}>
    <h4 className={`text-[10px] sm:text-[11px] font-black uppercase tracking-widest mb-1.5 leading-tight ${color.includes('red') ? 'text-red-700' : 'text-slate-600'}`}>{label}</h4>
    <p className={`text-2xl sm:text-3xl font-black tracking-tight ${color.includes('red') ? 'text-red-900' : 'text-slate-800'}`}>{value}</p>
  </div>
);

// Small Package Cards
const SmallCard = ({ label, value }) => (
  <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center">
    <h4 className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">{label}</h4>
    <p className="text-lg font-black text-indigo-600">{value}</p>
  </div>
);

export default TotalTopUpPage;