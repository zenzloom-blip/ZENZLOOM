import express from "express";
import { createOrder, verifyPayment, getAllOrders } from "../controllers/paymentController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create-order", createOrder);
router.post("/verify-payment", verifyPayment);
router.get("/", authMiddleware, getAllOrders);

export default router;
