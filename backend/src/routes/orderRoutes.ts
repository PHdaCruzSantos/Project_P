import { Router } from "express";
import { authMiddleware } from "@/middlewares/authMiddleware";
import {
  createOrder,
  getOrderById,
  getClientOrders,
  updateOrderStatus,
} from "@/controllers/orderController";

const orderRouter = Router();

orderRouter.post("/order-create", authMiddleware, createOrder);
orderRouter.get("/:orderId", authMiddleware, getOrderById);
orderRouter.get("/order/:clientId", authMiddleware, getClientOrders);
orderRouter.patch("/:orderId/status", authMiddleware, updateOrderStatus);

export default orderRouter;
