import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { Award, Search, Trophy, CheckCircle } from "lucide-react";
import SpinnerOverlay from "../../components/common/SpinnerOverlay";

const SalaryAchievers = () => {
  const [achievers, setAchievers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(25);

  useEffect(() => {
    fetchAchievers();
  }, []);

  const fetchAchievers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/user/salary-achievers-list'); // Naya API Call
      if (res.data.success) {
        setAchievers(res.data.data);
        setFiltered(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch achievers", err);
    } finally {
      setLoading(false);
    }
  };

  // Search Logic
  useEffect(() => {
    if (search) {
      const lowerSearch = search.toLowerCase();
      const result = achievers.filter(user => 
        user.userId?.toLowerCase().includes(lowerSearch) || 
        user.name?.toLowerCase().includes(lowerSearch)
      );
      setFiltered(result);
      setCurrentPage(1);
    } else {
      setFiltered(achievers);
    }
  }, [search, achievers]);

  // Pagination Logic
  const totalPages = Math.ceil(filtered.length / entriesPerPage) || 1;
  const indexOfLast = currentPage * entriesPerPage;
  const indexOfFirst = indexOfLast - entriesPerPage;
  const paginated = filtered.slice(indexOfFirst, indexOfLast);

  if (loading) return <SpinnerOverlay />;

  return (
    <div className="w-full min-h-screen bg-[#0b1221] p-4 md:p-8 font-sans pb-24">
      
      <div className="max-w-6xl mx-auto bg-[#131c31] rounded-xl border-t-[3px] border-[#eab308] shadow-[0_0_20px_rgba(234,179,8,0.1)] p-4 sm:p-6">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-gray-800 pb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl text-[#eab308] font-black tracking-wide flex items-center gap-3">
              <Trophy size={32} className="text-[#eab308]" /> 
              Monthly Salary Achievers
            </h2>
            <p className="text-gray-400 text-sm mt-1 flex items-center gap-2">
              <CheckCircle size={14} className="text-green-500" />
              Total {achievers.length} Users Qualified
            </p>
          </div>
          
          <div className="relative w-full sm:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-500" />
            </div>
            <input 
              type="text" 
              placeholder="Search by ID or Name..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="bg-[#0b1221] border border-gray-700 text-gray-200 rounded-lg px-3 py-2.5 pl-10 w-full focus:outline-none focus:border-[#eab308] transition-colors" 
            />
          </div>
        </div>

        {/* Table Controls */}
        <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
          <span>Show</span>
          <select 
            value={entriesPerPage} 
            onChange={(e) => { setEntriesPerPage(Number(e.target.value)); setCurrentPage(1); }} 
            className="bg-[#0b1221] border border-gray-700 text-[#eab308] rounded px-2 py-1 focus:outline-none"
          >
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span>entries</span>
        </div>

        {/* The Achievers Table */}
        <div className="overflow-x-auto border border-gray-800 rounded-xl shadow-inner">
          <table className="w-full text-left whitespace-nowrap border-collapse">
            <thead className="bg-[#1a253e] border-b border-gray-700">
              <tr>
                <th className="p-4 border-r border-gray-700/50 text-[#eab308] font-extrabold text-center w-16 uppercase tracking-wider text-xs">SR.No</th>
                <th className="p-4 border-r border-gray-700/50 text-[#eab308] font-extrabold uppercase tracking-wider text-xs">User ID</th>
                <th className="p-4 border-r border-gray-700/50 text-[#eab308] font-extrabold uppercase tracking-wider text-xs">Name</th>
                {/* 🚀 Package hata diya gaya hai */}
                <th className="p-4 text-[#eab308] font-extrabold text-center uppercase tracking-wider text-xs">Status</th>
              </tr>
            </thead>
            
            <tbody className="text-gray-300 text-sm">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-10 text-gray-500"> {/* 🚀 colSpan 4 kar diya */}
                    No Achievers found.
                  </td>
                </tr>
              ) : (
                paginated.map((user, idx) => {
                  const rank = indexOfFirst + idx + 1;
                  return (
                    <tr key={user.userId + idx} className="border-b border-gray-800 hover:bg-[#1a253e]/50 transition-colors">
                      <td className="p-4 border-r border-gray-800/50 text-center font-bold">
                        {rank <= 3 ? (
                           <span className="bg-[#eab308] text-black w-7 h-7 rounded-full flex items-center justify-center mx-auto text-xs shadow-[0_0_10px_rgba(234,179,8,0.5)]">
                             {rank}
                           </span>
                        ) : rank}
                      </td>
                      <td className="p-4 border-r border-gray-800/50 font-bold text-white tracking-wide">
                        {user.userId}
                      </td>
                      <td className="p-4 border-r border-gray-800/50 font-medium capitalize text-gray-400">
                        {user.name}
                      </td>
                      {/* 🚀 Package data hata diya gaya hai */}
                      <td className="p-4 text-center">
                         <div className="inline-flex items-center gap-1.5 bg-[#eab308]/10 border border-[#eab308]/30 px-3 py-1 rounded text-[#eab308] text-xs font-bold uppercase tracking-widest">
                            <Award size={14} /> Qualified
                         </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {filtered.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 text-gray-400 text-sm gap-4">
            <div>
              Showing <span className="text-white font-medium">{indexOfFirst + 1}</span> to <span className="text-white font-medium">{Math.min(indexOfLast, filtered.length)}</span> of <span className="text-white font-medium">{filtered.length}</span> achievers
            </div>
            
            <div className="flex items-center bg-[#0b1221] rounded border border-gray-700 overflow-hidden">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-4 py-2 text-[#eab308] hover:bg-[#1a253e] disabled:text-gray-600 disabled:bg-transparent disabled:cursor-not-allowed transition-colors">Prev</button>
              <div className="px-4 py-2 border-l border-r border-gray-700 bg-[#1a253e] text-[#eab308] font-bold">{currentPage}</div>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-4 py-2 text-[#eab308] hover:bg-[#1a253e] disabled:text-gray-600 disabled:bg-transparent disabled:cursor-not-allowed transition-colors">Next</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default SalaryAchievers;