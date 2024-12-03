import { db } from "../index";
import { clientsTable, clientAddressesTable } from "../db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import bcrypt from "bcryptjs";

const getClientById = async (id: string) => {
  const user = await db
    .select()
    .from(clientsTable)
    .where(eq(clientsTable.id, id));

  if (!user) {
    throw new Error("User not found");
  }

  const { password, ...safeUser } = user[0];
  return safeUser;
};

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  profile_image?: string;
  cpf: string;
  status?: string;
  fav_items?: string;
  created_at: Date;
}

const createClient = async (user: User) => {
  const newUser = {
    ...user,
    id: uuid(),
    password: await bcrypt.hash(user.password, 10),
    created_at: new Date(),
  };

  const retClient = await db.insert(clientsTable).values(newUser);

  return retClient;
};
interface Address {
  id?: string;
  clients_id: string;
  cep: string;
  address: string;
  city: string;
  state: string;
  country: string;
}

const getAddressesByClientId = async (clientId: string) => {
  const addresses = await db
    .select()
    .from(clientAddressesTable)
    .where(eq(clientAddressesTable.clients_id, clientId));
  return addresses;
};

const createAddress = async (addressData: Address) => {
  const newAddress = {
    ...addressData,
    id: uuid(),
    created_at: new Date(),
  };

  const result = await db.insert(clientAddressesTable).values(newAddress);

  return result;
};

const updateAddress = async (
  addressId: string,
  addressData: Partial<Address>
) => {
  const result = await db
    .update(clientAddressesTable)
    .set(addressData)
    .where(eq(clientAddressesTable.id, addressId));

  return result;
};

const deleteAddress = async (addressId: string) => {
  const result = await db
    .delete(clientAddressesTable)
    .where(eq(clientAddressesTable.id, addressId));

  return result;
};

const updateClient = async (id: string, user: Partial<User>) => {
  const validUser = await db
    .select()
    .from(clientsTable)
    .where(eq(clientsTable.id, id))
    .get();

  if (!validUser) {
    throw new Error("User not found");
  }

  const updatedUser = { ...validUser, ...user };

  const retClient = await db
    .update(clientsTable)
    .set(updatedUser)
    .where(eq(clientsTable.id, id));

  return retClient;
};

const deleteClient = async (id: string) => {
  const newStatus = { status: "inactive" };
  const validUser = await db
    .select()
    .from(clientsTable)
    .where(eq(clientsTable.id, id))
    .get();

  if (!validUser) {
    throw new Error("User not found");
  }

  validUser.status = newStatus.status;
  validUser.deleted_at = new Date();

  const retClient = await db
    .update(clientsTable)
    .set(validUser)
    .where(eq(clientsTable.id, id));

  // console.log(retClient.rowsAffected);
  return retClient;
};

const addFavItem = async (clientId: string, itemId: string) => {
  const client = await db
    .select()
    .from(clientsTable)
    .where(eq(clientsTable.id, clientId))
    .get();

  if (!client) {
    throw new Error("Client not found");
  }

  // Convert stored favorites string to array
  const currentFavorites = client.fav_items
    ? client.fav_items.split(",").filter(Boolean)
    : [];

  // Check if item is already favorited
  if (!currentFavorites.includes(itemId)) {
    currentFavorites.push(itemId);
  }

  // Update client with new favorites
  const retClient = await db
    .update(clientsTable)
    .set({ fav_items: currentFavorites.join(",") })
    .where(eq(clientsTable.id, clientId));

  return retClient;
};

const removeFavItem = async (clientId: string, itemId: string) => {
  const client = await db
    .select()
    .from(clientsTable)
    .where(eq(clientsTable.id, clientId))
    .get();

  if (!client) {
    throw new Error("Client not found");
  }

  // Convert stored favorites string to array
  const currentFavorites = client.fav_items
    ? client.fav_items.split(",").filter(Boolean)
    : [];

  // Remove item from favorites
  const updatedFavorites = currentFavorites.filter((id) => id !== itemId);

  // Update client with new favorites
  const retClient = await db
    .update(clientsTable)
    .set({ fav_items: updatedFavorites.join(",") })
    .where(eq(clientsTable.id, clientId));

  return retClient;
};

export default {
  getClientById,
  deleteClient,
  updateClient,
  createClient,
  addFavItem,
  removeFavItem,
  getAddressesByClientId,
  createAddress,
  updateAddress,
  deleteAddress,
};
