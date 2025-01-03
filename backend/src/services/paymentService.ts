import asaasClientService from "./asaasClientService";

interface PaymentRequest {
  customer: string; // ASAAS customer ID
  billingType: "PIX"; // Payment type
  value: number; // Payment amount
  dueDate: string; // Payment due date
  description?: string; // Payment description
  externalReference?: string; // Reference to our system's order ID
}
interface CreatePaymentDTO {
  value: number;
  customerName: string;
  customerEmail: string;
  customerCpfCnpj: string;
  customerPhone?: string;
  description?: string;
  externalReference?: string;
}

interface PixDetails {
  encodedImage: string; // QR code image in base64
  payload: string; // PIX code (string to copy)
  expirationDate: string; // PIX expiration date
}

interface PaymentResponse {
  id: string;
  dateCreated: string;
  customer: string;
  value: number;
  netValue: number;
  billingType: string;
  status: string;
  dueDate: string;
  originalValue: number;
  pix?: PixDetails;
}

const createPixPayment = async (
  paymentData: CreatePaymentDTO
): Promise<PaymentResponse> => {
  try {
    // Check if customer exists in ASAAS
    let customer = await asaasClientService.findCustomerByCpfCnpj(
      paymentData.customerCpfCnpj
    );

    // If customer doesn't exist, create new customer
    if (!customer) {
      customer = await asaasClientService.createCustomer({
        name: paymentData.customerName,
        email: paymentData.customerEmail,
        cpfCnpj: paymentData.customerCpfCnpj,
        phone: paymentData.customerPhone,
        externalReference: paymentData.externalReference,
      });
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 1);

    const payment: PaymentRequest = {
      customer: customer.id,
      billingType: "PIX",
      value: paymentData.value,
      dueDate: dueDate.toISOString().split("T")[0],
      description: paymentData.description,
      externalReference: paymentData.externalReference,
    };

    const response = await asaasClientService.asaasClientService.post(
      "/payments",
      payment
    );

    const pixResponse = await asaasClientService.asaasClientService.get(
      `/payments/${response.data.id}/pixQrCode`
    );

    return {
      ...response.data,
      pix: pixResponse.data,
    };
  } catch (error) {
    console.error(
      "Error creating PIX payment:",
      error.response?.data || error.message
    );
    throw new Error("Failed to create PIX payment");
  }
};

const checkPaymentStatus = async (paymentId: string): Promise<string> => {
  try {
    const response = await asaasClientService.asaasClientService.get(
      `/payments/${paymentId}`
    );
    return response.data.status;
  } catch (error) {
    console.error(
      "Error checking payment status:",
      error.response?.data || error.message
    );
    throw new Error("Failed to check payment status");
  }
};

export default { createPixPayment, checkPaymentStatus };
