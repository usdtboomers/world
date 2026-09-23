// import React, { useState, useEffect, useMemo } from 'react';
// import api from "../../api/axios";
// import { saveAs } from 'file-saver';
// import { format } from 'date-fns';
// import { FaCopy } from 'react-icons/fa';
// import { ethers } from 'ethers';
// import Swal from 'sweetalert2'; 
// import { ExternalLink } from 'lucide-react';

// const getISTDateStr = (dateObj = new Date()) => {
//   const utc = dateObj.getTime() + (dateObj.getTimezoneOffset() * 60000);
//   const istDate = new Date(utc + (3600000 * 5.5));
//   return format(istDate, 'yyyy-MM-dd');
// };

// const AdminWithdrawalTable = () => {
//   const token = localStorage.getItem('adminToken');

//   const [withdrawals, setWithdrawals] = useState([]);
//   const [search, setSearch] = useState('');
//   const [entriesPerPage, setEntriesPerPage] = useState(50);
  
//   const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'asc' }); 
//   const [currentPage, setCurrentPage] = useState(1);
//   const [fromDate, setFromDate] = useState(''); 
//   const [toDate, setToDate] = useState('');
//   const [statusFilter, setStatusFilter] = useState('pending'); 
//   const [loading, setLoading] = useState(false);

//   // ----------------- 0. Impersonate User -----------------
//   // const handleImpersonate = async (userId) => {
//   //   const result = await Swal.fire({
//   //     title: 'Login as User?',
//   //     text: `Do you want to log in to the account with User ID: ${userId}?`,
//   //     icon: 'question',
//   //     showCancelButton: true,
//   //     confirmButtonText: 'Yes, Login'
//   //   });

//   //   if (!result.isConfirmed) return;

//   //   try {
//   //     Swal.fire({ title: 'Logging in...', didOpen: () => { Swal.showLoading(); } });
      
//   //     const res = await api.post('/admin/impersonate', { userId }, {
//   //       headers: { Authorization: `Bearer ${token}` }
//   //     });

//   //     if (res.data.token) {
//   //       Swal.close();
//   //       const { token: userToken, user: impersonatedUser } = res.data;
//   //       const userDataStr = encodeURIComponent(JSON.stringify(impersonatedUser));

//   //       let targetBaseUrl = "";
//   //       const currentHost = window.location.hostname;

//   //       if (currentHost.includes("localhost") || currentHost === "127.0.0.1") {
//   //         targetBaseUrl = "http://localhost:5173"; 
//   //       } else {
//   //         targetBaseUrl = "https://worldfinance24.online"; 
//   //       }

//   //       const mainWebsiteUrl = `${targetBaseUrl}/login?token=${userToken}&user=${userDataStr}`;

//   //       const link = document.createElement('a');
//   //       link.href = mainWebsiteUrl;
//   //       link.target = '_blank';
//   //       link.rel = 'noopener noreferrer'; 
//   //       document.body.appendChild(link);
//   //       link.click();
//   //       document.body.removeChild(link);
//   //     }
//   //   } catch (error) {
//   //     console.error("Impersonation error:", error);
//   //     Swal.fire('Error', error.response?.data?.message || "Failed to impersonate user", 'error');
//   //   }
//   // };

//   // ----------------- 1. Professional Blockchain Approve -----------------

//   const handleBlockchainApprove = async (item) => {
//     try {
//       if (!window.ethereum) {
//         return Swal.fire('Error', 'MetaMask or Trust Wallet not detected!', 'error');
//       }
      
//       const provider = new ethers.providers.Web3Provider(window.ethereum);

//       const { chainId } = await provider.getNetwork();
//       if (chainId !== 56) {
//         const switchNet = await Swal.fire({
//           title: 'Wrong Network',
//           text: 'your wallet is not on BNB Network please Switch to BNB Network ?',
//           icon: 'warning',
//           showCancelButton: true,
//           confirmButtonText: 'Switch to BSC'
//         });
//         if (switchNet.isConfirmed) {
//           try {
//             await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x38' }] });
//           } catch (e) { return Swal.fire('Error', 'Network switch failed.', 'error'); }
//         } else return;
//       }

//       await provider.send("eth_requestAccounts", []);
//       const signer = provider.getSigner();

//       const USDT_ADDRESS = "0x55d398326f99059fF775485246999027B3197955";
//       const USDT_ABI = [
//         "function transfer(address to, uint amount) returns (bool)",
//         "function balanceOf(address owner) view returns (uint256)"
//       ];
//       const contract = new ethers.Contract(USDT_ADDRESS, USDT_ABI, signer);

//       const adminAddress = await signer.getAddress();
//       const balance = await contract.balanceOf(adminAddress);
//       const amountInWei = ethers.utils.parseUnits(item.netAmount.toString(), 18);

//       if (balance.lt(amountInWei)) {
//         return Swal.fire({
//           title: 'Insufficient Balance',
//           text: `Your wallet only has ${ethers.utils.formatUnits(balance, 18)} USDT, but the required amount is ${item.netAmount} USDT.`,
//           icon: 'error',
//           confirmButtonColor: '#3085d6'
//         });
//       }

//       Swal.fire({
//         title: 'Processing...',
//         text: 'confirm transaction in popup Wallet.',
//         allowOutsideClick: false,
//         didOpen: () => { Swal.showLoading(); }
//       });

//       const tx = await contract.transfer(item.walletAddress, amountInWei);
      
//       Swal.update({ text: 'Conforming on Blockchain please wait...' });
      
//       const receipt = await tx.wait(); 

//       const idsToUpdate = item.originalIds ? item.originalIds : [item.withdrawalId || item._id];

//       for (const singleId of idsToUpdate) {
//           await api.put(`/admin/withdrawals/approve/${singleId}`, { txnHash: receipt.transactionHash }, { 
//             headers: { Authorization: `Bearer ${token}` } 
//           });
//       }

//       Swal.fire('Success!', 'Payment has been sent successfully.', 'success');
      
//       setWithdrawals(prev => prev.map(w => 
//         idsToUpdate.includes(w._id) ? { ...w, status: 'approved', txnHash: receipt.transactionHash } : w
//       ));

//     } catch (err) {
//       console.error(err);
//       let msg = err.reason || err.message;
//       if (err.code === 4001) msg = "Transaction cancel .";
//       if (msg.includes("insufficient funds")) msg = "Fees (BNB) is insufficient!";
      
