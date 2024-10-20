import { sql } from "drizzle-orm";
import { sqliteTable, text, int, integer, real } from "drizzle-orm/sqlite-core";

export const itemsTable = sqliteTable("projectp", {
  id: int("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  price: real("price").notNull(),
  type: text("type").notNull(),
  description: text("description").notNull(),
  image_id: integer("image_id", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_DATE`),
  image_url: text("image_url").notNull(),
});
