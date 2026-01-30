# 🚨 URGENT: Backend Setup Required

## Current Errors:
1. ❌ **"Server Error"** - Backend route `/api/orders/place` returning 500 error
2. ❌ **"Placing order with userId: undefined"** - User not properly logged in OR backend not saving user data

---

## ⚡ IMMEDIATE ACTIONS REQUIRED:

### Step 1: Check if Backend Server is Running
```bash
# Open a new terminal and go to backend folder
cd d:\shaya-modestwear\backend

# Check if server is running
# If not, start it:
npm start
# OR
nodemon server.js
```

---

### Step 2: Test Login First

Before placing orders, **TEST LOGIN**:

1. Go to http://localhost:5173/login
2. Login with a test account
3. Open Browser Console (F12)
4. Check localStorage:
   ```javascript
   localStorage.getItem('userId')
   ```
   
**If it shows `null` or `undefined`:**
- Your backend `/api/auth/login` is not working
- Check backend console for errors
- Verify backend authentication routes exist

---

### Step 3: Add Missing Backend Routes

You need to create these files in your backend:

#### File: `backend/controllers/orderController.js`

Add this function:

```javascript
/* =========================
   PLACE ORDER
========================= */
export const placeOrder = async (req, res) => {
  try {
    console.log("📥 Place Order Request Body:", req.body);
    console.log("📥 Request File:", req.file);
    
    const { userId, name, mobile, address, payment, totalAmount } = req.body;

    // Validation
    if (!userId) {
      console.error("❌ userId missing!");
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    if (!name || !mobile || !address || !payment) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Parse items
    let items = [];
    try {
      items = typeof req.body.items === 'string' 
        ? JSON.parse(req.body.items) 
        : req.body.items;
    } catch (err) {
      console.error("❌ Items parse error:", err);
      return res.status(400).json({
        success: false,
        message: "Invalid items data",
      });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    // Reduce stock
    for (let item of items) {
      const product = await Product.findById(item.productId);
      if (product && product.stock >= item.quantity) {
        product.stock -= item.quantity;
        await product.save();
      }
    }

    const paymentProof = req.file ? req.file.filename : null;

    const newOrder = new Order({
      userId,
      name,
      mobile,
      address,
      payment,
      items,
      deliveryCharges: 200,
      totalAmount,
      paymentProof,
      paymentStatus: payment === "Cash on Delivery" ? "Verified" : "Unverified",
      status: "Pending",
    });

    await newOrder.save();

    console.log("✅ Order saved successfully:", newOrder._id);

    res.json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (err) {
    console.error("❌ ORDER ERROR:", err);
    res.status(500).json({ 
      success: false, 
      message: "Server Error",
      error: err.message 
    });
  }
};

/* =========================
   GET USER ORDERS
========================= */
export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      orders: orders
    });
  } catch (err) {
    console.error("GET USER ORDERS ERROR:", err);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch orders",
      error: err.message 
    });
  }
};

/* =========================
   GET ALL ORDERS (Admin)
========================= */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   VERIFY PAYMENT
========================= */
export const verifyPayment = async (req, res) => {
  try {
    await Order.findByIdAndUpdate(req.params.id, {
      paymentStatus: "Verified",
      status: "Confirmed",
    });
    res.json({ success: true, message: "Payment verified" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Verification failed" });
  }
};

/* =========================
   REJECT PAYMENT
========================= */
export const rejectPayment = async (req, res) => {
  try {
    await Order.findByIdAndUpdate(req.params.id, {
      paymentStatus: "Rejected",
      status: "Rejected",
    });
    res.json({ success: true, message: "Payment rejected" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Rejection failed" });
  }
};
```

---

#### File: `backend/routes/orderRoutes.js`

```javascript
import express from "express";
import multer from "multer";
import { 
  placeOrder, 
  getUserOrders,
  getAllOrders,
  verifyPayment, 
  rejectPayment 
} from "../controllers/orderController.js";
import Order from "../models/Order.js";

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Routes
router.post("/place", upload.single("paymentProof"), placeOrder);
router.get("/user/:userId", getUserOrders);
router.get("/all", getAllOrders);
router.put("/verify-payment/:id", verifyPayment);
router.put("/reject-payment/:id", rejectPayment);

// Update order status
router.put("/:orderId/status", async (req, res) => {
  try {
    const { status, adminResponse } = req.body;
    await Order.findByIdAndUpdate(req.params.orderId, {
      status,
      adminResponse: adminResponse || ""
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
```

---

#### File: `backend/server.js` (or `index.js`)

Make sure you have:

```javascript
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import orderRoutes from "./routes/orderRoutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/orders", orderRoutes);

// ... other routes

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

---

### Step 4: Create uploads folder

```bash
cd d:\shaya-modestwear\backend
mkdir uploads
```

---

### Step 5: Restart Backend

```bash
# Stop server (Ctrl+C)
# Then restart
npm start
```

---

## 🧪 Test After Setup:

1. Make sure backend is running on http://localhost:5000
2. Make sure frontend is running on http://localhost:5173
3. Login to the website
4. Add items to cart
5. Try placing an order

---

## 🔍 Debugging:

Check backend console for these logs:
- `📥 Place Order Request Body:`
- `✅ Order saved successfully:`

If you see errors, send them to me!
