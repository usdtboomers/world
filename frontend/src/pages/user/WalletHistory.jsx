import React, { useEffect, useState, useMemo } from "react"; 
import api from "../../api/axios"; 
import { useAuth } from "../../context/AuthContext"; 

const WalletHistoryPage = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [balances, setBalances] = useState({ walletBalance: 0, usdtBep20Balance: 0 });
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWalletHistory = async () => {
      if (!user?.userId) return;

      try {
        setLoading(true);
        // Tumhare backend route ke hisaab se API call
        const res = await api.get(
          `/wallet/history/${user.userId}?t=${new Date().getTime()}`
        );
        
        setTransactions(res.data.history || []);
        setBalances(res.data.balances || { walletBalance: 0, usdtBep20Balance: 0 });

      } catch (err) {
        console.error("Error fetching wallet history:", err);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWalletHistory();
  }, [user?.userId]);

  // Search Logic (Type ya Description ke basis par)
  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    return transactions.filter((tx) =>
      tx.type?.toLowerCase().includes(s) ||
      tx.description?.toLowerCase().includes(s) ||
      String(tx.amount).includes(s)
    );
  }, [transactions, search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // Pagination Logic
  const indexOfLast = currentPage * entriesPerPage;
  const indexOfFirst = indexOfLast - entriesPerPage;
  const currentItems = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / entriesPerPage) || 1;

  const handlePrev = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const handleEntriesChange = (e) => {
    setEntriesPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // IST Date Formatter
  const getISTDateTimeString = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true
    });
  };

  return (
    <div className="w-full min-h-screen bg-[#0b1221] p-4 md:p-8 font-sans pt-24">
      {/* Balances Top Cards (Optional for Wallet, but looks premium) */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-4 mb-6">
        <div className="bg-[#131c31] border border-gray-700 rounded-xl p-5 flex-1 shadow-lg border-l-4 border-l-[#eab308]">
          <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Fund Wallet Balance</h3>
          <p className="text-3xl font-black text-white">${Number(balances.walletBalance).toFixed(4)}</p>
        </div>
      </div>

      {/* Inner Card Container with Gold Top Border */}
      <div className="max-w-7xl mx-auto bg-[#131c31] rounded-xl border-t-[3px] border-[#eab308] shadow-2xl p-4 sm:p-6">
        
        {/* Header Title */}
        <h2 className="text-2xl sm:text-3xl text-[#eab308] font-bold mb-6 tracking-wide">
          Wallet History
        </h2>

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
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-[#0b1221] border border-gray-700 text-gray-200 rounded px-3 py-1.5 w-full sm:w-64 focus:outline-none focus:border-[#eab308] transition-colors placeholder-gray-500"
              placeholder="Search by type or description..."
            />
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto border border-gray-700 rounded-lg">
          <table className="w-full text-left whitespace-nowrap border-collapse">
            <thead className="text-[#eab308] bg-[#1a253e] text-sm border-b border-gray-700">
              <tr>
                <th className="p-4 border-r border-gray-700/50 font-bold"># <span className="text-[10px] text-gray-500 ml-1">♦</span></th>
                <th className="p-4 border-r border-gray-700/50 font-bold">Transaction Type <span className="text-[10px] text-gray-500 ml-1">♦</span></th>
                <th className="p-4 border-r border-gray-700/50 font-bold">Description <span className="text-[10px] text-gray-500 ml-1">♦</span></th>
                <th className="p-4 border-r border-gray-700/50 font-bold">Status <span className="text-[10px] text-gray-500 ml-1">♦</span></th>
                <th className="p-4 border-r border-gray-700/50 font-bold text-right">Amount <span className="text-[10px] text-gray-500 ml-1">♦</span></th>
                <th className="p-4 font-bold">Date (IST)</th>
              </tr>
            </thead>

            <tbody className="text-gray-300 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-[#eab308]">
                    Loading Data...
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500">
                    No matching records found
                  </td>
                </tr>
              ) : (
                currentItems.map((tx, index) => {
                  // Credit/Debit UI Logic
                  const isCredit = ['deposit', 'credit_to_wallet', 'credit', 'topup', 'manual_credit', 'fast_track'].includes(tx.type);
                  const isDebit = ['withdrawal', 'debit_topup', 'manual_debit'].includes(tx.type);
                  
                  let amountColor = 'text-white';
                  let prefix = '';

                  if (isCredit) { amountColor = 'text-green-400'; prefix = '+'; }
                  else if (isDebit) { amountColor = 'text-red-400'; prefix = '-'; }

                  return (
                    <tr key={tx._id || index} className="border-b border-gray-700 hover:bg-[#1a253e] transition-colors">
                      <td className="p-4 border-r border-gray-700/50">{indexOfFirst + index + 1}</td>
                      <td className="p-4 border-r border-gray-700/50 capitalize font-medium text-white">
                        {tx.type ? tx.type.replace(/_/g, ' ') : 'Transaction'}
                      </td>
                      <td className="p-4 border-r border-gray-700/50 truncate max-w-xs" title={tx.description}>
                        {tx.description || "-"}
                      </td>
                      <td className="p-4 border-r border-gray-700/50 capitalize font-medium">
                        <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${
                          tx.status === 'success' || tx.status === 'completed' 
                            ? 'bg-green-500/10 text-green-400' 
                            : tx.status === 'pending' 
                            ? 'bg-yellow-500/10 text-yellow-400'
                            : 'bg-red-500/10 text-red-400'
                        }`}>
                          {tx.status || 'Success'}
                        </span>
                      </td>
                      <td className={`p-4 border-r border-gray-700/50 font-bold text-right ${amountColor}`}>
                        {prefix}${Number(tx.amount || 0).toFixed(4)}
                      </td>
                      <td className="p-4 text-gray-400 text-xs">
                        {getISTDateTimeString(tx.createdAt || tx.date)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 text-gray-400 text-sm gap-4">
          <div>
            Showing <span className="text-white font-medium">{filtered.length === 0 ? 0 : indexOfFirst + 1}</span> to <span className="text-white font-medium">{Math.min(indexOfLast, filtered.length)}</span> of <span className="text-white font-medium">{filtered.length}</span> entries
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

      </div>
    </div>
  );
};

export default WalletHistoryPage;