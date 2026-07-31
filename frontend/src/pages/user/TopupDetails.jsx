import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import { Search, ChevronLeft, ChevronRight, ArrowUpRight, ArrowDownLeft, RefreshCcw, CheckCircle2, User, Calendar } from "lucide-react";

const TopupDetails = () => {
  const { user } = useAuth();
  const [topups, setTopups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // 🔥 HELPER: Decimal128 ko normal number me convert karne ke liye taaki NaN na aaye
  const getSafeAmount = (val) => {
    if (!val) return 0;
    if (val.$numberDecimal) return parseFloat(val.$numberDecimal);
    return parseFloat(val) || 0;
  };

  useEffect(() => {
    const fetchTopups = async () => {
      if (!user?.userId) {
        setLoading(false);
        setError("User not found. Please log in.");
        return;
      }

      try {
        setLoading(true);
        const res = await api.get(`/wallet/topup-history/${user.userId}?t=${new Date().getTime()}`);
        
        if (Array.isArray(res.data)) {
          const userTopups = res.data.filter((t) => {
            const typeStr = (t.type || "").toLowerCase();
            const sourceStr = (t.source || "").toLowerCase();
            const descStr = (t.description || "").toUpperCase();
            
            const isTopupRelated = 
              typeStr.includes("topup") || 
              sourceStr.includes("topup") || 
              typeStr.includes("activation") || 
              typeStr.includes("package");
              
            const isNotPromo = !descStr.includes("PROMOTION");
            
            return isTopupRelated && isNotPromo;
          });

          const uniqueTopups = Array.from(
            new Map(userTopups.map((t) => [`${t._id}-${t.createdAt}`, t])).values()
          );

          uniqueTopups.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));

          setTopups(uniqueTopups);
        } else {
          setTopups([]);
        }
      } catch (err) {
        console.error("Topup fetch error:", err);
        setError(err.response?.data?.message || "Failed to load top-ups.");
      } finally {
        setLoading(false);
      }
    };

    fetchTopups();
  }, [user]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); 
  };

  const filteredTopups = topups.filter((t) => {
    const searchLower = searchQuery.toLowerCase();
    const senderIdStr = (t.fromUserId || t.userId || "").toString().toLowerCase();
    const receiverIdStr = (t.toUserId || t.userId || "").toString().toLowerCase();
    const descStr = (t.description || "").toLowerCase();
    const amountStr = getSafeAmount(t.amount || t.grossAmount).toString().toLowerCase();

    return (
      senderIdStr.includes(searchLower) ||
      receiverIdStr.includes(searchLower) ||
      descStr.includes(searchLower) ||
      amountStr.includes(searchLower)
    );
  });

  const totalPages = Math.ceil(filteredTopups.length / rowsPerPage) || 1;
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredTopups.slice(indexOfFirstRow, indexOfLastRow);

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handlePrev = () => currentPage > 1 && setCurrentPage(prev => prev - 1);
  const handleNext = () => currentPage < totalPages && setCurrentPage(prev => prev + 1);

  return (
    <div className="w-full min-h-screen bg-[#0b1221] p-4 md:p-8 font-sans">
      
      {/* Inner Card Container */}
      <div className="max-w-7xl mx-auto bg-[#131c31] rounded-xl border-t-[3px] border-[#eab308] shadow-2xl p-4 sm:p-6">
        
        {/* Header Title */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl text-[#eab308] font-bold tracking-wide flex items-center gap-3">
             <RefreshCcw className="text-[#eab308]" size={28} /> Package Details
          </h2>
         
        </div>

        {/* Filters (Search & Entries) */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 text-gray-300 text-sm">
          
          <div className="flex items-center gap-2">
            <span>Show</span>
            <select
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              className="bg-[#0b1221] border border-gray-700 text-[#eab308] rounded px-3 py-1.5 focus:outline-none focus:border-[#eab308] transition-colors"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
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
                 placeholder="Search ID, details..."
                 value={searchQuery}
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
                <th className="p-4 border-r border-gray-700/50 font-bold text-center">Sr.</th>
                <th className="p-4 border-r border-gray-700/50 font-bold text-center">Date & Time</th>
                <th className="p-4 border-r border-gray-700/50 font-bold">Action Type</th>
                <th className="p-4 border-r border-gray-700/50 font-bold">Sender</th>
                <th className="p-4 border-r border-gray-700/50 font-bold">Receiver</th>
                <th className="p-4 border-r border-gray-700/50 font-bold text-center">Amount</th>
                <th className="p-4 font-bold">Details</th>
              </tr>
            </thead>

            <tbody className="text-gray-300 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-[#eab308]">
                     <div className="flex flex-col items-center justify-center">
                       <RefreshCcw className="animate-spin mb-2" size={24} />
                       Loading History...
                     </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-red-400 bg-red-900/10">
                     {error}
                  </td>
                </tr>
              ) : currentRows.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500">
                    No package Records Found
                  </td>
                </tr>
              ) : (
                currentRows.map((t, idx) => {
                  
                  const currentUserId = String(user?.userId || "");
                  let senderId = t.fromUserId ? String(t.fromUserId) : String(t.userId);
                  let receiverId = t.toUserId ? String(t.toUserId) : String(t.userId);
                  const isDebitTransaction = t.type?.toLowerCase().includes("debit") || Number(getSafeAmount(t.amount)) < 0;

                  if (isDebitTransaction && !t.toUserId) {
                      senderId = currentUserId; 
                      const descMatch = t.description?.match(/(?:for|user|to|#|-)\s*([0-9]{4,10})/i);
                      if (descMatch && descMatch[1]) {
                          receiverId = descMatch[1];
                      } else {
                          receiverId = "Team Member";
                      }
                  }

                  let tagDetails = { icon: null, text: "", style: "" };

                  if (senderId === currentUserId && receiverId === currentUserId) {
                    tagDetails = { icon: <CheckCircle2 size={12}/>, text: "SELF ACTIVATION", style: "bg-green-500/10 text-green-400 border-green-500/20" };
                  } else if (senderId === currentUserId && receiverId !== currentUserId) {
                    tagDetails = { icon: <ArrowUpRight size={12}/>, text: "ACTIVATED FOR TEAM", style: "bg-[#eab308]/10 text-[#eab308] border-[#eab308]/20" };
                  } else if (receiverId === currentUserId && senderId !== currentUserId) {
                    tagDetails = { icon: <ArrowDownLeft size={12}/>, text: "ACTIVATED BY UPLINE", style: "bg-blue-500/10 text-blue-400 border-blue-500/20" };
                  } else {
                    tagDetails = { icon: <CheckCircle2 size={12}/>, text: "ACTIVATED", style: "bg-gray-500/10 text-gray-400 border-gray-500/20" };
                  }

                  const recordDate = t.createdAt || t.date;
                  const finalAmount = getSafeAmount(t.amount || t.grossAmount);

                  return (
                    <tr
                      key={`${t._id}-${t.createdAt}-${idx}`}
                      className="border-b border-gray-700 hover:bg-[#1a253e] transition-colors"
                    >
                      <td className="p-4 border-r border-gray-700/50 text-center font-medium">
                        {indexOfFirstRow + idx + 1}
                      </td>
                      
                      {/* 🔥 TIME AND DATE ADDED */}
                      <td className="p-4 border-r border-gray-700/50 text-center">
                         <div className="flex flex-col items-center justify-center">
                           <span className="font-medium text-gray-200">
                             {recordDate ? format(new Date(recordDate), "dd MMM yyyy") : "N/A"}
                           </span>
                           <span className="text-[11px] text-gray-500">
                             {recordDate ? format(new Date(recordDate), "hh:mm a") : ""}
                           </span>
                         </div>
                      </td>

                      <td className="p-4 border-r border-gray-700/50">
                        <span className={`flex items-center gap-1.5 w-fit border py-1 px-2.5 rounded text-[10px] font-bold tracking-wider ${tagDetails.style}`}>
                          {tagDetails.icon} {tagDetails.text}
                        </span>
                      </td>

                      <td className="p-4 border-r border-gray-700/50 font-medium text-white">
                        <div className="flex items-center gap-2">
                           <div className="p-1 bg-[#0b1221] rounded-full text-gray-500 border border-gray-700"><User size={12}/></div>
                           {senderId === currentUserId ? (
                             <span className="text-[#eab308]">#{senderId} <span className="text-[9px] bg-[#eab308]/20 text-[#eab308] px-1.5 py-0.5 rounded ml-1">YOU</span></span>
                           ) : (
                             <span>{senderId.includes("Team") ? senderId : `#${senderId}`}</span>
                           )}
                        </div>
                      </td>

                      <td className="p-4 border-r border-gray-700/50 font-medium text-white">
                        <div className="flex items-center gap-2">
                           <div className="p-1 bg-[#0b1221] rounded-full text-gray-500 border border-gray-700"><User size={12}/></div>
                           {receiverId === currentUserId ? (
                             <span className="text-[#eab308]">#{receiverId} <span className="text-[9px] bg-[#eab308]/20 text-[#eab308] px-1.5 py-0.5 rounded ml-1">YOU</span></span>
                           ) : (
                             <span>{receiverId.includes("Team") ? receiverId : `#${receiverId}`}</span>
                           )}
                        </div>
                      </td>

                      {/* 🔥 AMOUNT FIX APPLIED */}
                      <td className="p-4 border-r border-gray-700/50 font-bold text-center text-[#eab308]">
                         ${Math.abs(finalAmount).toFixed(2)}
                      </td>

                      <td className="p-4 text-gray-400 text-xs truncate max-w-[200px]" title={t.description || "Top-up package"}>
                        {t.description || "Top-up package"}
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {!loading && filteredTopups.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 text-gray-400 text-sm gap-4">
            <div>
              Showing <span className="text-white font-medium">{indexOfFirstRow + 1}</span> to <span className="text-white font-medium">{Math.min(indexOfLastRow, filteredTopups.length)}</span> of <span className="text-white font-medium">{filteredTopups.length}</span> entries
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

export default TopupDetails;