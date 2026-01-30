import express from "express";
import { addProduct, getProducts, deleteProduct, updateProduct, setSaleOnProduct, removeSaleFromProduct, getProductsOnSale, getAllProductsAdmin, restoreProduct, permanentlyDeleteProduct } from "../controllers/productController.js";
import { uploadProductImage, handleUploadError } from "../middleware/secureUpload.js";
import { validateProduct } from "../middleware/validation.js";
import { verifyToken, verifyAdmin } from "../middleware/auth.js";

const router = express.Router();

router.post("/add", uploadProductImage, handleUploadError, validateProduct, addProduct);
router.get("/", getProducts);
router.get("/sale", getProductsOnSale);
router.put("/sale/:id", setSaleOnProduct);
router.delete("/sale/:id", removeSaleFromProduct);
router.delete("/:id", deleteProduct);
router.put("/:id", updateProduct);

// Admin-only routes for soft delete management
router.get("/admin/all", verifyToken, verifyAdmin, getAllProductsAdmin);
router.patch("/admin/restore/:id", verifyToken, verifyAdmin, restoreProduct);
router.delete("/admin/permanent/:id", verifyToken, verifyAdmin, permanentlyDeleteProduct);

export default router;
