import Order from "../models/Order.js";
import Product from "../models/Product.js";
import mongoose from "mongoose";
import logger from "../config/logger.js";

/* =========================
   PLACE ORDER
========================= */
export const placeOrder = async (req, res) => {
  // Start a MongoDB session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name, mobile, address, payment } = req.body;
    
    // Get userId from the authenticated token (set by verifyToken middleware)
    const userId = req.userId;

    if (!userId || !name || !mobile || !address || !payment) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    if (!req.body.items) {
      logger.warn("Order attempt with no items");
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "Items missing",
      });
    }

    let items = [];
    try {
      items = JSON.parse(req.body.items);
    } catch (err) {
      logger.error("Item parse error:", err);
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "Invalid items data",
      });
    }

    let total = 0;
    items.forEach((item) => {
      total += item.price * item.quantity;
    });

    const deliveryCharges = 200;
    const grandTotal = total + deliveryCharges;

    // Reduce stock with transaction safety
    for (let item of items) {
      const product = await Product.findById(item.productId).session(session);
      
      if (!product) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({
          success: false,
          message: `Product ${item.name} not found`,
        });
      }

      // Check if sufficient stock available
      if (product.stock < item.quantity) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${item.name}. Available: ${product.stock}, Requested: ${item.quantity}`,
        });
      }

      // Reduce stock
      product.stock -= item.quantity;
      await product.save({ session });
    }

    // Cloudinary returns the URL in req.file.path
    const paymentProof = req.file ? req.file.path : null;

    const newOrder = new Order({
      userId,
      name,
      mobile,
      address,
      payment,
      items,
      deliveryCharges,
      totalAmount: grandTotal,
      paymentProof,
      paymentStatus:
        payment === "Cash on Delivery" ? "verified" : "unverified",
      status: "pending",
    });

    await newOrder.save({ session });

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    res.json({
      success: true,
      message: "Order placed successfully",
      newOrder,
    });
  } catch (err) {
    // Rollback transaction on error
    await session.abortTransaction();
    session.endSession();
    
    console.error("ORDER ERROR:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/* =========================
   ADMIN ACTIONS
========================= */

// Verify payment
export const verifyPayment = async (req, res) => {
  try {
    await Order.findByIdAndUpdate(req.params.id, {
      paymentStatus: "verified",
      status: "confirmed",
    });

    res.json({ success: true, message: "Payment verified" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Verification failed" });
  }
};

// Reject payment
export const rejectPayment = async (req, res) => {
  try {
    await Order.findByIdAndUpdate(req.params.id, {
      paymentStatus: "rejected",
      status: "rejected",
    });

    res.json({ success: true, message: "Payment rejected" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Rejection failed" });
  }
};

// Update order status (Admin)
export const updateOrderStatus = async (req, res) => {
  try {
    logger.info("Update order status request:", {
      orderId: req.params.id,
      body: req.body
    });
    
    const { status, adminResponse } = req.body;
    
    const updateData = { status };
    if (adminResponse) {
      updateData.adminResponse = adminResponse;
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id, 
      updateData,
      { new: true }
    );

    logger.info("Order updated:", updatedOrder);

    res.json({ success: true, message: "Order status updated", order: updatedOrder });
  } catch (err) {
    logger.error("Update status error:", err);
    res.status(500).json({ success: false, message: "Failed to update order status" });
  }
};

// Verify payment (separate endpoint)
export const verifyPaymentOnly = async (req, res) => {
  try {
    await Order.findByIdAndUpdate(req.params.id, {
      paymentStatus: "verified",
    });

    res.json({ success: true, message: "Payment verified" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Verification failed" });
  }
};

// Reject payment (separate endpoint)
export const rejectPaymentOnly = async (req, res) => {
  try {
    await Order.findByIdAndUpdate(req.params.id, {
      paymentStatus: "rejected",
    });

    res.json({ success: true, message: "Payment rejected" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Rejection failed" });
  }
};

// Get all orders (Admin)
export const getAllOrders = async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
};

// Get user's orders
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.userId; // From verifyToken middleware
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    logger.error("Get user orders error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};
