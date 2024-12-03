import { Request, Response } from "express";
import { ShippingService } from "../services/shippingService";
import { ShippingRequest } from "../types/shipping";

const shippingService = new ShippingService();

export async function calculateShipping(req: Request, res: Response) {
  try {
    const shippingRequest: ShippingRequest = req.body;
    const rates = await shippingService.calculateShipping(shippingRequest);
    res.json(rates);
  } catch (error) {
    console.error("Shipping calculation error:", error);
    res.status(500).json({ error: "Failed to calculate shipping" });
  }
}
