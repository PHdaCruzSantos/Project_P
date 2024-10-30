import { not, sql } from "drizzle-orm";
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

// Tabela de Usuários com UUID como chave primária
export const usersTable = sqliteTable("users", {
  id: text("id").primaryKey().notNull(),  // UUID para o usuário
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  created_at: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

// Tabela de Lojas com UUID como chave primária e referência ao UUID do usuário
export const storesTable = sqliteTable("stores", {
  id: text("id").primaryKey().notNull(),  // UUID para a loja
  name: text("name").notNull(),
  address: text("address").notNull(),
  contact: text("contact").notNull(),
  user_id: text("user_id")                                     // UUID do usuário
    .notNull()
    .references(() => usersTable.id),
  created_at: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

// Tabela de Itens com UUID como chave primária e referência ao UUID da loja
export const itemsTable = sqliteTable("items", {
  id: text("id").primaryKey().notNull(),  // UUID para o item
  name: text("name").notNull(),
  price: real("price").notNull(),
  type: text("type").notNull(),
  description: text("description").notNull(),
  store_id: text("store_id")                                   // UUID da loja
    .notNull()
    .references(() => storesTable.id),
  image_names: text("image_names").notNull(), // ex: "1.png,2.png,3.png"
  created_at: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
