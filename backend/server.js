require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { clerkMiddleware } = require('@clerk/clerk-sdk-node');

const aiRoutes = require('./routes/ai');
const userRoutes = require('./routes/user');
const tripRoutes = require('./routes/trip');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 10000,
  family: 4 // Force IPv4 to avoid Node 22+ DNS resolution issues
})
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err);
    // Log more details if available
    if (err.reason) console.error('Reason:', err.reason);
  });

// Routes
app.use('/api/ai', aiRoutes);
app.use('/api/users', userRoutes);
app.use('/api/trips', tripRoutes);

app.get('/', (req, res) => {
  res.send('AI Trip Planner API is running...');
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
}

module.exports = app;
