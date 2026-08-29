import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { getUserId } from "../../utils/authUtils"; 
import { DollarSign, TrendingUp, Users, Calendar, Layers, BarChart } from "lucide-react";

const DownlineBusiness = () => {
  const userId = getUserId(); 
  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [typeFilter, setTypeFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  
  // Date Filters
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Stats States
  const [stats, setStats] = useState({
    totalDirect: 0, todayDirect: 0,
    totalLevel: 0, todayLevel: 0
  });

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    api.get(`/user/downline-business`)
      .then((res) => {
        if (res.data.success) {
          setTransactions(res.data.data || []);
          setFiltered(res.data.data || []);
          setStats(res.data.stats || {
            totalDirect: 0, todayDirect: 0,
            totalLevel: 0, todayLevel: 0
          });
        }
      })
      .catch((err) => {
        console.error("Failed to fetch Downline Business", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId]);

  // Filtering Logic
  useEffect(() => {
    let result = transactions;

    // Date Filter
    if (startDate || endDate) {
      result = result.filter(txn => {
        const txnDate = new Date(txn.date);
        txnDate.setHours(0, 0, 0, 0); 
        const sDate = startDate ? new Date(startDate) : null;
        if (sDate) sDate.setHours(0, 0, 0, 0);
        const eDate = endDate ? new Date(endDate) : null;
        if (eDate) eDate.setHours(23, 59, 59, 999);

        if (sDate && eDate) return txnDate >= sDate && txnDate <= eDate;
        if (sDate) return txnDate >= sDate;
        if (eDate) return txnDate <= eDate;
        return true;
      });
    }

    // Type Filter (Direct vs Team)
    if (typeFilter !== "All") {
      result = result.filter(txn => txn.type === typeFilter);
    }

    setFiltered(result);
    setCurrentPage(1); 
  }, [startDate, endDate, typeFilter, transactions]);

  const handleEntriesChange = (e) => {
    setEntriesPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filtered.length / entriesPerPage) || 1;
  const indexOfLast = currentPage * entriesPerPage;
  const indexOfFirst = indexOfLast - entriesPerPage;
  const paginated = filtered.slice(indexOfFirst, indexOfLast);

  const handlePrev = () => currentPage > 1 && setCurrentPage((p) => p - 1);
  const handleNext = () => currentPage < totalPages && setCurrentPage((p) => p + 1);

  return (
    <div className="w-full min-h-screen bg-[#0b1221] p-4 md:p-8 font-sans">
      
      <div className="max-w-7xl mx-auto bg-[#131c31] rounded-xl border-t-[3px] border-[#eab308] shadow-2xl p-4 sm:p-6">
        
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl text-[#eab308] font-bold tracking-wide flex items-center gap-3">
             Team Business Report
          </h2>
         </div>

        {/* 4 STATS CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#0b1221] border border-[#eab308]/30 p-5 rounded-xl flex items-center gap-4 hover:border-[#eab308] transition-colors">
            <div className="p-3 bg-[#eab308]/10 rounded-lg text-[#eab308]"><TrendingUp size={24} /></div>
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Today's Direct Biz</p>
              <h3 className="text-2xl text-white font-black flex items-center mt-1">
                <DollarSign size={20} className="text-[#eab308] mr-0.5" />{stats.todayDirect.toFixed(2)}
              </h3>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#eab308]/10 to-[#0b1221] border border-[#eab308]/50 p-5 rounded-xl flex items-center gap-4 shadow-sm">
            <div className="p-3 bg-[#eab308]/20 rounded-lg text-[#eab308]"><Users size={24} /></div>
            <div>
              <p className="text-[#eab308] text-xs font-bold uppercase tracking-wider">Total Direct Biz</p>
              <h3 className="text-2xl text-white font-black flex items-center mt-1">
                <DollarSign size={20} className="text-[#eab308] mr-0.5" />{stats.totalDirect.toFixed(2)}
              </h3>
            </div>
          </div>

          <div className="bg-[#0b1221] border border-purple-500/30 p-5 rounded-xl flex items-center gap-4 hover:border-purple-500 transition-colors">
            <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400"><TrendingUp size={24} /></div>
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Today's Team Biz</p>
              <h3 className="text-2xl text-white font-black flex items-center mt-1">
                <DollarSign size={20} className="text-[#eab308] mr-0.5" />{stats.todayLevel.toFixed(2)}
              </h3>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-[#0b1221] border border-purple-500/50 p-5 rounded-xl flex items-center gap-4 shadow-sm">
            <div className="p-3 bg-purple-500/20 rounded-lg text-purple-400"><Layers size={24} /></div>
            <div>
              <p className="text-purple-400 text-xs font-bold uppercase tracking-wider">Total Team Biz</p>
              <h3 className="text-2xl text-white font-black flex items-center mt-1">
                <DollarSign size={20} className="text-[#eab308] mr-0.5" />{stats.totalLevel.toFixed(2)}
              </h3>
            </div>
          </div>
        </div>

        {/* FILTER SECTION */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4 text-gray-300 text-sm border-t border-gray-800 pt-6">
          <div className="flex items-center gap-2">
            <span>Show</span>
            <select value={entriesPerPage} onChange={handleEntriesChange} className="bg-[#0b1221] border border-gray-700 text-[#eab308] rounded px-3 py-1.5 focus:outline-none">
              <option value={10}>10</option><option value={25}>25</option><option value={50}>50</option>
            </select>
            <span>entries</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            {/* Type Filter */}
            <div className="flex items-center gap-2 bg-[#0b1221] border border-gray-700 rounded-lg px-3 py-1.5 w-full sm:w-auto">
              <BarChart size={16} className="text-[#eab308]" />
              <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="bg-transparent text-gray-200 outline-none text-xs sm:text-sm w-full cursor-pointer">
                <option value="All">All Business</option>
                <option value="Direct Business">Direct Business Only</option>
                <option value="Team Business">Team Business Only</option>
              </select>
            </div>

            {/* Date Filters */}
            <div className="flex items-center gap-2 bg-[#0b1221] border border-gray-700 rounded-lg px-3 py-1.5 w-full sm:w-auto">
              <Calendar size={16} className="text-[#eab308]" />
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-transparent text-gray-200 outline-none text-xs sm:text-sm w-full"/>
              <span className="text-gray-500 px-1">to</span>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bg-transparent text-gray-200 outline-none text-xs sm:text-sm w-full"/>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto border border-gray-700 rounded-lg">
          <table className="w-full text-left whitespace-nowrap border-collapse">
            <thead className="text-[#eab308] bg-[#1a253e] text-sm border-b border-gray-700">
              <tr>
                <th className="p-4 border-r border-gray-700/50 font-bold text-center w-16">Sr.</th>
                <th className="p-4 border-r border-gray-700/50 font-bold text-center">Date</th>
                <th className="p-4 border-r border-gray-700/50 font-bold text-center">Business Type</th>
                <th className="p-4 border-r border-gray-700/50 font-bold text-center">Total Business Amount</th>
              </tr>
            </thead>
            
            <tbody className="text-gray-300 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-12 text-[#eab308]">
                    <div className="animate-spin h-8 w-8 mx-auto mb-3 border-4 border-t-transparent border-[#eab308] rounded-full"></div>
                    Loading Business Data...
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-12 text-gray-500">
                    No Business found for selected filters.
                  </td>
                </tr>
              ) : (
                paginated.map((txn, idx) => {
                  const date = new Date(txn.date);
                  const isDirect = txn.type === "Direct Business";
                  
                  return (
                    <tr key={txn._id || idx} className="border-b border-gray-700 hover:bg-[#1a253e] transition-colors">
                      <td className="p-4 border-r border-gray-700/50 text-center font-medium">
                        {indexOfFirst + idx + 1}
                      </td>
                      <td className="p-4 border-r border-gray-700/50 text-center font-medium">
                        {date.toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="p-4 border-r border-gray-700/50 text-center">
                        {isDirect ? (
                           <span className="bg-[#eab308]/10 text-[#eab308] border border-[#eab308]/20 px-4 py-1.5 rounded text-xs font-bold tracking-wider uppercase">Direct Business</span>
                        ) : (
                           <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-4 py-1.5 rounded text-xs font-bold tracking-wider uppercase">Team Business</span>
                        )}
                      </td>
                      <td className="p-4 font-black text-center text-green-400 text-base">
                        ${Number(txn.amount).toFixed(2)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && filtered.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 text-gray-400 text-sm gap-4">
            <div>
              Showing <span className="text-white font-medium">{indexOfFirst + 1}</span> to <span className="text-white font-medium">{Math.min(indexOfLast, filtered.length)}</span> of <span className="text-white font-medium">{filtered.length}</span> entries
            </div>
            
            <div className="flex items-center bg-[#0b1221] rounded border border-gray-700 overflow-hidden">
              <button onClick={handlePrev} disabled={currentPage === 1} className={`px-4 py-2 transition-colors ${currentPage === 1 ? 'text-gray-600 bg-transparent cursor-not-allowed' : 'text-[#eab308] hover:bg-[#1a253e]'}`}>Previous</button>
              <div className="px-4 py-2 border-l border-r border-gray-700 bg-[#1a253e] text-[#eab308] font-bold">{currentPage}</div>
              <button onClick={handleNext} disabled={currentPage === totalPages || totalPages === 0} className={`px-4 py-2 transition-colors ${currentPage === totalPages || totalPages === 0 ? 'text-gray-600 bg-transparent cursor-not-allowed' : 'text-[#eab308] hover:bg-[#1a253e]'}`}>Next</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default DownlineBusiness;