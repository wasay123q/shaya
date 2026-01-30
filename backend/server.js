import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import validateEnv from "./config/validateEnv.js";
import logger from "./config/logger.js";

dotenv.config();
validateEnv();

const app = express();

// Fix dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS Configuration - Secure for production
const allowedOrigins = [
  "http://localhost:5173",
  "https://shayafrontend.vercel.app",
  process.env.FRONTEND_URL
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// VERY IMPORTANT FOR FORMDATA
app.use(express.urlencoded({ extended: true }));

// Static uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/categories", categoryRoutes);

logger.info("All routes mounted successfully");

// Health check endpoint
app.get("/api/health", (req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    status: "ok",
    timestamp: Date.now(),
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  };
  
  try {
    res.status(200).json(healthcheck);
  } catch (error) {
    healthcheck.status = "error";
    healthcheck.message = error.message;
    res.status(503).json(healthcheck);
  }
});

// MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    const dbName = mongoose.connection.db.databaseName;
    const host = mongoose.connection.host;
    logger.info("MongoDB Connected Successfully!");
    logger.info(`Database: ${dbName}`);
    logger.info(`Host: ${host}`);
    logger.info(`Connection State: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
  })
  .catch((err) => {
    logger.error("MongoDB Connection Error:", err);
  });

// For Vercel serverless functions
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
}

// Export for Vercel
export default app;
