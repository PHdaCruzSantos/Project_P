import { db } from "../index";
import { clientsTable } from "../db/schema";
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

export default {
  getClientById,
  deleteClient,
  updateClient,
  createClient,
};
