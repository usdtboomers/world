const mongoose = require('mongoose');

const luckyWinnerSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String },
    amount: { type: Number, required: true, enum: [50, 100] },
    month: { type: String, required: true }, // Format: "YYYY-MM" (e.g., "2026-09")
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LuckyWinner', luckyWinnerSchema);