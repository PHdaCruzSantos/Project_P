import { Request, Response } from "express";
import paymentService from "../services/paymentService";
import clientServices from "@/services/clientServices";
import storeService from "@/services/storeService";

interface PaymentRequestBody {
  clientId: string;
  totalValue: number;
  items: Array<{
    storeId: string;
    productId: string;
    quantity: number;
    price: number;
    name: string;
  }>;
  split: {
    walletId: string;
    fixedValue: number;
  }[];
  description?: string;
  externalReference?: string;
}

export const createPayment = async (req: Request, res: Response) => {
  try {
    const paymentData: PaymentRequestBody = req.body;
    console.log("Creating payment", paymentData);

    // Busca dados do cliente
    const client = await clientServices.getClientById(paymentData.clientId);
    if (!client) {
      res.status(404).json({ error: "Client not found" });
    }

    // Valida as lojas e produtos
    const storeIds = Array.from(
      new Set(paymentData.items.map((items) => items.storeId))
    );
    for (const storeId of storeIds) {
      const store = await storeService.getStoreById(storeId);
      if (!store) {
        res.status(404).json({ error: `Store ${storeId} not found` });
      }
      if (!store.wallet?.wallet_id) {
        res.status(400).json({
          error: `Store ${storeId} does not have a wallet configured`,
        });
      }
    }

    // Calcula o valor total

    // Cria o pagamento com split
    const payment = await paymentService.createPixPayment({
      value: paymentData.totalValue,
      customerName: client.name,
      customerEmail: client.email,
      customerCpfCnpj: client.cpf,
      items: paymentData.items.map((item) => ({
        storeId: item.storeId,
        value: item.price * item.quantity,
        description: item.name,
      })),
      description: `Order items: ${paymentData.items
        .map((item) => `${item.quantity}x ${item.name}`)
        .join(", ")}`,
      externalReference: `order_${client.id}_${Date.now()}`, // Referência externa
      marketplaceFee: 0, // Taxa do marketplace (10%)
    });
    console.log("Payment created:", payment);
    res.status(201).json(payment);
  } catch (error) {
    console.error("Payment creation error:", error);
    res.status(500).json({ error: "Failed to create payment" });
  }
};

export const checkPaymentStatus = async (req: Request, res: Response) => {
  try {
    const { paymentId } = req.params;
    const status = await paymentService.checkPaymentStatus(paymentId);
    res.json({ status });
  } catch (error) {
    console.error("Payment status check error:", error);
    res.status(500).json({ error: "Failed to check payment status" });
  }
};
