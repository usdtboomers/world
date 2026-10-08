import React, { useEffect, useState } from 'react';
import api from "../../api/axios";
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import { ArrowUpDown, ArrowUp, ArrowDown, Wallet } from 'lucide-react';

const SystemIncomeReport = () => {
  const [data, setData] = useState({ today: {}, lifetime: {}, users: [] });
  const [loading, setLoading] = useState(true);

  // Filters & Pagination States
  const [searchId, setSearchId] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20); 

  // Sorting State
  const [sortConfig, setSortConfig] = useState({ key: 'totalEarned', direction: 'descending' });

  useEffect(() => {
    const fetchIncomeData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('adminToken');
        const dateQuery = selectedDate ? `?date=${selectedDate}` : '';
        const res = await api.get(`/admin/income-reports${dateQuery}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error("Fetch Income Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchIncomeData();
  }, [selectedDate]);

  // Handle Header Click for Sorting
  const requestSort = (key) => {
    let direction = 'descending';
    if (sortConfig.key === key && sortConfig.direction === 'descending') {
      direction = 'ascending';
    }
    setSortConfig({ key, direction });
  };

  // Search & Sorting Logic
  let filteredUsers = data.users.filter((user) => {
    const matchId = searchId ? String(user.userId).toLowerCase().includes(searchId.toLowerCase()) : true;
    const matchName = searchId ? String(user.name).toLowerCase().includes(searchId.toLowerCase()) : true;
    return matchId || matchName;
  });

  filteredUsers.sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  // 🔥 NAYA LOGIC: Sabhi users ka PENDING amount add/sum kar rahe hain
  const totalPendingDirect = data.users.reduce((sum, u) => sum + (u.directIncome || 0), 0);
  const totalPendingLevel = data.users.reduce((sum, u) => sum + (u.levelIncome || 0), 0);
  const totalPendingRoi = data.users.reduce((sum, u) => sum + (u.roiIncome || 0), 0);
  const totalPendingCompound = data.users.reduce((sum, u) => sum + (u.compoundIncome || 0), 0);

  // Export to CSV
  const exportToCSV = () => {
    const csvData = filteredUsers.map((u, i) => ({
      SNo: i + 1,
      UserID: u.userId,
      Name: u.name,
      "Pending Direct": (u.directIncome || 0).toFixed(2),
      "Pending Level": (u.levelIncome || 0).toFixed(2),
      "Pending ROI": (u.roiIncome || 0).toFixed(2),
      "Pending Compound": (u.compoundIncome || 0).toFixed(2),
      "Total Lifetime Earned": (u.totalEarned || 0).toFixed(2)
    }));
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `System_Income_Report_${Date.now()}.csv`);
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) return <ArrowUpDown size={14} className="text-gray-400" />;
    return sortConfig.direction === 'ascending' ? <ArrowUp size={14} className="text-indigo-600" /> : <ArrowDown size={14} className="text-indigo-600" />;
  };

  return (
    <div className="p-6 max-w-7xl pt-24 text-black mx-auto">
      <h2 className="text-3xl font-black text-indigo-800 mb-6 flex items-center gap-3">
        <Wallet className="text-indigo-600" size={32} /> System Income & Wallet Report
      </h2>

      {/* FILTER BAR */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 flex-wrap bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <input
          type="text"
          placeholder="Search User ID or Name"
          value={searchId}
          onChange={(e) => { setSearchId(e.target.value); setCurrentPage(1); }}
          className="px-4 py-2 border rounded w-full md:flex-1 shadow-sm outline-none focus:ring-2 focus:ring-indigo-400 font-semibold"
        />
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Date Distribution:</span>
          <input 
            type="date" 
            value={selectedDate} 
            onChange={(e) => setSelectedDate(e.target.value)} 
            className="px-4 py-2 border rounded shadow-sm outline-none font-semibold cursor-pointer" 
          />
        </div>

        <select 
          className="px-4 py-2 border rounded w-full md:w-auto shadow-sm outline-none font-semibold"
          value={itemsPerPage}
          onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
        >
          <option value={10}>Show 10</option>
          <option value={20}>Show 20</option>
          <option value={50}>Show 50</option>
          <option value={100}>Show 100</option>
          <option value={200}>Show 200</option>
        </select>
        
        <button onClick={() => { setSelectedDate(''); setSearchId(''); }} className="bg-slate-200 text-slate-700 font-bold px-5 py-2 rounded hover:bg-slate-300 transition">Clear</button>
      </div>

      {/* 🚀 TOP STATS - 3 BLOCKS NOW */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        
        {/* Block 1: Daily Distributed */}
        <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-xl shadow-sm">
            <h3 className="text-indigo-800 font-black uppercase tracking-widest text-sm mb-4 border-b border-indigo-200 pb-2">
                Distributed on: {selectedDate ? new Date(selectedDate).toLocaleDateString() : 'Today'}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="bg-white p-3 rounded-lg text-center shadow-sm">
                  <p className="text-[9px] font-bold text-gray-500 uppercase">Direct</p>
                  <p className="text-lg font-black text-indigo-700">${(data.today?.direct || 0).toFixed(2)}</p>
                </div>
                <div className="bg-white p-3 rounded-lg text-center shadow-sm">
                  <p className="text-[9px] font-bold text-gray-500 uppercase">Level</p>
                  <p className="text-lg font-black text-indigo-700">${(data.today?.level || 0).toFixed(2)}</p>
                </div>
                <div className="bg-white p-3 rounded-lg text-center shadow-sm">
                  <p className="text-[9px] font-bold text-gray-500 uppercase">ROI</p>
                  <p className="text-lg font-black text-indigo-700">${(data.today?.roi || 0).toFixed(2)}</p>
                </div>
                <div className="bg-white p-3 rounded-lg text-center shadow-sm">
                  <p className="text-[9px] font-bold text-gray-500 uppercase">Compound</p>
                  <p className="text-lg font-black text-indigo-700">${(data.today?.compound || 0).toFixed(2)}</p>
                </div>
            </div>
        </div>

        {/* Block 2: Lifetime Distributed */}
        <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-xl shadow-sm">
            <h3 className="text-emerald-800 font-black uppercase tracking-widest text-sm mb-4 border-b border-emerald-200 pb-2">
                System Lifetime Distributed
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="bg-white p-3 rounded-lg text-center shadow-sm">
                  <p className="text-[9px] font-bold text-gray-500 uppercase">Total Direct</p>
                  <p className="text-lg font-black text-emerald-700">${(data.lifetime?.direct || 0).toFixed(2)}</p>
                </div>
                <div className="bg-white p-3 rounded-lg text-center shadow-sm">
                  <p className="text-[9px] font-bold text-gray-500 uppercase">Total Level</p>
                  <p className="text-lg font-black text-emerald-700">${(data.lifetime?.level || 0).toFixed(2)}</p>
                </div>
                <div className="bg-white p-3 rounded-lg text-center shadow-sm">
                  <p className="text-[9px] font-bold text-gray-500 uppercase">Total ROI</p>
                  <p className="text-lg font-black text-emerald-700">${(data.lifetime?.roi || 0).toFixed(2)}</p>
                </div>
                <div className="bg-white p-3 rounded-lg text-center shadow-sm">
                  <p className="text-[9px] font-bold text-gray-500 uppercase">Total Cmpnd</p>
                  <p className="text-lg font-black text-emerald-700">${(data.lifetime?.compound || 0).toFixed(2)}</p>
                </div>
            </div>
        </div>

        {/* 🔥 NEW Block 3: Total Pending in System */}
        <div className="bg-orange-50 border border-orange-100 p-5 rounded-xl shadow-sm">
            <h3 className="text-orange-800 font-black uppercase tracking-widest text-sm mb-4 border-b border-orange-200 pb-2">
                Pending In User Wallets (System Total)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="bg-white p-3 rounded-lg text-center shadow-sm border border-orange-100/50">
                  <p className="text-[9px] font-bold text-gray-500 uppercase">Pending Direct</p>
                  <p className="text-lg font-black text-orange-700">${totalPendingDirect.toFixed(2)}</p>
                </div>
                <div className="bg-white p-3 rounded-lg text-center shadow-sm border border-orange-100/50">
                  <p className="text-[9px] font-bold text-gray-500 uppercase">Pending Level</p>
                  <p className="text-lg font-black text-orange-700">${totalPendingLevel.toFixed(2)}</p>
                </div>
                <div className="bg-white p-3 rounded-lg text-center shadow-sm border border-orange-100/50">
                  <p className="text-[9px] font-bold text-gray-500 uppercase">Pending ROI</p>
                  <p className="text-lg font-black text-orange-700">${totalPendingRoi.toFixed(2)}</p>
                </div>
                <div className="bg-white p-3 rounded-lg text-center shadow-sm border border-orange-100/50">
                  <p className="text-[9px] font-bold text-gray-500 uppercase">Pending Cmpnd</p>
                  <p className="text-lg font-black text-orange-700">${totalPendingCompound.toFixed(2)}</p>
                </div>
            </div>
        </div>

      </div>

      <div className="flex justify-between items-center mb-3">
        <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Showing {filteredUsers.length} Users</p>
        <button onClick={exportToCSV} className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded shadow-sm font-black uppercase text-[11px] tracking-wider">Export CSV</button>
      </div>

      {/* USER WALLET TABLE WITH SORTING */}
      {loading ? (
        <div className="text-center p-10 text-gray-500 font-bold uppercase tracking-widest animate-pulse">⏳ Loading Data...</div>
      ) : (
        <div className="overflow-x-auto border rounded-xl shadow-sm bg-white">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-slate-100 border-b border-slate-200">
              <tr>
                <th className="px-4 py-4 font-black text-slate-600 uppercase tracking-widest text-[11px]">User</th>
                
                {/* SORTABLE HEADERS */}
                <th onClick={() => requestSort('directIncome')} className="px-4 py-4 font-black text-slate-600 uppercase tracking-widest text-[11px] cursor-pointer hover:bg-slate-200 transition">
                  <div className="flex items-center gap-1">Pending Direct {getSortIcon('directIncome')}</div>
                </th>
                <th onClick={() => requestSort('levelIncome')} className="px-4 py-4 font-black text-slate-600 uppercase tracking-widest text-[11px] cursor-pointer hover:bg-slate-200 transition">
                  <div className="flex items-center gap-1">Pending Level {getSortIcon('levelIncome')}</div>
                </th>
                <th onClick={() => requestSort('roiIncome')} className="px-4 py-4 font-black text-slate-600 uppercase tracking-widest text-[11px] cursor-pointer hover:bg-slate-200 transition">
                  <div className="flex items-center gap-1">Pending ROI {getSortIcon('roiIncome')}</div>
                </th>
                <th onClick={() => requestSort('compoundIncome')} className="px-4 py-4 font-black text-slate-600 uppercase tracking-widest text-[11px] cursor-pointer hover:bg-slate-200 transition">
                  <div className="flex items-center gap-1">Pending Cmpnd {getSortIcon('compoundIncome')}</div>
                </th>
                <th onClick={() => requestSort('totalEarned')} className="px-4 py-4 font-black text-emerald-700 uppercase tracking-widest text-[11px] cursor-pointer hover:bg-emerald-100 transition bg-emerald-50">
                  <div className="flex items-center gap-1">Total Lifetime Earned {getSortIcon('totalEarned')}</div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedUsers.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-10 text-gray-400 font-bold uppercase tracking-widest">No users found</td></tr>
              ) : (
                paginatedUsers.map((u, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-black text-indigo-600">#{u.userId}</p>
                      <p className="text-xs text-slate-500 font-bold capitalize">{u.name}</p>
                    </td>
                    <td className="px-4 py-3 font-bold text-gray-700">${(u.directIncome || 0).toFixed(2)}</td>
                    <td className="px-4 py-3 font-bold text-gray-700">${(u.levelIncome || 0).toFixed(2)}</td>
                    <td className="px-4 py-3 font-bold text-gray-700">${(u.roiIncome || 0).toFixed(2)}</td>
                    <td className="px-4 py-3 font-bold text-gray-700">${(u.compoundIncome || 0).toFixed(2)}</td>
                    <td className="px-4 py-3 font-black text-emerald-600 bg-emerald-50/30">${(u.totalEarned || 0).toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* PAGINATION CONTROLS */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-5 py-2 rounded bg-indigo-600 text-white font-black text-xs uppercase disabled:opacity-50">Prev</button>
          <span className="font-black text-slate-500 text-xs uppercase tracking-widest">Page {currentPage} of {totalPages}</span>
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-5 py-2 rounded bg-indigo-600 text-white font-black text-xs uppercase disabled:opacity-50">Next</button>
        </div>
      )}
    </div>
  );
};

export default SystemIncomeReport;