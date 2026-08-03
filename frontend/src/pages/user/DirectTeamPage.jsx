// import React, { useEffect, useState, useMemo } from "react"; 
// import api from "../../api/axios"; 
// import { useAuth } from "../../context/AuthContext"; 

// const DirectTeamPage = () => {
//   const { user } = useAuth();
//   const [team, setTeam] = useState([]);
//   const [search, setSearch] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [entriesPerPage, setEntriesPerPage] = useState(10);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchDirectTeam = async () => {
//       if (!user?.userId) return;

//       try {
//         setLoading(true);
//         const res = await api.get(
//           `/user/direct-team/${user.userId}?t=${new Date().getTime()}`
//         );
        
//         const teamData = Array.isArray(res.data.team) ? res.data.team : [];
//         setTeam(teamData);

//       } catch (err) {
//         console.error("Error fetching direct team:", err);
//         setTeam([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDirectTeam();
//   }, [user?.userId]);


//   // useEffect(() => {
//   //   const fetchDirectTeam = async () => {
//   //     // Dhyan dena: check karna AuthContext mein 'userId' hai ya '_id'
//   //     if (!user?.userId) return; 

//   //     try {
//   //       setLoading(true);
//   //       const res = await api.get(
//   //         `/user/direct-team/${user.userId}?t=${new Date().getTime()}`
//   //       );
        
//   //       // 🚨 CHROME CONSOLE MEIN YE LINE CHECK KARNA (F12 dabake)
//   //       console.log("Direct Team API Response:", res.data); 

//   //       // Backend kis format mein array bhej raha hai usko auto-handle karne ke liye:
//   //       let teamData = [];
//   //       if (Array.isArray(res.data)) {
//   //         teamData = res.data; // Agar direct array aa raha hai
//   //       } else if (Array.isArray(res.data.team)) {
//   //         teamData = res.data.team; // Agar res.data.team mein hai
//   //       } else if (Array.isArray(res.data.data)) {
//   //         teamData = res.data.data; // Agar res.data.data mein hai
//   //       } else if (Array.isArray(res.data.directs)) {
//   //         teamData = res.data.directs; 
//   //       }

//   //       setTeam(teamData);

//   //     } catch (err) {
//   //       console.error("Error fetching direct team:", err);
//   //       setTeam([]);
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };

//   //   fetchDirectTeam();
//   // }, [user?.userId]);

//   // Search Logic
//   const filtered = useMemo(() => {
//     const s = search.toLowerCase();
//     return team.filter((u) =>
//       u.userId?.toString().includes(s) ||
//       u.name?.toLowerCase().includes(s)
//     );
//   }, [team, search]);

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [search]);

//   // Pagination Logic
//   const indexOfLast = currentPage * entriesPerPage;
//   const indexOfFirst = indexOfLast - entriesPerPage;
//   const currentItems = filtered.slice(indexOfFirst, indexOfLast);
//   const totalPages = Math.ceil(filtered.length / entriesPerPage) || 1;

//   const handlePrev = () => currentPage > 1 && setCurrentPage(currentPage - 1);
//   const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
//   const handleEntriesChange = (e) => {
//     setEntriesPerPage(Number(e.target.value));
//     setCurrentPage(1);
//   };

//   return (
//     <div className="w-full min-h-screen bg-[#0b1221] p-4 md:p-8 font-sans">
//       {/* Main Background - Dark Navy */}
      
//       {/* Inner Card Container with Gold Top Border */}
//       <div className="max-w-7xl mx-auto bg-[#131c31] rounded-xl border-t-[3px] border-[#eab308] shadow-2xl p-4 sm:p-6">
        
//         {/* Header Title */}
//         <h2 className="text-2xl sm:text-3xl text-[#eab308] font-bold mb-6 tracking-wide">
//           Direct Team Report
//         </h2>

//         {/* Filters (Entries & Search) */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 text-gray-300 text-sm">
          
//           <div className="flex items-center gap-2">
//             <span>Show</span>
//             <select
//               value={entriesPerPage}
//               onChange={handleEntriesChange}
//               className="bg-[#0b1221] border border-gray-700 text-[#eab308] rounded px-3 py-1.5 focus:outline-none focus:border-[#eab308] transition-colors"
//             >
//               <option value={10}>10</option>
//               <option value={25}>25</option>
//               <option value={50}>50</option>
//               <option value={100}>100</option>
//             </select>
//             <span>entries</span>
//           </div>

//           <div className="flex items-center gap-2 w-full sm:w-auto">
//             <span>Search:</span>
//             <input
//               type="text"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="bg-[#0b1221] border border-gray-700 text-gray-200 rounded px-3 py-1.5 w-full sm:w-64 focus:outline-none focus:border-[#eab308] transition-colors placeholder-gray-500"
//               placeholder="Search by ID or Name..."
//             />
//           </div>
//         </div>

