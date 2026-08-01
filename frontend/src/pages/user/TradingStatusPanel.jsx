// import React, { useEffect, useState } from "react";
// import api from "../../api/axios"; 
// import { TrendingUp, TrendingDown, Activity, Zap, RefreshCcw, Search } from "lucide-react";

// export default function TradingStatusPanel() {
//   const [rows, setRows] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [lastUpdated, setLastUpdated] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");

//   // 🔥 1000+ Trading Pairs Initialized List
//   const positions = [
//     { pair: "BTC/USDT", entry: 97000, side: "Long", lev: 20 },
//     { pair: "ETH/USDT", entry: 3400, side: "Short", lev: 15 },
//     { pair: "SOL/USDT", entry: 170, side: "Long", lev: 10 },
//     { pair: "BNB/USDT", entry: 600, side: "Long", lev: 10 },
//     { pair: "XRP/USDT", entry: 0.55, side: "Long", lev: 5 },
//     { pair: "ADA/USDT", entry: 0.40, side: "Short", lev: 5 },
//     { pair: "DOGE/USDT", entry: 0.12, side: "Long", lev: 10 },
//     { pair: "AVAX/USDT", entry: 25, side: "Long", lev: 10 },
//     { pair: "DOT/USDT", entry: 6.5, side: "Short", lev: 5 },
//     { pair: "MATIC/USDT", entry: 0.50, side: "Long", lev: 5 },
//     { pair: "LINK/USDT", entry: 14, side: "Long", lev: 10 },
//     { pair: "UNI/USDT", entry: 8, side: "Short", lev: 5 },
//     { pair: "BCH/USDT", entry: 350, side: "Long", lev: 10 },
//     { pair: "NEAR/USDT", entry: 5.2, side: "Long", lev: 10 },
//     { pair: "LTC/USDT", entry: 75, side: "Short", lev: 5 },
//     { pair: "ICP/USDT", entry: 9.5, side: "Long", lev: 10 },
//     { pair: "APT/USDT", entry: 8.5, side: "Long", lev: 10 },
//     { pair: "SHIB/USDT", entry: 0.000018, side: "Short", lev: 10 },
//     { pair: "RENDER/USDT", entry: 7.2, side: "Long", lev: 15 },
//     { pair: "FET/USDT", entry: 1.4, side: "Long", lev: 10 },
//     { pair: "INJ/USDT", entry: 22, side: "Short", lev: 10 },
//     { pair: "SUI/USDT", entry: 1.8, side: "Long", lev: 20 },
//     { pair: "PEPE/USDT", entry: 0.000012, side: "Long", lev: 15 },
//     { pair: "WIF/USDT", entry: 2.1, side: "Short", lev: 10 },
//     { pair: "AR/USDT", entry: 24, side: "Long", lev: 10 },
//     { pair: "OP/USDT", entry: 1.7, side: "Long", lev: 10 },
//     { pair: "ARB/USDT", entry: 0.55, side: "Short", lev: 10 },
//     { pair: "ATOM/USDT", entry: 4.5, side: "Long", lev: 5 },
//     { pair: "FTM/USDT", entry: 0.65, side: "Long", lev: 10 },
//     { pair: "TIA/USDT", entry: 5.8, side: "Short", lev: 10 },
//     { pair: "SEI/USDT", entry: 0.38, side: "Long", lev: 10 },
//     { pair: "STX/USDT", entry: 1.9, side: "Long", lev: 10 },
//     { pair: "IMX/USDT", entry: 1.5, side: "Short", lev: 10 },
//     { pair: "KAS/USDT", entry: 0.15, side: "Long", lev: 10 },
//     { pair: "FLOKI/USDT", entry: 0.00015, side: "Long", lev: 15 },
//     { pair: "BONK/USDT", entry: 0.000022, side: "Short", lev: 15 },
//     { pair: "JUP/USDT", entry: 0.95, side: "Long", lev: 10 },
//     { pair: "RUNE/USDT", entry: 4.8, side: "Long", lev: 10 },
//     { pair: "GRT/USDT", entry: 0.22, side: "Short", lev: 5 },
//     { pair: "ALGO/USDT", entry: 0.18, side: "Long", lev: 5 },
//     { pair: "THETA/USDT", entry: 1.6, side: "Long", lev: 10 },
//     { pair: "FIL/USDT", entry: 4.2, side: "Short", lev: 5 },
//     { pair: "VET/USDT", entry: 0.028, side: "Long", lev: 5 },
//     { pair: "HBAR/USDT", entry: 0.065, side: "Long", lev: 10 },
//     { pair: "MKR/USDT", entry: 2100, side: "Short", lev: 5 },
//     { pair: "AAVE/USDT", entry: 150, side: "Long", lev: 10 },
//     { pair: "SNX/USDT", entry: 1.8, side: "Long", lev: 10 },
//     { pair: "EGLD/USDT", entry: 32, side: "Short", lev: 5 },
//     { pair: "AXS/USDT", entry: 5.5, side: "Long", lev: 10 },
//     { pair: "SAND/USDT", entry: 0.35, side: "Long", lev: 10 }
//     // 💡 Baaki saare 1000+ pairs backend se automatically fetch aur match ho jayenge!
//   ];

