// const mongoose = require('mongoose');

// const autoCompoundPackageSchema = new mongoose.Schema({
//     userId: {
//         type: String, 
//         required: true
//     },
//     memberId: {
//         type: String,
//         required: true
//     },
//     purchasedBy: {
//         type: String,
//         required: true
//     },
//     packageAmount: {
//         type: Number,
//         required: true
//     },
//     dailyPercentage: {
//         type: Number,
//         default: 6 // 6% daily fixed for Auto Compound
//     },
//     totalDays: {
//         type: Number,
//         default: 25 // Har package (master ho ya child) sirf 25 din jiyega
//     },
//     // 🔥 NAYE FIELDS (For Compounding Logic)
//     compoundingDuration: {
//         type: Number, // User ne kya select kiya: 25, 50, ya 100 din
//         required: true
//     },
//     compoundingEndDate: {
//         type: Date, // Kis date ke baad reinvest hona (child banna) band ho jayega
//         required: true
//     },
//     packageType: {
//         type: String,
//         enum: ['master', 'child'], // Pehla package 'master', daily banne wale 'child'
//         required: true
//     },
//     masterId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'AutoCompoundPackage',
//         default: null // Child packages ke case mein yahan Master ka ObjectId aayega
//     },
//     // ===================================
//     daysCompleted: {
//         type: Number,
//         default: 0
//     },
//     startDate: {
//         type: Date,
//         default: Date.now
//     },
//     endDate: {
//         type: Date, // Exact 25 din wali expiry date
//         required: true
//     },
//     status: {
//         type: String,
//         default: 'active'
//     }
// }, { timestamps: true });

// module.exports = mongoose.model('AutoCompoundPackage', autoCompoundPackageSchema);




const mongoose = require('mongoose');

const autoCompoundPackageSchema = new mongoose.Schema({
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
    dailyPercentage: {
        type: Number,
        default: 1 // 🔥 UPDATE: 1% daily fixed
    },
    totalDays: {
        type: Number,
        default: 70 // 🔥 UPDATE: Har package strictly 70 din jiyega
    },
    compoundingDuration: {
        type: Number, 
        default: 70 // 🔥 UPDATE: Fixed 70 days cycle
    },
    compoundingEndDate: {
        type: Date, 
        required: true
    },
    packageType: {
        type: String,
        enum: ['master', 'child'], 
        default: 'master' // Naye plan me sirf master banega
    },
    masterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AutoCompoundPackage',
        default: null 
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
        type: Date, // Exact 70 din wali expiry date
        required: true
    },
    status: {
        type: String,
        default: 'active'
    }
}, { timestamps: true });

module.exports = mongoose.model('AutoCompoundPackage', autoCompoundPackageSchema);