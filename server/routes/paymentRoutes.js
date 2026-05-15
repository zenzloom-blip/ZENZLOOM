import express from "express";
import { createOrder, verifyPayment, getAllOrders, createManualOrder } from "../controllers/paymentController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

import protectUser from "../middlewares/userAuthMiddleware.js";

const router = express.Router();

router.post("/create-order", protectUser, createOrder);
router.post("/verify-payment", protectUser, verifyPayment);
router.get("/", authMiddleware, getAllOrders);
router.post("/manual-order", authMiddleware, createManualOrder);

export default router;
