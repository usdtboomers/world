const mongoose = require('mongoose');

const fakeUserSchema = new mongoose.Schema({
    // 🔥 Type 'String' kiya gaya hai kyunki ab ID 'WF1234567' format me aayegi
    userId: { 
        type: String, 
        required: true,
        unique: true 
    },
    name: { 
        type: String, 
        required: true 
    },
    package: { 
        type: Number, 
        default: 30 
    },
    country: { 
        type: String, 
        default: "India" 
    },
    isToppedUp: { 
        type: Boolean, 
        default: true 
    }, 
    topUpAmount: { 
        type: Number, 
        default: 30 
    }, 
    date: { 
        type: Date, 
        default: Date.now 
    }
}, { 
    timestamps: true // createdAt aur updatedAt auto-handle karega
});

module.exports = mongoose.model('FakeUser', fakeUserSchema);