//       Swal.fire('Failed', msg, 'error');
//     }
//   };

//   // ----------------- 2. Modern Update Status -----------------
//   const updateStatus = async (item, status) => {
//     if (status === 'approved') {
//       const result = await Swal.fire({
//         title: 'Confirm Withdrawal Approval?',
//         text: `Are you sure you want to transfer ${item.netAmount} USDT to the user's wallet?`,
//         icon: 'question',
//         showCancelButton: true,
//         confirmButtonColor: '#10b981', 
//         cancelButtonColor: '#ef4444',  
//         confirmButtonText: 'Yes, Process Payment',
//         cancelButtonText: 'Cancel'
//       });
      
//       if (result.isConfirmed) {
//         handleBlockchainApprove(item);
//       }
//       return;
//     }

//     try {
//       const idsToUpdate = item.originalIds ? item.originalIds : [item._id || item];
      
//       let txnHash = "";
//       if (status === 'dummy') {
//         const { value: hashInput } = await Swal.fire({
//           title: 'Dummy Transaction',
//           text: 'Transaction Hash here:',
//           input: 'text',
//           inputPlaceholder: '0x...',
//           showCancelButton: true,
//           inputValidator: (value) => {
//             if (!value) return 'Transaction hash is required!';
//           }
//         });
//         if (!hashInput) return;
//         txnHash = hashInput;
//       }
      
//       Swal.fire({ title: 'Updating...', allowOutsideClick: false, didOpen: () => { Swal.showLoading(); } });

//       for (const singleId of idsToUpdate) {
//          let url = status === 'dummy' ? `/admin/withdrawals/dummy/${singleId}` : `/admin/withdrawals/reject/${singleId}`;
//          let body = status === 'dummy' ? { txnHash } : {};
//          await api.put(url, body, { headers: { Authorization: `Bearer ${token}` } });
//       }

//       Swal.fire('Updated', 'Status changed!!!.', 'success');
      
//       const mappedStatus = status === 'dummy' ? 'approved' : 'rejected';
//       setWithdrawals(prev => prev.map(w => 
//         idsToUpdate.includes(w._id) ? { ...w, status: mappedStatus, txnHash: txnHash } : w
//       ));

//     } catch (err) {
//       Swal.fire('Error', err.response?.data?.message || err.message, 'error');
//     }
//   };

//   const normalizeDate = (d) => {
//     if (!d) return null;
//     const n = new Date(d);
//     n.setHours(0, 0, 0, 0);
//     return n;
//   };

//   const fetchWithdrawals = async () => {
//     try {
//       setLoading(true);
//       const params = {};
      
//       params.from = fromDate ? format(new Date(fromDate), 'dd-MM-yyyy') : '01-01-2024';
      
//       if (toDate) {
//          params.to = format(new Date(toDate), 'dd-MM-yyyy');
//       }

//       const { data } = await api.get('/admin/withdrawals', {
//         headers: { Authorization: `Bearer ${token}` },
//         params,
//       });
//       setWithdrawals(Array.isArray(data.withdrawals) ? data.withdrawals : []);
//     } catch (err) {
//       console.error('Failed to fetch withdrawals:', err);
//       setWithdrawals([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchWithdrawals();
//   }, [fromDate, toDate]);

//   const flattenedData = useMemo(() => {
//     const nonLeaderWithdrawals = withdrawals.filter(w => {
//        const remark = (w.remarks || '').toLowerCase();
//        const desc = (w.description || '').toLowerCase();
//        return !remark.includes('leader auto settlement') && !desc.includes('leader settlement');
//     });

//     let extractedData = nonLeaderWithdrawals.flatMap(w => {
//       const totalFee = Number(w.fee ?? 0);
//       const totalGross = Number(w.grossAmount ?? w.amount ?? 0);

//       const gross = parseFloat(totalGross.toFixed(2));
//       const fee = parseFloat(totalFee.toFixed(2));
//      // const net = parseFloat((gross - fee).toFixed(2));
//      const net = parseFloat(Number(w.netAmount ?? (gross - fee)).toFixed(2)); 
//      const createdAt = w.date ? new Date(w.date) : new Date(w.createdAt);

//       return {
//         _id: w._id,
//         withdrawalId: w._id,
//         userId: w.userId ?? '-',
//         name: w.name ?? '-',
//         source: w.source ?? 'ROI',
//         grossAmount: gross,
//         fee: fee,
//         netAmount: net,
//         walletAddress: w.walletAddress || 'No Wallet',
//         txnHash: w.txnHash ?? '-',
//         status: w.status ?? 'pending',
//         createdAt,
//         isFirstWithdrawal: w.isFirstWithdrawal // 🔥 Backend se bheja hua flag yahan map hoga
//       };
//     });

//     const groupedData = {};

//     extractedData.forEach(item => {
//         const dateStr = format(new Date(item.createdAt), 'yyyy-MM-dd');
//         const groupKey = `${item.userId}_${item.status}_${dateStr}`;

//         if (!groupedData[groupKey]) {
//             groupedData[groupKey] = {
//                 ...item,
//                 originalIds: [item._id], 
//                 source: item.source.toUpperCase(), 
//             };
//         } else {
//             groupedData[groupKey].grossAmount += item.grossAmount;
//             groupedData[groupKey].fee += item.fee;
//             groupedData[groupKey].netAmount += item.netAmount;
//             groupedData[groupKey].originalIds.push(item._id);

//             if(!groupedData[groupKey].source.includes(item.source.toUpperCase())) {
//                 groupedData[groupKey].source += `, ${item.source.toUpperCase()}`;
//             }
//         }
//     });

//     return Object.values(groupedData).map(grp => ({
//         ...grp,
//         grossAmount: parseFloat(grp.grossAmount.toFixed(2)),
//         fee: parseFloat(grp.fee.toFixed(2)),
//         netAmount: parseFloat(grp.netAmount.toFixed(2)),
//     }));

//   }, [withdrawals]);

//   const filteredData = useMemo(() => {
//     return flattenedData.filter(w => {
//       const createdAt = normalizeDate(new Date(w.createdAt));
//       if (!createdAt) return false;

//       const matchSearch =
//         w.name.toLowerCase().includes(search.toLowerCase()) ||
//         String(w.userId).includes(search);

//       const matchStatus = statusFilter === 'all' || w.status === statusFilter;
      
