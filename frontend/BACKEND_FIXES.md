# Backend Fixes Required

## Error 1: "userId missing in request"
## Error 2: "Failed to load orders"

---

## Fix 1: Update orderController.js

Add this new function to your `backend/controllers/orderController.js`:

```javascript
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
```

---

## Fix 2: Update orderRoutes.js (or create if it doesn't exist)

Create or update `backend/routes/orderRoutes.js`:

```javascript
import express from "express";
import multer from "multer";
import { 
  placeOrder, 
  verifyPayment, 
  rejectPayment, 
  getAllOrders,
  getUserOrders  // Add this new import
} from "../controllers/orderController.js";

const router = express.Router();

// Multer configuration for file upload
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
router.get("/all", getAllOrders);
router.get("/user/:userId", getUserOrders);  // Add this route
router.put("/verify-payment/:id", verifyPayment);
router.put("/reject-payment/:id", rejectPayment);
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

## Fix 3: Update server.js (or index.js)

Make sure your backend server has the order routes properly mounted:

```javascript
import orderRoutes from "./routes/orderRoutes.js";

app.use("/api/orders", orderRoutes);
```

---

## Fix 4: Ensure Order Model has userId field

Check `backend/models/Order.js` includes userId:

```javascript
const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  payment: {
    type: String,
    required: true
  },
  items: {
    type: Array,
    required: true
  },
  deliveryCharges: {
    type: Number,
    default: 200
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentProof: {
    type: String,
    default: null
  },
  paymentStatus: {
    type: String,
    default: "Unverified"
  },
  status: {
    type: String,
    default: "Pending"
  },
  adminResponse: {
    type: String,
    default: ""
  }
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
```

---

## How to Apply These Fixes:

1. Open your backend project folder
2. Update `controllers/orderController.js` - add the `getUserOrders` function
3. Update `routes/orderRoutes.js` - add the new route
4. Restart your backend server
5. Test the application

---

## After applying fixes, restart backend server:

```bash
cd backend
npm start
```

or

```bash
cd backend
nodemon server.js
```
