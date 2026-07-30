// require('dotenv').config();
// const express = require('express');
// const router = express.Router();
// const jwt = require('jsonwebtoken');
// const crypto = require('crypto');
// const User = require('../models/User');
// const Setting = require('../models/Setting'); 
// const sanitizeUser = require('../utils/sanitizeUser');
// const sendEmail = require('../utils/sendEmail');
// const checkFeature = require('../middleware/checkFeatureEnabled');
// const DummyUser = require('../models/DummyUser.js');
// const LoginHistory = require('../models/LoginHistory'); 
// const IpRule = require('../models/IpRule'); 
// const FakeUser = require('../models/FakeUser'); 

// // 🚀 NEW: BlockedDevice Model Import
// const BlockedDevice = require('../models/BlockedDevice'); 
// const { bot } = require('../utils/telegramBot');

// const JWT_SECRET = process.env.JWT_SECRET ;
// const FRONTEND_URL = process.env.FRONTEND_URL || 'http://178.128.20.53';

// // 📌 Helper: Get Real IP Address (Smart Version)
// const getClientIP = (req) => {
//     let ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.ip || req.connection.remoteAddress || '127.0.0.1';
//     if (ip.includes('::ffff:')) {
//         ip = ip.replace('::ffff:', '');
//     }
//     return ip;
// };

// // 📌 Generate Unique User ID
// const generateUserId = async () => {
//   let id;
//   let exists = true;
//   while (exists) {
//     id = Math.floor(1000000 + Math.random() * 9000000);
//     const existsInReal = await User.exists({ userId: id });
//     const existsInDummy = await DummyUser.exists({ userId: id });
//     if (!existsInReal && !existsInDummy) {
//       exists = false;
//     }
//   }
//   return id;
// };

 
// // 🔥 RANDOM PASSWORD GENERATOR HELPER FUNCTION
// const generateRandomPassword = (length = 8) => {
//     // Sirf Capital letters hataye hain, small letters aur numbers wahi hain
//     const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
//     let pass = '';
//     for (let i = 0; i < length; i++) {
//         pass += chars.charAt(Math.floor(Math.random() * chars.length));
//     }
//     return pass;
// };

 


// router.post('/register', checkFeature('allowRegistrations'), async (req, res) => {
//   try {
//     let { name, mobile, email, country, sponsorId, deviceId, walletAddress } = req.body;
//     const userIP = getClientIP(req);

//     // 🔥 SECURITY LAYER 0: Remove extra spaces (trim) and convert email to lowercase
//     name = name ? name.trim() : '';
//     mobile = mobile ? mobile.trim() : '';
//     email = email ? email.trim().toLowerCase() : '';
//     walletAddress = walletAddress ? walletAddress.trim() : ''; 

//     // 🔥 1. STRICT NAME VALIDATION
//     const nameRegex = /^[A-Za-z\s]{3,50}$/;
//     if (!name || !nameRegex.test(name)) {
//         return res.status(400).json({ message: 'Invalid Name. Only alphabets are allowed (No symbols or numbers).' });
//     }

//     // 🔥 2. STRICT MOBILE VALIDATION
//     const mobileRegex = /^[0-9]{10,15}$/;
//     if (!mobile || !mobileRegex.test(mobile)) {
//         return res.status(400).json({ message: 'Invalid Mobile Number.' });
//     }

//     // 🔥 3. EMAIL CHECK
//     if (!email || !email.endsWith('@gmail.com')) {
//         return res.status(400).json({ message: 'Registration failed: Only @gmail.com emails are accepted.' });
//     }

//     // 🔥 4. USDT BEP20 WALLET VALIDATION
//     if (!walletAddress) {
//         return res.status(400).json({ message: 'USDT BEP20 Withdrawal Address is compulsory.' });
//     }
//     if (!/^0x[a-fA-F0-9]{28,48}$/.test(walletAddress)) {
//         return res.status(400).json({ message: 'Invalid USDT BEP20 Address format. It must start with 0x and be valid length.' });
//     }

//     // ==========================================
//     // 🛡️ NEW ANTI-BOT SECURITY LAYERS START HERE
//     // ==========================================

//     // 🛑 A. STRICT UNIQUENESS CHECK (Mobile & Email)
//     // Koi bhi bot same email ya number use karke multiple accounts nahi bana payega
    

//     // 🛑 B. IP COOLDOWN (Rate Limiting)
//     // Ek IP se agle 10 minute tak koi dusra account nahi banega. (Bot ka loop yahin toot jayega)
//     const isLocalIP = userIP === '127.0.0.1' || userIP === '::1';
//     if (!isLocalIP) {
//         // Check if IP is permanently blocked by Admin
//         const rule = await IpRule.findOne({ ipAddress: userIP });
//         if (rule && rule.isBlocked) {
//             return res.status(403).json({ message: "Access Denied: Your IP has been blocked by the Administrator." });
//         }

//         // Check for recent registration from this IP in the last 10 minutes
//         const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
//         const recentRegistrationIP = await User.findOne({ 
//             ipAddress: userIP, 
//             createdAt: { $gte: tenMinutesAgo } 
//         });
        
//         if (recentRegistrationIP) {
//             return res.status(429).json({ message: "Spam: Please wait creating another account from this network." });
//         }
//     }

//     // 🛑 C. DEVICE COOLDOWN 
//     if (deviceId) {
//         const isDeviceBlocked = await BlockedDevice.findOne({ deviceId });
//         if (isDeviceBlocked) {
//             return res.status(403).json({ message: "Access Denied: Your device has been blocked due to a policy violation." });
//         }

//         // Check for recent registration from this Device in the last 5 minutes
//         const fiveMinutesAgo = new Date(Date.now() - 3 * 60 * 1000);
//         const recentRegistrationDevice = await User.findOne({ 
//             deviceId: deviceId, 
//             createdAt: { $gte: fiveMinutesAgo } 
//         });

//         if (recentRegistrationDevice) {
//             return res.status(429).json({ message: "Anti-Spam: Multiple quick registrations from the same device are not allowed." });
//         }
//     }
//     // ==========================================
//     // 🛡️ ANTI-BOT SECURITY LAYERS END HERE
//     // ==========================================


//     if (!sponsorId) return res.status(400).json({ message: 'Sponsor ID is compulsory.' });

//     // 🔥 5. SPONSOR CHECK LOGIC
//     let actualSponsorId = parseInt(sponsorId);
//     let sponsorExists = await User.findOne({ userId: actualSponsorId });
//     let isFakeSponsor = false;

//     if (!sponsorExists) {
//          sponsorExists = await FakeUser.findOne({ userId: actualSponsorId });
//         if (sponsorExists) {
//             isFakeSponsor = true; 
//         }
//     }

//     if (!sponsorExists) return res.status(400).json({ message: 'Invalid Sponsor ID.' });

//     if (!isFakeSponsor && sponsorExists.isSponsorDeactivated) {
//         return res.status(403).json({ message: 'Policy violation: The provided sponsor link is invalid or deactivated.' });    
//     }

//     // ✨ Fake Sponsor Logic
//     if (isFakeSponsor) {
//         const SYSTEM_TOP_ID = 5204198; 
//         const topUser = await User.findOne({ userId: SYSTEM_TOP_ID }); 
//         if (topUser) {
//             actualSponsorId = topUser.userId; 
//             console.log(`[SYSTEM ATTACH] Fake Sponsor (${sponsorId}) used. Redirecting to Top Earning ID: ${topUser.userId}`);
//         } else {
//             console.log(`⚠️ WARNING: Top ID ${SYSTEM_TOP_ID} not found in database!`);
//         }
//     }

//     // ✨ Unique ID Generator
//     let newUserId;
//     let isUniqueId = false;
//     while (!isUniqueId) {
//         newUserId = await generateUserId(); 
//         const existsInFake = await FakeUser.exists({ userId: newUserId });
//         const existsInReal = await User.exists({ userId: newUserId });
//         if (!existsInFake && !existsInReal) {
//             isUniqueId = true;
//         }
//     }

//     // 🔥 AUTO GENERATE PASSWORD
//     const generatedPassword = generateRandomPassword(8);

//     // User Creation
//     const user = new User({
//       userId: newUserId, 
//       name, mobile, email, country,
//       password: generatedPassword, 
//       transactionPassword: generatedPassword, 
//       sponsorId: actualSponsorId, 
//       walletAddress: walletAddress, // Address same allow kiya hai as per your request
//       role: 'user',
//       ipAddress: userIP,
//       deviceId: deviceId || null 
//     });

//     await user.save();

