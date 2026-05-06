const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  tripId: { type: String, required: true, unique: true },
  userEmail: { type: String, required: true },
  tripDetail: { type: String, required: true },
  destination: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Trip', tripSchema);
