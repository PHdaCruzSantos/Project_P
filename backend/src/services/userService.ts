import { db } from "../index.js";
import { usersTable } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import bcrypt from "bcryptjs";

const getAllUsers = async () => {
  return db.select().from(usersTable);
};

const getUserById = async (id: string) => {
  const user = await db.select().from(usersTable).where(eq(usersTable.id, id));

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
  status: string;
  fav_items?: string;
  created_at: Date;
}

const createUser = async (user: User) => {
  const newUser = {
    ...user,
    id: uuid(),
    password: await bcrypt.hash(user.password, 10),
    created_at: new Date(),
  };

  const retUser = await db.insert(usersTable).values(newUser);

  return retUser;
};

const updateUser = async (id: string, user: Partial<User>) => {
  const validUser = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, id));

  if (!validUser) {
    throw new Error("User not found");
  }

  const updatedUser = {
    ...validUser,
    ...user,
  };

  const retUser = await db
    .update(usersTable)
    .set(updatedUser)
    .where(eq(usersTable.id, id));

  return retUser.rowsAffected;
};

const deleteUser = async (id: string) => {
  const validUser = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, id))
    .get();

  if (!validUser) {
    throw new Error("User not found");
  }

  validUser.status = "inactive";
  validUser.deleted_at = new Date();

  const retUser = await db
    .update(usersTable)
    .set(validUser)
    .where(eq(usersTable.id, id));

  return retUser.rowsAffected;
};

export default {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