//   async function load() {
//     try {
//       const symbols = positions.map((p) => p.pair.replace("/", "")).join(",");
      
//       const res = await api.get("/market/prices", { params: { symbols } });
//       const prices = res.data.prices || [];
      
//       const map = new Map(prices.map((p) => [p.symbol, Number(p.price)]));

//       const merged = positions.map((p) => {
//         const latest = map.get(p.pair.replace("/", ""));

//         let pnl = "--";
//         let isProfit = false;
//         let color = "text-gray-500";
//         let bgColor = "bg-gray-500/10";

//         if (latest) {
//           const move = ((latest - p.entry) / p.entry) * 100;
//           const pnlPct = move * (p.side === "Short" ? -1 : 1) * p.lev;
          
//           isProfit = pnlPct >= 0;
//           pnl = `${pnlPct > 0 ? "+" : ""}${pnlPct.toFixed(2)}%`;
//           color = isProfit ? "text-green-400" : "text-red-400";
//           bgColor = isProfit ? "bg-green-500/10 border-green-500/20" : "bg-red-500/10 border-red-500/20";
//         }

//         return { ...p, latest, pnl, color, bgColor, isProfit };
//       });

//       setRows(merged);
//       setLastUpdated(new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute:'2-digit', second:'2-digit' }));
      
//     } catch (e) {
//       console.error("Failed to fetch market prices:", e);
//     }

//     setLoading(false);
//   }

//   useEffect(() => {
//     load();
//     const id = setInterval(load, 10000);
//     return () => clearInterval(id);
//   }, []);

//   // Search Filter logic for 1000+ coins list
//   const filteredRows = rows.filter(r => 
//     r.pair.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     r.side.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div className="w-full min-h-screen bg-[#0b1221] p-3 sm:p-4 md:p-8 font-sans flex flex-col justify-between">
      
//       <div className="max-w-7xl w-full mx-auto bg-[#131c31] rounded-xl border-t-[3px] border-[#eab308] shadow-2xl p-4 sm:p-6 mb-6">
        
//         {/* Header & Search Bar */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
//           <h2 className="text-lg sm:text-2xl md:text-3xl text-[#eab308] font-bold tracking-wide flex items-center gap-2">
//             <Activity className="text-[#eab308] w-5 h-5 sm:w-7 sm:h-7" /> 
//             <span>Live Positions (1000+ Pairs)</span>
//           </h2>

//           <div className="flex items-center gap-3 w-full sm:w-auto">
//             <div className="relative w-full sm:w-64">
//               <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
//                 <Search size={16} />
//               </span>
//               <input
//                 type="text"
//                 placeholder="Search coin (e.g. BTC, ETH)..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full bg-[#0b1221] border border-gray-700 text-gray-200 text-xs sm:text-sm rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-[#eab308] transition-colors"
//               />
//             </div>
            
//             {!loading && (
//               <div className="text-right hidden sm:block">
//                 <span className="text-[9px] uppercase tracking-widest text-gray-500 font-bold block">Updated</span>
//                 <span className="text-xs text-green-400 flex items-center gap-1 font-medium">
//                   <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
//                   {lastUpdated}
//                 </span>
//               </div>
//             )}
//           </div>
//         </div>

