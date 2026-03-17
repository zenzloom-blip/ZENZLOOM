import razorpay from "../config/razorpay.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import crypto from "crypto";

export const createOrder = async (req, res) => {
  try {
    const { amount, customer, cartItems } = req.body;

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const options = {
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Create a pending order in our database
    const newOrder = new Order({
      customer,
      orderItems: cartItems.map(item => ({
        name: item.name,
        price: item.price,
        image: item.images && item.images.length > 0 ? item.images[0] : "https://via.placeholder.com/300",
        product: item._id
      })),
      totalPrice: amount,
      razorpayOrderId: razorpayOrder.id,
      isPaid: false
    });

    await newOrder.save();

    res.status(200).json(razorpayOrder);
  } catch (error) {
    console.error("🔥 Razorpay Order Creation Failed!");
    console.error("Request Body:", req.body);
    console.error("Error Details:", error);
    res.status(500).json({
      message: "Razorpay order creation failed. Check server logs.",
      error: error.message,
      stack: process.env.NODE_ENV === "production" ? null : error.stack,
    });
  }
};

export const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    try {
      const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
      if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.razorpayPaymentId = razorpay_payment_id;
        await order.save();

        // 🔥 THRIFT LOGIC: Mark each product as sold
        for (const item of order.orderItems) {
          await Product.findByIdAndUpdate(item.product, {
            isSold: true,
            inStock: false
          });
        }

        res.status(200).json({ message: "Payment verified and products marked as sold" });
      } else {
        res.status(404).json({ message: "Order not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(400).json({ message: "Invalid signature, payment verification failed" });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({ isPaid: true }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
