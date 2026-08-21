import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { getUserId } from "../../utils/authUtils"; 
import { Search, DollarSign, TrendingUp, Wallet, Network, Calendar } from "lucide-react";

const RoiIncome = () => {
  const userId = getUserId(); 
  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  
  // 🔥 Date Filter States
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Stats States
  const [totalSelfRoi, setTotalSelfRoi] = useState(0);
  const [totalLevelRoi, setTotalLevelRoi] = useState(0);
  const [todayTotalIncome, setTodayTotalIncome] = useState(0);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    
    Promise.all([
      api.get(`/transaction/transactions/${userId}?type=daily_roi&t=${new Date().getTime()}`),
      api.get(`/transaction/transactions/${userId}?type=daily_level_income&t=${new Date().getTime()}`)
    ])
    .then(([roiRes, levelRes]) => {
      const selfRoiData = roiRes.data || [];
      const levelRoiData = levelRes.data || [];

      // ==========================================
      // 🔥 MAGIC: TEAM LEVEL ROI KO DIN KE HISAAB SE JODNA (COMBINE KARNA)
      // ==========================================
      const levelRoiByDate = {};
      
      levelRoiData.forEach(txn => {
        // Date nikalna aur format karna (YYYY-MM-DD taaki sort karna aasan ho)
        const dateObj = new Date(txn.createdAt || txn.date);
        const dateKey = dateObj.toISOString().split('T')[0]; 

        if (!levelRoiByDate[dateKey]) {
          levelRoiByDate[dateKey] = {
            _id: `level_combined_${dateKey}`, // Ek fake ID React ki key ke liye
            type: "daily_level_income",
            description: `Total Team Level ROI for the Day`,
            amount: 0,
            date: dateKey,
            createdAt: dateObj // Sorting ke liye
          };
        }
        levelRoiByDate[dateKey].amount += (Number(txn.amount) || 0);
      });

      // Object ko wapas Array me convert kiya
      const combinedLevelRoiArray = Object.values(levelRoiByDate);

      // Ab Self ROI aur naye jude hue Level ROI ko mix kiya
      const finalCombinedData = [...selfRoiData, ...combinedLevelRoiArray];
      
      // Date ke hisaab se sort kiya (Naya sabse upar)
      const sorted = finalCombinedData.sort(
        (a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)
      );
      
      setTransactions(sorted);
      setFiltered(sorted); // Initial load par sab dikhayega

      // Stats Calculation
      let selfRoiTotal = 0;
      let levelRoiTotal = 0;
      let todayTotal = 0;
      const todayStr = new Date().toLocaleDateString("en-GB"); 

      sorted.forEach(txn => {
        const amt = Number(txn.amount) || 0;
        
        if (txn.type === "daily_roi") selfRoiTotal += amt;
        if (txn.type === "daily_level_income") levelRoiTotal += amt;
        
        const txnDateStr = new Date(txn.createdAt || txn.date).toLocaleDateString("en-GB");
        if (txnDateStr === todayStr) {
          todayTotal += amt;
        }
      });

      setTotalSelfRoi(selfRoiTotal);
      setTotalLevelRoi(levelRoiTotal);
      setTodayTotalIncome(todayTotal);
    })
    .catch((err) => {
      console.error("Failed to fetch Combined ROI income", err);
    })
    .finally(() => {
      setLoading(false);
    });
  }, [userId]);

  // ==========================================
  // 🔥 NAYA FEATURE: FILTER BY DATE & SEARCH
  // ==========================================
  useEffect(() => {
    let result = transactions;

    // 1. Date Filter lagana
    if (startDate || endDate) {
      result = result.filter(txn => {
        const txnDate = new Date(txn.createdAt || txn.date);
        txnDate.setHours(0, 0, 0, 0); // Sirf date compare karne ke liye time zero kiya

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

    // 2. Search Text lagana
    if (search) {
      const value = search.toLowerCase();
      result = result.filter(
        (txn) =>
          txn.description?.toLowerCase().includes(value) ||
          String(txn.amount).toLowerCase().includes(value) ||
          txn.type?.toLowerCase().includes(value)
      );
    }

    setFiltered(result);
    setCurrentPage(1); // Filter badalne par page 1 par wapas le aao
  }, [startDate, endDate, search, transactions]);

  // Handle Entries Per Page
  const handleEntriesChange = (e) => {
    setEntriesPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Pagination Logic
  const totalPages = Math.ceil(filtered.length / entriesPerPage) || 1;
  const indexOfLast = currentPage * entriesPerPage;
  const indexOfFirst = indexOfLast - entriesPerPage;
  const paginated = filtered.slice(indexOfFirst, indexOfLast);

  const handlePrev = () => currentPage > 1 && setCurrentPage((p) => p - 1);
  const handleNext = () => currentPage < totalPages && setCurrentPage((p) => p + 1);

  return (
    <div className="w-full min-h-screen bg-[#0b1221] p-4 md:p-8 font-sans">
      
      {/* Inner Card Container */}
      <div className="max-w-7xl mx-auto bg-[#131c31] rounded-xl border-t-[3px] border-[#eab308] shadow-2xl p-4 sm:p-6">
        
        {/* Header Title */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl text-[#eab308] font-bold tracking-wide flex items-center gap-3">
               Total ROI 
            </h2>
            <p className="text-gray-500 text-sm mt-1">Track your Self Package ROI and Team Level ROI here</p>
          </div>
          <div className="bg-[#0b1221] border border-gray-700 px-5 py-2 rounded-lg flex items-center gap-3 shadow-inner">
             <span className="text-gray-400 text-sm font-semibold uppercase">Total Combined:</span>
             <span className="text-[#eab308] text-xl font-black flex items-center">
               <DollarSign size={18} />
               {(totalSelfRoi + totalLevelRoi).toFixed(2)}
             </span>
          </div>
        </div>

        {/* 🔥 STATS CARDS 🔥 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#0b1221] border border-gray-700/50 p-4 rounded-xl flex items-center gap-4">
            <div className="p-3 bg-green-500/10 rounded-lg text-green-500"><TrendingUp size={24} /></div>
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Today's Income</p>
              <h3 className="text-2xl text-white font-black flex items-center mt-0.5">
                <DollarSign size={20} className="text-[#eab308] mr-0.5" />{todayTotalIncome.toFixed(2)}
              </h3>
            </div>
          </div>
          <div className="bg-[#0b1221] border border-gray-700/50 p-4 rounded-xl flex items-center gap-4">
            <div className="p-3 bg-[#eab308]/10 rounded-lg text-[#eab308]"><Wallet size={24} /></div>
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Self ROI Earned</p>
              <h3 className="text-2xl text-white font-black flex items-center mt-0.5">
                <DollarSign size={20} className="text-[#eab308] mr-0.5" />{totalSelfRoi.toFixed(2)}
              </h3>
            </div>
          </div>
          <div className="bg-[#0b1221] border border-gray-700/50 p-4 rounded-xl flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400"><Network size={24} /></div>
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Team Level ROI</p>
              <h3 className="text-2xl text-white font-black flex items-center mt-0.5">
                <DollarSign size={20} className="text-[#eab308] mr-0.5" />{totalLevelRoi.toFixed(2)}
              </h3>
            </div>
          </div>
        </div>

        {/* 🔥 FILTER SECTION (Date & Search) 🔥 */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4 text-gray-300 text-sm border-t border-gray-800 pt-6">
          
          <div className="flex items-center gap-2">
            <span>Show</span>
            <select value={entriesPerPage} onChange={handleEntriesChange} className="bg-[#0b1221] border border-gray-700 text-[#eab308] rounded px-3 py-1.5 focus:outline-none">
              <option value={10}>10</option><option value={25}>25</option><option value={50}>50</option>
            </select>
            <span>entries</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            {/* Date Filters */}
            <div className="flex items-center gap-2 bg-[#0b1221] border border-gray-700 rounded-lg px-3 py-1.5 w-full sm:w-auto">
              <Calendar size={16} className="text-[#eab308]" />
              <input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-transparent text-gray-200 outline-none text-xs sm:text-sm"
              />
              <span className="text-gray-500">to</span>
              <input 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-transparent text-gray-200 outline-none text-xs sm:text-sm"
              />
            </div>

            {/* Search Box */}
            <div className="relative w-full sm:w-64">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <Search size={16} className="text-gray-500" />
               </div>
               <input 
                 type="text" 
                 placeholder="Search details..." 
                 value={search} 
                 onChange={(e) => setSearch(e.target.value)} 
                 className="bg-[#0b1221] border border-gray-700 text-gray-200 rounded px-3 py-1.5 pl-9 w-full focus:outline-none focus:border-[#eab308]" 
               />
            </div>
          </div>

        </div>

        {/* Table Container */}
        <div className="overflow-x-auto border border-gray-700 rounded-lg">
          <table className="w-full text-left whitespace-nowrap border-collapse">
            <thead className="text-[#eab308] bg-[#1a253e] text-sm border-b border-gray-700">
              <tr>
                <th className="p-4 border-r border-gray-700/50 font-bold text-center w-16">Sr. <span className="text-[10px] text-gray-500 ml-1">♦</span></th>
                <th className="p-4 border-r border-gray-700/50 font-bold text-center">Date <span className="text-[10px] text-gray-500 ml-1">♦</span></th>
                <th className="p-4 border-r border-gray-700/50 font-bold text-center">Income Type <span className="text-[10px] text-gray-500 ml-1">♦</span></th>
                <th className="p-4 border-r border-gray-700/50 font-bold">Description <span className="text-[10px] text-gray-500 ml-1">♦</span></th>
                <th className="p-4 font-bold text-center">Amount</th>
              </tr>
            </thead>
            
            <tbody className="text-gray-300 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-[#eab308]">
                    <div className="animate-spin h-8 w-8 mx-auto mb-3 border-4 border-t-transparent border-[#eab308] rounded-full"></div>
                    Loading Records...
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-gray-500">
                    No records found for selected filters.
                  </td>
                </tr>
              ) : (
                paginated.map((txn, idx) => {
                  const date = new Date(txn.createdAt || txn.date);
                  const isLevel = txn.type === "daily_level_income";
                  
                  return (
                    <tr key={txn._id || idx} className="border-b border-gray-700 hover:bg-[#1a253e] transition-colors">
                      <td className="p-4 border-r border-gray-700/50 text-center font-medium">
                        {indexOfFirst + idx + 1}
                      </td>
                      <td className="p-4 border-r border-gray-700/50 text-center font-medium">
                        {date.toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="p-4 border-r border-gray-700/50 text-center">
                        {isLevel ? (
                           <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-1 rounded text-xs font-bold tracking-wider">Level ROI</span>
                        ) : (
                           <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-1 rounded text-xs font-bold tracking-wider">Self ROI</span>
                        )}
                      </td>
                      <td className="p-4 border-r border-gray-700/50 font-medium text-white max-w-[300px] truncate" title={txn.description}>
                        {txn.description}
                      </td>
                      <td className="p-4 font-bold text-center text-green-400">
                        + ${Number(txn.amount).toFixed(2)}
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

export default RoiIncome;