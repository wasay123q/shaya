
import Product from "../models/Product.js";
import logger from "../config/logger.js";
import CATEGORIES from "../config/categories.js";

export const addProduct = async (req, res) => {
  try {
    const { name, category, price, description, stock } = req.body;
    const image = req.file ? req.file.filename : "";


    // Normalize category to match master list capitalization
    let normalizedCategory = category;
    if (category) {
      const found = CATEGORIES.find(
        (cat) => cat.toLowerCase() === category.toLowerCase()
      );
      if (found) normalizedCategory = found;
    }

    const product = new Product({
      name,
      category: normalizedCategory,
      price,
      description,
      stock,
      image
    });

    await product.save();
    res.json({ success: true, message: "Product Added" });

  } catch (error) {
    res.status(500).json({ success: false });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ isDeleted: false });
    res.json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch products" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, { isDeleted: true });
    res.json({ success: true, message: "Product soft deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete product" });
  }
};

export const updateProduct = async (req, res) => {
  await Product.findByIdAndUpdate(req.params.id, req.body);
  res.json({ success: true });
};

// Set sale on product
export const setSaleOnProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { isOnSale, discountPercentage, saleStartDate, saleEndDate } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    product.sale = {
      isOnSale: isOnSale || false,
      discountPercentage: discountPercentage || 0,
      saleStartDate: saleStartDate || null,
      saleEndDate: saleEndDate || null
    };

    await product.save();
    res.json({ success: true, message: "Sale updated successfully", product });

  } catch (error) {
    logger.error("Error setting sale:", error);
    res.status(500).json({ success: false, message: "Failed to update sale" });
  }
};

// Remove sale from product
export const removeSaleFromProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    product.sale = {
      isOnSale: false,
      discountPercentage: 0,
      saleStartDate: null,
      saleEndDate: null
    };

    await product.save();
    res.json({ success: true, message: "Sale removed successfully", product });

  } catch (error) {
    logger.error("Error removing sale:", error);
    res.status(500).json({ success: false, message: "Failed to remove sale" });
  }
};

// Get products on sale
export const getProductsOnSale = async (req, res) => {
  try {
    const currentDate = new Date();
    const products = await Product.find({
      isDeleted: false,
      "sale.isOnSale": true,
      $or: [
        { "sale.saleEndDate": null },
        { "sale.saleEndDate": { $gte: currentDate } }
      ]
    });
    res.json({ success: true, products });
  } catch (error) {
    logger.error("Error fetching sale products:", error);
    res.status(500).json({ success: false, message: "Failed to fetch sale products" });
  }
};

// Get all products including deleted (admin only)
export const getAllProductsAdmin = async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch products" });
  }
};

// Restore soft-deleted product (admin only)
export const restoreProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isDeleted: false },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, message: "Product restored", data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to restore product" });
  }
};

// Permanently delete product (admin only)
export const permanentlyDeleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, message: "Product permanently deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete product" });
  }
};

