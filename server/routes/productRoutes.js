// import express from "express";
// import {
//   getAllProducts,
//   getProductsByCategory,
// } from "../controllers/productController.js";

// const router = express.Router();

// router.get("/", getAllProducts);
// router.get("/category/:category", getProductsByCategory);

// export default router;
import express from "express";
import {
  getAllProducts,
  getProductsByCategory,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import upload from "../middlewares/uploadMiddleware.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Get all products
router.get("/", getAllProducts);

// Get products by category
router.get("/category/:category", getProductsByCategory);

// Get product by ID
router.get("/:id", getProductById);

// Create a product (with image upload)
router.post("/", authMiddleware, upload.array("images", 10), createProduct);

// Update a product (with optional image upload)
router.put("/:id", authMiddleware, upload.array("images", 10), updateProduct);

// Delete a product
router.delete("/:id", authMiddleware, deleteProduct);

export default router;

