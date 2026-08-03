// models/SystemStat.js (Ek naya file banega)
const mongoose = require('mongoose');

const systemStatSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true }, // Format: "YYYY-MM-DD" taaki har din ka alag hisaab rahe
  todayFakeUsdtAmount: { type: Number, default: 0 },    // Aaj ka fake deposit
  totalFakeUsdtAmount: { type: Number, default: 0 }     // Ab tak ka total fake deposit
});

module.exports = mongoose.model('SystemStat', systemStatSchema);