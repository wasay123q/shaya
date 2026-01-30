import express from "express";
import CATEGORIES from "../config/categories.js";

const router = express.Router();

// GET /api/categories - returns the master category list
router.get("/", (req, res) => {
  res.json({ success: true, data: CATEGORIES });
});

export default router;
