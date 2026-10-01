import React, { useState, useEffect, useMemo } from 'react';
import api from '../../api/axios'; 
import { Search, CheckCircle, AlertCircle, Clock, Wallet, ShieldAlert } from 'lucide-react';
import SpinnerOverlay from '../../components/common/SpinnerOverlay';

const MonthlySalaryClaims = () => {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchClaimsData();
  }, []);

  const fetchClaimsData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/monthly-salary-claims-report');
      if (res.data.success) {
        setReport(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching claims report", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredReport = useMemo(() => {
    return report.filter(user => 
      user.userId?.toLowerCase().includes(search.toLowerCase()) || 
      user.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [report, search]);

  const stats = useMemo(() => {
    let claimed = 0, ready = 0, blocked = 0;
    report.forEach(r => {
      if (r.status === 'Claimed') claimed++;
      if (r.status === 'Ready to Claim') ready++;
      if (r.status === 'Blocked (Team Inactive)') blocked++;
    });
    return { claimed, ready, blocked, total: report.length };
  }, [report]);

  if (loading) return <SpinnerOverlay />;

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2">
          <Wallet className="text-indigo-600" size={28} /> Salary Claims Status Tracker
        </h2>
        <p className="text-gray-500 text-sm mt-1">Monitor who has claimed, who is ready, and whose salary is blocked due to team inactivity.</p>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <p className="text-xs font-bold text-gray-500 uppercase">Total Qualified</p>
          <h3 className="text-2xl font-black text-gray-800 mt-1">{stats.total}</h3>
        </div>
        <div className="bg-green-50 p-4 rounded-xl shadow-sm border border-green-200">
          <p className="text-xs font-bold text-green-700 uppercase flex items-center gap-1"><CheckCircle size={14}/> Claimed This Month</p>
          <h3 className="text-2xl font-black text-green-800 mt-1">{stats.claimed}</h3>
        </div>
        <div className="bg-blue-50 p-4 rounded-xl shadow-sm border border-blue-200">
          <p className="text-xs font-bold text-blue-700 uppercase flex items-center gap-1"><Clock size={14}/> Ready To Claim</p>
          <h3 className="text-2xl font-black text-blue-800 mt-1">{stats.ready}</h3>
        </div>
        <div className="bg-red-50 p-4 rounded-xl shadow-sm border border-red-200">
          <p className="text-xs font-bold text-red-700 uppercase flex items-center gap-1"><ShieldAlert size={14}/> Blocked (Action Req.)</p>
          <h3 className="text-2xl font-black text-red-800 mt-1">{stats.blocked}</h3>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search ID or Name..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-4">User Details</th>
                <th className="px-6 py-4 text-center">Pending $ (Unclaimed)</th>
                <th className="px-6 py-4 text-center">Months Paid</th>
                <th className="px-6 py-4 text-center">Current Team (25 Days)</th>
                <th className="px-6 py-4 text-center">Claim Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredReport.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-10 text-gray-500 font-bold uppercase">No records found.</td></tr>
              ) : (
                filteredReport.map((user, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-800">#{user.userId}</div>
                      <div className="text-xs text-gray-500 capitalize">{user.name}</div>
                    </td>
                    <td className="px-6 py-4 text-center font-black text-gray-700">
                      ${user.unclaimedSalary}
                    </td>
                    <td className="px-6 py-4 text-center text-sm font-bold text-gray-500">
                      {user.salaryMonthsPaid} / 6
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="text-[11px] font-bold text-gray-500 flex flex-col items-center gap-1">
                        <span className={user.l1Active >= 3 ? "text-green-600" : "text-red-500"}>L1 Active: {user.l1Active}/3</span>
                        <span className={user.l2Active >= 6 ? "text-green-600" : "text-red-500"}>L2 Active: {user.l2Active}/6</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {user.status === 'Claimed' && (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded text-[11px] font-black uppercase flex items-center justify-center gap-1 w-max mx-auto border border-green-200"><CheckCircle size={12}/> CLAIMED</span>
                      )}
                      {user.status === 'Ready to Claim' && (
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-[11px] font-black uppercase flex items-center justify-center gap-1 w-max mx-auto border border-blue-200"><Clock size={12}/> READY TO CLAIM</span>
                      )}
                      {user.status === 'Blocked (Team Inactive)' && (
                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded text-[11px] font-black uppercase flex items-center justify-center gap-1 w-max mx-auto border border-red-200"><AlertCircle size={12}/> BLOCKED</span>
                      )}
                      {user.status === 'Waiting for Cron' && (
                        <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded text-[11px] font-black uppercase border border-gray-200">WAITING NEXT MONTH</span>
                      )}
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

export default MonthlySalaryClaims;