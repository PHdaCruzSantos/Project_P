import { Request, Response } from "express";
import paymentService from "../services/paymentService";
import clientServices from "@/services/clientServices";

interface PaymentRequestBody {
  clientId: string;
  value: number;
  items: Array<{
    name: string;
    id: string;
    quantity: number;
  }>;
  description?: string;
  externalReference?: string;
}

export const createPayment = async (req: Request, res: Response) => {
  try {
    const paymentData: PaymentRequestBody = req.body;

    // Get client data
    const client = await clientServices.getClientById(paymentData.clientId);
    if (!client) {
      res.status(404).json({ error: "Client not found" });
    }

    const payment = await paymentService.createPixPayment({
      value: paymentData.value,
      customerName: client.name,
      customerEmail: client.email,
      customerCpfCnpj: client.cpf,
      description: `Order items: ${paymentData.items
        .map((item) => `${item.quantity}x ${item.name}`)
        .join(", ")}`,
      externalReference: `order_${client.id}_${Date.now()}`,
    });

    res.status(201).json(payment);
  } catch (error) {
    console.error("Payment creation error:", error);
    res.status(500).json({ error: "Failed to create payment" });
  }
};

export const getPaymentStatus = async (req: Request, res: Response) => {
  try {
    const { paymentId } = req.params;
    const status = await paymentService.checkPaymentStatus(paymentId);
    res.json({ status });
  } catch (error) {
    console.error("Payment status check error:", error);
    res.status(500).json({ error: "Failed to check payment status" });
  }
};
