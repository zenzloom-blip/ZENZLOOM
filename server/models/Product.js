import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
      required: true,
      enum: ["hoodies", "jeans", "shirts", "tshirts", "jackets"],
    },

    images: [
      {
        type: String,
        required: true,
      },
    ],

    size: {
      type: [String],
      default: [],
    },

    quality: {
      type: String,
      enum: ["premium", "good", "normal"],
      required: true,
      default: "good",
    },

    inStock: {
      type: Boolean,
      default: true,
    },

    // 🔥 THRIFT-SPECIFIC FIELD
    isSold: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