//         {/* Table Container */}
//         <div className="overflow-x-auto border border-gray-700 rounded-lg">
//           <table className="w-full text-left whitespace-nowrap border-collapse">
//             <thead className="text-[#eab308] bg-[#1a253e] text-sm border-b border-gray-700">
//               <tr>
//                 <th className="p-4 border-r border-gray-700/50 font-bold cursor-pointer"># <span className="text-[10px] text-gray-500 ml-1">♦</span></th>
//                 <th className="p-4 border-r border-gray-700/50 font-bold cursor-pointer">Member ID <span className="text-[10px] text-gray-500 ml-1">♦</span></th>
//                  <th className="p-4 border-r border-gray-700/50 font-bold cursor-pointer">Name <span className="text-[10px] text-gray-500 ml-1">♦</span></th>
//                 <th className="p-4 border-r border-gray-700/50 font-bold cursor-pointer">Amount <span className="text-[10px] text-gray-500 ml-1">♦</span></th>
//                  <th className="p-4 border-r border-gray-700/50 font-bold cursor-pointer">Status <span className="text-[10px] text-gray-500 ml-1">♦</span></th>
//                 <th className="p-4 font-bold cursor-pointer">Activation Date</th>
//               </tr>
//             </thead>

//             <tbody className="text-gray-300 text-sm">
//               {loading ? (
//                 <tr>
//                   <td colSpan="8" className="text-center py-8 text-[#eab308]">
//                     Loading Data...
//                   </td>
//                 </tr>
//               ) : currentItems.length === 0 ? (
//                 <tr>
//                   <td colSpan="8" className="text-center py-8 text-gray-500">
//                     No matching records found
//                   </td>
//                 </tr>
//               ) : (
//                 currentItems.map((member, index) => {
//                   const isActive = Number(member.topUpAmount) > 0;
//                   const displayAmount = isActive ? `$${member.topUpAmount}` : `$0`;
//                   const status = isActive ? 'active' : 'pending';
//                   const statusColor = isActive ? 'text-green-400' : 'text-red-400';

//                   return (
//                     <tr key={member._id || index} className="border-b border-gray-700 hover:bg-[#1a253e] transition-colors">
//                       <td className="p-4 border-r border-gray-700/50">{indexOfFirst + index + 1}</td>
//                       <td className="p-4 border-r border-gray-700/50 font-medium text-white">{member.userId}</td>
//                        <td className="p-4 border-r border-gray-700/50">{member.name || "-"}</td>
//                       <td className="p-4 border-r border-gray-700/50 font-semibold text-[#eab308]">{displayAmount}</td>
//                        <td className="p-4 border-r border-gray-700/50 capitalize font-medium">
//                         <span className={statusColor}>{status}</span>
//                       </td>
//                       <td className="p-4">
//                         {member.createdAt && isActive
//                           ? new Date(member.createdAt).toLocaleDateString("en-GB")
//                           : ""}
//                       </td>
//                     </tr>
//                   );
//                 })
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination Footer */}
//         <div className="flex flex-col sm:flex-row justify-between items-center mt-6 text-gray-400 text-sm gap-4">
//           <div>
//             Showing <span className="text-white font-medium">{filtered.length === 0 ? 0 : indexOfFirst + 1}</span> to <span className="text-white font-medium">{Math.min(indexOfLast, filtered.length)}</span> of <span className="text-white font-medium">{filtered.length}</span> entries
//           </div>
          
//           <div className="flex items-center bg-[#0b1221] rounded border border-gray-700 overflow-hidden">
//             <button
//               onClick={handlePrev}
//               disabled={currentPage === 1}
//               className={`px-4 py-2 transition-colors ${currentPage === 1 ? 'text-gray-600 bg-transparent cursor-not-allowed' : 'text-[#eab308] hover:bg-[#1a253e]'}`}
//             >
//               Previous
//             </button>
//             <div className="px-4 py-2 border-l border-r border-gray-700 bg-[#1a253e] text-[#eab308] font-bold">
//               {currentPage}
//             </div>
//             <button
//               onClick={handleNext}
//               disabled={currentPage === totalPages || totalPages === 0}
//               className={`px-4 py-2 transition-colors ${currentPage === totalPages || totalPages === 0 ? 'text-gray-600 bg-transparent cursor-not-allowed' : 'text-[#eab308] hover:bg-[#1a253e]'}`}
//             >
//               Next
//             </button>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default DirectTeamPage;
















import React, { useEffect, useState, useMemo } from "react"; 
import api from "../../api/axios"; 
import { useAuth } from "../../context/AuthContext"; 

