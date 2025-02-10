import { Request, Response } from "express";
import orderService from "@/services/orderService";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const order = await orderService.createOrder(req.body);
    res.status(201).json(order);
  } catch (error) {
    console.error("Order creation failed:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.orderId;
    const order = await orderService.getOrderById(orderId);
    res.json(order);
  } catch (error) {
    res.status(404).json({ error: "Order not found" });
  }
};

export const getClientOrders = async (req: Request, res: Response) => {
  try {
    const clientId = req.params.clientId;
    const orders = await orderService.getClientOrders(clientId);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const order = await orderService.updateOrderStatus(
      req.params.orderId,
      req.body.status
    );
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to update order status" });
  }
};

export const getStoreOrders = async (req: Request, res: Response) => {
  try {
    const storeId = req.params.storeId;
    const filters: OrderFilters = {
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
      status: req.query.status as string,
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
    };

    const orders = await orderService.getStoreOrders(storeId, filters);
    res.json(orders);
  } catch (error) {
    console.error("Failed to fetch store orders:", error);
    res.status(500).json({ error: "Failed to fetch store orders" });
  }
};

export const getStoreMetrics = async (req: Request, res: Response) => {
  try {
    const storeId = req.params.storeId;
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;

    const metrics = await orderService.getStoreMetrics(storeId, {
      startDate,
      endDate,
    });
    res.json(metrics);
  } catch (error) {
    console.error("Failed to fetch store metrics:", error);
    res.status(500).json({ error: "Failed to fetch store metrics" });
  }
};
