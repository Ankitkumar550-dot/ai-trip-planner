const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  imageUrl: { type: String },
  subscription: { type: String, default: 'free' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