//       const matchFromDate = fromDate ? createdAt >= normalizeDate(new Date(fromDate)) : true;
//       const matchToDate = toDate ? createdAt <= normalizeDate(new Date(toDate)) : true;

//       return matchSearch && matchStatus && matchFromDate && matchToDate;
//     });
//   }, [flattenedData, search, statusFilter, fromDate, toDate]);

//   const sortedData = useMemo(() => {
//     const sorted = [...filteredData];
//     if (!sortConfig.key) return sorted;

//     sorted.sort((a, b) => {
//       const aVal = sortConfig.key === 'createdAt' ? new Date(a[sortConfig.key]) : a[sortConfig.key];
//       const bVal = sortConfig.key === 'createdAt' ? new Date(b[sortConfig.key]) : b[sortConfig.key];

//       if (typeof aVal === 'number' && typeof bVal === 'number') {
//         return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
//       }
//       return sortConfig.direction === 'asc'
//         ? String(aVal).localeCompare(String(bVal))
//         : String(bVal).localeCompare(String(aVal));
//     });

//     return sorted;
//   }, [filteredData, sortConfig]);

//   const paginatedData = useMemo(() => {
//     const start = (currentPage - 1) * entriesPerPage;
//     return sortedData.slice(start, start + entriesPerPage);
//   }, [sortedData, currentPage, entriesPerPage]);

//   const totals = useMemo(() => {
//     return filteredData.reduce(
//       (acc, w) => {
//         if (w.status === 'pending') {
//           acc.pendingCount += 1;
//           acc.pendingGross += w.grossAmount || 0;
//           acc.pendingFee += w.fee || 0;
//           acc.pendingNet += w.netAmount || 0;
//         }
//         return acc;
//       },
//       { pendingCount: 0, pendingGross: 0, pendingFee: 0, pendingNet: 0 }
//     );
//   }, [filteredData]);

//   const handleCopy = (value) => {
//     navigator.clipboard.writeText(value);
//     Swal.fire({
//       toast: true,
//       position: 'top-end',
//       icon: 'success',
//       title: 'Copied!',
//       showConfirmButton: false,
//       timer: 1500
//     });
//   };

//   const exportCSV = () => {
//     if (!paginatedData.length) return alert('No data to export.');
//     const rows = paginatedData.map((w, idx) => ({
//       'Sr. No.': idx + 1 + (currentPage - 1) * entriesPerPage,
//       'User ID': w.userId,
//       Name: w.name,
//       'Net Amount': `$${(w.netAmount || 0).toFixed(2)}`,
//       'Wallet Address': w.walletAddress,
//       Status: w.status.toUpperCase(),
//       Date: format(new Date(w.createdAt), 'dd/MM/yyyy HH:mm:ss'),
//     }));
//     const header = Object.keys(rows[0]).join(',');
//     const csv = [header, ...rows.map(row => Object.values(row).join(','))].join('\n');
//     saveAs(new Blob([csv], { type: 'text/csv' }), 'withdrawals.csv');
//   };

//   const indexOfLastRow = currentPage * entriesPerPage;
//   const indexOfFirstRow = indexOfLastRow - entriesPerPage;

//   return (
//     <div className="p-6 bg-white rounded-lg shadow">
//       <h2 className="text-2xl font-semibold mb-6 text-gray-800">💸 Pending Withdrawal Requests</h2>

//       <div className="flex flex-wrap items-center gap-4 mb-6 bg-slate-50 p-4 rounded-lg border border-slate-200">
//         <input
//           type="text"
//           placeholder="Search name/ID"
//           value={search}
//           onChange={e => setSearch(e.target.value)}
//           className="border border-gray-300 rounded px-3 py-2 w-48 font-semibold"
//         />
//         <select
//           value={statusFilter}
//           onChange={e => setStatusFilter(e.target.value)}
//           className="border border-gray-300 px-3 py-2 rounded font-semibold text-slate-700"
//         >
//           <option value="all">All Status</option>
//           <option value="pending">Pending</option>
//           <option value="approved">Approved</option>
//           <option value="rejected">Rejected</option>
//         </select>
        
//         <div className="flex items-center gap-2">
//            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">From:</span>
//            <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="border border-gray-300 px-3 py-2 rounded text-sm font-semibold" />
//         </div>
        
//         <div className="flex items-center gap-2">
//            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">To:</span>
//            <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="border border-gray-300 px-3 py-2 rounded text-sm font-semibold" />
//         </div>
        
//         <button onClick={fetchWithdrawals} className="bg-blue-600 text-white font-bold px-5 py-2 rounded hover:bg-blue-700 transition shadow-sm">Refresh</button>
//         <button onClick={exportCSV} className="bg-green-600 text-white font-bold px-5 py-2 rounded hover:bg-green-700 transition shadow-sm">Export CSV</button>
//         <button 
//            onClick={() => { setFromDate(''); setToDate(''); }} 
//            className="bg-gray-200 text-gray-700 font-bold px-4 py-2 rounded hover:bg-gray-300 transition shadow-sm text-xs"
//         >
//            Clear Dates (Show All)
//         </button>
//       </div>

//       <div className="overflow-auto border rounded-lg shadow-sm">
//         {loading ? (
//           <div className="p-10 text-center text-gray-500 font-bold tracking-widest uppercase animate-pulse">⏳ Loading withdrawals...</div>
//         ) : (
//           <table className="min-w-full text-sm table-auto">
//             <thead className="bg-slate-100 text-left text-slate-700 border-b border-slate-200">
//               <tr>
//                 {['Sr.', 'Date', 'User ID', 'Name', 'Source', 'Gross', 'Fee', 'Net', 'Wallet', 'Status', 'Actions'].map(h => (
//                   <th key={h} className="px-4 py-4 font-black uppercase tracking-wider text-[11px]">{h}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100 bg-white">
//               {paginatedData.length === 0 ? (
//                 <tr><td colSpan={11} className="text-center py-10 font-bold text-gray-400">NO WITHDRAWALS FOUND.</td></tr>
//               ) : (
//                 paginatedData.map((w, idx) => (
//                   // 🔥 Yahan Check Karein: FIRST or REPEAT ka color logic
//                   <tr key={w._id} className="hover:bg-blue-50/50 transition">
//                     <td className="px-4 py-3 font-bold text-gray-500">{(currentPage-1)*entriesPerPage + idx + 1}</td>
//                      <td className="px-4 py-3">
//                        <div className="flex flex-col text-slate-500 font-mono text-[10px] sm:text-xs">
//                           <span className="font-bold">{format(new Date(w.createdAt), 'dd MMM yyyy')}</span>
//                           <span>{format(new Date(w.createdAt), 'hh:mm a')}</span>
//                        </div>
//                     </td>
//                     <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
//                       <div className="flex items-center gap-2">
//                         {/* 🔥 RED/GREEN Highlight */}
//                         <button
//                           onClick={() => handleImpersonate(w.userId)}
//                           className={`flex items-center gap-1 font-black px-2 py-1 rounded shadow-sm border transition ${
//                             w.isFirstWithdrawal 
//                             ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100' 
//                             : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
//                           }`}
//                           title="Login as this User"
//                         >
//                           #{w.userId}
                         
