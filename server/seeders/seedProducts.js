import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Product from "../models/Product.js";

dotenv.config();
await connectDB();

const products = [
  {
    name: "Vintage Oversized Hoodie",
    description: "Black oversized hoodie with premium cotton feel",
    price: 1299,
    category: "hoodies",
    images: ["https://via.placeholder.com/400"],
    size: ["M", "L", "XL"],
    quality: "premium",
    inStock: true,
  },
  {
    name: "Classic Blue Jeans",
    description: "Regular fit denim jeans, timeless look",
    price: 1499,
    category: "jeans",
    images: ["https://via.placeholder.com/400"],
    size: ["M", "L"],
    quality: "good",
    inStock: true,
  },
  {
    name: "Checked Casual Shirt",
    description: "Red and black checked shirt for casual wear",
    price: 999,
    category: "shirts",
    images: ["https://via.placeholder.com/400"],
    size: ["M", "L", "XL"],
    quality: "normal",
    inStock: true,
  },
  {
    name: "Graphic Print T-Shirt",
    description: "Cotton graphic t-shirt, relaxed fit",
    price: 699,
    category: "tshirts",
    images: ["https://via.placeholder.com/400"],
    size: ["S", "M", "L"],
    quality: "good",
    inStock: true,
  },
  {
    name: "Denim Jacket",
    description: "Vintage denim jacket with classic wash",
    price: 1899,
    category: "jackets",
    images: ["https://via.placeholder.com/400"],
    size: ["M", "L"],
    quality: "premium",
    inStock: true,
  },
];

const seedProducts = async () => {
  try {
    await Product.deleteMany(); // clear old data
    await Product.insertMany(products);

    console.log("🌱 Products seeded successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

seedProducts();
