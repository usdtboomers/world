import React, { useState, useEffect, useMemo } from 'react';
import api from '../../api/axios'; 
import { Search, CheckCircle, AlertCircle, Clock, Wallet, ShieldAlert, DollarSign, Calendar, Star } from 'lucide-react';
import SpinnerOverlay from '../../components/common/SpinnerOverlay';

const MonthlySalaryClaims = () => {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchClaimsData();
  }, []);

  const fetchClaimsData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/monthly-salary-claims-report');
      if (res.data.success) {
        setReport(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching claims report", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1); 
  }, [search, itemsPerPage]);

  const filteredReport = useMemo(() => {
    return report.filter(user => 
      user.userId?.toLowerCase().includes(search.toLowerCase()) || 
      user.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [report, search]);

  const stats = useMemo(() => {
    let claimed = 0, ready = 0, blocked = 0, waiting = 0;
    report.forEach(r => {
      if (r.status === 'Claimed') claimed++;
      else if (r.status === 'Ready to Claim') ready++;
      else if (r.status === 'Blocked (Team Inactive)') blocked++;
      else if (r.status === 'Waiting for Cron') waiting++;
    });
    return { claimed, ready, blocked, waiting, total: report.length };
  }, [report]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredReport.length / itemsPerPage) || 1;
  const validCurrentPage = Math.min(currentPage, totalPages);
  const indexOfLastItem = validCurrentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReport.slice(indexOfFirstItem, indexOfLastItem);

  const handleNext = () => { if (validCurrentPage < totalPages) setCurrentPage(prev => prev + 1); };
  const handlePrev = () => { if (validCurrentPage > 1) setCurrentPage(prev => prev - 1); };

  if (loading) return <SpinnerOverlay />;

  return (
    <div className="p-4 md:p-8 bg-[#0b1221] min-h-screen font-sans pb-24">
      
      <style>{`
        .custom-scroll::-webkit-scrollbar { height: 6px; width: 6px; }
        .custom-scroll::-webkit-scrollbar-track { background: #131c31; border-radius: 4px;}
        .custom-scroll::-webkit-scrollbar-thumb { background: #374151; border-radius: 4px; }
      `}</style>

      <div className="max-w-7xl mx-auto bg-[#131c31] rounded-xl border-t-[3px] border-indigo-500 shadow-lg p-4 sm:p-6">
        
        <div className="mb-8 border-b border-gray-800 pb-6">
          <h2 className="text-2xl sm:text-3xl font-black text-indigo-400 flex items-center gap-3 tracking-wide">
            <Wallet size={32} /> Salary Claims Status Tracker
          </h2>
          <p className="text-gray-400 text-sm mt-2">Monitor who has claimed, who is ready, and whose salary is blocked due to team inactivity.</p>
        </div>

        {/* 📊 Top Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          <div className="bg-[#1e293b] p-4 rounded-xl border border-gray-700 shadow-sm col-span-2 md:col-span-1">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Qualified</p>
            <h3 className="text-3xl font-black text-white mt-1">{stats.total}</h3>
          </div>
          
         
          <div className="bg-red-900/20 p-4 rounded-xl border border-red-800/50 shadow-sm">
            <p className="text-[10px] font-black text-red-400 uppercase tracking-widest flex items-center gap-1"><ShieldAlert size={12}/> Blocked</p>
            <h3 className="text-3xl font-black text-red-500 mt-1">{stats.blocked}</h3>
          </div>
          
        </div>

        {/* 🔍 Controls Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Search ID or Name..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-[#0b1221] text-gray-200 border border-gray-700 rounded-lg pl-10 pr-4 py-2 w-full focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <span>Show</span>
            <select 
              className="bg-[#0b1221] border border-gray-700 text-indigo-400 font-bold rounded px-2 py-1 outline-none"
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>entries</span>
          </div>
        </div>

        {/* 📋 Table Section */}
        <div className="overflow-x-auto custom-scroll border border-gray-800 rounded-xl shadow-inner bg-[#1a253e]">
          <table className="w-full text-left whitespace-nowrap min-w-[1000px]">
            <thead className="bg-[#131c31] border-b border-gray-700">
              <tr>
                <th className="px-6 py-4 text-indigo-400 font-extrabold uppercase text-xs tracking-wider w-12 text-center">Sr</th>
                <th className="px-6 py-4 text-indigo-400 font-extrabold uppercase text-xs tracking-wider">User Details</th>
                <th className="px-6 py-4 text-indigo-400 font-extrabold uppercase text-xs tracking-wider text-center">Current Target Progress (25 Days)</th>
                <th className="px-6 py-4 text-indigo-400 font-extrabold uppercase text-xs tracking-wider text-center">Salary Data</th>
                <th className="px-6 py-4 text-indigo-400 font-extrabold uppercase text-xs tracking-wider text-center">Claim Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-sm">
              {currentItems.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-10 text-gray-500 font-bold uppercase tracking-widest">No records found.</td></tr>
              ) : (
                currentItems.map((user, idx) => {
                  
                  const l1Progress = Math.min((user.l1Active / 3) * 100, 100) || 0;
                  const l2Progress = Math.min((user.l2Active / 6) * 100, 100) || 0;
                  const averageProgress = (l1Progress + l2Progress) / 2;
                  
                  // Agar salaryMonthsPaid 0 hai matlab usko pehli salary milni hai (Grace Period)
                  const isFirstMonth = user.salaryMonthsPaid < 1;

                  return (
                    <tr key={idx} className="hover:bg-[#1f2d4a] transition-colors">
                      <td className="px-6 py-4 text-center font-black text-gray-500">
                        {indexOfFirstItem + idx + 1}
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="font-bold text-white tracking-wide text-base">#{user.userId}</div>
                        <div className="text-xs font-semibold text-gray-400 capitalize mt-0.5">{user.name}</div>
                      </td>

                      <td className="px-6 py-4">
                         <div className="w-full max-w-[250px] mx-auto">
                            {isFirstMonth ? (
                                /* 🔥 1ST MONTH GRACE PERIOD UI */
                                <div className="flex flex-col items-center justify-center p-2 bg-yellow-900/20 border border-yellow-700/50 rounded-lg text-center">
                                  <Star size={14} className="text-yellow-500 mb-1" />
                                  <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest">1st Month Grace</span>
                                  <span className="text-[9px] font-bold text-gray-400 uppercase mt-0.5">No Target Required</span>
                                </div>
                            ) : (
                                /* 📊 NORMAL PROGRESS BAR FOR 2ND MONTH ONWARDS */
                                <>
                                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                                      <span>Team Target (L1 & L2)</span>
                                      <span className={averageProgress === 100 ? "text-green-400" : "text-indigo-400"}>{averageProgress.toFixed(0)}%</span>
                                  </div>
                                  <div className="w-full bg-gray-800 rounded-full h-2.5 overflow-hidden">
                                     <div 
                                        className={`h-full rounded-full transition-all duration-1000 ${averageProgress === 100 ? 'bg-green-500' : 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]'}`}
                                        style={{ width: `${averageProgress}%` }}
                                     ></div>
                                  </div>
                                  <div className="flex justify-between mt-2">
                                      <span className={`text-[11px] font-bold ${user.l1Active >= 3 ? "text-green-400" : "text-red-400"}`}>L1: {user.l1Active}/3</span>
                                      <span className={`text-[11px] font-bold ${user.l2Active >= 6 ? "text-green-400" : "text-red-400"}`}>L2: {user.l2Active}/6</span>
                                  </div>
                                </>
                            )}
                         </div>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                           <span className="text-lg font-black text-yellow-500 flex items-center gap-1">
                              <DollarSign size={16}/> {user.unclaimedSalary} Pending
                           </span>
                           <span className="bg-[#0b1221] text-gray-300 border border-gray-700 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-widest mt-1">
                              Paid: {user.salaryMonthsPaid} / 6
                           </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-center">
                        {user.status === 'Claimed' && (
                          <div className="inline-flex items-center gap-1.5 bg-green-500/10 border border-green-500/30 px-3 py-1.5 rounded text-green-400 text-xs font-bold uppercase tracking-widest shadow-[0_0_10px_rgba(34,197,94,0.1)]">
                            <CheckCircle size={14}/> CLAIMED
                          </div>
                        )}
                        {user.status === 'Ready to Claim' && (
                          <div className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/30 px-3 py-1.5 rounded text-blue-400 text-xs font-bold uppercase tracking-widest shadow-[0_0_10px_rgba(59,130,246,0.1)]">
                            <Clock size={14}/> READY TO CLAIM
                          </div>
                        )}
                        {user.status === 'Blocked (Team Inactive)' && (
                          <div className="inline-flex items-center gap-1.5 bg-red-500/10 border border-red-500/30 px-3 py-1.5 rounded text-red-400 text-xs font-bold uppercase tracking-widest shadow-[0_0_10px_rgba(239,68,68,0.1)]">
                            <ShieldAlert size={14}/> BLOCKED
                          </div>
                        )}
                        {user.status === 'Waiting for Cron' && (
                          <div className="inline-flex items-center gap-1.5 bg-gray-500/10 border border-gray-500/30 px-3 py-1.5 rounded text-gray-400 text-xs font-bold uppercase tracking-widest">
                            <Calendar size={14}/> WAITING CRON
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 📟 Pagination Controls */}
        {!loading && filteredReport.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-6 text-sm">
            <span className="text-gray-400 font-bold uppercase tracking-widest text-[11px]">
              Showing <span className="text-white">{indexOfFirstItem + 1}</span> to <span className="text-white">{Math.min(indexOfLastItem, filteredReport.length)}</span> of <span className="text-white">{filteredReport.length}</span> entries
            </span>
            
            <div className="flex items-center bg-[#0b1221] rounded border border-gray-700 overflow-hidden shadow-sm">
              <button
                onClick={handlePrev}
                disabled={validCurrentPage === 1}
                className="px-4 py-2 font-bold uppercase text-xs tracking-widest transition-all text-indigo-400 hover:bg-[#1a253e] disabled:text-gray-600 disabled:bg-transparent disabled:cursor-not-allowed"
              >
                Prev
              </button>
              <div className="px-4 py-2 border-l border-r border-gray-700 bg-[#1a253e] text-indigo-400 font-black">
                {validCurrentPage}
              </div>
              <button
                onClick={handleNext}
                disabled={validCurrentPage === totalPages}
                className="px-4 py-2 font-bold uppercase text-xs tracking-widest transition-all text-indigo-400 hover:bg-[#1a253e] disabled:text-gray-600 disabled:bg-transparent disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default MonthlySalaryClaims;