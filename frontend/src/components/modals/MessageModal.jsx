import React from "react";
import { 
  X, 
  Info, 
  CheckCircle2, 
  AlertCircle, 
  TriangleAlert 
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

  // 🔥 THEME CONFIG: Dark Theme ke hisaab se high-contrast colors
  const theme = {
    success: {
      text: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30",
      icon: CheckCircle2,
      btn: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500 hover:text-[#0b1221]"
    },
    error: {
      text: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/30",
      icon: AlertCircle,
      btn: "bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500 hover:text-white"
    },
    warning: {
      text: "text-[#eab308]", // Gold Color
      bg: "bg-[#eab308]/10",
      border: "border-[#eab308]/30",
      icon: TriangleAlert,
      btn: "bg-[#eab308]/10 text-[#eab308] border-[#eab308]/30 hover:bg-[#eab308] hover:text-[#0b1221]"
    },
    info: {
      text: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/30",
      icon: Info,
      btn: "bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500 hover:text-white"
    },
  };

  const currentTheme = theme[type] || theme.info;
  const Icon = currentTheme.icon;

  return (
    <div
      className="fixed inset-0 bg-[#0b1221]/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300"
      style={{ zIndex }}
    >
      {/* Modal Box - Dark Navy Background */}
      <div className="bg-[#131c31] rounded-[24px] border border-gray-700 shadow-2xl w-full max-w-sm flex flex-col relative overflow-hidden transform scale-100 transition-all">
        
        {/* Soft Ambient Glow - Type ke hisaab se color change hoga */}
        <div className={`absolute top-0 right-0 w-32 h-32 ${currentTheme.bg} blur-[60px] pointer-events-none rounded-full`}></div>

        {/* Header with Close Icon */}
        <div className="flex justify-end p-3 relative z-10">
           <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white">
              <X size={18} />
           </button>
        </div>

        {/* Icon Section */}
        <div className="flex flex-col items-center px-6 pb-2 relative z-10">
          <div className={`p-4 rounded-2xl ${currentTheme.bg} ${currentTheme.text} border ${currentTheme.border} mb-4 shadow-sm`}>
            <Icon size={32} strokeWidth={2.5} />
          </div>

          {/* Title */}
          <h2 className={`text-xl font-black uppercase tracking-widest text-center mb-2 ${currentTheme.text}`}>
            {title}
          </h2>

          {/* Scrollable Message Area - High Contrast Text */}
          <div className="max-h-40 overflow-y-auto px-2 custom-scroll w-full text-center">
            <p className="text-sm text-gray-300 font-medium leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        {/* OK Button */}
        <div className="p-6 relative z-10">
          <button
            onClick={onClose}
            className={`w-full py-3.5 rounded-xl font-black uppercase tracking-widest text-xs border transition-all duration-200 active:scale-95 ${currentTheme.btn}`}
          >
            Acknowledge
          </button>
        </div>
      </div>

      <style>{`
        /* Custom Scrollbar for Dark Mode */
        .custom-scroll { scrollbar-width: thin; scrollbar-color: #374151 transparent; }
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #374151; border-radius: 10px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: #eab308; }
      `}</style>
    </div>
  );
};

export default MessageModal;