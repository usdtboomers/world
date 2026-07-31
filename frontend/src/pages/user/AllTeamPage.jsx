import React, { useEffect, useState, useMemo } from "react";
import api from "../../api/axios"; 
import useAuth from "../../hooks/useAuth"; 

const AllTeamPage = () => {
  const { user } = useAuth();
  const [team, setTeam] = useState([]);
  const [stats, setStats] = useState({
    totalTeam: 0,
    activeTeam: 0
  });
  
  const [search, setSearch] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "desc" });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.userId) return;

    const fetchAllTeam = async () => {
      setIsLoading(true); 
      try {
        const res = await api.get(`/user/all-team/${user.userId}?t=${new Date().getTime()}`);
        
        let teamData = (res.data.team || []).filter(u => u.level > 0);
        setTeam(teamData);
        
        setStats({
          totalTeam: teamData.length,
          activeTeam: teamData.filter(u => u.topUpAmount > 0).length
        });
      } catch (err) {
        console.error("Error fetching all team:", err);
      } finally {
        setIsLoading(false); 
      }
    };
    fetchAllTeam();
  }, [user?.userId]);

  const sortedAndFilteredTeam = useMemo(() => {
    let filtered = team.filter(
      (u) =>
        u.userId?.toString().toLowerCase().includes(search.toLowerCase()) ||
        u.name?.toLowerCase().includes(search.toLowerCase())
    );

    return filtered.sort((a, b) => {
      if (!sortConfig.key) return 0;
      let aValue = a[sortConfig.key] || "";
      let bValue = b[sortConfig.key] || "";
      
      if (typeof aValue === "string") aValue = aValue.toLowerCase();
      if (typeof bValue === "string") bValue = bValue.toLowerCase();
      
      if (sortConfig.key === "createdAt") {
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
      }
      
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [team, search, sortConfig]);

  const indexOfLast = currentPage * entriesPerPage;
  const indexOfFirst = indexOfLast - entriesPerPage;
  const currentItems = sortedAndFilteredTeam.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedAndFilteredTeam.length / entriesPerPage) || 1;

  const handleNext = () => currentPage < totalPages && setCurrentPage(prev => prev + 1);
  const handlePrev = () => currentPage > 1 && setCurrentPage(prev => prev - 1);
  const handleEntriesChange = (e) => {
    setEntriesPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    if (!key) return; 
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const tableColumns = [
    { label: "#", key: null },
    { label: "Date", key: "createdAt" },
    { label: "Level", key: "level" },
    { label: "User ID", key: "userId" },
    { label: "Name", key: "name" },
    { label: "Country", key: "country" },
  ];

  return (
    <div className="w-full min-h-screen bg-[#0b1221] p-4 md:p-8 font-sans">
      
      {/* Inner Card Container */}
      <div className="max-w-7xl mx-auto bg-[#131c31] rounded-xl border-t-[3px] border-[#eab308] shadow-2xl p-4 sm:p-6">
        
        {/* Header Title */}
        <h2 className="text-2xl sm:text-3xl text-[#eab308] font-bold mb-6 tracking-wide">
          All Team Report
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
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="bg-[#0b1221] border border-gray-700 text-gray-200 rounded px-3 py-1.5 w-full sm:w-64 focus:outline-none focus:border-[#eab308] transition-colors placeholder-gray-500"
              placeholder="Search by ID or Name..."
            />
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto border border-gray-700 rounded-lg">
          <table className="w-full text-left whitespace-nowrap border-collapse">
            <thead className="text-[#eab308] bg-[#1a253e] text-sm border-b border-gray-700">
              <tr>
                {tableColumns.map((col) => (
                  <th
                    key={col.label}
                    onClick={() => handleSort(col.key)}
                    className={`p-4 border-r border-gray-700/50 font-bold ${col.key ? 'cursor-pointer select-none hover:text-yellow-400' : ''}`}
                  >
                    {col.label}
                    {col.key && (
                      <span className="text-[10px] text-gray-500 ml-1">
                        {sortConfig.key === col.key 
                          ? (sortConfig.direction === "asc" ? "▲" : "▼") 
                          : "♦"}
                      </span>
                    )}
                    {!col.key && <span className="text-[10px] text-gray-500 ml-1">♦</span>}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="text-gray-300 text-sm">
              {isLoading ? (
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
                currentItems.map((u, index) => (
                  <tr key={u._id || index} className="border-b border-gray-700 hover:bg-[#1a253e] transition-colors">
                    <td className="p-4 border-r border-gray-700/50">{indexOfFirst + index + 1}</td>
                    <td className="p-4 border-r border-gray-700/50">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-GB") : "-"}
                    </td>
                    <td className="p-4 border-r border-gray-700/50 font-semibold text-[#eab308]">
                      L-{u.level}
                    </td>
                    <td className="p-4 border-r border-gray-700/50 font-medium text-white">
                      {u.userId}
                    </td>
                    <td className="p-4 border-r border-gray-700/50">
                      {u.name || "-"}
                    </td>
                    <td className="p-4">
                      {u.country || "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 text-gray-400 text-sm gap-4">
          <div>
            Showing <span className="text-white font-medium">{sortedAndFilteredTeam.length === 0 ? 0 : indexOfFirst + 1}</span> to <span className="text-white font-medium">{Math.min(indexOfLast, sortedAndFilteredTeam.length)}</span> of <span className="text-white font-medium">{sortedAndFilteredTeam.length}</span> entries
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

export default AllTeamPage;