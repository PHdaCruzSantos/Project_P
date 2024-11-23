import { db } from "../index";
import { storesTable, usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

const getStores = async (userId: string) => {
  const retStores = await db
    .select()
    .from(storesTable)
    .where(eq(storesTable.user_id, userId));

  return retStores;
};

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

const addStore = async (user_id: string, store: Store) => {
  // const validUser = await db
  //   .select()
  //   .from(usersTable)
  //   .where(eq(usersTable.id, user_id))
  //   .get();

  // if (!validUser) {
  //   throw new Error("User not found or not authorized");
  // }

  const newStore = {
    id: uuidv4(),
    user_id: user_id,
    created_at: new Date(),
    ...store,
  };
  const retStore = await db.insert(storesTable).values(newStore).execute();

  return retStore;
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

export default { getStores, addStore, updateStore, deleteStore, desativeStore };
