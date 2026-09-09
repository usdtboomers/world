import React, { useState, useEffect, useMemo } from 'react';
import api from '../../api/axios';
import { Trophy, PlusCircle, CheckCircle, X, AlertCircle, Search, Gift } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminLuckyWinner = () => {
    const [winners, setWinners] = useState([]);
    const [userId, setUserId] = useState("");
    const [amount, setAmount] = useState(50);
    const [loading, setLoading] = useState(false);
    
    // Search State
    const [search, setSearch] = useState("");

    // Popup Modal State
    const [showModal, setShowModal] = useState(false);
    const [pendingWinner, setPendingWinner] = useState(null);

    const currentMonth = new Date().toISOString().slice(0, 7);

    useEffect(() => {
        fetchWinners();
    }, []);

    const fetchWinners = async () => {
        try {
            const res = await api.get(`/admin/shared/lucky-winners-list?month=${currentMonth}`);
            if (res.data.success) setWinners(res.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    // 🔥 SORTING & SEARCHING LOGIC (Real Users On Top)
    const processedWinners = useMemo(() => {
        // 1. Sort: Real Winners hamesha upar rahenge
        let sortedList = [...winners].sort((a, b) => {
            if (a.type === 'Real Winner' && b.type !== 'Real Winner') return -1;
            if (a.type !== 'Real Winner' && b.type === 'Real Winner') return 1;
            return b.amount - a.amount; // Bada amount pehle
        });

        // 2. Filter: Search bar logic
        if (search.trim()) {
            const query = search.toLowerCase();
            sortedList = sortedList.filter(w => 
                w.userId?.toLowerCase().includes(query) || 
                w.name?.toLowerCase().includes(query)
            );
        }

        return sortedList;
    }, [winners, search]);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (!userId.trim()) return;
        
        setPendingWinner({ userId: userId.trim().toUpperCase(), amount: Number(amount) });
        setShowModal(true);
    };

    const confirmAddWinner = async () => {
        setLoading(true);
        try {
            const res = await api.post('/admin/add-lucky-winner', { 
                userId: pendingWinner.userId, 
                amount: pendingWinner.amount, 
                month: currentMonth 
            });
            
            if (res.data.success) {
                toast.success(res.data.message);
                setUserId("");
                fetchWinners(); 
                setShowModal(false); 
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Error adding winner");
            setShowModal(false);
        } finally {
            setLoading(false);
            setPendingWinner(null);
        }
    };

    const realWinnersCount = winners.filter(w => w.type === 'Real Winner').length;

    return (
        <div className="p-4 md:p-6 bg-slate-50 min-h-screen relative">
            
            {/* 🔥 CONFIRMATION POPUP */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 border border-indigo-100">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-black text-slate-800 flex items-center gap-2">
                                <AlertCircle size={18} className="text-indigo-600"/> Confirm Action
                            </h3>
                            <button 
                                onClick={() => setShowModal(false)} 
                                disabled={loading}
                                className="text-slate-400 hover:text-red-500 bg-white rounded-full p-1 shadow-sm transition-colors"
                            >
                                <X size={20}/>
                            </button>
                        </div>
                        
                        <div className="p-6 text-center text-slate-600">
                            <p className="mb-4 text-sm font-semibold">Are you sure you want to add this user as a Real Lucky Winner?</p>
                            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 inline-block shadow-inner">
                                <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">User ID</p>
                                <p className="text-2xl font-black text-indigo-700 my-1">{pendingWinner?.userId}</p>
                                <div className="mt-3 text-sm font-black text-emerald-700 bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center justify-center gap-1">
                                    <Gift size={16}/> Reward: ${pendingWinner?.amount}
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
                            <button 
                                onClick={() => setShowModal(false)} 
                                disabled={loading}
                                className="flex-1 bg-white border border-slate-300 text-slate-700 py-2.5 rounded-xl font-bold hover:bg-slate-100 transition shadow-sm"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={confirmAddWinner}
                                disabled={loading}
                                className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition disabled:opacity-70 flex justify-center items-center gap-2 shadow-md shadow-indigo-200"
                            >
                                {loading ? "Adding..." : <><CheckCircle size={16}/> Confirm Add</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- MAIN PAGE CONTENT --- */}
            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2 mb-6 tracking-wide">
                <Trophy className="text-[#eab308]" size={32} /> Manage Lucky Winners <span className="text-lg text-slate-400 font-medium ml-2">({currentMonth})</span>
            </h2>

            {/* ADD WINNER BOX */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8 max-w-3xl">
                <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2 uppercase tracking-wider text-sm">
                    <PlusCircle size={18} className="text-indigo-500"/> Add Real User to Winners
                </h3>
                
                <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row gap-4">
                    <input 
                        type="text" required placeholder="Enter User ID (e.g. WF12345)" 
                        className="border border-slate-300 px-4 py-3 rounded-xl flex-1 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 font-bold uppercase transition-all"
                        value={userId} onChange={(e) => setUserId(e.target.value)}
                    />
                    <select 
                        className="border border-slate-300 px-4 py-3 rounded-xl bg-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 font-bold text-slate-700 cursor-pointer transition-all"
                        value={amount} onChange={(e) => setAmount(e.target.value)}
                    >
                        <option value={50}>🎁 $50 Reward Winner</option>
                        <option value={100}>🏆 $100 Reward Winner</option>
                    </select>
                    <button type="submit" className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 transform hover:-translate-y-0.5">
                        Add Winner
                    </button>
                </form>
            </div>

            {/* WINNERS LIST TABLE WITH SEARCH */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50">
                    <div>
                        <h3 className="font-bold text-slate-800 text-lg">Final Winners List</h3>
                        <div className="flex gap-2 mt-1">
                            <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200 uppercase tracking-widest">Real: {realWinnersCount}</span>
                            <span className="text-[10px] font-black text-slate-500 bg-slate-200 px-2 py-0.5 rounded border border-slate-300 uppercase tracking-widest">System: {100 - realWinnersCount}</span>
                        </div>
                    </div>
                    
                    {/* 🔥 SEARCH BAR LAGA DIYA */}
                    <div className="relative w-full md:w-72">
                        <Search size={16} className="absolute left-3 top-3 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search by ID or Name..." 
                            className="w-full bg-white border border-slate-300 text-slate-700 rounded-xl px-3 py-2 pl-9 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-sm font-semibold"
                            value={search} 
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-100 text-slate-500 uppercase text-[11px] font-black tracking-widest">
                            <tr>
                                <th className="p-4 border-r border-slate-200 w-16 text-center">Sr.</th>
                                <th className="p-4 border-r border-slate-200">User ID</th>
                                <th className="p-4 border-r border-slate-200">Name</th>
                                <th className="p-4 border-r border-slate-200 text-center">Reward Won</th>
                                <th className="p-4 text-center">Winner Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            {processedWinners.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-10 text-slate-400 font-bold bg-slate-50">
                                        No winners found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                processedWinners.map((w, i) => (
                                    <tr key={i} className={`border-b border-slate-100 transition-colors ${w.type === 'Real Winner' ? 'bg-emerald-50/50 hover:bg-emerald-100/50' : 'hover:bg-slate-50'}`}>
                                        
                                        <td className="p-4 border-r border-slate-100 text-center font-bold text-slate-400">
                                            {i + 1}
                                        </td>
                                        
                                        <td className="p-4 border-r border-slate-100 font-bold text-slate-700">
                                            {w.userId}
                                        </td>
                                        
                                        <td className="p-4 border-r border-slate-100 capitalize font-medium text-slate-600">
                                            {w.name}
                                        </td>
                                        
                                        <td className="p-4 border-r border-slate-100 text-center">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-black shadow-sm border ${w.amount === 100 ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'}`}>
                                                <Gift size={14}/> ${w.amount}
                                            </span>
                                        </td>
                                        
                                        <td className="p-4 text-center">
                                            {w.type === 'Real Winner' 
                                                ? <span className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-3 py-1 rounded text-[10px] uppercase tracking-widest font-black flex items-center justify-center gap-1 w-28 mx-auto shadow-sm"><CheckCircle size={12}/> REAL USER</span>
                                                : <span className="bg-slate-100 text-slate-400 px-3 py-1 rounded text-[10px] uppercase tracking-widest font-black w-28 mx-auto block border border-slate-200">SYSTEM</span>
                                            }
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
export default AdminLuckyWinner;