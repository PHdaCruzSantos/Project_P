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
  externalReference?: string;
}

interface CustomerResponse {
  id: string;
  name: string;
  email: string;
  cpfCnpj: string;
  externalReference?: string;
}

interface AccountRequest {
  store_id: string;
  name: string;
  email: string;
  login_email?: string;
  cpf_cnpj: string;
  company_type?: string;
  birth_date?: string;
  phone?: string;
  mobile_phone: string;
  site?: string;
  address: string;
  address_number: string;
  complement?: string;
  province: string;
  postal_code: string;
  logo: string;
  banner?: string;
  user_id: string;
  income_value: number;
}

interface AccountResponse {
  id: string;
  name: string;
  email: string;
  cpfCnpj: string;
  apiKey: string;
  status: string;
}

interface NFERequest {
  customerName: string;
  customerCpfCnpj: string;
  customerEmail: string;
  value: number;
  deductionAmount?: number;
  serviceDescription: string;
  municipalServiceCode: string;
  municipalServiceName: string;
  paymentId: string;
}
interface WalletInfo {
  id: string;
}

const createAccount = async (
  data: AccountRequest
): Promise<AccountResponse> => {
  try {
    const response = await asaasClientService.post("/accounts", {
      name: data.name,
      email: data.email,
      cpfCnpj: data.cpf_cnpj,
      companyType: data.company_type || "MEI",
      phone: data.phone,
      mobilePhone: data.mobile_phone,
      address: data.address,
      addressNumber: data.address_number,
      complement: data.complement,
      province: data.province,
      postalCode: data.postal_code,
      logo: data.logo,
      banner: data.banner,
      user_id: data.user_id,
      incomeValue: data.income_value,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error creating account:",
      error.response?.data || error.message
    );
    throw new Error("Failed to create account");
  }
};

const getAccountWallet = async (accountApiKey: string): Promise<string> => {
  try {
    if (!accountApiKey) {
      throw new Error("Account API key is required");
    }
    const response = await axios.get(
      "https://api-sandbox.asaas.com/v3/wallets/",
      {
        headers: {
          "Content-Type": "application/json",
          access_token: accountApiKey,
        },
      }
    );
    if (!response?.data?.data?.[0]?.id) {
      throw new Error("No wallet ID found in response");
    }
    return response.data.data[0].id;
  } catch (error) {
    console.error(
      "Error getting account wallet:",
      error.response?.data || error.message
    );
    throw new Error("Failed to get account wallet");
  }
};

const getAccount = async (accountId: string): Promise<AccountResponse> => {
  try {
    const response = await asaasClientService.get(`/accounts/${accountId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error getting account:",
      error.response?.data || error.message
    );
    throw new Error("Failed to get account");
  }
};

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

const createNFE = async (nfeData: NFERequest) => {
  try {
    // Ajuste na URL e parâmetros conforme documentação do Asaas
    const response = await asaasClientService.post("/invoices", {
      customer: nfeData.customerCpfCnpj,
      serviceDescription: nfeData.serviceDescription,
      value: nfeData.value,
      // Adicionar campos obrigatórios do Asaas
      cityServiceCode: nfeData.municipalServiceCode, // Código do serviço municipal
      description: nfeData.serviceDescription,
      observations: `Nota fiscal referente ao pedido`,
      taxes: {
        retainIss: false,
        iss: 3, // Percentual do ISS (exemplo)
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error creating NFE:", error.response?.data || error.message);
    throw new Error("Failed to create NFE");
  }
};

export default {
  asaasClientService,
  findCustomerByCpfCnpj,
  createCustomer,
  createAccount,
  getAccount,
  getAccountWallet,
  createNFE,
};
