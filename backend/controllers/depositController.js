const { ethers, HDNodeWallet } = require("ethers");
const mongoose = require("mongoose");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const Deposit = require("../models/Deposit"); 
require("dotenv").config();

// 🔥 PREMIUM RPC (Sirf Sweep/Transfer aur Manual Check ke liye)
const primaryProvider = new ethers.JsonRpcProvider(process.env.RPC_URL_PRIMARY);

const usdtAbi = [
    "function balanceOf(address owner) view returns (uint256)", 
    "function transfer(address to, uint256 amount) returns (bool)"
];

// 🆓 FREE PUBLIC RPC POOL (Backup Cron Checking ke liye taaki credits bachein)
const freeRpcUrls = [
    "https://bsc-dataseed.binance.org/",
    "https://binance.llamarpc.com",
    "https://1rpc.io/bnb",
    "https://bsc.meowrpc.com",
    "https://bsc-dataseed1.defibit.io/"
];

const getRandomFreeProvider = () => {
    const randomIndex = Math.floor(Math.random() * freeRpcUrls.length);
    return new ethers.JsonRpcProvider(freeRpcUrls[randomIndex]);
};

// ==========================================
// 🛡️ SUPER ROBUST USER FINDER
// ==========================================
const findUserRobustly = async (rawId) => {
    if (!rawId) return null;
    let user = null;
    const strId = String(rawId).trim();

    if (mongoose.Types.ObjectId.isValid(strId)) {
        user = await User.findById(strId);
    }
    
    if (!user) {
        user = await User.findOne({ userId: strId });
    }
    
    if (!user && !isNaN(strId)) {
        user = await User.findOne({ userId: Number(strId) });
    }
    
    if (!user) {
        const onlyNumbers = strId.replace(/\D/g, ''); 
        if (onlyNumbers) {
            user = await User.findOne({ userId: onlyNumbers }); 
            if (!user) {
                user = await User.findOne({ userId: Number(onlyNumbers) }); 
            }
        }
    }
    
    return user;
};

