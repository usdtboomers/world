const mongoose = require('mongoose');

const DummyTransactionSchema = new mongoose.Schema({
  // 🔥 FIXED: Isko String kiya hai kyunki ID "WF..." format me aayegi
  userId: { type: String, required: true }, 
  name: { type: String }, // Hum loop se bhej rahe hain
  amount: { type: Number, required: true },
  type: { type: String, required: true }, // "deposit" ya "withdrawal"
  hash: { type: String }, // Blockchain ka hash save karne ke liye
  status: { type: String, default: "Success" }, // Status pass karne ke liye
  description: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.DummyTransaction || mongoose.model('DummyTransaction', DummyTransactionSchema);