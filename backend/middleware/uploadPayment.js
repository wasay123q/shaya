import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + "_" + Math.round(Math.random() * 1e9) + path.extname(file.originalname)
    );
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
