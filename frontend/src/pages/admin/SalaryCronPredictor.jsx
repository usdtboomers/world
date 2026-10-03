import React, { useState, useEffect } from 'react';
import api from '../../api/axios'; 
import { Server, Clock, CheckCircle, AlertCircle, Calendar } from 'lucide-react';

const SalaryCronPredictor = () => {
  const [data, setData] = useState({ upcomingTonight: [], upcomingFuture: [], recentlyPaid: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tonight'); // 'tonight' or 'recent'

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Ensure path matches your backend route
        const res = await api.get('/admin/cron-salary-predictor'); 
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (error) {
        console.error("Failed to load cron data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Server className="text-indigo-600" size={28} /> Cron Job Predictor
          </h2>
          <p className="text-gray-500 text-sm mt-1">See who is queued for tonight's salary distribution and recent payouts.</p>
        </div>
        <div className="bg-indigo-100 border border-indigo-200 text-indigo-800 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 shadow-sm">
          <Clock size={16} className="animate-pulse" /> Next Cron Run: 12:05 AM
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 pb-2 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('tonight')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-t-lg font-bold transition-colors ${activeTab === 'tonight' ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          <AlertCircle size={18} /> 
          Due Tonight <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">{data.upcomingTonight.length}</span>
        </button>
        <button 
          onClick={() => setActiveTab('recent')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-t-lg font-bold transition-colors ${activeTab === 'recent' ? 'bg-green-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          <CheckCircle size={18} /> 
          Recently Distributed (48h) <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">{data.recentlyPaid.length}</span>
        </button>
      </div>

      {/* Tab Content */}
      {loading ? (
        <div className="text-center py-20 text-gray-500 font-bold animate-pulse text-lg">
          ⏳ Analyzing Cron Queue...
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
          
          {/* TAB 1: TONIGHT'S QUEUE */}
          {activeTab === 'tonight' && (
            <div className="overflow-x-auto">
              {data.upcomingTonight.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  <Server size={40} className="mx-auto text-gray-300 mb-3" />
                  <p className="font-bold text-lg">Queue is Empty</p>
                  <p className="text-sm">No users are scheduled to receive salary tonight.</p>
                </div>
              ) : (
                <table className="min-w-full text-sm text-left">
                  <thead className="bg-indigo-50 text-indigo-800 uppercase text-xs">
                    <tr>
                      <th className="px-6 py-3 font-black">User Details</th>
                      <th className="px-6 py-3 font-black text-center">Current Month</th>
                      <th className="px-6 py-3 font-black">Trigger Reason</th>
                      <th className="px-6 py-3 font-black text-right">Expected Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.upcomingTonight.map((u, i) => (
                      <tr key={i} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-800">#{u.userId}</div>
                          <div className="text-gray-500 text-xs capitalize">{u.name}</div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="bg-indigo-100 text-indigo-800 font-black px-3 py-1 rounded-full text-xs">
                            Month {u.monthsPaid + 1}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 font-bold text-gray-700">
                            <Calendar size={14} className="text-orange-500" />
                            {u.reason}
                          </div>
                          {u.lastPaidOn && <div className="text-[10px] text-gray-400 mt-1">Last Paid: {formatDate(u.lastPaidOn)}</div>}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-green-600 font-bold flex items-center justify-end gap-1">
                            +$100 <Clock size={12}/>
                          </span>
                          <span className="text-[10px] text-gray-400">At 12:05 AM</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* TAB 2: RECENTLY DISTRIBUTED */}
          {activeTab === 'recent' && (
            <div className="overflow-x-auto">
              {data.recentlyPaid.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  <CheckCircle size={40} className="mx-auto text-gray-300 mb-3" />
                  <p className="font-bold text-lg">No Recent Activity</p>
                  <p className="text-sm">Cron hasn't distributed any salary in the last 48 hours.</p>
                </div>
              ) : (
                <table className="min-w-full text-sm text-left">
                  <thead className="bg-green-50 text-green-800 uppercase text-xs">
                    <tr>
                      <th className="px-6 py-3 font-black">User Details</th>
                      <th className="px-6 py-3 font-black">Month Count</th>
                      <th className="px-6 py-3 font-black">Generated On</th>
                      <th className="px-6 py-3 font-black text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentlyPaid.map((u, i) => (
                      <tr key={i} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-800">#{u.userId}</div>
                          <div className="text-gray-500 text-xs capitalize">{u.name}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-green-100 text-green-800 font-black px-3 py-1 rounded-full text-xs">
                            Completed {u.monthsPaid}/6
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-700">{formatDate(u.date)}</div>
                          <div className="text-xs text-gray-400">{formatTime(u.date)}</div>
                        </td>
                        <td className="px-6 py-4 text-right font-black text-green-600">
                          ${u.amount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SalaryCronPredictor;