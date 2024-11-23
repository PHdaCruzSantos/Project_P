import { sql } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
  real,
  view,
} from "drizzle-orm/sqlite-core";

// Tabela de Usuários com UUID como chave primária
export const usersTable = sqliteTable("users", {
  id: text("id").primaryKey().notNull(), // UUID para o usuário
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  cpf: text("cpf").notNull().unique(), // Cpf do usuário
  profile_image: text("profile_image"), // URL da imagem de perfil do usuário
  status: text("status").notNull().default("active"), // Status do usuário (active, inactive)
  fav_items: text("fav_items"), // Id dos items favoritatod por este usuario
  deleted_at: integer("deleted_at", { mode: "timestamp" }), // Data de exclusão lógica
  created_at: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
export const clientsTable = sqliteTable("cliente", {
  id: text("id").primaryKey().notNull(), // UUID para o usuário
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  cpf: text("cpf").notNull().unique(), // Cpf do usuário
  profile_image: text("profile_image"), // URL da imagem de perfil do usuário
  status: text("status").notNull().default("active"), // Status do usuário (active, inactive)
  fav_items: text("fav_items"), // Id dos items favoritatod por este usuario
  deleted_at: integer("deleted_at", { mode: "timestamp" }), // Data de exclusão lógica
  created_at: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

// Tabela de Lojas com UUID como chave primária e referência ao UUID do usuário
export const storesTable = sqliteTable("stores", {
  //REVIEW - combine with usersTable?
  id: text("id").primaryKey().notNull(), // UUID para a loja
  name: text("name").notNull(),
  address: text("address"),
  email: text("contact").notNull(),
  cnpj: text("document").notNull(),
  logo: text("logo").notNull(), // URL do logo da loja
  banner: text("banner"), // URL do banner da loja
  user_id: text("user_id") // UUID do usuário
    .notNull()
    .references(() => usersTable.id),
  status: text("status").notNull().default("active"), // Status da loja (active, inactive)
  deleted_at: integer("deleted_at", { mode: "timestamp" }), // Data de exclusão lógica
  created_at: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

// Tabela de Itens com UUID como chave primária e referência ao UUID da loja
export const itemsTable = sqliteTable("items", {
  id: text("id").primaryKey().notNull(), // UUID para o item
  name: text("name").notNull(),
  price: real("price").notNull(),
  type: text("type").notNull(),
  description: text("description").notNull(),
  store_id: text("store_id") // UUID da loja
    .notNull()
    .references(() => storesTable.id),
  category_id: text("category_id").references(() => categoriesTable.id),
  image_names: text("image_names").notNull(), // ex: "1.png,2.png,3.png"
  status: text("status").notNull().default("available"), // Status do item (available, unavailable)
  deleted_at: integer("deleted_at", { mode: "timestamp" }), // Data de exclus
  created_at: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
export const categoriesTable = sqliteTable("categories", {
  id: text("id").primaryKey().notNull(), // UUID para a categoria
  name: text("name").notNull(),
  item_id: text("item_id").references(() => itemsTable.id),
  description: text("description").notNull(),
});

// Tabela de Cores dos Itens
export const itemColorsTable = sqliteTable("item_colors", {
  //REVIEW - what is the purpose of this table?
  id: text("id").primaryKey().notNull(),
  item_id: text("item_id")
    .notNull()
    .references(() => itemsTable.id),
  color: text("color").notNull(),
});

// Tabela de Grades de Tamanho
export const sizeGradesTable = sqliteTable("size_grades", {
  id: text("id").primaryKey().notNull(), // UUID para a grade de tamanhos
  name: text("name").notNull(), // Nome da grade (ex: "Padrão", "Infantil", "Plus Size")
  created_by: text("created_by")
    .notNull()
    .references(() => usersTable.id), // Usuário que criou a grade
  created_at: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

// Tabela de Tamanhos dentro de cada Grade
export const gradeSizesTable = sqliteTable("grade_sizes", {
  id: text("id").primaryKey().notNull(), // UUID para o tamanho da grade
  grade_id: text("grade_id")
    .notNull()
    .references(() => sizeGradesTable.id), // Referência para a grade de tamanhos
  size: text("size").notNull(), // Nome do tamanho (ex: "S", "M", "L")
  status: text("status").notNull().default("available"), // Status do item (available, unavailable)
  position: integer("position").notNull(), // Posição para ordenar os tamanhos na grade
});

// Tabela de Estoque para Tamanhos e Cores Específicas de um Item
export const variantItemTable = sqliteTable("variantItem", {
  //REVIEW - change the name of the table for the variant of the item
  id: text("id").primaryKey().notNull(),
  item_id: text("item_id")
    .notNull()
    .references(() => itemsTable.id),
  variant_name: text("variant_name").notNull(),
  size_id: text("size_id").references(() => gradeSizesTable.id),
  color_id: text("color_id").references(() => itemColorsTable.id),
  quantity: integer("quantity").notNull().default(0),
  price: real("price"),
});

// Tabela de Vendas com UUID como chave primária e referência ao UUID do usuário e do item
export const salesTable = sqliteTable("sales", {
  id: text("id").primaryKey().notNull(), // UUID para a venda
  clients_id: text("user_id") // UUID do usuário
    .notNull()
    .references(() => clientsTable.id),
  item_id: text("item_id") // UUID do item
    .notNull()
    .references(() => itemsTable.id),
  variant_id: text("variant_id").references(() => variantItemTable.id), // UUID da variante
  quantity: integer("quantity").notNull(),
  total_price: real("total_price").notNull(),
  payment_method: text("payment_method").notNull(),
  created_at: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

// Tabela de Cupons com UUID como chave primária e referência ao UUID do item e da loja
export const couponsTable = sqliteTable("coupons", {
  id: text("id").primaryKey().notNull(), // UUID para o cupom
  code: text("code").notNull().unique(), // Código do cupom
  name: text("name").notNull(), // Nome do cupom
  discount_percentage: real("discount_percentage").notNull(), // Percentual de desconto
  start_date: integer("start_date", { mode: "timestamp" }).notNull(), // Data de início do cupom
  end_date: integer("end_date", { mode: "timestamp" }).notNull(), // Data de término do cupom
  store_id: text("store_id") // UUID da loja
    .notNull()
    .references(() => storesTable.id),
  item_id: text("item_id") // UUID do item
    .references(() => itemsTable.id),
});

//  Tabela de Categorias com UUID como chave primária
//  REVIEW - wathe the funcionality of the category?

// Tabela de Avaliações com UUID como chave primária e referência ao UUID do usuário e do item
export const reviewsTable = sqliteTable("reviews", {
  id: text("id").primaryKey().notNull(), // UUID para a avaliação
  clients_id: text("user_id") // UUID do cliente
    .notNull()
    .references(() => clientsTable.id),
  item_id: text("item_id") // UUID do item avaliado ou da variante
    .notNull()
    .references(() => itemsTable.id),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  created_at: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

// Tabela de Carrinho com UUID como chave primária e referência ao UUID do usuário e do item
export const cartTable = sqliteTable("cart", {
  id: text("id").primaryKey().notNull(), // UUID para o carrinho
  clients_id: text("user_id") // UUID do usuário
    .notNull()
    .references(() => clientsTable.id),
  item_id: text("item_id") // UUID do item ou da variante
    .notNull()
    .references(() => itemsTable.id),
  quantity: integer("quantity").notNull(),
  created_at: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
