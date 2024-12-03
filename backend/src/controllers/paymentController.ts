import { Request, Response } from "express";
import { CreatePayment } from "@/services/paymentService";
import clientsService from "@/services/clientServices"; // Assuming you have this service

export const initialPayment = async (req: Request, res: Response) => {
  try {
    const {
      value,
      description,
      dueDate,
      items,
      clientId, // Add client ID from your system
    } = req.body;

    if (!value || !dueDate || !clientId || !items) {
      res.status(400).json({
        message: "Missing required fields",
      });
    }

    // Get client data from your system
    const client = await clientsService.getClientById(clientId);
    if (!client) {
      res.status(404).json({
        message: "Client not found",
      });
    }

    const customerData = {
      name: client.name,
      email: client.email,
      cpfCnpj: client.cpf,
      externalReference: clientId,
    };
    console.log("costumer data cpf", customerData);

    const paymentData = {
      customer: "", // Will be set by CreatePayment
      billingType: "PIX" as const,
      value,
      dueDate,
      description,
      externalReference: `order-${Date.now()}`, // Generate order reference
    };

    const paymentResponse = await CreatePayment(
      paymentData,
      customerData,
      items
    );

    res.status(200).json({
      message: "Payment Successfully Created",
      paymentId: paymentResponse.id,
      pixQrCode: paymentResponse.pixQrCode,
      pixQrCodeImage: paymentResponse.pixQrCodeImage,
      orderReference: paymentResponse.externalReference,
    });
  } catch (error) {
    console.error("Error initiating payment:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
