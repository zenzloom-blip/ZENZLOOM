import { createOrder, verifyPayment, getAllOrders, createManualOrder } from "../controllers/paymentController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create-order", createOrder);
router.post("/verify-payment", verifyPayment);
router.get("/", authMiddleware, getAllOrders);
router.post("/manual-order", authMiddleware, createManualOrder);

export default router;
