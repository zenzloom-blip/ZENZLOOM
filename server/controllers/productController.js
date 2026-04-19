import Product from "../models/Product.js";
import { cloudinary } from "../config/cloudinary.js";

// @desc    Get all products
// @route   GET /api/products
export const getAllProducts = async (req, res) => {
  try {
    const { available } = req.query;
    const filter = available === "true" ? { $or: [{ isSold: true }, { inStock: true }] } : {};
    const products = await Product.find(filter);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get products by category
// @route   GET /api/products/category/:category
export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { available } = req.query;
    const filter = available === "true" ? { category, $or: [{ isSold: true }, { inStock: true }] } : { category };
    const products = await Product.find(filter);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get product by ID
// @route   GET /api/products/:id
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, size, quality } = req.body;
    
    // images will come from Cloudinary via req.files
    const images = req.files ? req.files.map(file => file.path) : [];

    if (images.length === 0) {
      return res.status(400).json({ message: "At least one product image is required 🖼️" });
    }

    const product = new Product({
      name,
      description,
      price: Number(price),
      category,
      images,
      size: Array.isArray(size) ? size : (size ? size.split(",") : []),
      quality,
    });

    console.log("💾 Saving product to MongoDB...");
    const createdProduct = await product.save();
    console.log("✅ Product saved successfully!");
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error("❌ CREATE PRODUCT ERROR:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: error.message || "Internal Server Error" });
    }
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, size, quality, inStock, isSold, existingImages } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price ? Number(price) : product.price;
      product.category = category || product.category;
      product.quality = quality || product.quality;
      product.inStock = inStock !== undefined ? inStock : product.inStock;
      product.isSold = isSold !== undefined ? isSold : product.isSold;
      product.size = size ? (Array.isArray(size) ? size : size.split(",")) : product.size;

      if (req.files && req.files.length > 0) {
        const newImages = req.files.map(file => file.path);
        const currentExisting = existingImages ? (typeof existingImages === 'string' ? JSON.parse(existingImages) : existingImages) : product.images;
        
        // Find images to delete from Cloudinary
        const imagesToDelete = product.images.filter(img => !currentExisting.includes(img));
        
        for (const imageUrl of imagesToDelete) {
          if (imageUrl.includes("cloudinary.com")) {
            const urlParts = imageUrl.split("/");
            const publicIdWithExtension = urlParts[urlParts.length - 1];
            const publicId = `zenzloom_products/${publicIdWithExtension.split(".")[0]}`;
            try {
              await cloudinary.uploader.destroy(publicId);
              console.log(`Edited: Deleted from Cloudinary: ${publicId}`);
            } catch (err) {
              console.error(`Edited: Failed to delete from Cloudinary: ${publicId}`, err);
            }
          }
        }

        product.images = [...currentExisting, ...newImages];
      } else if (existingImages) {
        // No new files, but maybe some existing ones were removed
        const currentExisting = typeof existingImages === 'string' ? JSON.parse(existingImages) : existingImages;
        
        const imagesToDelete = product.images.filter(img => !currentExisting.includes(img));
        
        for (const imageUrl of imagesToDelete) {
          if (imageUrl.includes("cloudinary.com")) {
            const urlParts = imageUrl.split("/");
            const publicIdWithExtension = urlParts[urlParts.length - 1];
            const publicId = `zenzloom_products/${publicIdWithExtension.split(".")[0]}`;
            try {
              await cloudinary.uploader.destroy(publicId);
              console.log(`Edited (No New): Deleted from Cloudinary: ${publicId}`);
            } catch (err) {
              console.error(`Edited (No New): Failed to delete from Cloudinary: ${publicId}`, err);
            }
          }
        }
        
        product.images = currentExisting;
      }

      const updatedProduct = await product.save();
      res.status(200).json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error("❌ UPDATE PRODUCT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      // Delete associated image files from Cloudinary
      if (product.images && product.images.length > 0) {
        for (const imageUrl of product.images) {
          if (imageUrl.includes("cloudinary.com")) {
            // Extract public_id from Cloudinary URL
            const urlParts = imageUrl.split("/");
            const publicIdWithExtension = urlParts[urlParts.length - 1];
            const publicId = `zenzloom_products/${publicIdWithExtension.split(".")[0]}`;
            
            try {
              await cloudinary.uploader.destroy(publicId);
              console.log(`Deleted from Cloudinary: ${publicId}`);
            } catch (err) {
              console.error(`Failed to delete from Cloudinary: ${publicId}`, err);
            }
          }
        }
      }

      await product.deleteOne();
      res.status(200).json({ message: "Product removed" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle product stock status
// @route   PATCH /api/products/:id/toggle-stock
export const toggleStockStatus = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      product.inStock = !product.inStock;
      const updatedProduct = await product.save();
      res.status(200).json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
