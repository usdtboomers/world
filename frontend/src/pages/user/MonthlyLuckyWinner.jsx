import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { Search, Trophy, Gift, Calendar, X } from "lucide-react";
import SpinnerOverlay from "../../components/common/SpinnerOverlay";

const MonthlyLuckyWinner = () => {
    const [winners, setWinners] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterAmount, setFilterAmount] = useState("ALL");
    const [showPopup, setShowPopup] = useState(true); // Popup State

    useEffect(() => {
        const fetchWinners = async () => {
            try {
                 const res = await api.get('/user/shared/lucky-winners-list');
                if (res.data.success) {
                    setWinners(res.data.data);
                    setFiltered(res.data.data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchWinners();
    }, []);

    useEffect(() => {
        let result = winners;
        if (filterAmount !== "ALL") {
            result = result.filter(w => w.amount === Number(filterAmount));
        }
        if (search) {
            const lower = search.toLowerCase();
            result = result.filter(w => w.userId?.toLowerCase().includes(lower) || w.name?.toLowerCase().includes(lower));
        }
        setFiltered(result);
    }, [search, filterAmount, winners]);

    if (loading) return <SpinnerOverlay />;

    return (
        <div className="w-full min-h-screen bg-[#0b1221] p-4 md:p-8 font-sans pb-24 relative">
            
        

            <div className="max-w-6xl mx-auto space-y-6">
                
                {/* Information Banner (Based on Image) */}
                <div className="bg-[#131c31] rounded-2xl border border-gray-800 p-6 flex flex-col md:flex-row items-center gap-6 shadow-xl relative overflow-hidden">
                    <div className="absolute top-[-50px] right-[-50px] opacity-10"><Trophy size={200} className="text-yellow-500"/></div>
                    
                    <div className="flex-1 z-10">
                        <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600 mb-2 uppercase tracking-widest">
                            Monthly Lucky Winner Program
                        </h1>
                        <p className="text-gray-400 text-sm mb-4 border-l-2 border-yellow-500 pl-3">Only members with an active $50 Top-Up ID will be eligible.</p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                            <div className="flex items-center gap-3 bg-[#0b1221] p-3 rounded-xl border border-gray-800">
                                <div className="bg-yellow-500/10 p-2 rounded-lg"><Trophy size={20} className="text-yellow-500"/></div>
                                <div><p className="text-xs text-gray-500 uppercase font-bold">Total Winners</p><p className="text-white font-bold">100 Lucky Winners</p></div>
                            </div>
                            <div className="flex items-center gap-3 bg-[#0b1221] p-3 rounded-xl border border-gray-800">
                                <div className="bg-blue-500/10 p-2 rounded-lg"><Calendar size={20} className="text-blue-500"/></div>
                                <div><p className="text-xs text-gray-500 uppercase font-bold">Announcement</p><p className="text-white font-bold">10th of Every Month</p></div>
                            </div>
                            <div className="flex items-center gap-3 bg-[#0b1221] p-3 rounded-xl border border-gray-800">
                                <div className="bg-green-500/10 p-2 rounded-lg"><Gift size={20} className="text-green-500"/></div>
                                <div><p className="text-xs text-gray-500 uppercase font-bold">Reward Tier 1</p><p className="text-white font-bold">50 Winners ($100)</p></div>
                            </div>
                            <div className="flex items-center gap-3 bg-[#0b1221] p-3 rounded-xl border border-gray-800">
                                <div className="bg-indigo-500/10 p-2 rounded-lg"><Gift size={20} className="text-indigo-500"/></div>
                                <div><p className="text-xs text-gray-500 uppercase font-bold">Reward Tier 2</p><p className="text-white font-bold">50 Winners ($50)</p></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters & Table */}
                <div className="bg-[#131c31] rounded-2xl border-t-[3px] border-[#eab308] shadow-[0_0_20px_rgba(234,179,8,0.1)] p-4 sm:p-6 z-10 relative">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                        <h2 className="text-xl text-white font-black uppercase tracking-wide">Winners List</h2>
                        
                        <div className="flex gap-2 w-full sm:w-auto">
                            <select 
                                className="bg-[#0b1221] border border-gray-700 text-[#eab308] rounded-lg px-4 py-2.5 outline-none font-bold"
                                value={filterAmount} onChange={(e) => setFilterAmount(e.target.value)}
                            >
                                <option value="ALL">All Rewards</option>
                                <option value="100">$100 Winners</option>
                                <option value="50">$50 Winners</option>
                            </select>
                            <div className="relative flex-1 sm:w-64">
                                <Search size={18} className="absolute left-3 top-3 text-gray-500" />
                                <input 
                                    type="text" placeholder="Search ID or Name" 
                                    className="bg-[#0b1221] border border-gray-700 text-gray-200 rounded-lg px-3 py-2.5 pl-10 w-full outline-none focus:border-[#eab308]"
                                    value={search} onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto border border-gray-800 rounded-xl">
                        <table className="w-full text-left whitespace-nowrap">
                            <thead className="bg-[#1a253e] border-b border-gray-700">
                                <tr>
                                    <th className="p-4 text-[#eab308] font-extrabold text-center uppercase text-xs">SR.No</th>
                                    <th className="p-4 text-[#eab308] font-extrabold uppercase text-xs">User ID</th>
                                    <th className="p-4 text-[#eab308] font-extrabold uppercase text-xs">Name</th>
                                    <th className="p-4 text-[#eab308] font-extrabold text-center uppercase text-xs">Reward Won</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-300 text-sm">
                                {filtered.length === 0 ? (
                                    <tr><td colSpan="4" className="text-center py-10 text-gray-500">No winners found.</td></tr>
                                ) : (
                                    filtered.map((user, idx) => (
                                        <tr key={idx} className="border-b border-gray-800 hover:bg-[#1a253e]/50">
                                            <td className="p-4 text-center font-bold text-gray-500">{idx + 1}</td>
                                            <td className="p-4 font-bold text-white tracking-wide">{user.userId}</td>
                                            <td className="p-4 font-medium capitalize text-gray-400">{user.name}</td>
                                            <td className="p-4 text-center">
                                                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold uppercase tracking-widest shadow-lg ${user.amount === 100 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
                                                    <Gift size={14} /> ${user.amount}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};
export default MonthlyLuckyWinner;