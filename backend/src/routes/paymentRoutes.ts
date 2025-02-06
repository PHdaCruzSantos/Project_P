import { Router } from "express";
import {
  createPayment,
  checkPaymentStatus,
} from "../controllers/paymentController";
import { authMiddleware } from "@/middlewares/authMiddleware";

const paymentRouter = Router();

paymentRouter.post("/create", authMiddleware, createPayment);
paymentRouter.get("/status/:paymentId", authMiddleware, checkPaymentStatus);

export default paymentRouter;
