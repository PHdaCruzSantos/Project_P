import { db } from "../index.js";
import { storeAccountsTable } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import asaasClientService from "./asaasClientService";

interface StoreAccount {
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
  store_id: string;
  income_value: number;
}

const createStoreWallet = async (tx: any, storeAccountData: StoreAccount) => {
  try {
    // 1. Create Asaas account
    const asaasAccount = await asaasClientService.createAccount(
      storeAccountData
    );

    // 2. Create store account record using the provided transaction
    const accountId = uuid();
    const account = {
      id: accountId,
      store_id: storeAccountData.store_id,
      account_id: asaasAccount.id,
      api_key: asaasAccount.apiKey,
      account_status: asaasAccount.status || "PENDING",
      created_at: new Date(),
      updated_at: new Date(),
    };

    const accountWallet = {
      wallet_id: await asaasClientService.getAccountWallet(account.api_key),
      ...account,
    };
    console.log(accountWallet);

    await tx.insert(storeAccountsTable).values(accountWallet);

    return { account };
  } catch (error) {
    console.error("Error in createStoreWallet:", error);
    throw error; // Let the transaction handle the rollback
  }
};

const getStoreWallet = async (storeId: string) => {
  try {
    const acconut = await db
      .select()
      .from(storeAccountsTable)
      .where(eq(storeAccountsTable.store_id, storeId))
      .get();

    if (!acconut) {
      throw new Error("Store wallet not found");
    }

    return acconut;
  } catch (error) {
    console.error("Error getting store wallet:", error);
    throw new Error("Failed to get store wallet");
  }
};

const updateWalletStatus = async (storeId: string, account_status: string) => {
  try {
    await db
      .update(storeAccountsTable)
      .set({
        account_status,
        updated_at: new Date(),
      })
      .where(eq(storeAccountsTable.store_id, storeId));
  } catch (error) {
    console.error("Error updating wallet status:", error);
    throw new Error("Failed to update wallet status");
  }
};

export default {
  createStoreWallet,
  getStoreWallet,
  updateWalletStatus,
};
