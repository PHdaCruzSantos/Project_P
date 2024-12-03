import asaasClientService from "./asaasClientService";

interface OrderItem {
  name: string;
  value: number;
  quantity: number;
}

interface PaymentRequest {
  customer: string;
  value: number;
  billingType: "PIX";
  dueDate: string;
  description?: string;
  externalReference?: string; // Reference to our order ID
}

interface PaymentResponse {
  id: string;
  status: string;
  paymentUrl?: string;
  pixQrCode?: string;
  pixQrCodeImage?: string;
  externalReference?: string;
}

export const CreatePayment = async (
  paymentData: PaymentRequest,
  customerData?: CustomerRequest,
  orderItems?: OrderItem[]
): Promise<PaymentResponse> => {
  try {
    if (customerData) {
      const existingCustomer = await asaasClientService.findCustomerByCpfCnpj(
        customerData.cpfCnpj
      );

      if (!existingCustomer) {
        const newCustomer = await asaasClientService.createCustomer(
          customerData
        );
        paymentData.customer = newCustomer.id;
      } else {
        paymentData.customer = existingCustomer.id;
      }
    }

    // Add order details to payment description
    if (orderItems) {
      paymentData.description = orderItems
        .map((item) => `${item.quantity}x ${item.name} - R$ ${item.value}`)
        .join("\n");
    }

    const response = await asaasClientService.asaasClientService.post(
      "/payments",
      paymentData
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error creating payment:",
      error.response?.data || error.message
    );
    throw new Error("Failed to create payment");
  }
};
