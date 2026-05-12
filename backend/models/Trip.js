const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  tripId: {
    type: String,
    required: true,
    unique: true
  },
  userEmail: {
    type: String,
    required: true
  },
  tripDetail: {
    type: String,
    required: true
  },
  destination: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Trip', tripSchema);