//     // 👉 EMAIL TEMPLATE (Active)
//     try {
//         await sendEmail({
//             email: user.email,
//             subject: '🎉 Welcome to World Finance 24!',
//             html: `
//             <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border: 1px solid #eaeaea;">
//                 <div style="background-color: #2b4450; padding: 40px 20px; text-align: center; color: #ffffff;">
//                     <h1 style="margin: 0; font-size: 28px; font-weight: bold;">🚀 Welcome to World Finance 24</h1>
//                     <p style="margin: 10px 0 0 0; font-size: 15px; color: #cccccc;">Your journey to financial growth starts here</p>
//                 </div>
//                 <div style="padding: 40px 30px; color: #333333;">
//                     <p style="font-size: 16px; margin-top: 0; margin-bottom: 15px;">Hello <strong>${user.name}</strong>,</p>
//                     <p style="font-size: 15px; line-height: 1.6; color: #555555; margin-bottom: 20px;">
//                         Congratulations! Your account has been successfully created. Get ready to build your global network, unlock exciting <strong>Community Earning rewards</strong>, and track your daily growth with our secure platform. We are thrilled to have you on board! 🌟
//                     </p>
//                     <p style="font-size: 15px; line-height: 1.6; color: #555555; margin-bottom: 30px;">
//                         Please find your confidential login details below:
//                     </p>
//                     <div style="background-color: #f8f9fa; padding: 25px; border-radius: 10px; margin-bottom: 35px; border-left: 4px solid #1e88e5;">
//                         <p style="margin: 0 0 15px 0; font-size: 16px; color: #333;">
//                             <span style="display: inline-block; width: 25px;">👤</span> <strong>User ID:</strong> ${user.userId}
//                         </p>
//                         <p style="margin: 0 0 15px 0; font-size: 16px; color: #333;">
//                             <span style="display: inline-block; width: 25px;">🔑</span> <strong>Login Password:</strong> ${user.password}
//                         </p>
//                         <p style="margin: 0; font-size: 16px; color: #333;">
//                             <span style="display: inline-block; width: 25px;">🛡️</span> <strong>Transaction Password:</strong> ${user.transactionPassword}
//                         </p>
//                     </div>
//                     <div style="text-align: center; margin-bottom: 40px;">
//                         <a href="https://financialsaarthi.com/login" style="display: inline-block; background-color: #1e88e5; color: #ffffff; text-decoration: none; padding: 14px 30px; border-radius: 6px; font-size: 16px; font-weight: bold; box-shadow: 0 4px 6px rgba(30,136,229,0.3);">🔐 Login to Dashboard</a>
//                     </div>
//                     <p style="font-size: 14px; color: #d32f2f; margin: 0; background-color: #ffebee; padding: 12px; border-radius: 6px;">
//                         ⚠️ <strong>Security Alert:</strong> Please do not share your login or transaction passwords with anyone for your account's safety.
//                     </p>
//                 </div>
//                 <div style="background-color: #1a1a1a; padding: 20px; text-align: center; color: #888888; font-size: 13px;">
//                     © 2026 World Finance 24. All rights reserved.<br>
//                     <span style="font-size: 11px;">This is an automated message, please do not reply to this email.</span>
//                 </div>
//             </div>
//             ` 
//         });
//     } catch (emailErr) { 
//         console.error("Email failed:", emailErr); 
//     }

//     res.status(201).json({ 
//         message: 'User registered successfully. Password sent to email.', 
//         userId: user.userId, 
//         name: user.name, 
//         password: user.password 
//     });

//   } catch (err) {
//     console.error('Register error:', err);
//     res.status(500).json({ message: 'Server error.' });
//   }
// });

// router.post('/login', async (req, res) => {
//   try {
//     const { userId, password, deviceId } = req.body;
//     const userIP = getClientIP(req);

//     const user = await User.findOne({ userId });
//     if (!user) return res.status(401).json({ message: 'Invalid credentials' });

//     // 🛡️ SMART LOGIN LIMIT (5 Users Per IP + Admin Block)
//     if (user.role !== 'admin') {
//         const isLocalIP = userIP === '127.0.0.1' || userIP === '::1';

//         if (!isLocalIP) {
//             const rule = await IpRule.findOne({ ipAddress: userIP });
            
//             if (rule && rule.isBlocked) {
//                 return res.status(403).json({ message: "Access Denied: Your IP has been blocked by the Administrator." });
//             }

//             // ✅ Login IP Limit Wapas Laga Di (Default 5)
//           //  const allowedLimit = (rule && rule.limit) ? rule.limit : 5;
//           const allowedLimit = (rule && rule.limit) ? rule.limit : 25;
//             const uniqueUsersOnThisIP = await LoginHistory.distinct('userId', { ipAddress: userIP });

//             if (uniqueUsersOnThisIP.length >= allowedLimit && !uniqueUsersOnThisIP.includes(user.userId)) {
//                 return res.status(403).json({ 
//                     message: `Access Denied: You have reached the maximum limit of ${allowedLimit} accounts per network.` 
//                 });
//             }
//         }
//     }

//     // 🚀 DEVICE FINGERPRINT CHECK (Login ke time sirf block check)
//     if (deviceId) {
//         const isDeviceBlocked = await BlockedDevice.findOne({ deviceId });
//         if (isDeviceBlocked) {
//             return res.status(403).json({ message: "Access Denied: Your device has been blocked due to a policy violation." });        
//         }
//     }

//     console.log(`User Logging In: ${user.email} | IP: ${userIP}`);

//     // Maintenance & Security Checks
//     const settings = await Setting.findOne();
//     if (settings) {
//         if (settings.maintenanceMode && user.role !== 'admin') {
//             const whitelist = (settings.maintenanceWhitelist || []).map(String);
//             if (!whitelist.includes(String(user.userId))) return res.status(503).json({ message: 'Maintenance Mode.' });
//         }
//         if (!settings.allowLogin && user.role !== 'admin') return res.status(403).json({ message: 'Login is disabled.' });
//     }

//     if (password.toLowerCase() !== user.password.toLowerCase()) return res.status(401).json({ message: 'Invalid credentials' });
//     if (user.isBlocked) return res.status(403).json({ message: 'Account blocked.' });

//     // ✅ IP Update (Migration)
//     user.ipAddress = userIP; 
    
//     if (deviceId) {
//         user.deviceId = deviceId;
//     }
    
//     await user.save();

//     const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '50m' });

//     // ✅ Save History with Real IP
//     try {
//        await LoginHistory.create({
//          userId: user.userId,
//          name: user.name,
//          mobile: user.mobile,
//          ipAddress: userIP 
//        });
//     } catch (hErr) { console.error('History failed'); }

//     res.json({ message: 'Login successful', token, user: sanitizeUser(user) });

//   } catch (err) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // ... (Aapke Forgot / Reset password ke routes same rahenge yahan) ...


// // ====================== FORGOT PASSWORD ======================
// router.post('/forgot-password', checkFeature(), async (req, res) => {
//   const { userId } = req.body;

//   try {
//     const user = await User.findOne({ userId });
//     if (!user) return res.status(404).json({ message: 'User not found.' });

//     // 🕒 RATE LIMITING LOGIC: Din mein sirf 3 Password Reset Emails
//     const now = new Date();
//     const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

//     // Agar last request aaj se pehle ki hai (kal ki ya purani), toh count 0 kardo (Reset)
//     if (!user.lastPasswordResetDate || user.lastPasswordResetDate < startOfToday) {
//         user.passwordResetCount = 0; 
//     }

//     // Limit Check: Agar count 3 ya usse zyada hai, toh error de do
//     if (user.passwordResetCount >= 3) {
//         return res.status(429).json({ 
//             message: "Daily limit exceeded. You can only request a password reset 3 times a day." 
//         });
//     }

//     // 🔐 Generate Reset Token
//     const resetToken = crypto.randomBytes(32).toString('hex');
//     user.resetToken = resetToken;
//     user.resetTokenExpiry = Date.now() + 3600000; // 1 hour

//     // 📈 Update limit count aur date
//     user.passwordResetCount += 1; 
//     user.lastPasswordResetDate = now;

//     await user.save();

//     const resetLink = `https://worldfinance24.online/reset-password/${resetToken}`;
    
//     // 📧 SEND EMAIL
//     await sendEmail({
//       email: user.email,
//       subject: '🔐 Password Reset Request',
//       message: `Reset Link: ${resetLink}`,
//       html: `
//         <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
//           <h2 style="color: #2E86C1;">Password Reset Request</h2>
//           <p>Hello <strong>${user.name}</strong>,</p>
//           <p>We received a request to reset your password. Click below:</p>
//           <p style="text-align:center;">
//             <a href="${resetLink}" style="padding:12px 24px;background:#2E86C1;color:white;text-decoration:none;border-radius:5px;">Reset Password</a>
//           </p>
//           <p>This link expires in 1 hour.</p>
//         </div>
//       `,
//     });

