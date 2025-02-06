import asaasClientService from "./asaasClientService";
import storeWalletService from "./storeWalletService";

interface PaymentRequest {
  customer: string;
  billingType: "PIX";
  value: number;
  dueDate: string;
  description?: string;
  externalReference?: string;
  split: Split[];
}

interface Split {
  walletId: string;
  fixedValue?: number;
  description?: string;
}

interface CreatePaymentDTO {
  value: number;
  customerName: string;
  customerEmail: string;
  customerCpfCnpj: string;
  customerPhone?: string;
  description?: string;
  externalReference?: string;
  items: Array<{
    storeId: string;
    value: number;
    description: string;
  }>;
  marketplaceFee: number; // Percentual da taxa do marketplace
}

interface StoreWallet {
  id: string;
  walletId: string;
}

const calculateSplits = (
  items: CreatePaymentDTO["items"],
  totalValue: number,
  marketplaceFee: number,
  storeWallets: Map<string, string>
): Split[] => {
  const splits: Split[] = [];
  const storeValues = new Map<string, number>();

  // Calculate total per store
  items.forEach((item) => {
    const current = storeValues.get(item.storeId) || 0;
    storeValues.set(item.storeId, current + item.value);
  });

  // Create splits for each store with full value
  storeValues.forEach((value, storeId) => {
    const walletId = storeWallets.get(storeId);
    if (!walletId) {
      throw new Error(`Wallet not found for store ${storeId}`);
    }

    splits.push({
      walletId,
      fixedValue: Number(value.toFixed(2)), // Full value without marketplace fee
      description: `Store payment: ${storeId}`,
    });
  });

  return splits;
};

const createPixPayment = async (
  paymentData: CreatePaymentDTO
): Promise<PaymentResponse> => {
  try {
    // Verifica se o cliente existe no ASAAS
    let customer = await asaasClientService.findCustomerByCpfCnpj(
      paymentData.customerCpfCnpj
    );

    if (!customer) {
      customer = await asaasClientService.createCustomer({
        name: paymentData.customerName,
        email: paymentData.customerEmail,
        cpfCnpj: paymentData.customerCpfCnpj,
        phone: paymentData.customerPhone,
        externalReference: paymentData.externalReference,
      });
    }

    // Busca os walletIds das lojas
    const storeIds = Array.from(
      new Set(paymentData.items.map((item) => item.storeId))
    );
    const storeWallets = new Map<string, string>();

    for (const storeId of storeIds) {
      const store = await storeWalletService.getStoreWallet(storeId);
      if (!store.wallet_id) {
        throw new Error(`Wallet not found for store ${storeId}`);
      }
      storeWallets.set(storeId, store.wallet_id);
    }

    // Define a data de vencimento do PIX (1 dia a partir de agora)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 1);

    // Calcula os splits
    const splits = calculateSplits(
      paymentData.items,
      paymentData.value,
      paymentData.marketplaceFee,
      storeWallets
    );
    console.log("Splits:", splits);

    // Cria o pagamento no Asaas
    const payment: PaymentRequest = {
      customer: customer.id,
      billingType: "PIX",
      value: paymentData.value,
      dueDate: dueDate.toISOString().split("T")[0],
      description: paymentData.description,
      externalReference: paymentData.externalReference,
      split: splits.map((split) => ({
        walletId: split.walletId,
        fixedValue: split.fixedValue, // Using fixedValue instead of value
      })), // Envia o split para o Asaas
    };

    const response = await asaasClientService.asaasClientService.post(
      "/payments",
      payment
    );

    // Obtém o QR Code do PIX
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
