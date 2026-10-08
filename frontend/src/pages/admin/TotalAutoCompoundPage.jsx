import React, { useEffect, useState } from 'react';
import api from "../../api/axios";
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import { Layers } from 'lucide-react';

const getISTDateStr = (dateObj = new Date()) => {
  if (!dateObj) return '';
  return new Date(dateObj).toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
};

const getISTDateTimeString = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true
  });
};

const TotalAutoCompoundPage = () => {
  const [compoundUsers, setCompoundUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchId, setSearchId] = useState('');
  const [searchDuration, setSearchDuration] = useState(''); 
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20); 

  useEffect(() => {
    const fetchCompoundUsers = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await api.get('/admin/auto-compound-users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCompoundUsers(res.data || []);
      } catch (err) {
        console.error("Auto Compound Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompoundUsers();
  }, []);

  useEffect(() => {
    const filtered = compoundUsers.filter((user) => {
      const matchesId = searchId ? String(user.userId).includes(searchId) : true;
      const matchesDuration = searchDuration ? String(user.duration) === searchDuration : true; 

      const dateStr = user.date ? getISTDateStr(new Date(user.date)) : null;
      const matchesFrom = fromDate ? dateStr && dateStr >= fromDate : true;
      const matchesTo = toDate ? dateStr && dateStr <= toDate : true;

      return matchesId && matchesDuration && matchesFrom && matchesTo;
    });

    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchId, searchDuration, fromDate, toDate, compoundUsers]);

  const todayIST = getISTDateStr(); 
  
  let totalBusiness = 0;
  let todayBusiness = 0;
  let todayCount = 0;

  filteredUsers.forEach(u => {
      const amt = Number(u.amount) || 0;
      const dateStr = u.date ? getISTDateStr(new Date(u.date)) : null;

      totalBusiness += amt;
      if (dateStr === todayIST) {
          todayBusiness += amt;
          todayCount++;
      }
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const exportToCSV = () => {
    const table = filteredUsers.map((u, i) => ({
      SNo: i + 1,
      UserID: u.userId,
      Name: u.name || '',
      ActivatedBy: u.topUpBy || 'Self',
      Amount: u.amount,
      CycleDays: `${u.duration} Days`,
      Status: u.status,
      Date: getISTDateTimeString(u.date),
    }));

    const csv = Papa.unparse(table);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `auto-compound-report-${Date.now()}.csv`);
  };

  return (
    <div className="p-6 max-w-7xl pt-24 text-black mx-auto">
      <h2 className="text-3xl font-bold text-indigo-700 mb-6 flex items-center gap-3">
        <Layers className="text-[#d4af37]" size={32} /> Auto Compound Report (6%)
      </h2>

      {/* FILTER SECTION */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 flex-wrap bg-slate-50 p-4 rounded-xl border border-slate-200">
        <input
          type="text"
          placeholder="Search User ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="px-4 py-2 border rounded w-full md:flex-1 shadow-sm outline-none font-semibold"
        />

        <select
          value={searchDuration}
          onChange={(e) => setSearchDuration(e.target.value)}
          className="px-4 py-2 border rounded w-full md:flex-1 shadow-sm outline-none font-semibold text-slate-700"
        >
          <option value="">All Cycles</option>
          <option value="25">25 Days Cycle</option>
          <option value="50">50 Days Cycle</option>
          <option value="100">100 Days Cycle</option>
        </select>

        <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="px-4 py-2 border rounded shadow-sm outline-none font-semibold" />
        <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="px-4 py-2 border rounded shadow-sm outline-none font-semibold" />
        
        <button onClick={() => { setFromDate(''); setToDate(''); setSearchDuration(''); setSearchId(''); }} className="bg-gray-200 text-gray-700 font-bold px-4 py-2 rounded hover:bg-gray-300 transition shadow-sm text-xs">Clear</button>
      </div>

      {/* 🚀 MAIN STATS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#131927] border border-[#d4af37] p-4 rounded-xl">
            <p className="text-[#e4c568] text-[10px] font-black uppercase tracking-widest">Total Activations</p>
            <p className="text-white text-3xl font-black">{filteredUsers.length}</p>
        </div>
        <div className="bg-[#131927] border border-[#d4af37] p-4 rounded-xl">
            <p className="text-[#e4c568] text-[10px] font-black uppercase tracking-widest">Total Business</p>
            <p className="text-[#00ff88] text-3xl font-black">${totalBusiness}</p>
        </div>
        <div className="bg-[#131927] border border-slate-700 p-4 rounded-xl">
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Today's Activations</p>
            <p className="text-white text-3xl font-black">{todayCount}</p>
        </div>
        <div className="bg-[#131927] border border-slate-700 p-4 rounded-xl">
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Today's Business</p>
            <p className="text-[#00ff88] text-3xl font-black">${todayBusiness}</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4 mt-4">
        <button onClick={exportToCSV} className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded shadow-sm font-black uppercase tracking-wider text-[11px]">Export CSV</button>
      </div>

      {/* DATA TABLE */}
      {loading ? (
        <div className="text-center p-10 text-gray-500 font-bold uppercase tracking-widest animate-pulse">⏳ Loading Auto Compound Data...</div>
      ) : (
        <div className="overflow-auto border rounded-lg shadow-sm bg-white">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-[#131927] text-[#e4c568] border-b border-[#d4af37]">
              <tr>
                <th className="px-4 py-3 font-black uppercase tracking-widest text-[11px]">User ID</th>
                <th className="px-4 py-3 font-black uppercase tracking-widest text-[11px]">Name</th>
                <th className="px-4 py-3 font-black uppercase tracking-widest text-[11px]">Amount</th>
                <th className="px-4 py-3 font-black uppercase tracking-widest text-[11px]">Cycle</th>
                <th className="px-4 py-3 font-black uppercase tracking-widest text-[11px]">Topped Up By</th>
                <th className="px-4 py-3 font-black uppercase tracking-widest text-[11px]">Status</th>
                <th className="px-4 py-3 font-black uppercase tracking-widest text-[11px]">Date (IST)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedUsers.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-10 text-gray-400 font-bold uppercase tracking-widest">No records found</td></tr>
              ) : (
                paginatedUsers.map((u, i) => (
                  <tr key={u._id || i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-black text-indigo-600">#{u.userId}</td>
                    <td className="px-4 py-3 text-gray-800 font-bold capitalize">{u.name}</td>
                    <td className="px-4 py-3 text-emerald-600 font-black">${u.amount}</td>
                    <td className="px-4 py-3">
                        <span className="bg-[#d4af37]/20 text-[#d4af37] font-black border border-[#d4af37] px-2 py-1 rounded text-[10px] uppercase">{u.duration} Days</span>
                    </td>
                    <td className="px-4 py-3 text-xs font-bold text-gray-600">{u.topUpBy}</td>
                    <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${u.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{u.status}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 font-bold text-[11px] whitespace-nowrap">{getISTDateTimeString(u.date)}</td>
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
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-5 py-2 rounded bg-indigo-600 text-white font-black text-xs">Prev</button>
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-5 py-2 rounded bg-indigo-600 text-white font-black text-xs">Next</button>
        </div>
      )}
    </div>
  );
};

export default TotalAutoCompoundPage;