// ==========================================
// 1. GENERATE DEPOSIT ADDRESS
// ==========================================
const getDepositAddress = async (req, res) => {
    try {
        const rawUserId = req.user.userId || req.user.id || req.user._id;
        const user = await findUserRobustly(rawUserId);
        
        if (!user) return res.status(404).json({ message: "User not found" });
        if (user.depositAddress) return res.json({ address: user.depositAddress });

        const pathIndex = parseInt(user._id.toString().substring(0, 8), 16); 
        const hdNode = HDNodeWallet.fromPhrase(process.env.MNEMONIC);
        const userWallet = hdNode.derivePath(`44'/60'/0'/0/${pathIndex}`); 
        
        user.depositAddress = userWallet.address;
        await user.save();

        res.json({ address: user.depositAddress });
    } catch (error) {
        console.error("Generate Address Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// 🛡️ HELPER: Free check for balance
async function checkUsdtBalanceFree(address) {
    let retries = 2; 
    while (retries > 0) {
        try {
            const freeProvider = getRandomFreeProvider();
            const freeContract = new ethers.Contract(process.env.USDT_CONTRACT_ADDRESS, usdtAbi, freeProvider);
            return await freeContract.balanceOf(address);
        } catch (err) {
            retries--;
            if (retries === 0) return 0n; 
        }
    }
}

// ==========================================
// 💎 2. SWEEP FUNDS (Ultra-Optimized Gas & Balance Check)
// ==========================================
const sweepFunds = async (user_id) => {
    try {
        const user = await findUserRobustly(user_id);
        if (!user || !user.depositAddress) return;

        // Pehle free RPC se check kiya
        let usdtWei = await checkUsdtBalanceFree(user.depositAddress);
        let amountInUSDT = parseFloat(ethers.formatUnits(usdtWei, 18));

        if (amountInUSDT < 0.1) return; 

        console.log(`\n💰💰 [DEPOSIT DETECTED] ${amountInUSDT} USDT for User ${user.userId}... Preparing Sweep!`);

        const pathIndex = parseInt(user._id.toString().substring(0, 8), 16); 
        const hdNode = HDNodeWallet.fromPhrase(process.env.MNEMONIC);
        
        const userWallet = hdNode.derivePath(`44'/60'/0'/0/${pathIndex}`).connect(primaryProvider);
        const userUsdtContract = new ethers.Contract(process.env.USDT_CONTRACT_ADDRESS, usdtAbi, userWallet);
        const gasFunderWallet = new ethers.Wallet(process.env.GAS_FUNDER_PRIVATE_KEY, primaryProvider);

        // 🔥 CALL_EXCEPTION FIX 1: Exact balance check from Premium RPC just before transfer
        const exactUsdtWei = await userUsdtContract.balanceOf(user.depositAddress);
        if (exactUsdtWei === 0n) {
            console.log("⚠️ Actual balance on Premium RPC is 0. Skipping to prevent CALL_EXCEPTION.");
            return;
        }

        // 🔥 SMART GAS CALCULATION (Admin ka BNB bachane ke liye)
        const bnbWei = await primaryProvider.getBalance(user.depositAddress);
        const feeData = await primaryProvider.getFeeData();
        const gasPrice = feeData.gasPrice || ethers.parseUnits("3", "gwei");

        const gasLimit = 90000n; // BEP-20 USDT transfer perfectly takes ~65k-80k gas. 90k is extremely safe.
        const exactBnbNeeded = gasLimit * gasPrice; 
        
        // Exact BNB + Sirf 5% extra buffer (Taki transaction fail na ho, aur BNB waste na ho)
        const safeBnbNeeded = (exactBnbNeeded * 105n) / 100n; 

        if (bnbWei < safeBnbNeeded) {
            const bnbToFund = safeBnbNeeded - bnbWei;
            console.log(`⛽ Exact gas required. Sending ${ethers.formatEther(bnbToFund)} BNB...`);
            
            const gasTx = await gasFunderWallet.sendTransaction({ 
                to: userWallet.address, 
                value: bnbToFund 
            });
            await gasTx.wait(1); // Wait for blockchain confirmation
            await new Promise(resolve => setTimeout(resolve, 3000)); // Extra safe wait
        }

        console.log(`📤 Executing USDT transfer to Central Wallet...`);
        const sweepTx = await userUsdtContract.transfer(process.env.CENTRAL_WALLET_ADDRESS, exactUsdtWei, {
            gasLimit: gasLimit
        });
        
        const receipt = await sweepTx.wait(1); 
        const actualHash = receipt.hash; 

        // 🔥 UPDATE DATABASE: Direct 'walletBalance' me add kar diya!
        const finalSweptAmount = parseFloat(ethers.formatUnits(exactUsdtWei, 18));
        user.walletBalance = (user.walletBalance || 0) + finalSweptAmount; // <-- YAHAN CHANGE KIYA HAI
        await user.save();
        
        await Transaction.create({
            userId: user.userId,
            amount: finalSweptAmount,
            type: 'deposit',
            status: 'completed', 
            description: `Auto-Deposit of ${finalSweptAmount} USDT via BEP-20`,
            date: new Date(),
            txHash: actualHash,  
            txnHash: actualHash  
        });

        await Deposit.create({
            userId: user.userId,
            amount: finalSweptAmount,
            txnHash: actualHash, 
            status: 'approved',
            createdAt: new Date()
        });

        console.log(`✅ [SUCCESS] ${finalSweptAmount} USDT swept! Added to walletBalance. Hash: ${actualHash}`);

        // --- BNB RECOVERY (Bacha hua BNB wapas Gas Funder mein dalne ka logic) ---
        try {
            const currentBnbBalance = await primaryProvider.getBalance(userWallet.address);
            const freshFeeData = await primaryProvider.getFeeData();
            const costToSendBnb = 21000n * freshFeeData.gasPrice; 

            if (currentBnbBalance > costToSendBnb) {
                const sweepableBnb = currentBnbBalance - costToSendBnb;
                if (sweepableBnb > ethers.parseEther("0.0001")) { 
                    const bnbSweepTx = await userWallet.sendTransaction({
                        to: gasFunderWallet.address, 
                        value: sweepableBnb
                    });
                    await bnbSweepTx.wait();
                }
            }
        } catch (bnbError) {
            console.log(`⚠️ BNB recovery skipped: ${bnbError.message}`);
        }

    } catch (error) {
        console.error(`❌ Sweep Failed for User ${user_id}:`, error.code || error.message);
    }
};

// ==========================================
// 🚀 3. USER-TRIGGERED MANUAL CHECK
// ==========================================
const verifyAndProcessDeposit = async (req, res) => {
    try {
        const rawUserId = req.user.userId || req.user.id || req.user._id;
        const user = await findUserRobustly(rawUserId);
        
        if (!user || !user.depositAddress) {
            return res.status(400).json({ success: false, message: "Deposit address not found. Please generate one first." });
        }

        console.log(`🔍 [MANUAL CHECK] User ${user.userId} checking deposit on ${user.depositAddress}`);

        const userUsdtContract = new ethers.Contract(process.env.USDT_CONTRACT_ADDRESS, usdtAbi, primaryProvider);
        const usdtWei = await userUsdtContract.balanceOf(user.depositAddress);
        const amountInUSDT = parseFloat(ethers.formatUnits(usdtWei, 18));

        if (amountInUSDT < 0.1) {
            return res.status(400).json({ 
                success: false, 
                message: "No deposit found yet. If you just sent it, please wait 1-2 minutes for blockchain confirmation." 
            });
        }

        res.json({ 
            success: true, 
            message: `Success! ${amountInUSDT} USDT detected. It is being credited to your wallet in a few seconds.` 
        });

        // Background sweep
        sweepFunds(user._id).catch(err => console.error("Background sweep error:", err));

    } catch (error) {
        console.error("Manual Deposit Check Error:", error);
        res.status(500).json({ success: false, message: "Error checking deposit. Please try again." });
    }
};

module.exports = {
    getDepositAddress,
    sweepFunds,
    verifyAndProcessDeposit
};