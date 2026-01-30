import jwt from "jsonwebtoken";
import logger from "../config/logger.js";

// Middleware to verify JWT token
export const verifyToken = (req, res, next) => {
  try {
    // Get token from header
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No authentication token, access denied",
      });
    }

    // Verify token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!verified) {
      return res.status(401).json({
        success: false,
        message: "Token verification failed, authorization denied",
      });
    }

    // Add user id and role to request
    req.userId = verified.id;
    req.userRole = verified.role;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired, please login again",
      });
    }
    
    res.status(401).json({
      success: false,
      message: "Invalid token, authorization denied",
    });
  }
};

// Middleware to verify admin role
export const verifyAdmin = (req, res, next) => {
  try {
    // First verify token (should be called after verifyToken)
    if (!req.userRole) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Check if user is admin
    if (req.userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
    }

    next();
  } catch (err) {
    console.error("Admin verification error:", err);
    res.status(500).json({
      success: false,
      message: "Authorization check failed",
    });
  }
};
