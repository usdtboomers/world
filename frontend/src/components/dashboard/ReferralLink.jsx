import React, { useState } from "react";
import { Copy, Check } from "lucide-react"; // ClipboardCopy ki jagah Copy icon zyada match karta hai

const ReferralLinkBox = ({ link }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2s
  };

  return (
    <div className="bg-white border border-gray-200 rounded shadow-sm w-full mb-6">
      
      {/* HEADER: Jaise image mein upar title aur line hai */}
      <div className="border-b border-gray-200 px-4 py-3 bg-[#fafbfc]">
        <h3 className="text-gray-800 text-[1.05rem] font-medium">
          Referral Link
        </h3>
      </div>

      {/* BODY: Input box aur attached blue button */}
      <div className="p-4 bg-white">
        <div className="flex items-stretch w-full max-w-3xl">
          {/* LINK INPUT */}
          <input
            type="text"
            readOnly
            value={link}
            onFocus={(e) => e.target.select()}
            className="w-full bg-[#f1f3f5] border border-gray-300 border-r-0 text-[#305a86] px-3 py-2 text-sm sm:text-base focus:outline-none rounded-l"
          />
          
          {/* BLUE COPY BUTTON */}
          <button 
            onClick={handleCopy}
            className="bg-[#0d6efd] hover:bg-blue-600 text-white px-4 flex items-center justify-center rounded-r transition-colors active:bg-blue-700"
            title="Copy Link"
          >
            {copied ? (
              <Check size={18} strokeWidth={2.5} />
            ) : (
              <Copy size={18} strokeWidth={2.5} />
            )}
          </button>
        </div>
      </div>
      
    </div>
  );
};

export default ReferralLinkBox;