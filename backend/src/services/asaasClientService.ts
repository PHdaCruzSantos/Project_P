import axios from "axios";

const ASAAS_TOKEN = process.env.ASAS_API_KEY;

const asaasClientService = axios.create({
  baseURL: "https://sandbox.asaas.com/api/v3",
  headers: {
    "Content-Type": "application/json",
    access_token: ASAAS_TOKEN,
  },
});

interface CustomerRequest {
  name: string;
  email: string;
  cpfCnpj: string;
  phone?: string;
  externalReference?: string; // Add reference to our system's user ID
}

interface CustomerResponse {
  id: string;
  name: string;
  email: string;
  cpfCnpj: string;
  externalReference?: string;
}

const findCustomerByCpfCnpj = async (
  cpfCnpj: string
): Promise<CustomerResponse | null> => {
  try {
    const response = await asaasClientService.get(
      `/customers?cpfCnpj=${cpfCnpj}`
    );
    return response.data.data[0] || null;
  } catch (error) {
    console.error(
      "Error finding customer:",
      error.response?.data || error.message
    );
    return null;
  }
};

const createCustomer = async (
  customerData: CustomerRequest
): Promise<CustomerResponse> => {
  try {
    const response = await asaasClientService.post("/customers", customerData);
    return response.data;
  } catch (error) {
    console.error(
      "Error creating customer:",
      error.response?.data || error.message
    );
    throw new Error("Failed to create customer");
  }
};

export default { asaasClientService, findCustomerByCpfCnpj, createCustomer };
