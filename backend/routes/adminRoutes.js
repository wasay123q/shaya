import express from "express";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import { adminLogin } from "../controllers/adminController.js";
import { verifyToken, verifyAdmin } from "../middleware/auth.js";
import { authLimiter } from "../middleware/rateLimiter.js";
import { validateLogin } from "../middleware/validation.js";

const router = express.Router();

// Admin login (rate limited and validated)
router.post("/login", authLimiter, validateLogin, adminLogin);

// Protected admin routes (require authentication + admin role)
router.get("/stats", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const productsCount = await Product.countDocuments({ isDeleted: false });
    const ordersCount = await Order.countDocuments();

    const pendingOrders = await Order.countDocuments({
      status: "pending",
    });

    const confirmedOrders = await Order.countDocuments({
      status: "confirmed",
    });

    const sales = await Order.aggregate([
      { $match: { status: "confirmed" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    const lowStock = await Product.find({ stock: { $lt: 5 } });

    res.json({
      success: true,
      productsCount,
      ordersCount,
      pendingOrders,
      confirmedOrders,
      totalSales: sales[0]?.total || 0,
      lowStock,
    });
  } catch (err) {
    console.error("Stats fetch error:", err);
    res.status(500).json({ 
      success: false,
      message: "Error fetching stats" 
    });
  }
});

export default router;
