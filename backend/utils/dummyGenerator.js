const User = require("../models/User"); 
// 🔥 IMPORT ME DONO CHEEZEIN NIKALI HAIN (Destructuring)
const { countryNames, countriesProbability } = require("./fakeData"); 

const generateUniqueDummyId = async () => {
    try {
        let isUnique = false;
        let newUserId = "";
        
        while (!isUnique) {
            const random7Digit = Math.floor(1000000 + Math.random() * 9000000);
            newUserId = `WF${random7Digit}`;

            const existingUser = await User.findOne({ userId: newUserId });
            if (!existingUser) {
                isUnique = true; 
            }
        }
        return newUserId;
    } catch (error) {
        console.error("❌ [Dummy Gen] ID Generation DB Error:", error.message);
        const fallbackId = `WF${Math.floor(1000000 + Math.random() * 9000000)}`;
        return fallbackId;
    }
};

const generateName = () => {
    // 🔥 SAFETY: Check if imports are working
    if (!countriesProbability || !countryNames) {
        return "User" + Math.floor(1000 + Math.random() * 9000);
    }

    // 1. Aapke 100-item array se random country pick karo
    const randomIndex = Math.floor(Math.random() * countriesProbability.length);
    const selectedCountry = countriesProbability[randomIndex];

    // 2. Uss country ka names array nikalo
    const namesArray = countryNames[selectedCountry];
    
    // 🔥 BULLETPROOF CHECK
    if (!namesArray || namesArray.length === 0) {
        return "User" + Math.floor(1000 + Math.random() * 9000); 
    }

    // 3. Array se ek random naam pick karo
    const randomName = namesArray[Math.floor(Math.random() * namesArray.length)];
    
    console.log(`👤 [Dummy Gen] Name Selected: ${randomName} (${selectedCountry})`); 
    return randomName;
};

module.exports = { generateUniqueDummyId, generateName };