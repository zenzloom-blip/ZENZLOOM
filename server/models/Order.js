import mongoose from "mongoose";

const orderSchema = mongoose.Schema(
  {
    customer: {
      name: { type: String, required: true },
      email: { type: String },
      phone: { type: String },
      address: { type: String },
      city: { type: String },
      pincode: { type: String },
    },
    orderItems: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        image: { type: String, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
      },
    ],
    totalPrice: { type: Number, required: true },
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    orderType: { type: String, enum: ["online", "offline"], default: "online" },
    razorpayOrderId: { type: String }, // Make optional for manual orders
    razorpayPaymentId: { type: String },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
