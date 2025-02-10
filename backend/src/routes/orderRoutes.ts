import { Router } from "express";
import { authMiddleware } from "@/middlewares/authMiddleware";
import {
  createOrder,
  getOrderById,
  getClientOrders,
  updateOrderStatus,
  getStoreOrders,
  getStoreMetrics,
} from "@/controllers/orderController";

const orderRouter = Router();

orderRouter.post("/order-create", authMiddleware, createOrder);
orderRouter.get("/:orderId", authMiddleware, getOrderById);
orderRouter.get("/order/:clientId", authMiddleware, getClientOrders);
orderRouter.patch("/:orderId/status", authMiddleware, updateOrderStatus);
orderRouter.get("/store/:storeId/orders", authMiddleware, getStoreOrders);
orderRouter.get("/store/:storeId/metrics", authMiddleware, getStoreMetrics);
export default orderRouter;
