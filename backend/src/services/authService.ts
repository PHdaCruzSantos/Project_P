import { db } from "../index.js";
import { usersTable, clientsTable } from "../db/schema.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

const loginUser = async (email: string, password: string) => {
  const user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .get(); // Garante que retorne apenas um registro

  console.log(user);
  console.log(email, password);
  if (!user) {
    throw new Error("User not found");
  }
  const valisPassword = await bcrypt.compare(password, user.password);
  console.log(valisPassword);
  if (!valisPassword) {
    throw new Error("Invalid password");
  }

  const { password: _, ...safeUser } = user; // REVIEW - mudar desestruturação

  return { user: safeUser };
};
const loginClient = async (email: string, password: string) => {
  const user = await db
    .select()
    .from(clientsTable)
    .where(eq(clientsTable.email, email))
    .get(); // Garante que retorne apenas um registro

  if (!user) {
    throw new Error("User not found");
  }
  const valisPassword = await bcrypt.compare(password, user.password);
  if (!valisPassword) {
    throw new Error("Invalid password");
  }
  console.log(user.created_at);
  console.log(new Date(Number(user.created_at) * 1000));
  const { password: _, ...safeUser } = user; // REVIEW - mudar desestruturação

  return { user: safeUser };
};

export default { loginUser, loginClient };
