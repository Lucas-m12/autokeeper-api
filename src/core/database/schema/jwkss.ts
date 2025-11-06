import { uuidv7 } from "uuidv7";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const jwkss = pgTable("jwkss", {
  id: uuid("id").primaryKey().$defaultFn(() => uuidv7()),
  publicKey: text("public_key").notNull(),
  privateKey: text("private_key").notNull(),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).notNull(),
});