//                           {/* <ExternalLink size={14} className="opacity-60" />
//                          */}
//                         </button>
                        
//                         {/* 🔥 BADGE for extra clarity */}
//                         {w.isFirstWithdrawal ? (
//                             <span className="text-[8px] font-black tracking-widest text-white bg-red-500 px-1.5 py-0.5 rounded shadow-sm animate-pulse">FIRST</span>
//                         ) : (
//                             <span className="text-[8px] font-black tracking-widest text-white bg-green-500 px-1.5 py-0.5 rounded shadow-sm">REPEAT</span>
//                         )}

//                         <FaCopy 
//                           className="cursor-pointer text-gray-400 hover:text-gray-800 transition ml-1" 
//                           onClick={() => handleCopy(w.userId)} 
//                           title="Copy User ID"
//                         />
//                       </div>
//                     </td> 
//                     <td className="px-4 py-3 font-bold text-slate-700 capitalize">{w.name}</td>
                    
//                     <td className="px-4 py-3">
//                       <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-1 rounded text-[10px] font-black tracking-widest">
//                         {w.source || 'ROI'}
//                       </span>
//                     </td>

//                     <td className="px-4 py-3 font-bold text-slate-600">${w.grossAmount.toFixed(2)}</td>
//                     <td className="px-4 py-3 text-red-400 font-bold">-${w.fee.toFixed(2)}</td>
//                     <td className="px-4 py-3 font-black text-emerald-600 text-base">${w.netAmount.toFixed(2)}</td>
                    
//                     <td className="px-4 py-3">
//                       <div className="flex items-center gap-2 bg-slate-50 px-2 py-1 rounded border border-slate-200 w-fit">
//                         <span className="text-slate-600 font-mono text-[10px] sm:text-xs font-bold">{w.walletAddress.slice(0,6)}...{w.walletAddress.slice(-4)}</span>
//                         <FaCopy className="cursor-pointer text-gray-400 hover:text-blue-600" onClick={() => handleCopy(w.walletAddress)} />
//                       </div>
//                     </td>
                    
//                     <td className="px-4 py-3">
//                       <span className={`px-2 py-1 rounded text-[10px] font-black tracking-widest uppercase border ${
//                         w.status==='pending' ? 'bg-amber-50 text-amber-600 border-amber-200' : 
//                         w.status==='approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-red-50 text-red-600 border-red-200'
//                       }`}>{w.status}</span>
//                     </td>
                    
//                     <td className="px-4 py-3">
//                       {w.status==='pending' && (
//                         <div className="flex flex-col gap-1.5 w-fit">
//                           <button onClick={() => updateStatus(w,'approved')} className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded text-[10px] font-black tracking-widest shadow-sm">APPROVE</button>
//                           <button onClick={() => updateStatus(w,'dummy')} className="bg-amber-400 hover:bg-amber-500 text-slate-900 px-3 py-1.5 rounded text-[10px] font-black tracking-widest shadow-sm">DUMMY</button>
//                         </div>
//                       )}
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         )}
//       </div>

//       {!loading && paginatedData.length > 0 && (
//          <div className="mt-6 p-4 bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg flex flex-col sm:flex-row justify-end items-center gap-6 text-sm font-black uppercase tracking-widest">
//             <div className="flex items-center gap-2">
//                <span className="text-slate-500">Total Pending Count:</span> 
//                <span className="text-blue-600 text-lg bg-blue-50 px-3 py-1 rounded border border-blue-200">{totals.pendingCount}</span>
//             </div>
//             <div className="flex items-center gap-2">
//                <span className="text-slate-500">Total Net Pending:</span> 
//                <span className="text-emerald-600 text-xl bg-emerald-50 px-3 py-1 rounded border border-emerald-200">${totals.pendingNet.toFixed(2)}</span>
//             </div>
//          </div>
//       )}

//       <div className="mt-6 flex flex-col sm:flex-row justify-between items-center text-xs font-bold text-gray-500 tracking-widest uppercase">
//         <p>Showing {indexOfFirstRow + 1} to {Math.min(indexOfLastRow, sortedData.length)} of {sortedData.length} records</p>
        
//         <div className="flex items-center gap-3 mt-4 sm:mt-0">
//            <span>Rows per page:</span>
//            <select 
//               value={entriesPerPage} 
//               onChange={e => { setEntriesPerPage(Number(e.target.value)); setCurrentPage(1); }} 
//               className="border border-gray-300 rounded px-2 py-1 outline-none cursor-pointer"
//            >
//               <option value={50}>50</option>
//               <option value={100}>100</option>
//               <option value={200}>200</option>
//            </select>

//            <div className="flex gap-2 ml-4">
//              <button onClick={() => setCurrentPage(p => Math.max(p-1,1))} disabled={currentPage === 1} className="px-4 py-2 border rounded-md hover:bg-gray-100 disabled:opacity-50 transition">Prev</button>
//              <span className="px-4 py-2 bg-blue-600 text-white font-black rounded-md shadow-sm">{currentPage}</span>
//              <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage * entriesPerPage >= sortedData.length} className="px-4 py-2 border rounded-md hover:bg-gray-100 disabled:opacity-50 transition">Next</button>
//            </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminWithdrawalTable;



import React, { useState, useEffect, useMemo } from 'react';
import api from "../../api/axios";
import { saveAs } from 'file-saver';
import { format } from 'date-fns';
import { FaCopy, FaCheckSquare } from 'react-icons/fa';
import { ethers } from 'ethers';
import Swal from 'sweetalert2'; 

