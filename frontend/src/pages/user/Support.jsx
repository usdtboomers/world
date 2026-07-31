import React, { useState, useEffect, useCallback } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import SuccessModal from "../../components/modals/SuccessModal";
import MessageModal from "../../components/modals/MessageModal";
import { LifeBuoy, Clock, CheckCircle2, XCircle, AlertCircle, Wallet, Info } from "lucide-react";

const Support = () => {
  const { user, token } = useAuth();
  const [message, setMessage] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [optional, setOptional] = useState("");
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const [userMessages, setUserMessages] = useState([]);
  const [fetching, setFetching] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState(null);

  // Fetch logic using the NEW /me route
  const fetchMessages = useCallback(async () => {
    if (!token) return;
    try {
      setFetching(true);
      const res = await api.get(`/support/me?t=${new Date().getTime()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserMessages(res.data.supports || []);
    } catch (err) {
      console.error("Fetch messages error:", err);
    } finally {
      setFetching(false);
    }
  }, [token]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim()) {
      setStatusMsg({ type: "error", text: "Please enter your message." });
      return;
    }

    setLoading(true);
    setStatusMsg({ type: "", text: "" });

    try {
      const res = await api.post(
        "/support/create",
        { message, email: user?.email || "unknown", walletAddress, optional },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setSubmittedMessage({ message, walletAddress, optional });
        setShowModal(true);
        setMessage("");
        setWalletAddress("");
        setOptional("");
        fetchMessages(); // Refresh list
      }
    } catch (err) {
      const errorText = err.response?.data?.error || "Failed to send message. Please try again.";
      setStatusMsg({ type: "error", text: errorText });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMessage("");
    setStatusMsg({ type: "", text: "" });
  };

  return (
    <div className="w-full max-w-5xl mx-auto pb-10 relative z-10 animate-in fade-in duration-500">
      
      {/* Scrollbar CSS - Updated to Dark/Gold Theme */}
      <style>{`
        .custom-scroll::-webkit-scrollbar { height: 6px; width: 6px; }
        .custom-scroll::-webkit-scrollbar-track { background: #0b101e; border-radius: 4px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #e4c568; border-radius: 10px; }
      `}</style>

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-[#e4c568] uppercase tracking-wide flex items-center gap-3 drop-shadow-md">
             <LifeBuoy className="text-[#e4c568]" size={28} strokeWidth={2.5} /> Support Center
          </h2>
          <p className="text-[#9ca3af] text-xs md:text-sm font-bold tracking-widest uppercase mt-1">
            We are here to help you 24/7
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* LEFT COLUMN: Support Form (Updated to Dark/Gold Theme) */}
        <div>
          <div className="bg-[#0b101e] border border-[#2d3748] w-full max-w-[500px] relative shadow-[0_0_20px_rgba(212,175,55,0.15)] rounded-xl overflow-hidden flex flex-col">
            
            <div className="bg-[#e4c568] px-5 py-4 flex justify-between items-center shrink-0">
              <h3 className="text-black font-extrabold text-[18px] tracking-wide flex items-center gap-2">
                Generate Ticket
              </h3>
            </div>

            <div className="p-5 flex-1">
              <form onSubmit={handleSubmit}>
                
                {/* Table Style Wrapper mapped to Dark Mode */}
                <div className="border border-[#2d3748] mb-6 rounded-md overflow-hidden flex flex-col font-semibold text-[13px]">
                  
                  {/* User ID Row */}
                  <div className="flex border-b border-[#2d3748]">
                    <div className="w-1/3 bg-[#131927] p-3 text-white flex items-center border-r border-[#2d3748]">
                      User ID
                    </div>
                    <div className="w-2/3 p-2 bg-[#0b101e]">
                      <input 
                        type="text" 
                        value={user?.userId || ""} 
                        readOnly 
                        className="w-full bg-[#161c2d] border border-[#2d3748] text-gray-400 px-3 py-2 outline-none rounded text-sm font-mono cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Message Row */}
                  <div className="flex">
                    <div className="w-1/3 bg-[#131927] p-3 text-white flex items-start pt-4 border-r border-[#2d3748]">
                      Message <span className="text-red-500 ml-1">*</span>
                    </div>
                    <div className="w-2/3 p-2 bg-[#0b101e]">
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Describe your issue in detail..."
                        className="w-full bg-[#131927] border border-[#2d3748] text-white text-sm rounded px-3 py-2 focus:outline-none focus:border-[#e4c568] focus:ring-1 focus:ring-[#e4c568] placeholder-gray-600 custom-scroll"
                        rows="4"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                </div>

                {statusMsg.text && statusMsg.type === "error" && (
                  <div className="bg-red-900/30 border border-red-500/50 text-[#ff4d4d] px-4 py-2.5 rounded mb-4 flex items-center gap-2">
                    <AlertCircle size={16} className="shrink-0" />
                    <span className="font-semibold text-xs tracking-wide">{statusMsg.text}</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-[#e4c568] hover:bg-[#d4af37] text-black font-extrabold py-2.5 rounded shadow-[0_0_10px_rgba(228,197,104,0.3)] hover:scale-[1.02] transition-transform disabled:opacity-70 disabled:hover:scale-100 uppercase tracking-widest text-[14px]"
                  >
                    {loading ? "Sending..." : "Submit Ticket"}
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex-none bg-[#1e2536] hover:bg-[#2d3748] border border-[#2d3748] text-white px-6 py-2.5 rounded font-bold transition-colors uppercase tracking-widest text-[14px]"
                  >
                    Reset
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Ticket History (Updated to Dark/Gold Theme) */}
        <div>
          <div className="bg-[#0b101e] border border-[#2d3748] shadow-[0_0_20px_rgba(212,175,55,0.05)] rounded-xl p-5 h-full flex flex-col">
            <h3 className="text-lg font-black text-[#e4c568] mb-5 uppercase tracking-widest flex items-center gap-2 border-b border-[#2d3748] pb-3">
              <Clock size={18} className="text-[#e4c568]" /> Ticket History
            </h3>

            <div className="flex-1 overflow-y-auto custom-scroll pr-2 space-y-4 max-h-[500px]">
              {fetching ? (
                <div className="text-center py-10">
                  <svg className="animate-spin h-8 w-8 text-[#e4c568] mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#9ca3af]">Loading History...</span>
                </div>
              ) : userMessages.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-[#2d3748] rounded-xl bg-[#161c2d]">
                  <span className="text-[#9ca3af] font-bold text-sm uppercase tracking-widest">No Previous Tickets</span>
                </div>
              ) : (
                userMessages.map((m) => {
                  let statusColor = "bg-[#1e2536] text-gray-300 border-[#2d3748]";
                  let StatusIcon = Clock;
                  
                  if (m.status === "Pending") {
                    statusColor = "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
                    StatusIcon = Clock;
                  } else if (m.status === "Resolved" || m.status === "Closed") {
                    statusColor = "bg-[#00ff88]/10 text-[#00ff88] border-[#00ff88]/20";
                    StatusIcon = CheckCircle2;
                  } else if (m.status === "Rejected") {
                    statusColor = "bg-red-500/10 text-[#ff4d4d] border-red-500/20";
                    StatusIcon = XCircle;
                  }

                  return (
                    <div key={m._id} className="p-4 border border-[#2d3748] rounded-xl bg-[#161c2d] hover:border-[#e4c568]/40 transition-colors shadow-sm relative group">
                      <div className="flex justify-between items-start mb-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-black tracking-widest uppercase rounded bg-opacity-20 border ${statusColor}`}>
                          <StatusIcon size={12} /> {m.status || "PENDING"}
                        </span>
                        <span className="text-[11px] font-mono text-[#9ca3af] bg-[#0b101e] px-2.5 py-1 rounded border border-[#2d3748]">
                          {new Date(m.createdAt).toLocaleDateString("en-GB")}
                        </span>
                      </div>
                      
                      <p className="text-gray-200 text-sm font-medium leading-relaxed mb-3">
                        {m.message}
                      </p>

                      {/* Admin Reply Box */}
                      {m.adminReply && (
                        <div className="mt-3 p-3 bg-[#131927] border border-[#e4c568]/30 rounded-lg relative overflow-hidden">
                          {/* Small accent glow effect */}
                          <div className="absolute top-0 left-0 w-1 h-full bg-[#e4c568]"></div>
                          
                          <div className="flex items-center gap-2 mb-1.5 pl-2">
                            <CheckCircle2 size={14} className="text-[#e4c568]" />
                            <span className="text-xs font-black text-[#e4c568] uppercase tracking-widest">Support Reply</span>
                          </div>
                          <p className="text-gray-300 text-sm font-medium pl-2">
                            {m.adminReply}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

      </div>

      {submittedMessage && (
        <SuccessModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          customTitle="Ticket Generated"
          customMessage="We've received your message. Our support team will review it and get back to you shortly."
        />
      )}
    </div>
  );
};

export default Support;