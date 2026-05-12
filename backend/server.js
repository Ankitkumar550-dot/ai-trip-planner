require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { clerkMiddleware } = require('@clerk/clerk-sdk-node');

const aiRoutes = require('./routes/ai');
const userRoutes = require('./routes/user');
const tripRoutes = require('./routes/trip');
const emailRoutes = require('./routes/email');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Mongoose Configuration
mongoose.set('bufferCommands', true); // Re-enable buffering but with a timeout

// MongoDB Connection
const connectDB = async () => {
  try {
    console.log('⏳ Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 15000,
      family: 4
    });
    console.log('✅ Connected to MongoDB');
    
    // Start server ONLY after DB is connected (if not already listening)
    if (!app.listening) {
      app.listen(PORT, () => {
        console.log(`🚀 Server is running on http://localhost:${PORT}`);
      });
    }
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.error('👉 Ensure your Atlas IP Whitelist is set (0.0.0.0/0 for testing)');
    // Try to reconnect after 5 seconds
    setTimeout(connectDB, 5000);
  }
};

connectDB();

mongoose.connection.on('error', err => {
  console.error('❌ MongoDB Runtime Error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB Disconnected. Attempting to reconnect...');
  connectDB();
});

// Routes
app.use('/api/ai', aiRoutes);
app.use('/api/users', userRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/email', emailRoutes);

app.get('/', (req, res) => {
  res.send('AI Trip Planner API is running...');
});

module.exports = app;