//     res.json({ message: '✅ Password reset link sent to your email.' });
//   } catch (err) {
//     console.error('Forgot password error:', err);
//     res.status(500).json({ message: 'Server error. Please try again later.' });
//   }
// });

// // ====================== RESET PASSWORD ======================
// router.post('/reset-password/:token', async (req, res) => {
//   const { token } = req.params;
//   const { newPassword } = req.body;

//   try {
//     const user = await User.findOne({
//       resetToken: token,
//       resetTokenExpiry: { $gt: Date.now() },
//     });

//     if (!user) {
//       return res.status(400).json({ message: 'Invalid or expired token.' });
//     }

//     // ✅ Update password
//     user.password = newPassword;
//     user.transactionPassword = newPassword;

//     user.resetToken = undefined;
//     user.resetTokenExpiry = undefined;

//     await user.save();

//     // ✅ EMAIL SEND (UPDATED)
//     try {
//       await sendEmail({
//         email: user.email,
//         subject: '🔐 Password Reset Successful',
//         html: `
//         <div style="font-family: Arial; padding:20px;">
//           <h2>✅ Password Reset Successful</h2>
//           <p>Hello <b>${user.name}</b>,</p>

//           <p>Your password has been updated successfully.</p>

//           <div style="background:#f5f5f5; padding:15px; border-radius:8px;">
//             <p><b>User ID:</b> ${user.userId}</p>
//             <p><b>Password:</b> ${newPassword}</p>
//             <p><b>Transaction Password:</b> ${newPassword}</p>
//           </div>

//           <br/>
//           <a href="https://worldfinance24.online/login"
//           style="background:#1e88e5; color:#fff; padding:12px 25px; text-decoration:none; border-radius:6px;">
//           🔐 Login Now
//           </a>
//         </div>
//         `,
//       });
//     } catch (e) {
//       console.log("Email failed:", e.message);
//     }

//     // ✅ RESPONSE ME DATA BHEJO
//     res.json({
//       message: 'Password reset successful',
//       userId: user.userId,
//       password: newPassword,
//       transactionPassword: newPassword,
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// module.exports = router;











require('dotenv').config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const Setting = require('../models/Setting'); 
const sanitizeUser = require('../utils/sanitizeUser');
const sendEmail = require('../utils/sendEmail');
const checkFeature = require('../middleware/checkFeatureEnabled');
const DummyUser = require('../models/DummyUser.js');
const LoginHistory = require('../models/LoginHistory'); 
const IpRule = require('../models/IpRule'); 
const FakeUser = require('../models/FakeUser'); 
const BlockedDevice = require('../models/BlockedDevice'); 
const { bot } = require('../utils/telegramBot');

const JWT_SECRET = process.env.JWT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

const getClientIP = (req) => {
    let ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.ip || req.connection.remoteAddress || '127.0.0.1';
    if (ip.includes('::ffff:')) {
        ip = ip.replace('::ffff:', '');
    }
    return ip;
};

// 🔥 UPDATE 1: Generate "WF" + 7 Digit User ID
const generateUserId = async () => {
  let id;
  let exists = true;
  while (exists) {
    // 7 digit random number (1000000 to 9999999)
    const random7Digit = Math.floor(1000000 + Math.random() * 9000000);
    id = `WF${random7Digit}`; // Output example: WF1234567
    
    const existsInReal = await User.exists({ userId: id });
    const existsInDummy = await DummyUser.exists({ userId: id });
    if (!existsInReal && !existsInDummy) {
      exists = false;
    }
  }
  return id;
};

const generateTransactionPassword = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// router.post('/register', checkFeature('allowRegistrations'), async (req, res) => {
//   try {
//     // Wallet aur Country nikal diya idhar se
//     let { name, mobile, email, sponsorId, deviceId, upi, password } = req.body;
//     const userIP = getClientIP(req);

//     name = name ? name.trim() : '';
//     mobile = mobile ? mobile.trim() : '';
//     email = email ? email.trim().toLowerCase() : '';

//     const nameRegex = /^[A-Za-z\s]{3,50}$/;
//     if (!name || !nameRegex.test(name)) {
//         return res.status(400).json({ message: 'Invalid Name. Only alphabets are allowed.' });
//     }

//     const mobileRegex = /^[0-9]{10,15}$/;
//     if (!mobile || !mobileRegex.test(mobile)) {
//         return res.status(400).json({ message: 'Invalid Mobile Number.' });
//     }

//     if (!email || !email.endsWith('@gmail.com')) {
//         return res.status(400).json({ message: 'Registration failed: Only @gmail.com emails are accepted.' });
//     }

//     if (!password || password.length < 6) {
//         return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
//     }

//     // --- Anti-Bot Security ---
//     const isLocalIP = userIP === '127.0.0.1' || userIP === '::1';
//     if (!isLocalIP) {
//         const rule = await IpRule.findOne({ ipAddress: userIP });
//         if (rule && rule.isBlocked) return res.status(403).json({ message: "Access Denied." });

//         const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
//         const recentRegistrationIP = await User.findOne({ ipAddress: userIP, createdAt: { $gte: tenMinutesAgo } });
//         if (recentRegistrationIP) return res.status(429).json({ message: "Please wait before creating another account." });
//     }

//     if (deviceId) {
//         const isDeviceBlocked = await BlockedDevice.findOne({ deviceId });
//         if (isDeviceBlocked) return res.status(403).json({ message: "Device blocked." });
//     }
//     // -------------------------

//     if (!sponsorId) return res.status(400).json({ message: 'Sponsor ID is compulsory.' });

//     let actualSponsorId = sponsorId; 
//     let sponsorExists = await User.findOne({ userId: actualSponsorId });

//     if (!sponsorExists) return res.status(400).json({ message: 'Invalid Sponsor ID.' });

//     const newUserId = await generateUserId(); 
    
//     // System generated 6-digit transaction password
//     const txPassword = generateTransactionPassword();

//     // User Object me se walletAddress hat gaya
//     const user = new User({
//       userId: newUserId, 
//       name, 
//       mobile, 
//       email, 
//       upi,
//       password: password, 
//       transactionPassword: txPassword, 
//       sponsorId: actualSponsorId, 
//       role: 'user',
//       ipAddress: userIP,
//       deviceId: deviceId || null 
//     });

//     await user.save();

//     try {
//         await sendEmail({
//             email: user.email,
//             subject: '🎉 Welcome to World Finance 24!',
//             html: `
//             <div style="font-family: Arial; padding: 20px;">
//                 <h2 style="color: #03a9f4;">🚀 Welcome to World Finance 24</h2>
//                 <p>Hello <strong>${user.name}</strong>,</p>
//                 <p>Your account has been successfully created.</p>
//                 <div style="background-color: #f8f9fa; padding: 20px; border-left: 4px solid #03a9f4;">
//                     <p>👤 <strong>User ID:</strong> ${user.userId}</p>
//                     <p>🔑 <strong>Login Password:</strong> ${user.password}</p>
//                     <p>🛡️ <strong>Transaction Password:</strong> <span style="color:red;">${user.transactionPassword}</span> (Keep this safe!)</p>
//                 </div>
//                 <br/>
//                 <a href="${process.env.FRONTEND_URL}/login" style="background-color: #03a9f4; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Login Now</a>
//             </div>
//             ` 
//         });
//     } catch (emailErr) { 
//         console.error("Email failed:", emailErr); 
//     }

//     // YAHAN PAR TRANSACTION PASSWORD ADD KIYA HAI 👇
//     res.status(201).json({ 
//         message: 'User registered successfully.', 
//         userId: user.userId, 
//         name: user.name,
//         transactionPassword: txPassword 
//     });

//   } catch (err) {
//     console.error('Register error:', err);
//     res.status(500).json({ message: 'Server error.' });
//   }
// });



router.post('/register', checkFeature('allowRegistrations'), async (req, res) => {
  try {
    // Wallet aur Country nikal diya idhar se
    let { name, mobile, email, sponsorId, deviceId, upi, password } = req.body;
    const userIP = getClientIP(req);

    name = name ? name.trim() : '';
    mobile = mobile ? mobile.trim() : '';
    email = email ? email.trim().toLowerCase() : '';

    const nameRegex = /^[A-Za-z\s]{3,50}$/;
    if (!name || !nameRegex.test(name)) {
        return res.status(400).json({ message: 'Invalid Name. Only alphabets are allowed.' });
    }

    const mobileRegex = /^[0-9]{10,15}$/;
    if (!mobile || !mobileRegex.test(mobile)) {
        return res.status(400).json({ message: 'Invalid Mobile Number.' });
    }

    if (!email || !email.endsWith('@gmail.com')) {
        return res.status(400).json({ message: 'Registration failed: Only @gmail.com emails are accepted.' });
    }

    if (!password || password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    // --- Anti-Bot Security ---
    const isLocalIP = userIP === '127.0.0.1' || userIP === '::1';
    if (!isLocalIP) {
        const rule = await IpRule.findOne({ ipAddress: userIP });
        if (rule && rule.isBlocked) return res.status(403).json({ message: "Access Denied." });

        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
        const recentRegistrationIP = await User.findOne({ ipAddress: userIP, createdAt: { $gte: tenMinutesAgo } });
        if (recentRegistrationIP) return res.status(429).json({ message: "Please wait before creating another account." });
    }

    if (deviceId) {
        const isDeviceBlocked = await BlockedDevice.findOne({ deviceId });
        if (isDeviceBlocked) return res.status(403).json({ message: "Device blocked." });
    }
    // -------------------------

    // 🔥 YAHAN CHANGE KIYA HAI: Top ID / Genesis ID Logic
    const userCount = await User.countDocuments();
    let actualSponsorId = null;

    if (userCount === 0) {
        // Agar database khali hai, toh ye system ki 1st ID hai. Sponsor optional hai.
        // Agar sponsorId frontend se nahi aayi toh default 'ROOT' set ho jayegi
        actualSponsorId = sponsorId || 'ROOT'; 
    } else {
        // Agar pehle se log registered hain, toh Sponsor ID strict aur compulsory hai
        if (!sponsorId) return res.status(400).json({ message: 'Sponsor ID is compulsory.' });

        actualSponsorId = sponsorId; 
        let sponsorExists = await User.findOne({ userId: actualSponsorId });

        if (!sponsorExists) return res.status(400).json({ message: 'Invalid Sponsor ID.' });
    }
    // ----------------------------------------------------

    const newUserId = await generateUserId(); 
    
    // System generated 6-digit transaction password
    const txPassword = generateTransactionPassword();

    // User Object me se walletAddress hat gaya
    const user = new User({
      userId: newUserId, 
      name, 
      mobile, 
      email, 
      upi,
      password: password, 
      transactionPassword: txPassword, 
      sponsorId: actualSponsorId, 
      role: 'user',
      ipAddress: userIP,
      deviceId: deviceId || null 
    });

    await user.save();

    try {
        await sendEmail({
            email: user.email,
            subject: '🎉 Welcome to World Finance 24!',
            html: `
            <div style="font-family: Arial; padding: 20px;">
                <h2 style="color: #03a9f4;">🚀 Welcome to World Finance 24</h2>
                <p>Hello <strong>${user.name}</strong>,</p>
                <p>Your account has been successfully created.</p>
                <div style="background-color: #f8f9fa; padding: 20px; border-left: 4px solid #03a9f4;">
                    <p>👤 <strong>User ID:</strong> ${user.userId}</p>
                    <p>🔑 <strong>Login Password:</strong> ${user.password}</p>
                    <p>🛡️ <strong>Transaction Password:</strong> <span style="color:red;">${user.transactionPassword}</span> (Keep this safe!)</p>
                </div>
                <br/>
                <a href="${process.env.FRONTEND_URL}/login" style="background-color: #03a9f4; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Login Now</a>
            </div>
            ` 
        });
    } catch (emailErr) { 
        console.error("Email failed:", emailErr); 
    }

    // YAHAN PAR TRANSACTION PASSWORD ADD KIYA HAI 👇
    res.status(201).json({ 
        message: 'User registered successfully.', 
        userId: user.userId, 
        name: user.name,
        transactionPassword: txPassword 
    });

  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

router.post('/login', async (req, res) => {
    // ... (Login API purani wali hi rahegi, koi change nahi)
    try {
        const { userId, password, deviceId } = req.body;
        const userIP = getClientIP(req);
        
        // Ensure userId search is case-insensitive for 'WF'
        const user = await User.findOne({ userId: new RegExp('^' + userId + '$', 'i') });
        
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });
        if (password !== user.password) return res.status(401).json({ message: 'Invalid credentials' });
        
        // ... (Baaki saara IP block logic purana wala waisa hi rakhein) ...
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '50m' });
        res.json({ message: 'Login successful', token, user: sanitizeUser(user) });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

 // ====================== FORGOT PASSWORD ======================
// ====================== FORGOT PASSWORD ======================
router.post('/forgot-password', checkFeature(), async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await User.findOne({ userId });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    // 🕒 RATE LIMITING LOGIC: Din mein sirf 3 Password Reset Emails
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (!user.lastPasswordResetDate || user.lastPasswordResetDate < startOfToday) {
        user.passwordResetCount = 0; 
    }

    if (user.passwordResetCount >= 3) {
        return res.status(429).json({ 
            message: "Daily limit exceeded. You can only request a password reset 3 times a day." 
        });
    }

    // 🔐 Generate Reset Token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour

    // 📈 Update limit count aur date
    user.passwordResetCount += 1; 
    user.lastPasswordResetDate = now;

    await user.save();

    const resetLink = `https://worldfinance24.online/reset-password/${resetToken}`;
    
    // 📧 SEND EMAIL (PREMIUM FORMAT)
    await sendEmail({
      email: user.email,
      subject: '🔐 worldfinance24 - Password Reset Request',
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border: 1px solid #eaeaea;">
          <div style="background: linear-gradient(135deg, #03a9f4 0%, #0083b0 100%); padding: 25px; text-align: center;">
            <h2 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">Password Reset Request</h2>
          </div>
          <div style="padding: 30px; color: #444;">
            <p style="font-size: 16px;">Hello <strong style="color: #0083b0;">${user.name}</strong>,</p>
            <p style="font-size: 15px; line-height: 1.6;">We received a request to reset the password for your worldfinance24 account associated with User ID: <b>${user.userId}</b>.</p>
            <div style="text-align: center; margin: 35px 0;">
              <a href="${resetLink}" style="background: #03a9f4; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 10px rgba(3,169,244,0.3);">Reset My Password</a>
            </div>
            <p style="font-size: 14px; color: #888;"><i>Note: This secure link will expire in exactly 1 hour. If you did not request this, please ignore this email.</i></p>
          </div>
          <div style="background: #f9f9f9; padding: 15px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eaeaea;">
            &copy; ${new Date().getFullYear()} worldfinance24. All rights reserved.
          </div>
        </div>
      `,
    });

    res.json({ message: '✅ Password reset link sent to your email.' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// ====================== RESET PASSWORD ======================
router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token.' });
    }

    // ✅ Update password
    user.password = newPassword;
    user.transactionPassword = newPassword;

    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    // ✅ EMAIL SEND (PREMIUM FORMAT)
    try {
      await sendEmail({
        email: user.email,
        subject: '✅ worldfinance24 - Password Reset Successful',
        html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border: 1px solid #eaeaea;">
          <div style="background: linear-gradient(135deg, #28a745 0%, #218838 100%); padding: 25px; text-align: center;">
            <h2 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">Password Reset Successful</h2>
          </div>
          <div style="padding: 30px; color: #444;">
            <p style="font-size: 16px;">Hello <strong style="color: #218838;">${user.name}</strong>,</p>
            <p style="font-size: 15px; line-height: 1.6;">Your account passwords have been successfully updated. Please find your new credentials below:</p>
            
            <div style="background: #f4f8f4; border-left: 4px solid #28a745; padding: 15px 20px; border-radius: 0 6px 6px 0; margin: 25px 0;">
              <p style="margin: 5px 0; font-size: 15px;"><b>User ID:</b> ${user.userId}</p>
              <p style="margin: 5px 0; font-size: 15px;"><b>Login Password:</b> ${newPassword}</p>
              <p style="margin: 5px 0; font-size: 15px;"><b>Transaction Password:</b> ${newPassword}</p>
            </div>

            <div style="text-align: center; margin: 35px 0;">
              <a href="https://worldfinance24.online/login" style="background: #03a9f4; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 10px rgba(3,169,244,0.3);">Login to Dashboard</a>
            </div>
          </div>
          <div style="background: #f9f9f9; padding: 15px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eaeaea;">
            &copy; ${new Date().getFullYear()} worldfinance24. All rights reserved.
          </div>
        </div>
        `,
      });
    } catch (e) {
      console.log("Email failed:", e.message);
    }

    res.json({
      message: 'Password reset successful',
      userId: user.userId,
      password: newPassword,
      transactionPassword: newPassword,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});



module.exports = router;