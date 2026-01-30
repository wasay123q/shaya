import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ MongoDB connected");

    // Admin credentials - CHANGE THESE!
    const adminData = {
      name: "khadija",
      email: "admin@gmail.com",
      password: "Sprinter@6001", // Change this to a secure password
      role: "admin" // ✅ Set admin role
    };

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log("⚠️  Admin with this email already exists!");
      
      // Update existing user to admin if not already
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log("✅ Existing user promoted to admin!");
      }
      
      process.exit(0);
    }

    // Hash the password
    const hashedPassword = await bcryptjs.hash(adminData.password, 10);

    // Create admin user
    const admin = new User({
      name: adminData.name,
      email: adminData.email,
      password: hashedPassword,
      role: adminData.role // ✅ Set role to 'admin'
    });

    await admin.save();
    console.log("✅ Admin user created successfully!");
    console.log("📧 Email:", adminData.email);
    console.log("🔑 Password:", adminData.password);
    console.log("👤 Role:", adminData.role);
    console.log("\n⚠️  IMPORTANT: Change the default password after first login!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();
