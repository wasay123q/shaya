import multer from "multer";
import path from "path";
import crypto from "crypto";

// Allowed file types for payment proofs
const ALLOWED_PAYMENT_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Allowed file types for product images
const ALLOWED_PRODUCT_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_PRODUCT_SIZE = 10 * 1024 * 1024; // 10MB

// Secure storage configuration for payment proofs
const paymentStorage = multer.diskStorage({
  destination: "uploads/payments",
  filename: (req, file, cb) => {
    // Generate secure random filename
    const randomName = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `payment-${randomName}${ext}`);
  },
});

// Secure storage configuration for product images
const productStorage = multer.diskStorage({
  destination: "uploads/products",
  filename: (req, file, cb) => {
    // Generate secure random filename
    const randomName = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `product-${randomName}${ext}`);
  },
});

// File filter for payment proofs
const paymentFileFilter = (req, file, cb) => {
  if (ALLOWED_PAYMENT_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'), false);
  }
};

// File filter for product images
const productFileFilter = (req, file, cb) => {
  if (ALLOWED_PRODUCT_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'), false);
  }
};

// Payment proof upload middleware
export const uploadPaymentProof = multer({
  storage: paymentStorage,
  fileFilter: paymentFileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1
  }
}).single('paymentProof');

// Product image upload middleware
export const uploadProductImage = multer({
  storage: productStorage,
  fileFilter: productFileFilter,
  limits: {
    fileSize: MAX_PRODUCT_SIZE,
    files: 1
  }
}).single('image');

// Error handler for multer errors
export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB for payment proofs and 10MB for product images.'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Only one file allowed.'
      });
    }
    return res.status(400).json({
      success: false,
      message: `Upload error: ${err.message}`
    });
  }
  
  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message || 'File upload failed'
    });
  }
  
  next();
};
