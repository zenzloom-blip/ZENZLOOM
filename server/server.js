import dotenv from "dotenv";
dotenv.config(); // 1️⃣ Load env variables first

import express from "express";
import connectDB from "./config/db.js";
import cors from "cors";
import path from "path";
import productRoutes from "./routes/productRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import authRoutes from "./routes/authRoutes.js";

connectDB(); // 2️⃣ Connect to MongoDB

const app = express();

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

//cors for making the backend and frontend stay connected
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL, // Add your Vercel URL here in Render env vars
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Auth Routes
app.use("/api/auth", authRoutes);

// Payment Routes
app.use("/api/payment", paymentRoutes);

// Routes
app.use("/api/products", productRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("🔥 GLOBAL ERROR:", err);
  if (err.storageErrors) {
     console.error("📦 STORAGE ERRORS:", err.storageErrors);
  }
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

// Test route (optional but useful)
app.get("/test", (req, res) => {
  res.json({
    status: "API working",
    env: {
      has_jwt_secret: !!process.env.JWT_SECRET,
      has_mongo_uri: !!process.env.MONGO_URI,
      port: process.env.PORT
    }
  });
});

// Start server  ✅ THIS WAS MISSING
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
