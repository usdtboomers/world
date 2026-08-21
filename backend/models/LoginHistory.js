const mongoose = require('mongoose');

const loginHistorySchema = new mongoose.Schema({
  userId: { type: String, required: true }, // 🔥 String kar diya taaki "WF..." IDs bina error save hon
  name: { type: String },
  mobile: { type: String }, 
  ipAddress: { type: String }
}, { timestamps: true }); // 🔥 YE LINE DATE AUR TIME AUTO-SAVE KAREGI (createdAt)

module.exports = mongoose.model('LoginHistory', loginHistorySchema);