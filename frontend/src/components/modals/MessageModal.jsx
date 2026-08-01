import React from "react";
import { 
  X, 
  Info, 
  CheckCircle2, 
  AlertCircle, 
  TriangleAlert,
  Calendar
} from "lucide-react";

const MessageModal = ({
  isOpen,
  onClose,
  title = "Message",
  message = "",
  type = "info",
  zIndex = 2000,
}) => {
  if (!isOpen) return null;

  // 🔥 PREMIUM FINANCE THEME CONFIG
  const theme = {
    success: {
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      icon: CheckCircle2,
      btn: "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20"
    },
    error: {
      color: "text-rose-400",
      bg: "bg-rose-500/10",
      border: "border-rose-500/20",
      icon: AlertCircle,
      btn: "bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20"
    },
    warning: {
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      icon: TriangleAlert,
      btn: "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20"
    },
    info: {
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      icon: Info,
      btn: "bg-blue-500 hover:bg-blue-600 text-white shadow-blue-500/20"
    },
  };

  const currentTheme = theme[type] || theme.info;
  const Icon = currentTheme.icon;

  // Get current date only (no time)
  const todayDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div
      className="fixed inset-0 bg-[#070b14]/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
      style={{ zIndex }}
    >
      {/* Premium Minimalist Modal Card */}
      <div className="bg-[#111827] rounded-2xl border border-gray-800 shadow-2xl w-full max-w-sm flex flex-col relative overflow-hidden">
        
        {/* Subtle Top Gradient Line */}
        <div className={`absolute top-0 left-0 right-0 h-1 ${currentTheme.btn} opacity-70`}></div>

        {/* Top Close Button */}
        <div className="absolute top-4 right-4 z-10">
           <button 
             onClick={onClose} 
             className="p-1.5 rounded-full bg-gray-800/50 hover:bg-gray-700 transition-all text-gray-400 hover:text-white"
           >
              <X size={16} strokeWidth={2.5} />
           </button>
        </div>

        {/* Content Area */}
        <div className="flex flex-col items-center pt-10 pb-4 px-6 relative z-10">
          
          {/* Elegant Icon Box */}
          <div className={`p-4 rounded-2xl ${currentTheme.bg} border ${currentTheme.border} mb-5 shadow-inner`}>
            <Icon size={32} className={currentTheme.color} strokeWidth={2.5} />
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-white mb-2 text-center tracking-wide">
            {title}
          </h2>

          {/* Message Area */}
          <div className="max-h-32 overflow-y-auto w-full text-center px-2 custom-scroll">
            <p className="text-sm text-gray-400 leading-relaxed font-medium">
              {message}
            </p>
          </div>
        </div>

        {/* Footer Area with Button & Date */}
        <div className="px-6 pb-6 pt-3 flex flex-col gap-4">
          <button
            onClick={onClose}
            className={`w-full py-3.5 rounded-xl font-bold tracking-wide text-sm transition-all duration-200 active:scale-95 shadow-lg ${currentTheme.btn}`}
          >
            Got It
          </button>
          
          {/* Footer Date Section */}
          <div className="flex items-center justify-center gap-1.5 text-gray-500">
            <Calendar size={13} />
            <span className="text-xs font-medium tracking-wider uppercase">{todayDate}</span>
          </div>
        </div>
      </div>

      <style>{`
        /* Minimalist Scrollbar for Dark Mode */
        .custom-scroll { scrollbar-width: thin; scrollbar-color: #374151 transparent; }
        .custom-scroll::-webkit-scrollbar { width: 3px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #374151; border-radius: 10px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: #4b5563; }
      `}</style>
    </div>
  );
};

export default MessageModal;