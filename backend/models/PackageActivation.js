const mongoose = require('mongoose');

const packageActivationSchema = new mongoose.Schema({
    userId: {
        type: String, 
        required: true
    },
    memberId: {
        type: String,
        required: true
    },
    purchasedBy: {
        type: String,
        required: true
    },
    packageAmount: {
        type: Number,
        required: true
    },
    dailyRoi: {
        type: Number,
        required: true
    },
    totalDays: {
        type: Number,
        default: 25
    },
    daysCompleted: {
        type: Number,
        default: 0
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        default: 'active'
    }
}, { timestamps: true });

module.exports = mongoose.model('PackageActivation', packageActivationSchema);