// backend/controllers/authController.js
// Copy this entire file to your backend

import User from "../models/User.js";
import bcrypt from "bcryptjs";

/* =========================
   USER REGISTRATION
========================= */
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log("📝 Register request:", { name, email });

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    await newUser.save();

    console.log("✅ User registered:", newUser._id);

    res.json({
      success: true,
      message: "Registration successful",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (err) {
    console.error("❌ Registration Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error during registration"
    });
  }
};

/* =========================
   USER LOGIN
========================= */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("🔐 Login attempt for:", email);

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    // Find user
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      console.log("❌ Invalid password for:", email);
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    console.log("✅ Login successful for:", email, "| userId:", user._id);

    // IMPORTANT: Return user with _id
    res.json({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,  // ← This is critical!
        id: user._id,   // ← Fallback
        name: user.name,
        email: user.email
      },
      userId: user._id  // ← Additional fallback
    });
  } catch (err) {
    console.error("❌ Login Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error during login"
    });
  }
};
