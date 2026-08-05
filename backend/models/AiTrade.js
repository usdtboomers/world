const mongoose = require('mongoose');

const aiTradeSchema = new mongoose.Schema({
  symbol: { type: String, required: true, unique: true },
  pair: { type: String, required: true },
  side: { type: String, required: true }, // 'Long' ya 'Short'
  leverage: { type: Number, required: true },
  entryPrice: { type: Number, required: true },
  status: { type: String, default: 'open' }
}, { timestamps: true });

module.exports = mongoose.model('AiTrade', aiTradeSchema);