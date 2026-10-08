import React, { useEffect, useState } from 'react';
import api from "../../api/axios"; // Apna axios instance path verify kar lein
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import { Package, User, CheckCircle, RefreshCw } from 'lucide-react';

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

const HighestActivePackagePage = () => {
  const [activeUsers, setActiveUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchId, setSearchId] = useState('');
  const [searchPackage, setSearchPackage] = useState(''); 
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20); 

  const fetchHighestPackages = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      // Backend route /highest-active-packages call kar rahe hain
      const res = await api.get('/admin/highest-active-packages', {
        headers: { Authorization: `Bearer ${token}` },
      });

      let users = (res.data || []).map((u) => ({
        ...u,
        highestPackageAmount: toNumber(u.highestPackageAmount || u.topUpAmount),
      }));

      // Highest Package amount ke hisab se Descending order me sort karo
      users.sort((a, b) => b.highestPackageAmount - a.highestPackageAmount);

      setActiveUsers(users);
      setFilteredUsers(users);
    } catch (err) {
      console.error("Highest Active Packages Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHighestPackages();
  }, []);

  // Filter Logic
  useEffect(() => {
    const filtered = activeUsers.filter((user) => {
      const matchesId = searchId ? String(user.userId).includes(searchId) : true;
      const matchesPackage = searchPackage ? user.packageName === searchPackage : true; 

      const startDateStr = user.startDate ? getISTDateStr(new Date(user.startDate)) : null;
      
      const matchesFrom = fromDate ? startDateStr && startDateStr >= fromDate : true;
      const matchesTo = toDate ? startDateStr && startDateStr <= toDate : true;

      return matchesId && matchesPackage && matchesFrom && matchesTo;
    });

    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchId, searchPackage, fromDate, toDate, activeUsers]);

  // Summary Counts Calculation
  let totalBusiness = 0;

  let packageCounts = {
    'SAVING 1': 0, 'SAVING 2': 0, 'SAVING 3': 0, 
    'SAVING 4': 0, 'SAVING 5': 0, 'SAVING 6': 0, 
    'SAVING 7': 0, 'SAVING 8': 0, 'SAVING 9': 0
  };

  filteredUsers.forEach(u => {
    const amt = u.highestPackageAmount;
    totalBusiness += amt;

    if (u.packageName && packageCounts[u.packageName] !== undefined) {
      packageCounts[u.packageName]++;
    }
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const handleEntriesChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Export CSV Function
  const exportToCSV = () => {
    const summary = [
      { Metric: 'Total Active Users', Value: filteredUsers.length },
      { Metric: 'Total Active Investment ($)', Value: totalBusiness }
    ];

    const table = filteredUsers.map((u, i) => ({
      SNo: i + 1,
      UserID: u.userId,
      Name: u.name || '',
      Mobile: u.mobile || '',
      PackageName: u.packageName,
      HighestPackageAmount: `$${u.highestPackageAmount}`,
      ToppedUpBy: u.topUpBy || 'Self / System',
      StartDate: getISTDateTimeString(u.startDate),
      EndDate: getISTDateTimeString(u.endDate),
      Status: u.status || 'Active'
    }));

    const csv = Papa.unparse(summary) + '\n\n' + Papa.unparse(table);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `highest-active-packages-report-${Date.now()}.csv`);
  };

  return (
    <div className="p-6 max-w-7xl pt-24 text-black mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-indigo-700 flex items-center gap-2">
          <CheckCircle className="text-emerald-500" size={32} /> Highest Active Package Users (Last 25 Days)
        </h2>
        <button 
          onClick={fetchHighestPackages}
          className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold px-3 py-1.5 rounded-lg border border-indigo-200 text-xs transition"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

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
          <option value="">All Active Packages</option>
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

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Start From:</span>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="px-4 py-2 border rounded w-full md:flex-1 shadow-sm outline-none font-semibold"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Start To:</span>
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
           onClick={() => { setFromDate(''); setToDate(''); setSearchPackage(''); setSearchId(''); }} 
           className="bg-gray-200 text-gray-700 font-bold px-4 py-2 rounded hover:bg-gray-300 transition shadow-sm text-xs w-full md:w-auto"
        >
          Clear
        </button>
      </div>

      {/* 🚀 MAIN STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <SummaryCard label="Total Active Users" value={filteredUsers.length} color="bg-indigo-100 border-indigo-200" />
        <SummaryCard label="Total Active Investment Value" value={`$${totalBusiness}`} color="bg-emerald-100 border-emerald-200" />
      </div>

      {/* 📦 PACKAGE-WISE STATS CARDS */}
      <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-3 border-b pb-2">📦 Active Package Summary</h3>
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
        <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">
          Showing {filteredUsers.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredUsers.length)} of {filteredUsers.length} entries
        </p>
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
                <th className="px-4 py-3 font-black text-slate-600 uppercase tracking-widest text-[11px]">Name / Mobile</th>
                <th className="px-4 py-3 font-black text-slate-600 uppercase tracking-widest text-[11px]">Highest Package</th>
                <th className="px-4 py-3 font-black text-slate-600 uppercase tracking-widest text-[11px] whitespace-nowrap">Activated By</th>
                <th className="px-4 py-3 font-black text-slate-600 uppercase tracking-widest text-[11px]">Start Date (IST)</th>
                <th className="px-4 py-3 font-black text-slate-600 uppercase tracking-widest text-[11px]">Expiry Date (IST)</th>
                <th className="px-4 py-3 font-black text-slate-600 uppercase tracking-widest text-[11px]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-10 text-gray-400 font-bold uppercase tracking-widest">No active user records found</td>
                </tr>
              ) : (
                paginatedUsers.map((u, i) => (
                  <tr 
                    key={u._id || u.userId || i} 
                    className="bg-white hover:bg-indigo-50/30 border-slate-100 transition-colors border-b"
                  >
                    <td className="px-4 py-3 text-gray-500 font-bold">{startIndex + i + 1}</td>
                    
                    <td className="px-4 py-3 font-black text-indigo-600">
                      <span>#{u.userId}</span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-bold text-gray-800 capitalize">{u.name}</div>
                      <div className="text-[11px] text-gray-400 font-medium">{u.mobile}</div>
                    </td>

                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded text-xs font-black tracking-wider whitespace-nowrap">
                        <Package size={14} /> {u.packageName} (${u.highestPackageAmount})
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

                    <td className="px-4 py-3 text-slate-600 font-bold text-[11px] whitespace-nowrap">
                      {getISTDateTimeString(u.startDate)}
                    </td>

                    <td className="px-4 py-3 text-red-600 font-bold text-[11px] whitespace-nowrap">
                      {getISTDateTimeString(u.endDate)}
                    </td>

                    <td className="px-4 py-3">
                      <span className="inline-block whitespace-nowrap bg-emerald-100 text-emerald-700 border border-emerald-300 px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest">
                        ACTIVE
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* PAGINATION */}
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

// Summary Card Component
const SummaryCard = ({ label, value, color }) => (
  <div className={`${color} p-5 rounded-xl shadow-sm border flex flex-col justify-center transform hover:scale-[1.01] transition-transform`}>
    <h4 className="text-xs font-black uppercase tracking-widest mb-1.5 leading-tight text-slate-600">{label}</h4>
    <p className="text-3xl font-black tracking-tight text-slate-800">{value}</p>
  </div>
);

// Small Package Card Component
const SmallCard = ({ label, value }) => (
  <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center">
    <h4 className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">{label}</h4>
    <p className="text-lg font-black text-indigo-600">{value}</p>
  </div>
);

export default HighestActivePackagePage;