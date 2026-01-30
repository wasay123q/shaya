import multer from "multer";
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Configure Cloudinary (uses env variables set in secureUpload.js)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Cloudinary storage configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'shaya/uploads',
    allowed_formats: ['jpeg', 'jpg', 'png', 'webp', 'pdf'],
  },
});

const upload = multer({
  storage,
});

// IMPORTANT FIX 👇  
// If NO file is uploaded, multer SHOULD NOT block req.body  
export default {
  single: (fieldName) => (req, res, next) => {
    const handler = upload.single(fieldName);
    handler(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err.message });
      }
      // If no file uploaded -> just continue
      next();
    });
  },
};
