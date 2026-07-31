 

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

//     // 🔥 YAHAN CHANGE KIYA HAI: Top ID / Genesis ID Logic
//     const userCount = await User.countDocuments();
//     let actualSponsorId = null;

//     if (userCount === 0) {
//         // Agar database khali hai, toh ye system ki 1st ID hai. Sponsor optional hai.
//         // Agar sponsorId frontend se nahi aayi toh default 'ROOT' set ho jayegi
//         actualSponsorId = sponsorId || 'ROOT'; 
//     } else {
//         // Agar pehle se log registered hain, toh Sponsor ID strict aur compulsory hai
//         if (!sponsorId) return res.status(400).json({ message: 'Sponsor ID is compulsory.' });

//         actualSponsorId = sponsorId; 
//         let sponsorExists = await User.findOne({ userId: actualSponsorId });

//         if (!sponsorExists) return res.status(400).json({ message: 'Invalid Sponsor ID.' });
//     }
//     // ----------------------------------------------------

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
    // 🔥 YAHAN CHANGE KIYA HAI: Country add kiya gaya hai
    let { name, mobile, email, sponsorId, deviceId, upi, password, country } = req.body;
    const userIP = getClientIP(req);

    name = name ? name.trim() : '';
    mobile = mobile ? mobile.trim() : '';
    email = email ? email.trim().toLowerCase() : '';
    country = country ? country.trim() : '';

    const nameRegex = /^[A-Za-z\s]{3,50}$/;
    if (!name || !nameRegex.test(name)) {
        return res.status(400).json({ message: 'Invalid Name. Only alphabets are allowed.' });
    }

    if (!country) {
        return res.status(400).json({ message: 'Country is required.' });
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

    // Top ID / Genesis ID Logic
    const userCount = await User.countDocuments();
    let actualSponsorId = null;

    if (userCount === 0) {
        actualSponsorId = sponsorId || 'ROOT'; 
    } else {
        if (!sponsorId) return res.status(400).json({ message: 'Sponsor ID is compulsory.' });

        actualSponsorId = sponsorId; 
        let sponsorExists = await User.findOne({ userId: actualSponsorId });

        if (!sponsorExists) return res.status(400).json({ message: 'Invalid Sponsor ID.' });
    }
    // ----------------------------------------------------

    const newUserId = await generateUserId(); 
    
    // System generated 6-digit transaction password
    const txPassword = generateTransactionPassword();

    // 🔥 User Object me country pass kar diya hai
    const user = new User({
      userId: newUserId, 
      name, 
      mobile, 
      email, 
      country, // Added
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
        
        // 👇 YEH ADD KARO 👇
 
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