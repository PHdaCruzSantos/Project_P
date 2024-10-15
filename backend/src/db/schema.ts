// import { sql } from "drizzle-orm";
import { sqliteTable, text, int } from "drizzle-orm/sqlite-core";

export const itemsTable = sqliteTable("projectp", {
  id: int("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  price: int("price").notNull(),
  type: text("type").notNull(),
  description: text("description").notNull(),
  image_id: text("image_id").notNull(),
  image_url: text("image_url").notNull(),
});
