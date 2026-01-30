import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    mobile: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    payment: {
      type: String,
      enum: ["Cash on Delivery", "JazzCash", "Bank Transfer"],
      required: true,
    },

    paymentProof: {
      type: String,
      default: null,
    },

    items: {
      type: Array,
      required: true,
    },

    deliveryCharges: {
      type: Number,
      default: 200,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    // Order lifecycle
    status: {
      type: String,
      enum: ["pending", "approved", "in-progress", "delivered", "rejected", "confirmed"],
      default: "pending",
      lowercase: true
    },

    // Payment verification
    paymentStatus: {
      type: String,
      enum: ["unverified", "verified", "rejected", "pending"],
      default: "unverified",
      lowercase: true
    },

    // Admin response/note
    adminResponse: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Add indexes for faster queries
orderSchema.index({ userId: 1, createdAt: -1 }); // For user order history
orderSchema.index({ status: 1 }); // For status filtering
orderSchema.index({ paymentStatus: 1 }); // For payment verification queries
orderSchema.index({ createdAt: -1 }); // For chronological sorting

export default mongoose.model("Order", orderSchema);
