const mongoose = require("mongoose");

const withdrawalSchema = new mongoose.Schema({
  // 🔥 FIX: `Number` ko `String` kiya hai kyunki "WF1757652" ek string hai
  userId: { type: String, required: true },
  name: { type: String, default: "-" },

  source: {
    type: String,
    required: true
  },

  poolLevel: { 
    type: Number, 
    default: 0 
  },

  grossAmount: { type: Number, required: true },
  fee: { type: Number, default: 0 },
  netAmount: { type: Number, default: 0 },

  walletUsed: { type: Number, default: 0 },
  incomeUsed: { type: Number, default: 0 },

  walletAddress: { type: String, default: "" },
  txnHash: { type: String, default: "" },

  status: { 
    type: String, 
    enum: ["pending", "approved", "rejected", "processing"],
    default: "pending" 
  },

  remarks: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },

  schedule: [
    {
      day: String,
      date: String,
      percent: Number,
      grossAmount: { type: Number, default: 0 },
      fee: { type: Number, default: 0 },
      netAmount: { type: Number, default: 0 },
      walletUsed: { type: Number, default: 0 },
      incomeUsed: { type: Number, default: 0 },
      status: { type: String, default: "pending" },
      walletAddress: { type: String, default: "" }
    }
  ]
});

module.exports = mongoose.model("Withdrawal", withdrawalSchema);