import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
    required: true
  }
}, {
  timestamps: true
});

// Add index on email for faster lookups
userSchema.index({ email: 1 }, { unique: true });

export default mongoose.model("User", userSchema);
