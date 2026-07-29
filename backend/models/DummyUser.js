const mongoose = require('mongoose');

const DummyUserSchema = new mongoose.Schema({
  // 🔥 ID aur Sponsor ID ko String kar diya hai "WF" format ke liye
  userId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String },
  password: { type: String },
  country: { type: String },
  mobile: { type: String },
  isDummy: { type: Boolean, default: true },
  topUpAmount: { type: Number, default: 0 },
  withdrawAmount: { type: Number, default: 0 }, // 🔥 NAYA FIELD ADD KIYA HAI WITHDRAW KE LIYE
  sponsorId: { type: String }, 
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.DummyUser || mongoose.model('DummyUser', DummyUserSchema);