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
    const order = await orderService.getOrderById(req.params.orderId);
    res.json(order);
  } catch (error) {
    res.status(404).json({ error: "Order not found" });
  }
};

export const getClientOrders = async (req: Request, res: Response) => {
  try {
    const orders = await orderService.getClientOrders(req.params.clientId);
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
