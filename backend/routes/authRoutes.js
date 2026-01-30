import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { authLimiter } from "../middleware/rateLimiter.js";
import { validateRegistration, validateLogin } from "../middleware/validation.js";

const router = express.Router();

// Apply rate limiting and validation to auth routes
router.post("/register", authLimiter, validateRegistration, registerUser);
router.post("/login", authLimiter, validateLogin, loginUser);

export default router;