const DirectTeamPage = () => {
  const { user } = useAuth();
  const [team, setTeam] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDirectTeam = async () => {
      if (!user?.userId) return;

      try {
        setLoading(true);
        const res = await api.get(
          `/user/direct-team/${user.userId}?t=${new Date().getTime()}`
        );
        
        const teamData = Array.isArray(res.data.team) ? res.data.team : [];
        setTeam(teamData);

      } catch (err) {
        console.error("Error fetching direct team:", err);
        setTeam([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDirectTeam();
  }, [user?.userId]);

  // Search Logic - Updated to include mobile number search
  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    return team.filter((u) =>
      u.userId?.toString().toLowerCase().includes(s) ||
      u.name?.toLowerCase().includes(s) ||
      u.mobile?.includes(s)
    );
  }, [team, search]);

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

  return (
    <div className="w-full min-h-screen bg-[#0b1221] p-4 md:p-8 font-sans">
      {/* Main Background - Dark Navy */}
      
      {/* Inner Card Container with Gold Top Border */}
      <div className="max-w-7xl mx-auto bg-[#131c31] rounded-xl border-t-[3px] border-[#eab308] shadow-2xl p-4 sm:p-6">
        
        {/* Header Title */}
        <h2 className="text-2xl sm:text-3xl text-[#eab308] font-bold mb-6 tracking-wide">
          Direct Team Report
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
              placeholder="Search by ID, Name or Mobile..."
            />
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto border border-gray-700 rounded-lg">
          <table className="w-full text-left whitespace-nowrap border-collapse">
            <thead className="text-[#eab308] bg-[#1a253e] text-sm border-b border-gray-700">
              <tr>
                <th className="p-4 border-r border-gray-700/50 font-bold cursor-pointer"># <span className="text-[10px] text-gray-500 ml-1">♦</span></th>
                <th className="p-4 border-r border-gray-700/50 font-bold cursor-pointer">Member ID <span className="text-[10px] text-gray-500 ml-1">♦</span></th>
                 <th className="p-4 border-r border-gray-700/50 font-bold cursor-pointer">Name <span className="text-[10px] text-gray-500 ml-1">♦</span></th>
                 {/* 🔥 Mobile Number Header */}
                 <th className="p-4 border-r border-gray-700/50 font-bold cursor-pointer">Mobile <span className="text-[10px] text-gray-500 ml-1">♦</span></th>
                <th className="p-4 border-r border-gray-700/50 font-bold cursor-pointer">Amount <span className="text-[10px] text-gray-500 ml-1">♦</span></th>
                 <th className="p-4 border-r border-gray-700/50 font-bold cursor-pointer">Status <span className="text-[10px] text-gray-500 ml-1">♦</span></th>
                <th className="p-4 font-bold cursor-pointer">Activation Date</th>
              </tr>
            </thead>

            <tbody className="text-gray-300 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-[#eab308]">
                    Loading Data...
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500">
                    No matching records found
                  </td>
                </tr>
              ) : (
                currentItems.map((member, index) => {
                  const isActive = Number(member.topUpAmount) > 0;
                  const displayAmount = isActive ? `$${member.topUpAmount}` : `$0`;
                  const status = isActive ? 'active' : 'pending';
                  const statusColor = isActive ? 'text-green-400' : 'text-red-400';

                  return (
                    <tr key={member._id || index} className="border-b border-gray-700 hover:bg-[#1a253e] transition-colors">
                      <td className="p-4 border-r border-gray-700/50">{indexOfFirst + index + 1}</td>
                      <td className="p-4 border-r border-gray-700/50 font-medium text-white">{member.userId}</td>
                       <td className="p-4 border-r border-gray-700/50">{member.name || "-"}</td>
                       
                       {/* 🔥 Mobile Number with Call Button */}
                       <td className="p-4 border-r border-gray-700/50">
                         {member.mobile ? (
                           <div className="flex items-center gap-3">
                             <span className="tracking-wide text-gray-300">{member.mobile}</span>
                             {/* Call Link using tel: scheme */}
                             <a 
                               href={`tel:${member.mobile}`}
                               className="flex items-center gap-1 bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/40 hover:border-green-400 px-2 py-1 rounded text-xs font-semibold transition-all duration-200"
                               title={`Call ${member.mobile}`}
                             >
                               📞 
                             </a>
                           </div>
                         ) : (
                           <span className="text-gray-500">-</span>
                         )}
                       </td>

                      <td className="p-4 border-r border-gray-700/50 font-semibold text-[#eab308]">{displayAmount}</td>
                       <td className="p-4 border-r border-gray-700/50 capitalize font-medium">
                        <span className={statusColor}>{status}</span>
                      </td>
                      <td className="p-4">
                        {member.createdAt && isActive
                          ? new Date(member.createdAt).toLocaleDateString("en-GB")
                          : ""}
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

export default DirectTeamPage;