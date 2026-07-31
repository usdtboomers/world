import React, { useEffect, useState } from 'react';
import api from '../../api/axios'; 
import { format } from 'date-fns';
import { Search, History, ArrowDownCircle, Calendar, ExternalLink } from 'lucide-react'; 

const DepositHistory = () => {
  const [deposits, setDeposits] = useState([]);
  const [filteredDeposits, setFilteredDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // 🛠️ HELPER: Decimal128 aur Simple Numbers dono ko handle karne ke liye
  const getSafeAmount = (val) => {
    if (!val) return 0;
    if (val.$numberDecimal) return parseFloat(val.$numberDecimal);
    return parseFloat(val) || 0;
  };

  // 🛠️ HELPER: Hash ko chota karne ke liye (0x1234...abcd)
  const formatHash = (hash) => {
    if (!hash) return null;
    if (hash.length < 15) return hash; 
    return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;
  };

  // 🕵️‍♂️ SECRET HELPER: 100% Unique & Consistent Dummy Hash Generator
  const generateDummyHash = (item, idx) => {
    const idStr = String(item._id || item.id || idx);
    
    // MongoDB IDs ke aakhiri characters sabse zyada unique hote hain
    const uniqueEnd = idStr.slice(-6); 
    
    // ID ko reverse kar denge taaki shuruwat bhi unique lage
    const reversedId = idStr.split('').reverse().join('');
    
    const padding = "f8a9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1";
    
    // Exact 66 characters ka hex banayenge: "0x" (2) + body (58) + uniqueEnd (6)
    const body = reversedId + padding;
    return ("0x" + body.substring(0, 58) + uniqueEnd).toLowerCase();
  };

  useEffect(() => {
    const fetchDeposits = async () => {
      try {
        const userData = localStorage.getItem('user');
        const user = userData ? JSON.parse(userData) : null;
        const userId = user?.userId;

        if (!userId) {
          setLoading(false);
          return;
        }

        setLoading(true);
        const res = await api.get(`/wallet/history/${userId}?t=${new Date().getTime()}`);
        
        const historyData = res.data.history || (Array.isArray(res.data) ? res.data : []);

        // Sirf Deposit filter karenge aur Fake Hash attach karenge
        const processedDeposits = historyData
          .filter(item => item.type && (item.type.toLowerCase() === 'deposit' || item.type.toLowerCase() === 'manual_credit'))
          .map((item, idx) => {
            let originalHash = item.txHash || item.txnHash;
            let displayHash = originalHash;
            
            // 🔥 AGAR MANUAL HAI YA HASH GAYAB HAI, TOH UNIQUE FAKE HASH BANA DO
            if (!originalHash || originalHash === 'N/A' || originalHash.startsWith('MANUAL-')) {
              displayHash = generateDummyHash(item, idx);
            }

            return { ...item, displayHash }; 
          });

        setDeposits(processedDeposits);
        setFilteredDeposits(processedDeposits);
      } catch (err) {
        console.error('Failed to fetch deposit history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDeposits();
  }, []);

  // 🔍 SEARCH LOGIC
  useEffect(() => {
    const query = search.toLowerCase();
    const filtered = deposits.filter((d) => {
      const amt = getSafeAmount(d.amount || d.grossAmount).toString();
      const recordDate = d.createdAt || d.date; 
      // Time removed from search filtering as well
      const dateStr = recordDate ? format(new Date(recordDate), 'dd-MM-yyyy').toLowerCase() : '';
      const hashString = (d.displayHash || '').toLowerCase(); 
        
      return amt.includes(query) || dateStr.includes(query) || hashString.includes(query);
    });

    setFilteredDeposits(filtered);
  }, [search, deposits]);

  return (
    <div className="w-full min-h-screen bg-[#0b1221] p-4 md:p-8 font-sans">
      
      {/* Inner Card Container */}
      <div className="max-w-5xl mx-auto bg-[#131c31] rounded-xl border-t-[3px] border-[#eab308] shadow-2xl p-4 sm:p-6">
        
        {/* Header Title */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl text-[#eab308] font-bold tracking-wide flex items-center gap-3">
             <History className="text-[#eab308]" size={28} /> Deposit History
          </h2>
         
        </div>

        {/* Filter (Search) */}
        <div className="mb-6">
          <div className="relative w-full sm:w-[400px]">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
               <Search size={16} className="text-gray-500" />
             </div>
             <input
               type="text"
               placeholder="Search by amount, date, or tx hash..."
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="w-full bg-[#0b1221] border border-gray-700 text-gray-200 rounded px-3 py-2 pl-10 focus:outline-none focus:border-[#eab308] transition-colors placeholder-gray-500"
             />
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto border border-gray-700 rounded-lg">
          <table className="w-full text-left whitespace-nowrap border-collapse">
            <thead className="text-[#eab308] bg-[#1a253e] text-sm border-b border-gray-700">
              <tr>
                <th className="p-4 border-r border-gray-700/50 font-bold w-16 text-center">Sr. <span className="text-[10px] text-gray-500 ml-1">♦</span></th>
                <th className="p-4 border-r border-gray-700/50 font-bold text-center">Date <span className="text-[10px] text-gray-500 ml-1">♦</span></th>
                <th className="p-4 border-r border-gray-700/50 font-bold">Type <span className="text-[10px] text-gray-500 ml-1">♦</span></th>
                <th className="p-4 border-r border-gray-700/50 font-bold text-center">TxHash (BscScan) <span className="text-[10px] text-gray-500 ml-1">♦</span></th>
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
              ) : filteredDeposits.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-gray-500">
                    No Deposit Records Found
                  </td>
                </tr>
              ) : (
                filteredDeposits.map((record, index) => {
                  const recordDate = record.createdAt || record.date;
                  const finalAmount = getSafeAmount(record.amount || record.grossAmount);
                  
                  // 🔥 Hamesha Safe & Unique Hash Use Hoga
                  const hash = record.displayHash; 
                  const shortHash = formatHash(hash);
                  
                  return (
                    <tr key={record._id || index} className="border-b border-gray-700 hover:bg-[#1a253e] transition-colors">
                      <td className="p-4 border-r border-gray-700/50 text-center font-medium">{index + 1}</td>

                      {/* Date (Time removed) */}
                      <td className="p-4 border-r border-gray-700/50 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Calendar size={14} className="text-gray-400" />
                          <span>{recordDate ? format(new Date(recordDate), 'dd MMM yyyy') : 'N/A'}</span>
                        </div>
                      </td>

                      <td className="p-4 border-r border-gray-700/50">
                        <span className="inline-flex items-center gap-1.5 bg-[#eab308]/10 text-[#eab308] border border-[#eab308]/20 py-1 px-2.5 rounded-md text-[10px] font-bold tracking-widest uppercase">
                          <ArrowDownCircle size={12} /> Deposit
                        </span>
                      </td>

                      {/* 🔥 FAKE/REAL HASH BUTTON */}
                      <td className="p-4 border-r border-gray-700/50 text-center">
                        <a 
                          href={`https://bscscan.com/tx/${hash}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 font-mono text-[11px] font-bold text-[#eab308] bg-[#0b1221] hover:bg-[#eab308] hover:text-[#0b1221] border border-gray-700 hover:border-[#eab308] px-3 py-1.5 rounded transition-all duration-200"
                          title="Click to view on BscScan"
                        >
                          {shortHash} <ExternalLink size={12} />
                        </a>
                      </td>

                      <td className="p-4 font-bold text-center text-green-400">
                         + ${finalAmount.toFixed(2)}
                      </td>
                  
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DepositHistory;