//         {loading ? (
//           <div className="w-full flex flex-col items-center justify-center py-16 text-[#eab308]">
//             <RefreshCcw className="w-8 h-8 animate-spin mb-3" />
//             <span className="font-bold tracking-widest text-xs sm:text-sm uppercase">Syncing 1000+ Markets...</span>
//           </div>
//         ) : filteredRows.length === 0 ? (
//           <div className="text-center py-12 text-gray-500 text-sm">
//             No matching trading pairs found.
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 max-h-[70vh] overflow-y-auto pr-1 custom-scroll">
//             <style>{`
//               .custom-scroll::-webkit-scrollbar { width: 4px; }
//               .custom-scroll::-webkit-scrollbar-thumb { background: #374151; border-radius: 10px; }
//               .custom-scroll::-webkit-scrollbar-thumb:hover { background: #eab308; }
//             `}</style>
//             {filteredRows.map((r, i) => (
//               <div 
//                 key={i} 
//                 className="bg-[#1a253e] rounded-xl border border-gray-700 hover:border-gray-500 shadow-lg overflow-hidden transition-all duration-300 relative group hover:-translate-y-1"
//               >
//                 <div className={`h-1.5 w-full absolute top-0 left-0 ${r.isProfit ? 'bg-green-500' : 'bg-red-500'}`}></div>

//                 <div className="p-4 sm:p-5 pt-5">
//                   <div className="flex justify-between items-start mb-4">
//                     <div>
//                       <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-1.5 sm:gap-2">
//                         {r.pair}
//                         <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#eab308]" />
//                       </h3>
//                       <div className="flex gap-2 mt-1.5">
//                         <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${r.side === 'Long' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
//                           {r.side}
//                         </span>
//                         <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-gray-700/30 text-gray-300 border border-gray-600/50">
//                           {r.lev}x
//                         </span>
//                       </div>
//                     </div>
                    
//                     <div className={`text-right px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg border ${r.bgColor}`}>
//                       <span className={`font-black text-base sm:text-lg flex items-center gap-1 sm:gap-1.5 ${r.color}`}>
//                         {r.isProfit ? <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <TrendingDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
//                         {r.pnl}
//                       </span>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-2 pt-3 sm:pt-4 border-t border-gray-700/50">
//                     <div>
//                       <span className="text-[9px] sm:text-[10px] text-gray-500 font-bold uppercase tracking-widest block mb-0.5">Entry Price</span>
//                       <span className="text-xs sm:text-sm text-gray-300 font-medium">
//                         ${Number(r.entry).toLocaleString(undefined, { minimumFractionDigits: 2 })}
//                       </span>
//                     </div>
//                     <div className="text-right">
//                       <span className="text-[9px] sm:text-[10px] text-gray-500 font-bold uppercase tracking-widest block mb-0.5">Mark Price</span>
//                       <span className="text-sm sm:text-base text-white font-black">
//                         ${r.latest ? Number(r.latest).toLocaleString(undefined, { minimumFractionDigits: 2 }) : "--"}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       <div className="w-full text-center py-4">
//         <a 
//           href="https://www.worldfinance24.online" 
//           target="_blank" 
//           rel="noopener noreferrer" 
//           className="text-gray-500 hover:text-[#eab308] text-sm font-semibold tracking-wider transition-colors"
//         >
// www.worldfinance24.online        </a>
//       </div>
      
//     </div>
//   );
// }


import React, { useEffect, useState, useRef } from "react";
import api from "../../api/axios";
import { TrendingUp, TrendingDown, Activity, Zap, RefreshCcw, Search } from "lucide-react";

// Stable hash - har coin ko hamesha same Long/Short + leverage milta hai (har poll pe flip nahi hoga)
function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

const LEVERAGES = [5, 10, 15, 20];
const BATCH_SIZE = 10; // 🔥 10-10 karke load

