import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { getUserId } from "../../utils/authUtils";
import { Search, DollarSign, ChevronLeft, ChevronRight, UserCircle } from "lucide-react";

const DirectIncome = () => {
  const userId = getUserId();
  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    // API directly sirf direct_income filter karke hi laa rahi hai
    api.get(`/transaction/transactions/${userId}?type=direct_income&t=${new Date().getTime()}`)
      .then((res) => {
        // Strict filter hataya hua hai
        const sorted = (res.data || [])
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          
        setTransactions(sorted);
        setFiltered(sorted);
      })
      .catch((err) => {
        console.error("Failed to fetch direct income", err);
        setTransactions([]);
        setFiltered([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId]);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    setCurrentPage(1);
    if (!value) return setFiltered(transactions);

    const result = transactions.filter(
      (txn) =>
        txn.description?.toLowerCase().includes(value) ||
        String(txn.fromUserId).toLowerCase().includes(value)
    );
    setFiltered(result);
  };

  const handleEntriesChange = (e) => {
    setEntriesPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filtered.length / entriesPerPage) || 1;
  const indexOfLast = currentPage * entriesPerPage;
  const indexOfFirst = indexOfLast - entriesPerPage;
  const paginated = filtered.slice(indexOfFirst, indexOfLast);

  const handlePrev = () => currentPage > 1 && setCurrentPage(p => p - 1);
  const handleNext = () => currentPage < totalPages && setCurrentPage(p => p + 1);

  return (
    <div className="w-full min-h-screen bg-[#0b1221] p-4 md:p-8 font-sans">
      
      {/* Inner Card Container */}
      <div className="max-w-7xl mx-auto bg-[#131c31] rounded-xl border-t-[3px] border-[#eab308] shadow-2xl p-4 sm:p-6">
        
        {/* Header Title */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl text-[#eab308] font-bold tracking-wide flex items-center gap-3">
             Direct Income
          </h2>
        </div>

        {/* Filters (Entries & Search) */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 text-gray-300 text-sm">
          
          <div className="flex items-center gap-2">
            <span>Show</span>
            <select
              value={entriesPerPage}
              onChange={handleEntriesChange}
              className="bg-[#0b1221] border border-gray-700 text-[#eab308] rounded px-3 py-1.5 focus:outline-none focus:border-[#eab308] transition-colors"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>entries</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span>Search:</span>
            <div className="relative w-full sm:w-64">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <Search size={16} className="text-gray-500" />
               </div>
               <input
                 type="text"
                 placeholder="Search User ID or details..."
                 value={search}
                 onChange={handleSearch}
                 className="bg-[#0b1221] border border-gray-700 text-gray-200 rounded px-3 py-1.5 pl-9 w-full focus:outline-none focus:border-[#eab308] transition-colors placeholder-gray-500"
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
                <th className="p-4 border-r border-gray-700/50 font-bold">From User <span className="text-[10px] text-gray-500 ml-1">♦</span></th>
                <th className="p-4 border-r border-gray-700/50 font-bold text-center">Package <span className="text-[10px] text-gray-500 ml-1">♦</span></th>
                <th className="p-4 border-r border-gray-700/50 font-bold text-center">Income <span className="text-[10px] text-gray-500 ml-1">♦</span></th>
                <th className="p-4 font-bold">Description</th>
              </tr>
            </thead>
            
            <tbody className="text-gray-300 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-[#eab308]">
                    <div className="animate-spin h-8 w-8 mx-auto mb-3 border-4 border-t-transparent border-[#eab308] rounded-full"></div>
                    Loading Records...
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-gray-500">
                    No Direct Income Records Found
                  </td>
                </tr>
              ) : (
                paginated.map((txn, idx) => {
                  const date = new Date(txn.createdAt);
                  
                  // 🔥 PACKAGE FIX: Agar package value database me nahi hai, toh Income * 10 kar lega (Kyunki Direct Income 10% hoti hai)
                  const packageAmount = Number(txn.package) > 0 
                    ? Number(txn.package) 
                    : Number(txn.amount) * 10;
                  
                  // 🔥 LEADER TEXT FIX: Description se "(Leader)" word ko clean kar dega
                  const cleanDescription = txn.description 
                    ? txn.description.replace(/\s*\(Leader\)/gi, "") 
                    : "Direct income";

                  return (
                    <tr key={txn._id || idx} className="border-b border-gray-700 hover:bg-[#1a253e] transition-colors">
                      
                      {/* Sr No */}
                      <td className="p-4 border-r border-gray-700/50 text-center font-medium">
                        {indexOfFirst + idx + 1}
                      </td>
                      
                      {/* Date (Time Removed) */}
                      <td className="p-4 border-r border-gray-700/50 text-center font-medium">
                        {date.toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>

                      {/* From User */}
                      <td className="p-4 border-r border-gray-700/50 font-medium text-white">
                        <div className="flex items-center gap-2">
                          <UserCircle className="text-[#eab308]" size={16} /> 
                          {txn.fromUserId || "N/A"}
                        </div>
                      </td>

                      {/* Package */}
                      <td className="p-4 border-r border-gray-700/50 text-center">
                        <span className="inline-flex items-center justify-center bg-[#eab308]/10 text-[#eab308] border border-[#eab308]/20 px-2 py-1 rounded text-xs font-bold tracking-wider">
                          ${packageAmount.toFixed(2)}
                        </span>
                      </td>

                      {/* Income Amount */}
                      <td className="p-4 border-r border-gray-700/50 font-bold text-center text-green-400">
                        + ${Number(txn.amount).toFixed(2)}
                      </td>

                      {/* Description */}
                      <td className="p-4 text-gray-400 text-xs capitalize truncate max-w-[200px]" title={cleanDescription}>
                        {cleanDescription}
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {!loading && filtered.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 text-gray-400 text-sm gap-4">
            <div>
              Showing <span className="text-white font-medium">{indexOfFirst + 1}</span> to <span className="text-white font-medium">{Math.min(indexOfLast, filtered.length)}</span> of <span className="text-white font-medium">{filtered.length}</span> entries
            </div>
            
            <div className="flex items-center bg-[#0b1221] rounded border border-gray-700 overflow-hidden">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className={`px-4 py-2 transition-colors ${currentPage === 1 ? 'text-gray-600 bg-transparent cursor-not-allowed' : 'text-[#eab308] hover:bg-[#1a253e]'}`}
              >
                Previous
              </button>
              <div className="px-4 py-2 border-l border-r border-gray-700 bg-[#1a253e] text-[#eab308] font-bold">
                {currentPage}
              </div>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages || totalPages === 0}
                className={`px-4 py-2 transition-colors ${currentPage === totalPages || totalPages === 0 ? 'text-gray-600 bg-transparent cursor-not-allowed' : 'text-[#eab308] hover:bg-[#1a253e]'}`}
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

export default DirectIncome;