import { Router } from "express";
import { initialPayment } from "@/controllers/paymentController";
import { authMiddleware } from "@/middlewares/authMiddleware";

const paymentRouter = Router();

paymentRouter.post("/payment", authMiddleware, initialPayment);

export default paymentRouter;