export default function TradingStatusPanel() {
  const [symbols, setSymbols] = useState([]);      // 🔥 real, backend-validated USDT pairs (BTC/USDT sabse upar)
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);

  const entriesRef = useRef({}); // pehli baar jo price mile wahi entry freeze ho jaati hai

  // 🔥 Step 1: backend se real validated symbols ki poori list (ek hi baar)
  async function loadSymbols() {
    try {
      const res = await api.get("/market/symbols");
      const list = res.data?.symbols || [];
      setSymbols(list);
    } catch (e) {
      console.error("Failed to fetch symbol list:", e);
    }
  }

  // 🔥 Step 2: sirf abhi jitne coins visible hain unhi ke live prices fetch karo (10-10 karke)
  async function loadPrices(activeSymbols) {
    if (!activeSymbols.length) {
      setLoading(false);
      return;
    }

    try {
      const res = await api.get("/market/prices", {
        params: { symbols: activeSymbols.join(",") },
      });
      const prices = res.data?.prices || [];
      const map = new Map(prices.map((p) => [p.symbol, Number(p.price)]));

      const merged = activeSymbols.map((symbol) => {
        const latest = map.get(symbol);
        const pair = `${symbol.replace("USDT", "")}/USDT`;

        // entry price sirf pehli baar freeze hoti hai, phir wahi rehti hai
        if (latest && !entriesRef.current[symbol]) {
          entriesRef.current[symbol] = latest;
        }
        const entry = entriesRef.current[symbol];

        const h = hashCode(symbol);
        const side = h % 2 === 0 ? "Long" : "Short";
        const lev = LEVERAGES[h % LEVERAGES.length];

        let pnl = "--";
        let pnlValue = null; // 🔥 numeric PnL - isi se sahi sorting hogi, koi random nahi
        let isProfit = false;
        let color = "text-gray-500";
        let bgColor = "bg-gray-500/10";

        if (latest && entry) {
          const move = ((latest - entry) / entry) * 100;
          const pnlPct = move * (side === "Short" ? -1 : 1) * lev;

          pnlValue = pnlPct;
          isProfit = pnlPct >= 0;
          pnl = `${pnlPct > 0 ? "+" : ""}${pnlPct.toFixed(2)}%`;
          color = isProfit ? "text-green-400" : "text-red-400";
          bgColor = isProfit ? "bg-green-500/10 border-green-500/20" : "bg-red-500/10 border-red-500/20";
        }

        return { symbol, pair, entry, latest, side, lev, pnl, pnlValue, color, bgColor, isProfit };
      });

      // pehle se load ho chuke rows ko preserve karke naye merge karo
      setRows((prev) => {
        const prevMap = new Map(prev.map((r) => [r.symbol, r]));
        merged.forEach((r) => prevMap.set(r.symbol, r));

        const all = symbols.filter((s) => prevMap.has(s)).map((s) => prevMap.get(s));

        // 🔥 Sabse zyada REAL profit wala coin hamesha upar - koi fixed/random coin nahi.
        // Jinka price abhi load nahi hua (pnlValue null) woh sabse neeche chale jaate hain.
        return [...all].sort((a, b) => {
          if (a.pnlValue == null && b.pnlValue == null) return 0;
          if (a.pnlValue == null) return 1;
          if (b.pnlValue == null) return -1;
          return b.pnlValue - a.pnlValue;
        });
      });

      setLastUpdated(new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute:'2-digit', second:'2-digit' }));
    } catch (e) {
      console.error("Failed to fetch market prices:", e);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadSymbols();
  }, []);

  // jab bhi symbols list mil jaaye ya visibleCount badhe, sirf utne hi coins ke prices load karo
  useEffect(() => {
    if (!symbols.length) return;
    const activeSymbols = symbols.slice(0, visibleCount);
    loadPrices(activeSymbols);

    const id = setInterval(() => loadPrices(activeSymbols), 10000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbols, visibleCount]);

  // Search karte hi 10 se wapas start karo
  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
  }, [searchQuery]);

  // Search Filter logic
  const filteredRows = rows.filter(r =>
    r.pair.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.side.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hasMore = visibleCount < symbols.length;

  return (
    // 🔥 Faltu ki padding (p-8) aur min-h-screen hata diya taaki layout fit baithe
    <div className="w-full font-sans flex flex-col">

      {/* 🔥 max-w-7xl hata kar w-full kiya taaki parent box ke hisaab se automatic adjust ho */}
      <div className="w-full bg-[#131c31] rounded-2xl border-t-[3px] border-[#eab308] shadow-xl p-3 sm:p-5">

        {/* Header & Search Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
          <h2 className="text-lg sm:text-2xl text-[#eab308] font-bold tracking-wide flex items-center gap-2">
            <Activity className="text-[#eab308] w-5 h-5 sm:w-6 sm:h-6" />
            <span>Live Positions ({symbols?.length || "1000+"} Pairs)</span>
          </h2>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-56">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <Search size={16} />
              </span>
              <input
                type="text"
                placeholder="Search coin..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0b1221] border border-gray-700 text-gray-200 text-xs sm:text-sm rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-[#eab308] transition-colors"
              />
            </div>

            {!loading && (
              <div className="text-right hidden sm:block min-w-[70px]">
                <span className="text-[9px] uppercase tracking-widest text-gray-500 font-bold block">Updated</span>
                <span className="text-[11px] text-green-400 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                  {lastUpdated}
                </span>
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="w-full flex flex-col items-center justify-center py-12 text-[#eab308]">
            <RefreshCcw className="w-7 h-7 animate-spin mb-3" />
            <span className="font-bold tracking-widest text-xs uppercase">Syncing Markets...</span>
          </div>
        ) : filteredRows.length === 0 ? (
          <div className="text-center py-10 text-gray-500 text-xs sm:text-sm">
            No matching trading pairs found.
          </div>
        ) : (
          <>
            {/* 🔥 max-h-[70vh] rakha hai taaki zyada lambi list dashboard ko khrab na kare */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-h-[60vh] overflow-y-auto pr-1 custom-scroll">
              <style>{`
                .custom-scroll::-webkit-scrollbar { width: 4px; }
                .custom-scroll::-webkit-scrollbar-thumb { background: #374151; border-radius: 10px; }
                .custom-scroll::-webkit-scrollbar-thumb:hover { background: #eab308; }
              `}</style>
              {filteredRows.map((r) => (
                <div
                  key={r.symbol}
                  className="bg-[#1a253e] rounded-xl border border-gray-700 hover:border-gray-500 shadow-md overflow-hidden transition-all duration-300 relative group hover:-translate-y-1"
                >
                  <div className={`h-1.5 w-full absolute top-0 left-0 ${r.isProfit ? 'bg-green-500' : 'bg-red-500'}`}></div>

                  <div className="p-3 sm:p-4 pt-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-1.5">
                          {r.pair}
                          <Zap className="w-3.5 h-3.5 text-[#eab308]" />
                        </h3>
                        <div className="flex gap-1.5 mt-1">
                          <span className={`text-[8px] sm:text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${r.side === 'Long' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                            {r.side}
                          </span>
                          <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-gray-700/30 text-gray-300 border border-gray-600/50">
                            {r.lev}x
                          </span>
                        </div>
                      </div>

                      <div className={`text-right px-2 py-1 rounded-lg border ${r.bgColor}`}>
                        <span className={`font-black text-sm sm:text-base flex items-center gap-1 ${r.color}`}>
                          {r.isProfit ? <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <TrendingDown className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                          {r.pnl}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-2 pt-2 sm:pt-3 border-t border-gray-700/50">
                      <div>
                        <span className="text-[8px] sm:text-[9px] text-gray-500 font-bold uppercase tracking-widest block mb-0.5">Entry Price</span>
                        <span className="text-[11px] sm:text-xs text-gray-300 font-medium">
                          {r.entry ? `$${Number(r.entry).toLocaleString(undefined, { minimumFractionDigits: 2 })}` : "--"}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[8px] sm:text-[9px] text-gray-500 font-bold uppercase tracking-widest block mb-0.5">Mark Price</span>
                        <span className="text-xs sm:text-sm text-white font-black">
                          {r.latest ? `$${Number(r.latest).toLocaleString(undefined, { minimumFractionDigits: 2 })}` : "--"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 🔥 10-10 karke load - Load More button */}
            {hasMore && (
              <div className="flex justify-center mt-5">
                <button
                  onClick={() => setVisibleCount((c) => c + BATCH_SIZE)}
                  className="px-5 py-2 rounded-lg bg-[#1a253e] border border-[#eab308]/40 text-[#eab308] text-[10px] sm:text-xs font-bold uppercase tracking-wider hover:bg-[#eab308]/10 hover:border-[#eab308] transition-colors"
                >
                  Load 10 More ({rows.length}/{symbols.length})
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer Link */}
      <div className="w-full text-center py-3">
        <a
          href="https://www.worldfinance24.online"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-[#eab308] text-xs font-semibold tracking-wider transition-colors"
        >
          www.worldfinance24.online
        </a>
      </div>

    </div>
  );
}