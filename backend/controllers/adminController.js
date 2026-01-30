import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import logger from "../config/logger.js";

// 🔹 ADMIN LOGIN (NOW USES DATABASE WITH ROLE VERIFICATION)
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Email and password required" 
      });
    }

    // Find user in database
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid admin credentials" 
      });
    }

    // Verify user is admin
    if (user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: "Access denied. Admin privileges required." 
      });
    }

    // Verify password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid admin credentials" 
      });
    }

    // Create JWT token with admin role
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
      message: "Admin login successful",
      token,
      admin: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    logger.error("Admin login error:", err);
    res.status(500).json({ 
      success: false, 
      message: "Admin login failed" 
    });
  }
};
