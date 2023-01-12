const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  passwordHash: { type: String, required: true },
  status: { type: String, required: false, default: 'active' },
  creationDate: { type: Date, required: false, default: Date.now() },
  lastLogin: { type: Date, required: false },
});

const User = mongoose.model('User', userSchema);

module.exports = User;