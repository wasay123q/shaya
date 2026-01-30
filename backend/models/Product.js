import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  description: String,
  image: String,
  stock: { type: Number, default: 0 },
  isDeleted: { type: Boolean, default: false },
  sale: {
    isOnSale: { type: Boolean, default: false },
    discountPercentage: { type: Number, default: 0 },
    saleStartDate: { type: Date, default: null },
    saleEndDate: { type: Date, default: null }
  }
}, {
  timestamps: true
});

// Add indexes for faster queries
productSchema.index({ category: 1 }); // For category filtering
productSchema.index({ 'sale.isOnSale': 1 }); // For sale product queries
productSchema.index({ stock: 1 }); // For stock queries
productSchema.index({ isDeleted: 1 }); // For filtering deleted products

export default mongoose.model("Product", productSchema);
