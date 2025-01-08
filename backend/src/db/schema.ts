import { sql, relations } from "drizzle-orm";
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

// Tabela de endereços das lojas com UUID como chave primária e referência ao UUID da loja
export const storeAddressesTable = sqliteTable("store_addresses", {
  id: text("id").primaryKey().notNull(), // UUID para o endereço da loja
  store_id: text("store_id") // UUID da loja
    .notNull()
    .references(() => storesTable.id),
  cep: text("cep").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  country: text("country").notNull(),
  created_at: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

// tabela de endereço dos clientes
export const clientAddressesTable = sqliteTable("client_addresses", {
  id: text("id").primaryKey().notNull(), // UUID para o endereço do cliente
  clients_id: text("clients_id") // UUID do cliente
    .notNull()
    .references(() => clientsTable.id),
  cep: text("cep").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  country: text("country").notNull(),
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
  width: real("width"),
  height: real("height"),
  length: real("length"),
  weight: real("weight"),
  insurance_value_multiplier: real("insurance_value_multiplier"),
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
  shipping_template_id: text("shipping_template_id")
    .references(() => shippingTemplatesTable.id)
    .notNull(),
});

export const shippingTemplatesTable = sqliteTable("shipping_templates", {
  id: text("id").primaryKey().notNull(),
  name: text("name").notNull(),
  width: real("width").notNull(),
  height: real("height").notNull(),
  length: real("length").notNull(),
  weight: real("weight").notNull(),
  insurance_value_multiplier: real("insurance_value_multiplier")
    .notNull()
    .default(1),
  created_at: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
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
  clients_id: text("clients_id") // UUID do usuário
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
  clients_id: text("clients_id") // UUID do cliente
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
export const cartClientsTable = sqliteTable("cartClients", {
  id: text("id").primaryKey().notNull(), // UUID para o carrinho
  clients_id: text("clients_id") // UUID do usuário
    .notNull()
    .references(() => clientsTable.id),
  items_id: text("items_id") // UUID do item ou da variante
    .notNull()
    .references(() => itemsTable.id),
  quantity: integer("quantity").notNull(),
  created_at: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
export const ordersTable = sqliteTable("orders", {
  id: text("id").primaryKey().notNull(), // UUID do pedido
  clients_id: text("clients_id") // UUID do cliente
    .notNull()
    .references(() => clientsTable.id),
  payment_id: text("payment_id"), // ID do pagamento no ASAAS
  status: text("status").notNull(), // pending, paid, cancelled, delivered
  total_amount: real("total_amount").notNull(), // Valor total do pedido
  payment_method: text("payment_method"), // PIX, credit_card, etc
  shipping_address: text("shipping_address").notNull(), // Endereço de entrega
  shipping_price: real("shipping_price").notNull(), // Valor do frete
  tracking_code: text("tracking_code"), // Código de rastreamento
  notes: text("notes"), // Observações do pedido
  created_at: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updated_at: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

// Tabela de itens do pedido
export const orderItemsTable = sqliteTable("order_items", {
  id: text("id").primaryKey().notNull(), // UUID do item do pedido
  order_id: text("order_id") // UUID do pedido
    .notNull()
    .references(() => ordersTable.id),
  item_id: text("item_id") // UUID do item
    .notNull()
    .references(() => itemsTable.id),
  quantity: integer("quantity").notNull(), // Quantidade do item
  price: real("price").notNull(), // Preço unitário do item no momento da compra
  item_name: text("item_name").notNull(), // Nome do item no momento da compra
  created_at: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const ordersRelations = relations(ordersTable, ({ many }) => ({
  items: many(orderItemsTable),
}));

export const orderItemsRelations = relations(orderItemsTable, ({ one }) => ({
  order: one(ordersTable, {
    fields: [orderItemsTable.order_id],
    references: [ordersTable.id],
  }),
}));
