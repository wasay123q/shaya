import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import logger from "../config/logger.js";

// 🔹 REGISTER USER
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }

    // Check if user already exists
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ success: false, message: "Email already registered" });
    }

    // Hash password
    const hashedPass = await bcrypt.hash(password, 10);

    // Save new user (role defaults to 'user')
    const user = new User({ 
      name, 
      email: email.toLowerCase(), 
      password: hashedPass 
    });
    await user.save();

    res.status(201).json({ success: true, message: "User registered successfully" });

  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ success: false, message: "Signup failed" });
  }
};

// 🔹 LOGIN USER (UNIFIED - WORKS FOR BOTH USERS AND ADMINS)
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password required" });
    }

    // Find user (admin or regular user)
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Create JWT Token with role information
    const token = jwt.sign(
      { 
        id: user._id,
        role: user.role 
      }, 
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ success: false, message: "Login failed" });
  }
};
