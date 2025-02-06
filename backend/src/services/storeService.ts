import { db } from "../index";
import { storesTable, storeAccountsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import storeWalletService from "./storeWalletService";

interface Store {
  id: string;
  name: string;
  address: string;
  email: string;
  cnpj: string;
  logo: string;
  banner?: string;
  user_id: string;
  status?: string;
  created_at: Date;
}
interface CreateStoreDTO {
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
  income_value: number;
  postal_code: string;
  logo: string;
  banner?: string;
  user_id: string;
}

const getStores = async (userId: string) => {
  const retStores = await db
    .select()
    .from(storesTable)
    .where(eq(storesTable.user_id, userId));

  return retStores;
};

const getStoreById = async (id: string) => {
  try {
    const store = await db
      .select({
        store: storesTable,
        wallet: storeAccountsTable,
      })
      .from(storesTable)
      .leftJoin(
        storeAccountsTable,
        eq(storesTable.id, storeAccountsTable.store_id)
      )
      .where(eq(storesTable.id, id))
      .get();

    return store;
  } catch (error) {
    console.error("Error getting store:", error);
    throw new Error("Failed to get store");
  }
};

const createStore = async (storeData: CreateStoreDTO) => {
  try {
    return await db.transaction(async (tx) => {
      // 1. First create the store
      const storeId = uuid();
      const newStore = {
        id: storeId,
        name: storeData.name,
        email: storeData.email,
        cnpj: storeData.cpf_cnpj,
        address: storeData.address,
        logo: storeData.logo,
        banner: storeData.banner,
        user_id: storeData.user_id,
        status: "active",
        created_at: new Date(),
        ...storeData,
      };

      // Insert store first
      await tx.insert(storesTable).values(newStore);

      // 2. Then create wallet with the confirmed store ID
      const asaasAccountData = {
        store_id: storeId, // Now we have a valid store ID
        name: storeData.name,
        email: storeData.email,
        login_email: storeData.login_email,
        cpf_cnpj: storeData.cpf_cnpj,
        company_type: storeData.company_type,
        birth_date: storeData.birth_date,
        phone: storeData.phone,
        mobile_phone: storeData.mobile_phone,
        site: storeData.site,
        address: storeData.address,
        address_number: storeData.address_number,
        complement: storeData.complement,
        province: storeData.province,
        postal_code: storeData.postal_code,
        logo: storeData.logo,
        banner: storeData.banner,
        user_id: storeData.user_id,
        income_value: storeData.income_value,
      };

      // Create wallet using the same transaction
      const { account } = await storeWalletService.createStoreWallet(
        tx,
        asaasAccountData
      );

      return { store: newStore, account };
    });
  } catch (error) {
    console.error("Error creating store:", error);
    throw new Error("Failed to create store and wallet");
  }
};

const updateStore = async (store_id: string, store: Partial<Store>) => {
  const retStore = await db
    .update(storesTable)
    .set(store)
    .where(eq(storesTable.id, store_id));

  return retStore.rowsAffected;
};

const deleteStore = async (storeId: string) => {
  const validStore = await db
    .select()
    .from(storesTable)
    .where(eq(storesTable.id, storeId))
    .get();

  if (!validStore) {
    throw new Error("Store not found");
  }

  validStore.deleted_at = new Date();
  validStore.status = "inactive";

  const retStore = await db
    .update(storesTable)
    .set(validStore)
    .where(eq(storesTable.id, storeId))
    .execute();

  return retStore.rowsAffected;
};

const desativeStore = async (storeId: string) => {
  const newStatus = "inactive";
  const validStore = await db
    .select()
    .from(storesTable)
    .where(eq(storesTable.id, storeId))
    .get();

  if (!validStore) {
    throw new Error("Store not found");
  }

  const retStore = await db
    .update(storesTable)
    .set({ status: newStatus, ...validStore[0] })
    .where(eq(storesTable.id, storeId))
    .execute();

  return retStore.rowsAffected;
};

export default {
  getStores,
  createStore,
  updateStore,
  deleteStore,
  desativeStore,
  getStoreById,
};