const getISTDateStr = (dateObj = new Date()) => {
  const utc = dateObj.getTime() + (dateObj.getTimezoneOffset() * 60000);
  const istDate = new Date(utc + (3600000 * 5.5));
  return format(istDate, 'yyyy-MM-dd');
};

const AdminWithdrawalTable = () => {
  const token = localStorage.getItem('adminToken');

  const [withdrawals, setWithdrawals] = useState([]);
  const [search, setSearch] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(50);
  
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'asc' }); 
  const [currentPage, setCurrentPage] = useState(1);
  const [fromDate, setFromDate] = useState(''); 
  const [toDate, setToDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending'); 
  const [loading, setLoading] = useState(false);

  // Bulk Selection States
  const [selectedIds, setSelectedIds] = useState([]);
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);

  // ----------------- 1. Professional Blockchain Approve (Single) -----------------
  const handleBlockchainApprove = async (item) => {
    try {
      if (!window.ethereum) {
        return Swal.fire('Error', 'MetaMask or Trust Wallet not detected!', 'error');
      }
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const { chainId } = await provider.getNetwork();
      if (chainId !== 56) {
        const switchNet = await Swal.fire({
          title: 'Wrong Network',
          text: 'your wallet is not on BNB Network please Switch to BNB Network ?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Switch to BSC'
        });
        if (switchNet.isConfirmed) {
          try {
            await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x38' }] });
          } catch (e) { return Swal.fire('Error', 'Network switch failed.', 'error'); }
        } else return;
      }

      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      const USDT_ADDRESS = "0x55d398326f99059fF775485246999027B3197955";
      const USDT_ABI = [
        "function transfer(address to, uint amount) returns (bool)",
        "function balanceOf(address owner) view returns (uint256)"
      ];
      const contract = new ethers.Contract(USDT_ADDRESS, USDT_ABI, signer);

      const adminAddress = await signer.getAddress();
      const balance = await contract.balanceOf(adminAddress);
      const amountInWei = ethers.utils.parseUnits(item.netAmount.toString(), 18);

      if (balance.lt(amountInWei)) {
        return Swal.fire('Insufficient Balance', `Your wallet only has ${ethers.utils.formatUnits(balance, 18)} USDT.`, 'error');
      }

      Swal.fire({
        title: 'Processing...',
        text: 'confirm transaction in popup Wallet.',
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); }
      });

      const tx = await contract.transfer(item.walletAddress, amountInWei);
      Swal.update({ text: 'Confirming on Blockchain please wait...' });
      
      const receipt = await tx.wait(); 

      const idsToUpdate = item.originalIds ? item.originalIds : [item.withdrawalId || item._id];

      for (const singleId of idsToUpdate) {
          await api.put(`/admin/withdrawals/approve/${singleId}`, { txnHash: receipt.transactionHash }, { 
            headers: { Authorization: `Bearer ${token}` } 
          });
      }

      Swal.fire('Success!', 'Payment has been sent successfully.', 'success');
      
      setWithdrawals(prev => prev.map(w => 
        idsToUpdate.includes(w._id) ? { ...w, status: 'approved', txnHash: receipt.transactionHash } : w
      ));
      setSelectedIds(prev => prev.filter(id => id !== item._id)); 

    } catch (err) {
      console.error(err);
      let msg = err.reason || err.message;
      if (err.code === 4001) msg = "Transaction cancelled.";
      if (msg.includes("insufficient funds")) msg = "Fees (BNB) is insufficient!";
      Swal.fire('Failed', msg, 'error');
    }
  };

  // ----------------- 2. BATCH PROCESS LOOP -----------------
  const executeBatchPayment = async () => {
    if (selectedIds.length === 0) return;

    const itemsToPay = filteredData.filter(w => selectedIds.includes(w._id) && w.status === 'pending');
    if (itemsToPay.length === 0) return;

    const totalUsdtNeeded = itemsToPay.reduce((acc, curr) => acc + curr.netAmount, 0);

    const result = await Swal.fire({
      title: 'Start Batch Payment?',
      html: `You are about to pay <b>${itemsToPay.length} users</b>.<br/>Total Amount: <b>$${totalUsdtNeeded.toFixed(2)} USDT</b><br/><br/><small class="text-red-500">Note: Your wallet will popup ${itemsToPay.length} times. Keep confirming them!</small>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Start Loop',
      confirmButtonColor: '#10b981'
    });

    if (!result.isConfirmed) return;

    setIsBatchProcessing(true);

    try {
      if (!window.ethereum) throw new Error("Wallet not found!");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      
      const USDT_ADDRESS = "0x55d398326f99059fF775485246999027B3197955";
      const USDT_ABI = ["function transfer(address to, uint amount) returns (bool)", "function balanceOf(address owner) view returns (uint256)"];
      const contract = new ethers.Contract(USDT_ADDRESS, USDT_ABI, signer);

      let successCount = 0;

      for (let i = 0; i < itemsToPay.length; i++) {
        const item = itemsToPay[i];
        
        Swal.fire({
          title: `Batch Payment (${i + 1}/${itemsToPay.length})`,
          html: `Sending <b>$${item.netAmount}</b> to <b>${item.name}</b><br/>Please confirm in your wallet extension...`,
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading()
        });

        try {
          const amountInWei = ethers.utils.parseUnits(item.netAmount.toString(), 18);
          const tx = await contract.transfer(item.walletAddress, amountInWei);
          
          Swal.update({ html: `Waiting for Blockchain Confirmation for <b>${item.name}</b>...` });
          const receipt = await tx.wait();

          const idsToUpdate = item.originalIds ? item.originalIds : [item.withdrawalId || item._id];
          for (const singleId of idsToUpdate) {
              await api.put(`/admin/withdrawals/approve/${singleId}`, { txnHash: receipt.transactionHash }, { headers: { Authorization: `Bearer ${token}` } });
          }

          setWithdrawals(prev => prev.map(w => idsToUpdate.includes(w._id) ? { ...w, status: 'approved', txnHash: receipt.transactionHash } : w));
          setSelectedIds(prev => prev.filter(id => id !== item._id));
          successCount++;

        } catch (txErr) {
          console.error("Tx failed for", item.name, txErr);
          const wantToContinue = await Swal.fire({
            title: 'Transaction Failed!',
            text: `Failed for ${item.name}. Do you want to continue with the remaining ${itemsToPay.length - i - 1} users?`,
            icon: 'error',
            showCancelButton: true,
            confirmButtonText: 'Yes, Continue',
            cancelButtonText: 'Stop Batch'
          });
          if (!wantToContinue.isConfirmed) break; 
        }
      }

      Swal.fire('Batch Complete', `Successfully processed ${successCount} out of ${itemsToPay.length} payments.`, 'success');

    } catch (err) {
      Swal.fire('Error', err.message || 'Batch process failed.', 'error');
    } finally {
      setIsBatchProcessing(false);
    }
  };

  // ----------------- 3. Smart Auto Select (< $10) -----------------
  const handleAutoSelectSmall = (count) => {
    const validPendingSmall = sortedData.filter(w => w.status === 'pending' && w.netAmount < 10);
    const topN = validPendingSmall.slice(0, count).map(w => w._id);
    setSelectedIds(topN);
    
    if (topN.length === 0) {
      Swal.fire({ toast: true, position: 'top-end', icon: 'info', title: 'No pending small withdrawals found!', showConfirmButton: false, timer: 2000 });
    } else {
      Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: `Selected ${topN.length} users (< $10)`, showConfirmButton: false, timer: 2000 });
    }
  };

  const handleCheckboxChange = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  // 🔥 FIX: Master Select All Box (Sirf < $10 walon ko select karega)
  const handleSelectAllPage = (e) => {
    if (e.target.checked) {
      const pagePendingSmallIds = paginatedData
        .filter(w => w.status === 'pending' && w.netAmount < 10)
        .map(w => w._id);
      setSelectedIds(prev => [...new Set([...prev, ...pagePendingSmallIds])]);
    } else {
      const pageIds = paginatedData.map(w => w._id);
      setSelectedIds(prev => prev.filter(id => !pageIds.includes(id)));
    }
  };

  // ----------------- Modern Update Status -----------------
  const updateStatus = async (item, status) => {
    if (status === 'approved') {
      const result = await Swal.fire({
        title: 'Confirm Withdrawal Approval?',
        text: `Are you sure you want to transfer ${item.netAmount} USDT to the user's wallet?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#10b981', 
        cancelButtonColor: '#ef4444',  
        confirmButtonText: 'Yes, Process Payment',
        cancelButtonText: 'Cancel'
      });
      if (result.isConfirmed) handleBlockchainApprove(item);
      return;
    }

    try {
      const idsToUpdate = item.originalIds ? item.originalIds : [item._id || item];
      let txnHash = "";
      if (status === 'dummy') {
        const { value: hashInput } = await Swal.fire({ title: 'Dummy Transaction', input: 'text', showCancelButton: true });
        if (!hashInput) return;
        txnHash = hashInput;
      }
      
      Swal.fire({ title: 'Updating...', allowOutsideClick: false, didOpen: () => { Swal.showLoading(); } });

      for (const singleId of idsToUpdate) {
         let url = status === 'dummy' ? `/admin/withdrawals/dummy/${singleId}` : `/admin/withdrawals/reject/${singleId}`;
         await api.put(url, status === 'dummy' ? { txnHash } : {}, { headers: { Authorization: `Bearer ${token}` } });
      }

      Swal.fire('Updated', 'Status changed.', 'success');
      setWithdrawals(prev => prev.map(w => idsToUpdate.includes(w._id) ? { ...w, status: status === 'dummy' ? 'approved' : 'rejected', txnHash: txnHash } : w));
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || err.message, 'error');
    }
  };

  const normalizeDate = (d) => {
    if (!d) return null;
    const n = new Date(d);
    n.setHours(0, 0, 0, 0);
    return n;
  };

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      const params = {};
      params.from = fromDate ? format(new Date(fromDate), 'dd-MM-yyyy') : '01-01-2024';
      if (toDate) params.to = format(new Date(toDate), 'dd-MM-yyyy');

      const { data } = await api.get('/admin/withdrawals', { headers: { Authorization: `Bearer ${token}` }, params });
      setWithdrawals(Array.isArray(data.withdrawals) ? data.withdrawals : []);
    } catch (err) {
      console.error('Failed to fetch withdrawals:', err);
      setWithdrawals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, [fromDate, toDate]);

  const flattenedData = useMemo(() => {
    const nonLeaderWithdrawals = withdrawals.filter(w => {
       const remark = (w.remarks || '').toLowerCase();
       const desc = (w.description || '').toLowerCase();
       return !remark.includes('leader auto settlement') && !desc.includes('leader settlement');
    });

    let extractedData = nonLeaderWithdrawals.flatMap(w => {
      const gross = parseFloat(Number(w.grossAmount ?? w.amount ?? 0).toFixed(2));
      const fee = parseFloat(Number(w.fee ?? 0).toFixed(2));
      const net = parseFloat(Number(w.netAmount ?? (gross - fee)).toFixed(2)); 
      const createdAt = w.date ? new Date(w.date) : new Date(w.createdAt);

      return {
        _id: w._id,
        withdrawalId: w._id,
        userId: w.userId ?? '-',
        name: w.name ?? '-',
        source: w.source ?? 'ROI',
        grossAmount: gross,
        fee: fee,
        netAmount: net,
        walletAddress: w.walletAddress || 'No Wallet',
        txnHash: w.txnHash ?? '-',
        status: w.status ?? 'pending',
        createdAt,
        isFirstWithdrawal: w.isFirstWithdrawal 
      };
    });

    const groupedData = {};

    extractedData.forEach(item => {
        const dateStr = format(new Date(item.createdAt), 'yyyy-MM-dd');
        const groupKey = `${item.userId}_${item.status}_${dateStr}`;

        if (!groupedData[groupKey]) {
            groupedData[groupKey] = { ...item, originalIds: [item._id], source: item.source.toUpperCase() };
        } else {
            groupedData[groupKey].grossAmount += item.grossAmount;
            groupedData[groupKey].fee += item.fee;
            groupedData[groupKey].netAmount += item.netAmount;
            groupedData[groupKey].originalIds.push(item._id);
            if(!groupedData[groupKey].source.includes(item.source.toUpperCase())) {
                groupedData[groupKey].source += `, ${item.source.toUpperCase()}`;
            }
        }
    });

    return Object.values(groupedData).map(grp => ({
        ...grp,
        grossAmount: parseFloat(grp.grossAmount.toFixed(2)),
        fee: parseFloat(grp.fee.toFixed(2)),
        netAmount: parseFloat(grp.netAmount.toFixed(2)),
    }));
  }, [withdrawals]);

  const filteredData = useMemo(() => {
    return flattenedData.filter(w => {
      const createdAt = normalizeDate(new Date(w.createdAt));
      if (!createdAt) return false;

      const matchSearch = w.name.toLowerCase().includes(search.toLowerCase()) || String(w.userId).includes(search);
      const matchStatus = statusFilter === 'all' || w.status === statusFilter;
      const matchFromDate = fromDate ? createdAt >= normalizeDate(new Date(fromDate)) : true;
      const matchToDate = toDate ? createdAt <= normalizeDate(new Date(toDate)) : true;

      return matchSearch && matchStatus && matchFromDate && matchToDate;
    });
  }, [flattenedData, search, statusFilter, fromDate, toDate]);

  const sortedData = useMemo(() => {
    const sorted = [...filteredData];
    if (!sortConfig.key) return sorted;
    sorted.sort((a, b) => {
      const aVal = sortConfig.key === 'createdAt' ? new Date(a[sortConfig.key]) : a[sortConfig.key];
      const bVal = sortConfig.key === 'createdAt' ? new Date(b[sortConfig.key]) : b[sortConfig.key];

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return sortConfig.direction === 'asc' ? String(aVal).localeCompare(String(bVal)) : String(bVal).localeCompare(String(aVal));
    });
    return sorted;
  }, [filteredData, sortConfig]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * entriesPerPage;
    return sortedData.slice(start, start + entriesPerPage);
  }, [sortedData, currentPage, entriesPerPage]);

  const totals = useMemo(() => {
    return filteredData.reduce((acc, w) => {
        if (w.status === 'pending') {
          acc.pendingCount += 1;
          acc.pendingGross += w.grossAmount || 0;
          acc.pendingFee += w.fee || 0;
          acc.pendingNet += w.netAmount || 0;
        }
        return acc;
      }, { pendingCount: 0, pendingGross: 0, pendingFee: 0, pendingNet: 0 });
  }, [filteredData]);

  const handleCopy = (value) => {
    navigator.clipboard.writeText(value);
    Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Copied!', showConfirmButton: false, timer: 1500 });
  };

  const exportCSV = () => {
    if (!paginatedData.length) return alert('No data to export.');
    const rows = paginatedData.map((w, idx) => ({
      'Sr. No.': idx + 1 + (currentPage - 1) * entriesPerPage,
      'User ID': w.userId,
      Name: w.name,
      'Net Amount': `$${(w.netAmount || 0).toFixed(2)}`,
      'Wallet Address': w.walletAddress,
      Status: w.status.toUpperCase(),
      Date: format(new Date(w.createdAt), 'dd/MM/yyyy HH:mm:ss'),
    }));
    const header = Object.keys(rows[0]).join(',');
    const csv = [header, ...rows.map(row => Object.values(row).join(','))].join('\n');
    saveAs(new Blob([csv], { type: 'text/csv' }), 'withdrawals.csv');
  };

  const indexOfLastRow = currentPage * entriesPerPage;
  const indexOfFirstRow = indexOfLastRow - entriesPerPage;

  return (
    <div className="p-2 sm:p-6 bg-white rounded-lg shadow w-full overflow-hidden">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-800">💸 Pending Withdrawal Requests</h2>

      {/* SMART BATCH ACTION PANEL */}
      <div className="mb-6 p-3 sm:p-4 bg-indigo-50 border border-indigo-200 rounded-lg flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 w-full md:w-auto">
            <span className="font-bold text-indigo-800 text-xs sm:text-sm flex items-center gap-1 sm:gap-2 w-full sm:w-auto justify-center">
                <FaCheckSquare /> Auto-Select ({"<"} $10):
            </span>
            <button onClick={() => handleAutoSelectSmall(5)} className="bg-white border border-indigo-300 text-indigo-700 px-2 sm:px-3 py-1 rounded text-xs font-bold hover:bg-indigo-100 transition shadow-sm">Top 5</button>
            <button onClick={() => handleAutoSelectSmall(10)} className="bg-white border border-indigo-300 text-indigo-700 px-2 sm:px-3 py-1 rounded text-xs font-bold hover:bg-indigo-100 transition shadow-sm">Top 10</button>
            <button onClick={() => handleAutoSelectSmall(20)} className="bg-white border border-indigo-300 text-indigo-700 px-2 sm:px-3 py-1 rounded text-xs font-bold hover:bg-indigo-100 transition shadow-sm">Top 20</button>
            <button onClick={() => handleAutoSelectSmall(50)} className="bg-white border border-indigo-300 text-indigo-700 px-2 sm:px-3 py-1 rounded text-xs font-bold hover:bg-indigo-100 transition shadow-sm">Top 50</button>
            {selectedIds.length > 0 && (
               <button onClick={() => setSelectedIds([])} className="bg-red-100 text-red-600 px-2 sm:px-3 py-1 rounded text-xs font-bold hover:bg-red-200 transition">Clear</button>
            )}
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-4 w-full md:w-auto border-t md:border-none pt-3 md:pt-0 border-indigo-200">
            <div className="text-left md:text-right">
                <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase">Selected</p>
                <p className="text-base sm:text-lg font-black text-indigo-700">{selectedIds.length} Users</p>
            </div>
            <button 
                onClick={executeBatchPayment} 
                disabled={selectedIds.length === 0 || isBatchProcessing}
                className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded font-black tracking-wider text-xs sm:text-sm shadow-md transition ${selectedIds.length > 0 ? 'bg-emerald-500 hover:bg-emerald-600 text-white animate-pulse' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            >
                {isBatchProcessing ? 'PROCESSING...' : `PAY (${selectedIds.length})`}
            </button>
        </div>
      </div>

      {/* FILTER PANEL */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-6 bg-slate-50 p-3 sm:p-4 rounded-lg border border-slate-200 text-sm">
        <input type="text" placeholder="Search name/ID" value={search} onChange={e => setSearch(e.target.value)} className="border border-gray-300 rounded px-2 py-1.5 w-full sm:w-48 font-semibold" />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border border-gray-300 px-2 py-1.5 rounded font-semibold text-slate-700 w-full sm:w-auto">
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <button onClick={fetchWithdrawals} className="bg-blue-600 text-white font-bold px-4 py-1.5 rounded hover:bg-blue-700 transition shadow-sm w-full sm:w-auto">Refresh</button>
      </div>

      {/* MOBILE RESPONSIVE TABLE WRAPPER */}
      <div className="overflow-x-auto w-full border rounded-lg shadow-sm">
        {loading ? (
          <div className="p-10 text-center text-gray-500 font-bold tracking-widest uppercase animate-pulse">⏳ Loading withdrawals...</div>
        ) : (
          <table className="min-w-full text-xs sm:text-sm table-auto w-full">
            <thead className="bg-slate-100 text-left text-slate-700 border-b border-slate-200">
              <tr>
                <th className="px-2 sm:px-4 py-3 sm:py-4">
                    {/* 🔥 Master Checkbox: Sirf < 10 walon ke hisab se checked dikhega */}
                    <input 
                       type="checkbox" 
                       className="w-4 h-4 cursor-pointer accent-indigo-600"
                       onChange={handleSelectAllPage}
                       checked={
                           paginatedData.filter(w => w.status === 'pending' && w.netAmount < 10).length > 0 && 
                           paginatedData.filter(w => w.status === 'pending' && w.netAmount < 10).every(w => selectedIds.includes(w._id))
                       }
                    />
                </th>
                {['Sr.', 'Date', 'User ID', 'Name', 'Source', 'Gross', 'Fee', 'Net', 'Wallet', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-2 sm:px-4 py-3 sm:py-4 font-black uppercase tracking-wider text-[9px] sm:text-[11px] whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {paginatedData.length === 0 ? (
                <tr><td colSpan={12} className="text-center py-10 font-bold text-gray-400">NO WITHDRAWALS FOUND.</td></tr>
              ) : (
                paginatedData.map((w, idx) => (
                  <tr key={w._id} className={`transition ${selectedIds.includes(w._id) ? 'bg-indigo-50/70' : 'hover:bg-blue-50/50'}`}>
                    <td className="px-2 sm:px-4 py-2 sm:py-3">
                        {w.status === 'pending' ? (
                            <input 
                                type="checkbox" 
                                className="w-4 h-4 cursor-pointer accent-indigo-600"
                                checked={selectedIds.includes(w._id)}
                                onChange={() => handleCheckboxChange(w._id)}
                            />
                        ) : (
                            <FaCheckSquare className="text-emerald-500 opacity-50" />
                        )}
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 font-bold text-gray-500 whitespace-nowrap">{(currentPage-1)*entriesPerPage + idx + 1}</td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-[9px] sm:text-xs font-mono text-slate-500 font-bold whitespace-nowrap">{format(new Date(w.createdAt), 'dd MMM yy hh:mm a')}</td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 font-medium text-gray-900 whitespace-nowrap">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
                        <span className="font-black px-1.5 sm:px-2 py-1 rounded border bg-slate-50 text-[10px] sm:text-xs">#{w.userId}</span>
                        {w.isFirstWithdrawal ? <span className="text-[8px] font-black text-white bg-red-500 px-1.5 py-0.5 rounded animate-pulse">FIRST</span> : <span className="text-[8px] font-black text-white bg-green-500 px-1.5 py-0.5 rounded">REPEAT</span>}
                      </div>
                    </td> 
                    <td className="px-2 sm:px-4 py-2 sm:py-3 font-bold text-slate-700 capitalize whitespace-nowrap">{w.name}</td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap"><span className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-1 rounded text-[9px] sm:text-[10px] font-black">{w.source || 'ROI'}</span></td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 font-bold text-slate-600 whitespace-nowrap">${w.grossAmount.toFixed(2)}</td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-red-400 font-bold whitespace-nowrap">-${w.fee.toFixed(2)}</td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 font-black text-emerald-600 text-sm sm:text-base whitespace-nowrap">${w.netAmount.toFixed(2)}</td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1 sm:gap-2 bg-slate-50 px-1.5 sm:px-2 py-1 rounded border border-slate-200 w-fit">
                        <span className="text-slate-600 font-mono text-[9px] sm:text-[10px] font-bold">{w.walletAddress.slice(0,6)}...{w.walletAddress.slice(-4)}</span>
                        <FaCopy className="cursor-pointer text-gray-400 hover:text-blue-600" onClick={() => handleCopy(w.walletAddress)} />
                      </div>
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                      <span className={`px-1.5 sm:px-2 py-1 rounded text-[9px] sm:text-[10px] font-black uppercase border ${w.status==='pending' ? 'bg-amber-50 text-amber-600 border-amber-200' : w.status==='approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-red-50 text-red-600 border-red-200'}`}>{w.status}</span>
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                      {w.status==='pending' && (
                        <div className="flex flex-col sm:flex-row gap-1.5 w-fit">
                          <button onClick={() => updateStatus(w,'approved')} className="bg-emerald-500 hover:bg-emerald-600 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded text-[9px] sm:text-[10px] font-black shadow-sm">APPROVE</button>
                          <button onClick={() => updateStatus(w,'dummy')} className="bg-amber-400 hover:bg-amber-500 text-slate-900 px-2 sm:px-3 py-1 sm:py-1.5 rounded text-[9px] sm:text-[10px] font-black shadow-sm">DUMMY</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-4 sm:mt-6 flex flex-col md:flex-row justify-between items-center text-[10px] sm:text-xs font-bold text-gray-500 uppercase gap-4">
        <p>Showing {indexOfFirstRow + 1} to {Math.min(indexOfLastRow, sortedData.length)} of {sortedData.length} records</p>
        <div className="flex flex-wrap items-center justify-center gap-3 w-full md:w-auto">
           <span>Rows per page:</span>
           <select value={entriesPerPage} onChange={e => { setEntriesPerPage(Number(e.target.value)); setCurrentPage(1); }} className="border rounded px-2 py-1 outline-none cursor-pointer">
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={200}>200</option>
           </select>
           <div className="flex gap-2">
             <button onClick={() => setCurrentPage(p => Math.max(p-1,1))} disabled={currentPage === 1} className="px-3 py-1 sm:px-4 sm:py-2 border rounded-md hover:bg-gray-100 disabled:opacity-50">Prev</button>
             <span className="px-3 py-1 sm:px-4 sm:py-2 bg-blue-600 text-white font-black rounded-md">{currentPage}</span>
             <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage * entriesPerPage >= sortedData.length} className="px-3 py-1 sm:px-4 sm:py-2 border rounded-md hover:bg-gray-100 disabled:opacity-50">Next</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminWithdrawalTable;