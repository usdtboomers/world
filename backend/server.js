require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// 📦 Imports
const allRoutes = require('./routes'); 

// 🔥 EK HI CRON HAI APNA (Daily ROI) 🔥
require('./cron/roiCron'); 
 
// 🔥 USER MODEL
const User = require('./models/User'); 
 
const app = express();
app.set('trust proxy', true);

// ====================== 1. CORS SETUP ======================
const allowedOrigins = [
  // --- Local Testing ke liye ---
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://pink.localhost:3000',
  'http://localhost:5000',       
  'http://127.0.0.1:5000',
  'http://localhost:5173',       
  'http://127.0.0.1:5173',
  'http://pink.localhost:5173', 

  // --- LIVE SERVER KE LIYE ---
  'https://worldfinance24.online',        
  'https://www.worldfinance24.online',    
  'https://pink.worldfinance24.online'   
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const cleanOrigin = origin.replace(/\/$/, "");
    if (allowedOrigins.includes(cleanOrigin)) {
      callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// ====================== 2. API ROUTES ======================
app.use('/api', allRoutes);

// ====================== 3. MAGIC ROUTE: CREATE ROOT ID ======================
app.get('/setup-root', async (req, res) => {
  try {
    const rootId = 100000; 

    const rootExists = await User.findOne({ userId: rootId });
    if (rootExists) {
      return res.send(`<h1>Root ID already exists! ID: ${rootId}</h1>`);
    }

    const rootUser = new User({
      userId: rootId, 
      name: 'Global Founder',
      mobile: '9999999999',
      email: 'admin@cryptocomm.com',
      password: 'adminpassword123', 
      transactionPassword: 'adminpassword123', 
      sponsorId: "0", 
      country: 'Global',
      isActive: true
    });

    await rootUser.save(); 
    return res.send(`<h1>🎉 ROOT ID CREATED SUCCESSFULLY! ID: ${rootId} <br> Ab MongoDB Compass refresh karo!</h1>`);
    
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating root ID: " + err.message);
  }
});

// ====================== 4. API 404 HANDLER ======================
app.use('/api', (req, res) => {
  res.status(404).json({ message: "API Route Not Found!" });
});


// ====================== 5. FRONTEND SERVING ======================
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API is running locally... Use React Dev Server for UI.');
  });
}

// ====================== 6. DATABASE & SERVER ======================
mongoose.connect(process.env.MONGO_URI) 
  .then(async () => { 
    console.log('✅ MongoDB connected successfully for World Finance'); 

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });