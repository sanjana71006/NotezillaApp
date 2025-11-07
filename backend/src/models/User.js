const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'Faculty', 'Student'], default: 'Student' },
  isBlocked: { type: Boolean, default: false },
  isEmailVerified: { type: Boolean, default: false },
  profilePicture: { type: String },
  bio: { type: String },
  department: { type: String },
  semester: { type: String },
  subjects: [{ type: String }],
  lastLogin: { type: Date },
  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
